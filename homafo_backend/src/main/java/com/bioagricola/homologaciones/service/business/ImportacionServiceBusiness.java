package com.bioagricola.homologaciones.service.business;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import lombok.extern.slf4j.Slf4j;
import org.jfree.util.Log;
import org.postgresql.util.PSQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.dto.InsertDataRetornoDTO;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.common.service.DiccColumnasServiceImpl;
import com.bioagricola.common.service.DictTablasServiceImpl;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.common.util.FormaterDataUtil;
import com.bioagricola.common.util.SpreadsheetUtil;
import com.bioagricola.config.ImportacionControlService;
import com.bioagricola.homologaciones.dto.basic.PiminsJsonColumnDTO;
import com.bioagricola.homologaciones.dto.basic.PiminsJsonDTO;
import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionTablaDTO;
import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;
import com.bioagricola.homologaciones.entity.IminsImportarInsertsEntity;
import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.service.impl.ImcdsusImpcontdsuscripcionService;
import com.bioagricola.homologaciones.service.impl.PimpProcesoImportacionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gell.estandar.dto.AuditoriaDTO;
import com.google.common.base.Objects;

@Slf4j
@Service
public class ImportacionServiceBusiness extends ImportacionAbstractService {

	@Autowired
	private PimpProcesoImportacionService procesoImportacionService;
	@Autowired
	private DictTablasServiceImpl diccTablasServiceImpl;
	@Autowired
	private DiccColumnasServiceImpl diccColumnasServiceImpl;
	@Autowired
	ImcdsusImpcontdsuscripcionService imcdService;
	
	@Autowired
	private GenericSQLRepository genericSqlRepository;
	
    @Autowired
    private ProcesoValidacionService procesoValidacionService;
	
	ConvertGeneral conv=new ConvertGeneral();
	
	private List<String>validadorInsert;
	List<Map<String, Object>> ImcdGlobal ;
	
	Logger logger = LoggerFactory.getLogger(ImportacionServiceBusiness.class);

	public void init(SpreadsheetUtil spreadsheetUtil, ImarcArchivosImportacion imarc) {
		this.spreadsheetUtil = spreadsheetUtil;
		this.columnsSwap = new HashMap<>();
		this.imarc = imarc;
		this.validadorInsert=new ArrayList<>();
	}

