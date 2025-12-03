package com.bioagricola.homologaciones.service.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.dto.InsertDataRetornoDTO;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.common.util.ENUM_IMCOL_TIPO_RESOLUCION;
import com.bioagricola.common.util.FormaterDataUtil;
import com.bioagricola.homologaciones.dto.basic.PiminsJsonColumnDTO;
import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionGroupDTO;
import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionTablaDTO;
import com.bioagricola.homologaciones.entity.DiminsDimportarInsertsEntity;
import com.bioagricola.homologaciones.entity.IminsImportarInsertsEntity;
import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.service.impl.DiminsDimportarInsertsService;
import com.bioagricola.homologaciones.service.impl.IminsImportarInsertService;
import com.bioagricola.homologaciones.service.impl.PiminsProyeccionIminsService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class ImportacionEjecutorService {

	private final String ACIERTOS = "ACIERTOS";
	private final String ERRORES = "ERRORES";
	@Autowired
	private Gson gson;
	@Autowired
	private DiminsDimportarInsertsService diminsService;
	@Autowired
	private IminsImportarInsertService iminsService;
	@Autowired
	private ImportacionServiceBusiness importacionService;
	@Autowired
	private GenericSQLRepository genericSQLRepository;
	@Autowired
	EntityManager em;
	@Autowired
	private PiminsProyeccionIminsService piminsService;
	private HashMap<String, String> memory;
	private HashMap<String, List<String>> resultados;
	private PimpProcesoImportacion proceso;
	
	Logger logger=LoggerFactory.getLogger(ImportacionEjecutorService.class);

	public HashMap<String, List<String>> procesar(PimpProcesoImportacion proceso) {
		this.memory = new HashMap<String, String>();
		this.resultados = new HashMap<String, List<String>>();
		resultados.put(ACIERTOS, new ArrayList<String>());
		resultados.put(ERRORES, new ArrayList<String>());
		this.proceso = proceso;
		this.proceso.getProyecciones().stream().forEach(proyeccion -> {
			try {
			
				if(proyeccion.getPiminsEstado().equalsIgnoreCase("P")) {
					this.memory.clear();
					this.procesarProyeccion(proyeccion);
					proyeccion.setPiminsEstado("C");
					piminsService.save(proyeccion);
					this.resultados.get(ACIERTOS).add("Insertado con exito la proyeccion: " + proyeccion.getPiminsIderegistro()
					+"  Fila : "+proyeccion.getPiminsFila());
				}
			} catch (Exception e) {
				String rootCause = ExceptionUtils.getRootCause(e).getMessage();
				PiminsJsonColumnDTO tmpColumna = null;
				PiminsProyeccionGroupDTO piminsJson = gson.fromJson(proyeccion.getPiminsJson(), PiminsProyeccionGroupDTO.class);
				for (PiminsProyeccionTablaDTO tabla : piminsJson.getTablas()) {
					for (PiminsJsonColumnDTO columna : tabla.getColumnas()) {
						if(columna.getValor() == null) {
							tmpColumna = columna;
							break;
						}
					}
					if(tmpColumna != null) break;
				}
				//logger.error("RESULTADO:->"+tmpTabla.get(0).getEtiqueta());
				this.resultados.get(ERRORES)
						.add("Error al insertar la proyeccion: " + proyeccion.getPiminsIderegistro() + " : "
								+"  Fila :"+proyeccion.getPiminsFila() +
								" : Campo Error: "+tmpColumna.getEtiqueta()+" -- "+
								tmpColumna.getNombre()+" eRROR: "+rootCause);
			
			}
		});
		return this.resultados;
	}

	@Transactional
	private void procesarProyeccion(PiminsProyeccionImins proyeccion) throws Exception {
		PiminsProyeccionGroupDTO piminsJson = gson.fromJson(proyeccion.getPiminsJson(), PiminsProyeccionGroupDTO.class);
		for (PiminsProyeccionTablaDTO tabla : piminsJson.getTablas()) {
			this.procesarTabla(tabla);
		}
	}

	private void procesarTabla(PiminsProyeccionTablaDTO tabla) throws Exception {
		IminsImportarInsertsEntity imins = iminsService.findById(tabla.getIminsIderegistro());
		//System.out.println("Procesando " + tabla.getNombre() + " Orden: " + tabla.getIminsOrden());
		tabla.getColumnas().stream().filter(col -> col.getValor() == null).forEach(col -> {
			this.procesarColumna(col);
		});	
		
		tabla.getColumnas().stream().filter(col -> col.getValor() != null).forEach(col -> {
			this.procesarColumnaMemory(col);
		});		
		
		InsertDataRetornoDTO jsonDto = gson.fromJson(imins.getIminsJson(), InsertDataRetornoDTO.class);	
		String sql = "";
		String sqlPreInsert="";
		Integer resultado = 0;
		
		if(tabla.getSql().trim().toUpperCase().startsWith("UPDATE")) {
			if(jsonDto.getUpdateColumns()!=null) {
				sql = importacionService.buildUpdate(tabla, imins);
				this.procesarUpdates(sql, imins.getIminsOrden());
				return;
			}
		} else if (tabla.getSql().trim().toUpperCase().startsWith("INSERT")) {
			if(jsonDto.getPreInsertReturn() != null) {
				sql = importacionService.buildInsert(tabla, imins);
				this.procesarInsert(sql, imins.getIminsOrden());
				return;
			}			
		}		
		// SOLO UNA DIRECCION Y EL SISTEMA INTERPRETARA SI APLICA INSERT O UPDATE

		/*if (this.proceso.getImarcIderegistro().getImarcTipoProceso().equals(1)) {
			if(jsonDto.getUpdateColumns()==null) {
				if (jsonDto.getValideInsertReturn() != null) {
					sqlPreInsert = setParametersSQL(jsonDto.getValideInsertReturn(), this.memory);
					
					Pattern pattern = Pattern.compile("[<>]"); // Busca cualquier símbolo < o >
					Matcher matcher = pattern.matcher(sqlPreInsert);

					if (matcher.find()) {
					    resultado = 0; // Se encontró un símbolo no permitido
					}else {
						resultado = this.procesarInsertValide(sqlPreInsert, imins.getIminsOrden());					
					}
				}				
				if (resultado == 0) {
					sql = importacionService.buildInsert(tabla, imins);
					this.procesarInsert(sql, imins.getIminsOrden());
				}				
			}else {
				sql = importacionService.buildUpdate(tabla, imins);
				this.procesarUpdates(sql, imins.getIminsOrden());
			}
		} else if (this.proceso.getImarcIderegistro().getImarcTipoProceso().equals(2)) {
			if(jsonDto == null) {
				sql = importacionService.buildInsert(tabla, imins);
				if(!sql.contains("()")) this.procesarInsertSinReturning(sql, imins.getIminsOrden());
				return;
			}
			
			sql = importacionService.buildUpdate(tabla, imins);
			this.procesarUpdates(sql, imins.getIminsOrden());
			
			if(jsonDto.getPreInsertReturn() != null) {
				sql = importacionService.buildInsert(tabla, imins);
				this.procesarInsert(sql, imins.getIminsOrden());
			}
		}*/

	}
	
	public String setParametersSQL(String sql, Map<String, String> rowData) {
		AtomicReference<String> sqlAtomic = new AtomicReference<>(sql);
		rowData.keySet().stream().forEach(col -> {	
			if (rowData.containsKey(col) && rowData.get(col) != null) {
				sqlAtomic.set(sqlAtomic.get().replaceAll("<" + col + ">",
						rowData.get(col) != null ? rowData.get(col).toString() : null));
			}
		});
		return sqlAtomic.get();
	}
	
	private void procesarUpdates(String sql, Integer orden) {
		Integer updates = genericSQLRepository.executeUpdateWithReturning(sql);
		if (updates >= 0) {
			memory.put("update" ,updates+"");
		}
	}

	private void procesarInsert(String sql, Integer orden) {
		Optional<List<HashMap<String, String>>> returning = genericSQLRepository.executeInsertWithReturning(sql);
		if (returning.isPresent()) {
			returning.get().stream().forEach(result -> {
				result.keySet().stream().forEach(key -> {
					memory.put("insert:" + key + ":" + orden, FormaterDataUtil.convertToString(result.get(key)));
				});
			});
		}
	}
	
	private Integer procesarInsertSinReturning(String sql, Integer orden) {
		int returning = genericSQLRepository.executeInsertImport(sql);	
		return returning ;
	}
	
	private Integer procesarInsertValide(String sql, Integer orden) {
		Optional<List<HashMap<String, String>>> returning = genericSQLRepository.executeSelectWithReturning(sql);
		Integer resultado= 0;
		if (returning.isPresent()) {
			returning.get().stream().forEach(result -> {
				result.keySet().stream().forEach(key -> {
					memory.put("insert:" + key + ":" + orden, FormaterDataUtil.convertToString(result.get(key)));
				});
			});
		resultado = 1;
		}
		return resultado;
	}	

	private void procesarColumna(PiminsJsonColumnDTO col) {
		//System.out.println("Procesando columna " + col.getNombre() + ": dimins " + col.getDimins());
		DiminsDimportarInsertsEntity columna = diminsService.findById(col.getDimins());
		//System.out.println(columna.getDiminsJson());
		if (columna.getDiminsTipoResolucion() == ENUM_IMCOL_TIPO_RESOLUCION.REFERENCIA
				&& columna.getDiminsJson().matches(".+insert\\:.+")) {
			JsonObject jsonValor = JsonParser.parseString(columna.getDiminsJson()).getAsJsonObject();
			//System.out.println("La columna " + columna.getDiminsColumnName() + " depende del insert "+ jsonValor.get("valor").getAsString());			
			col.setValor(memory.get(jsonValor.get("valor").getAsString()));
		}
		//this.memory.put(columna.getDiminsColumnName(),(JsonParser.parseString(columna.getDiminsJson()).getAsJsonObject()).get("valor").getAsString());
	}
	
	private void procesarColumnaMemory(PiminsJsonColumnDTO col) {
		//System.out.println("Procesando columna " + col.getNombre() + ": dimins " + col.getDimins());
		DiminsDimportarInsertsEntity columna = diminsService.findById(col.getDimins());
		//System.out.println(columna.getDiminsJson());
		/*if (columna.getDiminsTipoResolucion() == ENUM_IMCOL_TIPO_RESOLUCION.REFERENCIA
				&& columna.getDiminsJson().matches(".+insert\\:.+")) {
			JsonObject jsonValor = JsonParser.parseString(columna.getDiminsJson()).getAsJsonObject();
			System.out.println("La columna " + columna.getDiminsColumnName() + " depende del insert "
					+ jsonValor.get("valor").getAsString());			
			col.setValor(memory.get(jsonValor.get("valor").getAsString()));
		}*/
		this.memory.put(columna.getDiminsColumnName(),(col.getValor().toString()));
	}
	
}