	public void procesarArchivo(File file, ImarcArchivosImportacion imarc) {
		try {
			this.procesarArchivo(new FileInputStream(file), imarc);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void procesarArchivo(InputStream inputStream, ImarcArchivosImportacion imarc) {
		this.spreadsheetUtil = new SpreadsheetUtil(inputStream);
		this.spreadsheetUtil.switchToSheet(0);
		this.imarc = imarc;
		this.iniciarProcesamiento();
	}
	public Optional<PimpProcesoImportacion> iniciarProcesamiento() {
		Long usuario = this.authenticationFacade.getIdUsuarioLong();
		Integer empresa = this.authenticationFacade.getIdEmpresa();
		ImcdGlobal = imcdService.obtenerRegistrosBaseCentralByDsusPcodigo(usuario, imarc.getImarcIderegistro());

		PimpProcesoImportacion pimp = new PimpProcesoImportacion();
		pimp.setPimpFechaCreacion(LocalDateTime.now());
		pimp.setImarcIderegistro(imarc);
		pimp.setPimpEstado("P");
		pimp.setPimpNumeroRegistros(this.spreadsheetUtil.getNumRows());
		pimp.setUsuIderegistro(authenticationFacade.getIdUsuario().longValue());
		pimp.setEmpIderegistro(authenticationFacade.getIdEmpresaLong().longValue());
		pimp.setPimpDescripcion("Proceso de carge");
		pimp.setProyecciones(new ArrayList<PiminsProyeccionImins>());
		List<String> mensajesError = new ArrayList<>();

		this.columnsSwap = new HashMap<>();
		Map<String, Integer> columnsFile = this.spreadsheetUtil.getColumnsName();
		boolean columnasCheck = imarc.getImcolList().stream()
				.allMatch(col -> col.getImcolObligatorio() ? columnsFile.containsKey(col.getImcolNombre()) : true);

		if (columnasCheck) {
			int registros = ImcdGlobal.size();

			// SOLUCIÓN 1: Configuración optimizada de hilos y tamaño de grupo
			int nHilos;
			int tamGrupo;

			if (registros <= 100) {
				nHilos = 1;
				tamGrupo = registros;
			} else if (registros <= 500) {
				nHilos = 4;
				tamGrupo = Math.max(50, registros / nHilos);
			} else if (registros <= 2000) {
				nHilos = 8;
				tamGrupo = Math.max(100, registros / nHilos);
			} else {
				nHilos = 14;
				tamGrupo = Math.max(150, registros / nHilos);
			}

			logger.info("Procesando {} registros con {} hilos, ~{} registros por hilo",
					registros, nHilos, tamGrupo);

			ExecutorService executor = Executors.newFixedThreadPool(nHilos);
			List<PiminsProyeccionImins> allProyecciones = Collections.synchronizedList(new ArrayList<>());
			List<Future<Boolean>> futures = new ArrayList<>();

			// SOLUCIÓN 2: Contador de registros procesados
			int registrosProcesados = 0;

			for (int i = 0; i < registros; i += tamGrupo) {
				final int inicio = i;
				final int fin = Math.min(i + tamGrupo, registros);

				List<Map<String, Object>> subImcdGlobal = ImcdGlobal.subList(inicio, fin);
				registrosProcesados += subImcdGlobal.size();

				logger.debug("Creando tarea para procesar registros {}-{} ({} registros)",
						inicio, fin - 1, subImcdGlobal.size());  // fin-1 porque subList es exclusivo

				Runnable importAsync = new ImportacionControlService(inicio,fin,
						this,allProyecciones,this.spreadsheetUtil,this.imarc,usuario,empresa,pimp,subImcdGlobal,procesoValidacionService
				);

				Future<Boolean> future = executor.submit(importAsync, true);
				futures.add(future);
			}

			logger.info("Total de registros enviados a procesar: {}/{}", registrosProcesados, registros);

			// SOLUCIÓN 3: Mejor manejo de timeouts y errores
			int lotesProcesados = 0;
			int lotesConError = 0;

			for (int i = 0; i < futures.size(); i++) {
				try {
					// Aumentar timeout para lotes grandes
					futures.get(i).get(600, TimeUnit.SECONDS);  // 10 minutos
					lotesProcesados++;
				} catch (TimeoutException e) {
					mensajesError.add(String.format("Timeout en lote %d (registros %d-%d)",
							i, i * tamGrupo, Math.min((i + 1) * tamGrupo, registros) - 1));
					futures.get(i).cancel(true);
					lotesConError++;
					logger.error("Timeout en lote {}", i);
				} catch (Exception e) {
					mensajesError.add(String.format("Error en lote %d: %s", i, e.getMessage()));
					logger.error("Error en lote " + i, e);
					lotesConError++;
				}
			}

			logger.info("Lotes procesados exitosamente: {}/{}", lotesProcesados, futures.size());
			if (lotesConError > 0) {
				logger.error("Lotes con error: {}", lotesConError);
			}

			executor.shutdown();

			List<PiminsProyeccionImins> outData = null;

			synchronized (allProyecciones) {
				if (!allProyecciones.isEmpty()) {
					outData = allProyecciones.stream()
							.filter( p -> p != null && (p.getMensaje() == null || p.getMensaje().isEmpty()) )
							.map(p -> {
								PiminsProyeccionImins pi = p;
								pi.setPimpIderegistro(pimp);
								if (pi.getPiminsJson() == null || pi.getPiminsJson().trim().isEmpty()) {pi.setPiminsJson("{}");}
								if (pi.getPiminsEstado() == null || pi.getPiminsEstado().trim().isEmpty()) {pi.setPiminsEstado("P");}
								return pi;
					}).collect(Collectors.toList());
					logger.info("Total de proyecciones generadas: {}", outData.size());
				} else {
					logger.warn("No se generaron proyecciones");
				}
			}
			mensajesError = mensajesError.isEmpty() ? allProyecciones.stream()
					.filter( p -> p != null && p.getMensaje() != null && !p.getMensaje().isEmpty())
					.sorted(Comparator.comparingInt(PiminsProyeccionImins::getPiminsFila))
					.flatMap(p -> p.getMensaje().stream())
					.collect(Collectors.toList()) : mensajesError;
			pimp.setMensajesError(mensajesError);
			pimp.setProyecciones(outData);
			procesoImportacionService.save(pimp);
			logger.error("Termino proyecciones -> ");
			return Optional.of(pimp);

		} else {
			logger.error("No pasó validación de columnas");
		}

		return Optional.empty();
	}
	
	public Optional<PiminsProyeccionImins> resolverFila(int row,Long usuario,Integer empresa) {
		try {
			this.columnsSwap = new HashMap<>();
			Map<String, String> rowData = this.spreadsheetUtil.getRowData(row);
			rowData.put("Fila", String.valueOf(row));
			List<Map<String,Object>> listIndividual = Collections.singletonList(this.ImcdGlobal.get(row - 1));
			this.imarc.getImcolList().stream().forEach(col -> {
				this.columnsSwap.put(col.getImcolNombre(), resolucionUtil.resolv(col, rowData,listIndividual));
				//System.out.println("Resolviendo columna: "+ col.getImcolNombre() + " : "+this.columnsSwap.get(col.getImcolNombre()));
			});
			this.columnsSwap.put("USUARIO_SESION", usuario + "");
			this.columnsSwap.put("EMPRESA_SESION", empresa + "");
			
			Optional<PiminsProyeccionImins> proyeccion = this.resolucionInsertsOneDirection(columnsSwap, row);			
			return proyeccion;

		} catch (Exception e) {
			e.printStackTrace();

		}
		return Optional.empty();
	}
	public Optional<PiminsProyeccionImins> resolverGrupo(int rowIni,int rowFin,Long usuario,Integer empresa,List<Map<String, Object>> subImcdGlobal) {

		// SOLUCIÓN: Validación de límites antes de acceder al Excel
		int totalRowsExcel = this.spreadsheetUtil.getNumRows();
		int excelStartRow = rowIni + 1;  // +1 para saltar header
		int excelEndRow = Math.min(rowFin + 1, totalRowsExcel + 1);  // Asegurar que no exceda límites

		logger.debug("Procesando grupo: rowIni={}, rowFin={}, excelStart={}, excelEnd={}, totalExcel={}",
				rowIni, rowFin, excelStartRow, excelEndRow, totalRowsExcel);

		List<Map<String, String>> rowsData =
				this.spreadsheetUtil.getDataMatrix(excelStartRow, excelEndRow);

		List<String> listaErrores = new ArrayList<>();

		// SOLUCIÓN: Crear variables finales para usar en lambda
		final List<Map<String, String>> finalRowsData = rowsData;
		final List<Map<String, Object>> finalSubImcdGlobal = subImcdGlobal;
		final int finalExcelStartRow = excelStartRow;

		// El resto del código continúa igual...
		List<Optional<PiminsProyeccionImins>> proyecciones = IntStream.range(0, finalRowsData.size())
				.mapToObj(i -> {
					PiminsProyeccionImins proyeccion = new PiminsProyeccionImins();
					try {
						// SOLUCIÓN: Crear una instancia local de columnsSwap para cada iteración
						HashMap<String, String> localColumnsSwap = new HashMap<>();

						Map<String, String> rowData = finalRowsData.get(i);
						List<Map<String,Object>> listIndividual =
								Collections.singletonList(finalSubImcdGlobal.get(i));

							this.imarc.getImcolList().forEach(col -> {						
								localColumnsSwap.put(col.getImcolNombre(),
										resolucionUtil.resolv(col, rowData, listIndividual));							
							});

						localColumnsSwap.put("USUARIO_SESION", String.valueOf(usuario));
						localColumnsSwap.put("EMPRESA_SESION", String.valueOf(empresa));

						// Usar el número de fila real del Excel para los mensajes
						int realExcelRow = finalExcelStartRow + i;
						proyeccion = this.resolucionInsertsOneDirection(localColumnsSwap, realExcelRow)
								.orElse(new PiminsProyeccionImins());

					} catch (Exception e) {
						String errorDetail = e.getMessage();
						String serverDetail = "";

						// Buscar PSQLException en toda la cadena
						Throwable cause = e;
						while (cause != null) {
							PSQLException psqlEx = null;

							if (cause instanceof PSQLException) {
								psqlEx = (PSQLException) cause;
							} else if (cause instanceof org.hibernate.exception.ConstraintViolationException) {
								SQLException sqlEx = ((org.hibernate.exception.ConstraintViolationException) cause).getSQLException();
								if (sqlEx instanceof PSQLException) psqlEx = (PSQLException) sqlEx;
							}

							if (psqlEx != null) {
								errorDetail = psqlEx.getMessage();
								if (psqlEx.getServerErrorMessage() != null && psqlEx.getServerErrorMessage().getDetail() != null) {
									serverDetail = " | Detalle: " + psqlEx.getServerErrorMessage().getDetail();
								}
								break;
							}
							cause = cause.getCause();
						}

						String msgError = "Fila: " + finalSubImcdGlobal.get(i).get("imcd_fila") +
								" Proceso: " + finalSubImcdGlobal.get(i).get("imcd_ideregistro") +
								" Error: " + errorDetail + serverDetail;
						listaErrores.add(msgError);

						proyeccion.setPiminsEstado("ERROR");
						proyeccion.setMensaje(Collections.singletonList(msgError));
					}

					return Optional.of(proyeccion);
				})
				.collect(Collectors.toList());

		// Continúa con el resto del método...
		Optional<PiminsProyeccionImins> conError = proyecciones.stream()
				.filter(Optional::isPresent)
				.map(Optional::get)
				.filter(p -> p.getMensaje() != null && !p.getMensaje().isEmpty())
				.findFirst();

		if (conError.isPresent()) return conError;

		return proyecciones.stream()
				.filter(Optional::isPresent)
				.map(Optional::get)
				.reduce((f,s) -> s);
	}
	
	

	public Optional<PiminsProyeccionImins> resolverFila(int row) {
		try {
			this.columnsSwap = new HashMap<>();
			Map<String, String> rowData = this.spreadsheetUtil.getRowData(row);
			rowData.put("Fila", String.valueOf(row - 1));
			this.imarc.getImcolList().stream().forEach(col -> {
				this.columnsSwap.put(col.getImcolNombre(), resolucionUtil.resolv(col, rowData,this.ImcdGlobal));
				//System.out.println("Resolviendo columna: "+ col.getImcolNombre() + " : "+this.columnsSwap.get(col.getImcolNombre()));
			});
			this.columnsSwap.put("USUARIO_SESION", authenticationFacade.getIdUsuario().longValue() + "");
			this.columnsSwap.put("EMPRESA_SESION", authenticationFacade.getIdEmpresaLong() + "");
			
			//Destructur . Lista
			if(this.columnsSwap.containsKey("DATOS")) {
				String [] str = this.columnsSwap.get("DATOS").split(",");
				if(str.length > 0) {
					for(int i = 0 ; i < str.length ; i++) {
						this.columnsSwap.put("dat"+i, str[i]);
					}
				}
			}		
			
			Iterator<String> keys = columnsSwap.keySet().iterator();
			
			while(keys.hasNext()) {
				String key = keys.next();
				//System.out.println("Valor en row Data: "+key +" : "+columnsSwap.get(key));		
			}	
			
			Optional<PiminsProyeccionImins> proyeccion = this.resolucionInserts(columnsSwap, row);			
			return proyeccion;

		} catch (Exception e) {
			// TODO: handle exception
			//System.out.println("Exepciont" + e.getClass().getSimpleName());
			e.printStackTrace();
			//System.err.println("Error al insertar registro: " + row + " : " + e.getLocalizedMessage());

		}
		return Optional.empty();
	}
	
	public Optional<PiminsProyeccionImins> resolucionInsertsOneDirection(HashMap<String, String> memoryData, int row) {
		this.imarc.getIminsList().sort((o1, o2) -> o1.getIminsOrden().compareTo(o2.getIminsOrden()));
		List<PiminsProyeccionTablaDTO> tablas = new ArrayList<PiminsProyeccionTablaDTO>();
		this.imarc.getIminsList().stream().forEach(item -> {
			if (item.getIminsJson() != null) {
				Optional<PiminsProyeccionTablaDTO> proyeccion = this.onOneDirection(item, memoryData, row);
				proyeccion.ifPresent(e -> tablas.add(e));
			} else {
				Optional<PiminsProyeccionTablaDTO> tabla = this.buildProyeccion(item, memoryData, row);
				tabla.ifPresent(e -> tablas.add(e));
			}

		});
		if (!tablas.isEmpty()) {
			PiminsProyeccionImins pimins = new PiminsProyeccionImins();
			pimins.setPiminsEstado("P");
			pimins.setPiminsFila(row);
			PiminsJsonDTO piminsJsonDTO = new PiminsJsonDTO();
			piminsJsonDTO.setTablas(tablas);
			piminsJsonDTO.setFila(row);
			pimins.setPiminsJson(gson.toJson(piminsJsonDTO));
			return Optional.of(pimins);
		}

		return Optional.empty();		
	}

	public Optional<PiminsProyeccionImins> resolucionInserts(HashMap<String, String> memoryData, int row) {
		this.imarc.getIminsList().sort((o1, o2) -> o1.getIminsOrden().compareTo(o2.getIminsOrden()));
		List<PiminsProyeccionTablaDTO> tablas = new ArrayList<PiminsProyeccionTablaDTO>();
		this.imarc.getIminsList().stream().forEach(item -> {
			if (item.getIminsJson() != null) {
				Optional<PiminsProyeccionTablaDTO> proyeccion = this.validateInsertJson(item, memoryData, row);
				proyeccion.ifPresent(e -> tablas.add(e));
			} else {
				Optional<PiminsProyeccionTablaDTO> tabla = this.buildProyeccion(item, memoryData, row);
				tabla.ifPresent(e -> tablas.add(e));
			}

		});
		if (!tablas.isEmpty()) {
			PiminsProyeccionImins pimins = new PiminsProyeccionImins();
			pimins.setPiminsEstado("P");
			pimins.setPiminsFila(row);
			PiminsJsonDTO piminsJsonDTO = new PiminsJsonDTO();
			piminsJsonDTO.setTablas(tablas);
			piminsJsonDTO.setFila(row);
			pimins.setPiminsJson(gson.toJson(piminsJsonDTO));
			return Optional.of(pimins);
		}

		return Optional.empty();		
		
	}	
	
	private Optional<PiminsProyeccionTablaDTO> onOneDirection(IminsImportarInsertsEntity insert,
			HashMap<String, String> memoryData, int row) {
		
		InsertDataRetornoDTO jsonDto = gson.fromJson(insert.getIminsJson(), InsertDataRetornoDTO.class);	
		jsonDto.setIminsIderegistro(insert.getIminsIderegistro());		
		Object [] result = this.OneDirectionQuery(jsonDto, memoryData,insert,row);
		
		@SuppressWarnings("unchecked")
		Optional<List<HashMap<String, String>>> optLista = (Optional<List<HashMap<String, String>>>) result[0];

		@SuppressWarnings("unchecked")
		Optional<PiminsProyeccionTablaDTO> optProyeccion = (Optional<PiminsProyeccionTablaDTO>) result[1];
		
		if (optLista.isPresent()) {
			this.insertIntoMemoryData(optLista.get().get(0), memoryData, insert.getIminsOrden());
		}

		return optProyeccion;

	}

	private Optional<PiminsProyeccionTablaDTO> validateInsertJson(IminsImportarInsertsEntity insert,
			HashMap<String, String> memoryData, int row) {
		
		InsertDataRetornoDTO jsonDto = gson.fromJson(insert.getIminsJson(), InsertDataRetornoDTO.class);	

		if(jsonDto.getPreValideInsertReturn() != null) {
			Optional<HashMap<String, String>> result = this.validatePreInsert(jsonDto, memoryData);
			if (result.isPresent()) {
				this.insertIntoMemoryData(result.get(), memoryData, insert.getIminsOrden());
				//logger.info("MEMORY->"+memoryData);
				return this.buildProyeccion(insert, memoryData, row);
			}
		}
		if (jsonDto.getPreInsert() != null) {
			Optional<HashMap<String, String>> result = this.validatePreInsert(jsonDto, memoryData);
			if (result.isPresent()) {
				this.insertIntoMemoryData(result.get(), memoryData, insert.getIminsOrden());
				//logger.error("MEMORY->"+memoryData);
				return Optional.empty();
			}
		}
		if (jsonDto.getPreInsertReturn() != null) {// validacion si existe lo deja en memoria si no existe lo inserta y lo deja en memoria
			Optional<HashMap<String, String>> result = this.validatePreInsert(jsonDto, memoryData);
			if (!result.isPresent()) {	
				memoryData.put("ESTADO", "INSERT");
				return this.buildProyeccion(insert, memoryData, row);
			}else {
				memoryData.put("ESTADO", "UPDATE");
				this.insertIntoMemoryData(result.get(), memoryData, insert.getIminsOrden());
			}
		}
		if (jsonDto.getRetornoInsert() != null) {
			return this.buildProyeccion(insert, memoryData, row);
		}
		if(jsonDto.getPreUpdateReturn() != null) {
			Optional<HashMap<String, String>> result = this.validatePreInsert(jsonDto, memoryData);
			if (result.isPresent()) {
				this.insertIntoMemoryData(result.get(), memoryData, insert.getIminsOrden());
				//logger.info("MEMORY->"+memoryData);
			}else {
				return Optional.empty();
			}
		}
		if(jsonDto.getUpdateColumns()!=null){
			return this.buildProyeccion(insert, memoryData, row);
		}
		return Optional.empty();

	}
	
	public Object [] OneDirectionQuery(InsertDataRetornoDTO dto,
			HashMap<String, String> memoryData,IminsImportarInsertsEntity insert,Integer row) {
		
		String sqlPreInsert="";
		
		if(dto.getPreInsertReturn() != null) {
			sqlPreInsert = this.resolucionUtil.setParametersSQL(dto.getPreInsertReturn(), memoryData);
		}
			
		Pattern patter = Pattern.compile("\\<.+\\>");
		Matcher matcher = patter.matcher(sqlPreInsert);		
		
		Optional<PiminsProyeccionTablaDTO> resultado = this.buildProyeccionOneDirection(insert,memoryData,row,sqlPreInsert);
		PiminsProyeccionTablaDTO piminDTO = resultado.orElse(null);
		
		Optional<List<HashMap<String, String>>> result = this.genericSqlRepository
				.executeSelectWithColumnsNamesOneDirection(piminDTO.getSql(), piminDTO.getReturning());

		return new Object[] { result, resultado };
		
	}

	public Optional<HashMap<String, String>> validatePreInsert(InsertDataRetornoDTO dto,
			HashMap<String, String> memoryData) {
		String sqlPreInsert="";
		
		if(dto.getPreInsertReturn() != null) {
			sqlPreInsert = this.resolucionUtil.setParametersSQL(dto.getPreInsertReturn(), memoryData);
		}else if (dto.getPreUpdateReturn() != null){
			sqlPreInsert = this.resolucionUtil.setParametersSQL(dto.getPreUpdateReturn(), memoryData);
		}else if (dto.getPreValideInsertReturn() != null){
			sqlPreInsert = this.resolucionUtil.setParametersSQL(dto.getPreValideInsertReturn(), memoryData);
		}else {
			sqlPreInsert = this.resolucionUtil.setParametersSQL(dto.getPreInsert(), memoryData);
		}
			
		Pattern patter = Pattern.compile("\\<.+\\>");
		Matcher matcher = patter.matcher(sqlPreInsert);
		
		if (matcher.find()) {
			return Optional.empty();
		}
		Optional<List<HashMap<String, String>>> result = this.genericSqlRepository
				.executeSelectWithColumnsNames(sqlPreInsert, 1);
		if (result.isPresent()) {
			return Optional.of(result.get().get(0));
		} else {
			return Optional.empty();
		}
		// return result.map(item->Optional.of(item.get(0))).orElse(Optional.empty());
	}

	public void insertIntoMemoryData(HashMap<String, String> values, HashMap<String, String> memoryData,
			Integer orden) {
		values.keySet().forEach(key -> {
			String nombreVar = "insert:" + key + ":" + orden;
			memoryData.put(nombreVar, values.get(key));
		});
	}
	
	private Optional<PiminsProyeccionTablaDTO> buildProyeccionOneDirection(IminsImportarInsertsEntity imins,
			HashMap<String, String> memoryData, Integer fila,String sqlPreInsert) {
		
		HashMap<String, Object> rowData = new HashMap<String, Object>();
		List<PiminsJsonColumnDTO> piminsColumns = new ArrayList<PiminsJsonColumnDTO>();
		String query = "";
		String intoQuery = "";
		String conflictQuery = "";
		String returningQuery = "";
		String tabla = imins.getIminsTabla().toString();

		ObjectMapper mapper = new ObjectMapper();
		JsonNode root;
		List<String> conditionsColumns = new ArrayList<>();
		List<String> updateColumns = new ArrayList<>();
		List<String> retornoInsert = new ArrayList<>();
		try {
			root = mapper.readTree(imins.getIminsJson());

		    Optional.ofNullable(root.path("conditionsColumns"))
		        .filter(JsonNode::isArray)
		        .ifPresent(node -> node.forEach(col -> conditionsColumns.add(col.asText())));
		    
		    Optional.ofNullable(root.path("retornoInsert"))
	        .filter(JsonNode::isArray)
	        .ifPresent(node -> node.forEach(col -> retornoInsert.add(col.asText())));

			Optional.ofNullable(root.path("updateColumns"))
					.filter(JsonNode::isArray)
					.ifPresent(node -> updateColumns.addAll(
							StreamSupport.stream(node.spliterator(), false)
									.map(JsonNode::asText)
									.collect(Collectors.toList())
					));
		} catch (IOException e) {
		    e.printStackTrace();
		}		

		imins.getDiminsList().stream().forEach(col -> {
			if (col.getDiminsObligatorio() != null && col.getDiminsObligatorio()) {
				rowData.put(col.getDiminsColumnName(), this.resolucionUtil.resolv(col, memoryData));
				PiminsJsonColumnDTO columnDTO = new PiminsJsonColumnDTO();
				columnDTO.setDimins(col.getDiminsIderegistro());
				columnDTO.setNombre(col.getDiminsColumnName());
				columnDTO.setValor(rowData.get(col.getDiminsColumnName()));				
				columnDTO.setValor(rowData.get(col.getDiminsColumnName()));
				columnDTO.setEditable(col.getDiminsEditable() != null ? col.getDiminsEditable() : false);
				columnDTO.setSugerido(col.getDiminsSugerido() != null ? col.getDiminsSugerido() : false);
				columnDTO.setEtiqueta(col.getDiminsColumnName());
				piminsColumns.add(columnDTO);
			}
		});	
		
		Map<String,Object> ColumnValor = piminsColumns.stream()
				.collect(Collectors.toMap(
						PiminsJsonColumnDTO::getNombre,
				        p -> {
				            Object val = p.getValor();
				            if (val == null) return "NULL"; 
				            String str = val.toString().trim();
				            return "'" + str + "'"; 
				        },					
						(v1,v2) -> v1,
						LinkedHashMap::new
						));		
		
		boolean result = conditionsColumns.stream()
	    .map(ColumnValor::get)
	    .filter(java.util.Objects::nonNull)
	    .map(Object::toString)
	    .map(s -> s.replace("'", "").trim())
	    .anyMatch("-1"::equals);
		
		String Columns = String.join(", ", ColumnValor.keySet());
	
		String Valores = ColumnValor.values().stream().collect(Collectors.toList())
				.stream()
				.map(Object::toString)	
			    .collect(Collectors.joining(", "));	
		
		String updateQuery = "SET " + updateColumns.stream()
				.map(col -> col + " = EXCLUDED." + col)
				.collect(Collectors.joining(",\n      "));

		query = String.format(sqlPreInsert, Valores) + (result ? " WHERE 0 = -1" : "");
		conflictQuery = String.join(",", conditionsColumns);

		if (! retornoInsert.isEmpty()) returningQuery = "RETURNING " + String.join(", ", retornoInsert);
		intoQuery = String.format("INSERT INTO %s (%s) %s ON CONFLICT (%s) DO UPDATE %s  %s",tabla,Columns,query,conflictQuery,updateQuery,returningQuery);

		PiminsProyeccionTablaDTO piminsTabla = new PiminsProyeccionTablaDTO();
		piminsTabla.setNombre(imins.getIminsTabla());
		piminsTabla.setIminsIderegistro(imins.getIminsIderegistro());
		piminsTabla.setIminsOrden(imins.getIminsOrden());
		piminsTabla.setColumnas(piminsColumns);
		piminsTabla.setSql(intoQuery);
		piminsTabla.setEtiqueta(imins.getIminsTabla());
		piminsTabla.setReturning(retornoInsert);
		return Optional.of(piminsTabla);
	}

	private Optional<PiminsProyeccionTablaDTO> buildProyeccion(IminsImportarInsertsEntity imins,
			HashMap<String, String> memoryData, Integer fila) {
		HashMap<String, Object> rowData = new HashMap<String, Object>();
		List<PiminsJsonColumnDTO> piminsColumns = new ArrayList<PiminsJsonColumnDTO>();

		imins.getDiminsList().stream().forEach(col -> {
			if (col.getDiminsObligatorio() != null && col.getDiminsObligatorio()) {
				rowData.put(col.getDiminsColumnName(), this.resolucionUtil.resolv(col, memoryData));
				PiminsJsonColumnDTO columnDTO = new PiminsJsonColumnDTO();
				columnDTO.setDimins(col.getDiminsIderegistro());
				columnDTO.setNombre(col.getDiminsColumnName());
				columnDTO.setValor(rowData.get(col.getDiminsColumnName()));
				/*if(col.getDiminsColumnName().compareTo("uni_clasificacionvivienda")==0 && rowData.get(col.getDiminsColumnName())!=null &&
						memoryData.get("Clasificacion de la vivienda").chars().boxed().findFirst().filter(b->b!=32).isPresent()){
					
					HashMap<String, String>mp=new HashMap<String, String>();
							mp.put("uni_registro", rowData.get(col.getDiminsColumnName()).toString());
							mp.put("uni_nombre1",memoryData.get("Clasificacion de la vivienda"));
					List<HashMap<String, String>> lista=new ArrayList<>();
					lista.add(mp);
					columnDTO.setValor(conv.convertListToJson(lista));
				}else {*/					
				columnDTO.setValor(rowData.get(col.getDiminsColumnName()));
				//}
				columnDTO.setEditable(col.getDiminsEditable() != null ? col.getDiminsEditable() : false);
				columnDTO.setSugerido(col.getDiminsSugerido() != null ? col.getDiminsSugerido() : false);
				columnDTO.setEtiqueta(col.getDiminsColumnName());
				/*columnDTO.setEtiqueta(
						diccColumnasServiceImpl.findByTabla(imins.getIminsTabla(), col.getDiminsColumnName())
								.map(c -> c.getDiccEtiqueta()).orElse(col.getDiminsColumnName()));*/
				piminsColumns.add(columnDTO);
			}
		});
		
		
		InsertDataRetornoDTO jsonDto = gson.fromJson(imins.getIminsJson(), InsertDataRetornoDTO.class);
		List<String> listaColumnas = jsonDto.getUpdateColumns();
		
		boolean filtroDatos = true;
		
		if(memoryData.get("ESTADO").equalsIgnoreCase("UPDATE")) {
		
			filtroDatos = listaColumnas.stream()
					.anyMatch(clave -> {
						Object valor = rowData.get(clave);
						String texto = valor != null ? valor.toString().trim() : "";
						return !texto.isEmpty() && !"null".equalsIgnoreCase(texto);
					});
			
		}
		
		
		if(!filtroDatos) return Optional.empty(); 
		
		PiminsProyeccionTablaDTO piminsTabla = new PiminsProyeccionTablaDTO();
		piminsTabla.setNombre(imins.getIminsTabla());
		piminsTabla.setIminsIderegistro(imins.getIminsIderegistro());
		piminsTabla.setIminsOrden(imins.getIminsOrden());
		piminsTabla.setColumnas(piminsColumns);
		
		//InsertDataRetornoDTO jsonDto = gson.fromJson(imins.getIminsJson(), InsertDataRetornoDTO.class);		
		//logger.error("JSON:"+jsonDto.getUpdateColumns());	
		if ("INSERT".equals(memoryData.get("ESTADO"))){		
				piminsTabla.setSql(this.buildInsert(piminsTabla, imins));
			}else {
				piminsTabla.setSql(this.buildUpdate(piminsTabla, imins));
		}
		/*piminsTabla.setEtiqueta(this.diccTablasServiceImpl.findEtiquetaTabla(imins.getIminsTabla())
				.map(t -> t.getDictEtiqueta()).orElse(imins.getIminsTabla()));*/
		piminsTabla.setEtiqueta(imins.getIminsTabla());
		return Optional.of(piminsTabla);
	}

	public String buildInsert(PiminsProyeccionTablaDTO piminsTabla, IminsImportarInsertsEntity imins) {
		Map<String, Object> rowData = new HashMap<String, Object>();
		piminsTabla.getColumnas().stream()
		.filter(col -> col.getValor() != null && !"null".equals(String.valueOf(col.getValor())))
		.forEach(col -> {
			rowData.put(col.getNombre(), col.getValor());
		});
		return this.sqlBuilderUtil.buildInsert(piminsTabla.getNombre(), imins.getIminsJson(), rowData);
	}

	public String buildUpdate(PiminsProyeccionTablaDTO piminsTabla, IminsImportarInsertsEntity imins) {
		Map<String, Object> rowData = new HashMap<String, Object>();
		piminsTabla.getColumnas().stream()
		.filter(col -> col.getValor() != null && !"null".equals(String.valueOf(col.getValor())))
		.forEach(col -> {
			rowData.put(col.getNombre(), col.getValor());
		});
		return this.sqlBuilderUtil.buildUpdate(piminsTabla.getNombre(), imins.getIminsJson(), rowData);
	}


}
