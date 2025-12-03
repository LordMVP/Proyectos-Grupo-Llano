package com.bioagricola.homologaciones.controller;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.validation.constraints.NotNull;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.sql.Insert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.dto.ImportacionInformacionDTO;
import com.bioagricola.common.dto.RegistroValidacionArchivoDTO;
import com.bioagricola.common.dto.RespuestaGenericoExss;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.common.util.ExcelExpress;
import com.bioagricola.common.util.SpreadsheetUtil;
import com.bioagricola.config.ImportacionControlService;
import com.bioagricola.homologaciones.dto.ImportacionProcesoResponse;
import com.bioagricola.homologaciones.dto.response.ProcesoValidacionResponse;
import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;
import com.bioagricola.homologaciones.entity.ImcolImportarColumnaEntity;
import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.service.business.ImportacionServiceBusiness;
import com.bioagricola.homologaciones.service.business.ImportacionValidacionServiceBusiness;
import com.bioagricola.homologaciones.service.business.ProcesoValidacionService;
import com.bioagricola.homologaciones.service.impl.ImarcArchivosImportacionService;
import com.gell.estandar.constante.ETipoReporte;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.reporte.ReporteInvocar;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import io.jsonwebtoken.Header;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping(path = "api/importacion")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Log4j2
public class ImportacionBussinesRestController  {

	@Autowired
	ImportacionServiceBusiness impotacionService;
	
	@Autowired
	ImarcArchivosImportacionService imarcService;
	
	@Autowired
	ImportacionValidacionServiceBusiness validacionService;

    @Autowired
    private ProcesoValidacionService procesoValidacionService;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@Autowired
	GenericSQLRepository genericSql;
	
	@Autowired
	DataSource dataSource;
	//Crear constantes programa 778 y empresa 317
	private static final Integer PROGRAMA_ID = 778;
	private static final Integer EMPRESA_ID = 317;
	
	Logger logger = LoggerFactory.getLogger(ImportacionBussinesRestController.class);
	
	@Autowired
	private HttpServletRequest request;

	
	@PostMapping(path="/procesaralto")
	public ResponseEntity<?> procesarII(@RequestParam("imarc")Long imarcId,@RequestParam("file") MultipartFile file) throws IOException {
		logger.error("iamrc"+imarcId);
		ImarcArchivosImportacion imarc = imarcService.findById(imarcId);
		ImportacionProcesoResponse response = new ImportacionProcesoResponse();	
		try {			
			SpreadsheetUtil spreadsheetUtil = new SpreadsheetUtil(file.getInputStream());
			spreadsheetUtil.switchToSheet(0);
			validacionService.init(spreadsheetUtil, imarc);			
			Optional<RegistroValidacionArchivoDTO> validacionColumnas = validacionService.validarColumnas();
			if(validacionColumnas.isPresent()) {
				List<RegistroValidacionArchivoDTO> validaciones= new ArrayList<RegistroValidacionArchivoDTO>();
				validaciones.add(validacionColumnas.get());
				response.setValidaciones(validaciones);
				response.setCodigo(1);
				response.setMensaje("Errores de validacion de columnas");
				return ResponseEntity.ok(response);
			};
			
			Optional<List<RegistroValidacionArchivoDTO>> validacionesTipoDato = validacionService.validarTiposDatosColumnas(10);
			if(validacionesTipoDato.isPresent()) {
				response.setValidaciones(validacionesTipoDato.get());
				response.setCodigo(1);
				response.setMensaje("Errores de validacion de tipo de datos columnas, se validaron las primeras 10.");
				return ResponseEntity.ok(response);
			}			
			
			ImportacionInformacionDTO informacionDTO = new ImportacionInformacionDTO();
			informacionDTO.setNombreArchivo(file.getName());
			informacionDTO.setNumeroFilasArchivo(spreadsheetUtil.getNumRows());
			informacionDTO.setNumeroColumnasArchivo(spreadsheetUtil.getColumnsName().keySet().size());
			informacionDTO.setNombreConfiguracion(imarc.getImarcNombreArchivo());	
			List<String> tablas = imarc.getIminsList().stream().sorted((c,c2)->c.getIminsOrden().compareTo(c2.getIminsOrden()))
					.map(insert->insert.getIminsTabla()).collect(Collectors.toList());
			
			informacionDTO.setTablasRelacionadas(tablas);
			impotacionService.init(spreadsheetUtil, imarc);
			
			/***************************************** Validaciones Incorporadas ******************************************/
			
			if(spreadsheetUtil.getRowData(0).containsKey("VALIDACION")) {
				RespuestaGenericoExss resxss= new RespuestaGenericoExss<>();
				resxss.setCodigo(0);
				resxss.setMensaje("Generado Excel Validaciones Terceros");
				
				ExcelExpress exss = ExcelExpress.getExcelExpress();
				exss.crearLibro();
				exss.crearHoja("Actualizacion Propietario");
				exss.addEncabezado(new String[] {"ESTADO","CODIGO BIO EXCEL","NOMBRE TERCERO EXCEL",
						"TIPO DOCUMENTO EXCEL","DOCUMENTO EXCEL","DOCUMENTO SUSCRIPTOR EXCEL","NOMBRE SUSCRIPTOR EXCEL","DOCUMENTO SUSCRIPTOR","NOMBRE SUSCRIPTOR",
						"DOCUMENTO TERCERO","NOMBRE TERCERO","OBSERVACIONES"}, 0);
							
				List<RegistroValidacionArchivoDTO> validaciones = new ArrayList<RegistroValidacionArchivoDTO>();
				Map<String, String>datos= new HashMap<>();
				for(int i= 0; i <= spreadsheetUtil.getNumRows() ; i ++) {
					datos = spreadsheetUtil.getRowData(i);
					if(datos.containsKey("VALIDACION")) {
						String sql=null;
						switch (datos.get("VALIDACION")) {
						case "P":
							HashMap<String, String>datosSnapshoot=new HashMap<>();
							StringBuilder observacion = new StringBuilder();
							sql = String.format("select tt.ter_documento as STD,tt.ter_nomcompleto as STN,tt2.ter_documento as SD,tt2.ter_nomcompleto as SN, tt3.ter_documento as TD,tt3.ter_nomcompleto as TN  from dsus_detsuscrip dd \r\n"
									+ "left join ter_tercero tt on tt.ter_documento = '%s' and tt.ter_ideregistro = dd.ter_ideregistro  \r\n"
									+ "left join ter_tercero tt2 on tt2.ter_ideregistro = dd.ter_ideregistro \r\n"
									+ "left join ter_tercero tt3 on tt3.ter_documento  = '%s' \r\n"
									+ "where dd.dsus_pcodigo = '%s' ",datos.get("Numero Documento"),datos.get("Numero Documento"),datos.get("Codigo"));
							
							Optional<List> resultado = genericSql.executeSelect(sql,1);
							exss.escribirHoja(0,i,datos,resultado);						
							
							datosSnapshoot = exss.getFilaValores(i+ExcelExpress.XSS_INCREMENTA);
							
							if(datosSnapshoot.get("Col9").equalsIgnoreCase("null")) {
								observacion.append("Tercero No Existe");
							}else {
								if(datosSnapshoot.get("Col5").equalsIgnoreCase("null")) {
									observacion.append("Suscripcion no contiene el tercero de cambio solicitado, ");
								}else {
									observacion.append(" [(Tercero Excel - Tercero Suscripcion) "+
								exss.evalCellValue(datosSnapshoot.get("Col2"), datosSnapshoot.get("Col6"))+"]");
								}
								observacion.append(" [(Tercero Excel - Tercero Documento) "+
								exss.evalCellValue(datosSnapshoot.get("Col2"), datosSnapshoot.get("Col10"))+"]");
							}					
							
							exss.escribirCeldaHoja(0, (i+ ExcelExpress.XSS_INCREMENTA), 11,observacion.toString());						
							break;					
							
						case "SI":
							sql = String.format("select * from dsus_detsuscrip dd where dd.dsus_pcodigo ='%s'",datos.get("CODIGO").toString());
							Optional<List> resultadox = genericSql.executeSelect(sql,1);
								if(resultadox.isPresent()) {
									resultadox.get().stream()
									.forEach(r->log.error("resultado: "+((Object [])r)[2]));	
									validaciones.add(RegistroValidacionArchivoDTO.buildNumColumnsValorMessage(i, 0,
											"CODIGO", "Duplicado -> "+ datos.get("CODIGO").toString()));
								}
						default:
							break;
						}
					}
				}
				/*** Nuevos Usuarios Emsa ***/
				if(validaciones.size() > 0 ) {
					response.setValidaciones(validaciones);	
					return ResponseEntity.ok(response); 
				}
				/*** Actualizacion Propietario ***/
				if (exss.numeroFilas(0) > 0) {
					ByteArrayOutputStream out = new ByteArrayOutputStream();
					exss.escribirLibro(out);
					exss.leerHoja(0);
					exss.cerrarLibro();
					
					resxss.setObjeto(out.toByteArray());
					
					HttpHeaders headers = new HttpHeaders();
					headers.add("authorization", request.getHeader("authorization"));
					SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
					String nombreArchivo = "Validacion Propietario" + format.format(new Date()) + ".xlsx";
					headers.add("Access-Control-Expose-Headers", "Content-Disposition");
					headers.add("Content-Disposition", "attachment; filename=" + nombreArchivo);
					return ResponseEntity.ok()
							.headers(headers)
							.body(resxss);
				}
			}	
			
			/*********************************************************************************************************/
			
			Optional<PimpProcesoImportacion> pimp = impotacionService.iniciarProcesamiento();
			
			if(pimp.isPresent()) {
				informacionDTO.setPimpId(pimp.get().getPimpIderegistro());
				informacionDTO.setNumeroProyecciones(pimp.get().getProyecciones().size());
			}
			response.setInformacionImportacion(informacionDTO);
			response.setCodigo(0);
			
			return ResponseEntity.ok(response); 
			
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}			
	}
	
	@GetMapping(path="/validar-proceso-importacion")
	public ResponseEntity<ProcesoValidacionResponse> validarProcesoImportacion() {
		try {
			Long USUARIO = autoFacade.getIdUsuarioLong();
			ProcesoValidacionResponse response = procesoValidacionService.validarProcesoInactivo(PROGRAMA_ID,EMPRESA_ID,USUARIO);
			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("Error al validar estado del proceso", e);
			ProcesoValidacionResponse errorResponse = new ProcesoValidacionResponse(
				"Error al validar el estado del proceso: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, path="/procesar")
	public ResponseEntity<?> procesarImportacion(HttpServletRequest request,@RequestParam("imarc")Long imarcId) {
		ImportacionProcesoResponse response = new ImportacionProcesoResponse();		
			try {
				 if(request instanceof StandardMultipartHttpServletRequest) {
					 Long usuario = autoFacade.getIdUsuarioLong();
					ProcesoValidacionResponse validacion = procesoValidacionService.validarProcesoInactivo(PROGRAMA_ID,
							EMPRESA_ID, usuario);
					if (!validacion.isProcesoInactivo()) {
						return ResponseEntity.badRequest().body(validacion);
					}					
					 
					 StandardMultipartHttpServletRequest mult = (StandardMultipartHttpServletRequest) request;
					 Map<String,MultipartFile> fileMap = mult.getFileMap();
					 MultipartFile file = fileMap.get("file");
					 
					 if(file!=null) {
						 
						 ImarcArchivosImportacion imarc = imarcService.findById(imarcId);
						 imarc.setImcolList(
								 			imarc.getImcolList().stream().sorted(Comparator.comparing(ImcolImportarColumnaEntity::getImcolIderegistro))
								 			.collect(Collectors.toList())								 	
								 );
						 	
							try {			
								SpreadsheetUtil spreadsheetUtil = new SpreadsheetUtil(file.getInputStream());
								spreadsheetUtil.switchToSheet(0);
								validacionService.init(spreadsheetUtil, imarc);			
								Optional<RegistroValidacionArchivoDTO> validacionColumnas = validacionService.validarColumnas();
								if(validacionColumnas.isPresent()) {
									List<RegistroValidacionArchivoDTO> validaciones= new ArrayList<RegistroValidacionArchivoDTO>();
									validaciones.add(validacionColumnas.get());
									response.setValidaciones(validaciones);
									response.setCodigo(1);
									response.setMensaje("Errores de validacion de columnas");
									return ResponseEntity.ok(response);
								};
								
								Optional<List<RegistroValidacionArchivoDTO>> validacionesTipoDato = validacionService.validarTiposDatosColumnas(10);
								if(validacionesTipoDato.isPresent()) {
									response.setValidaciones(validacionesTipoDato.get());
									response.setCodigo(1);
									response.setMensaje("Errores de validacion de tipo de datos columnas, se validaron las primeras 10.");
									return ResponseEntity.ok(response);
								}
																
								
								ImportacionInformacionDTO informacionDTO = new ImportacionInformacionDTO();
								informacionDTO.setNombreArchivo(file.getName());
								informacionDTO.setNumeroFilasArchivo(spreadsheetUtil.getNumRows());
								informacionDTO.setNumeroColumnasArchivo(spreadsheetUtil.getColumnsName().keySet().size());
								informacionDTO.setNombreConfiguracion(imarc.getImarcNombreArchivo());
								
								List<String> tablas = imarc.getIminsList().stream().sorted((c,c2)->c.getIminsOrden().compareTo(c2.getIminsOrden()))
										.map(insert->insert.getIminsTabla()).collect(Collectors.toList());
								
								informacionDTO.setTablasRelacionadas(tablas);
								impotacionService.init(spreadsheetUtil, imarc);	
								
								validacionService.limpiarImcdsusCompleto(usuario,imarc.getImarcIderegistro());								
								Integer filas = validacionService.uploadRecords(usuario,imarc.getImarcIderegistro()); // Importacion registros pcodigos	
								
								Optional<PimpProcesoImportacion> pimp = impotacionService.iniciarProcesamiento();
								
								if(pimp.isPresent()) {
									List<PiminsProyeccionImins> proyeccion = pimp.get().getProyecciones();
									List<String> mensajes = proyeccion.stream()
											.filter(Objects::nonNull) 
										    .map(PiminsProyeccionImins::getMensaje) 
										    .filter(Objects::nonNull) 
										    .flatMap(List::stream) 
										    .filter(Objects::nonNull) 
										    .collect(Collectors.toList());									
											
									informacionDTO.setMensajesError(mensajes);
									informacionDTO.setNumeroErrores(mensajes.size());
									informacionDTO.setPimpId(pimp.get().getPimpIderegistro());									
									informacionDTO.setNumeroProyecciones(filas - mensajes.size());
								
								}
								response.setInformacionImportacion(informacionDTO);
								response.setCodigo(0);
								if(!pimp.get().getMensajesError().isEmpty()) {
									response.setMensajesError(pimp.get().getMensajesError());
									response.setMensaje(pimp.get().getMensajesError().stream()
						                      .collect(Collectors.joining(" || ")));
									response.setCodigo(1);
								}								
								return ResponseEntity.ok(response);
						 
							}catch(Exception e){
								e.printStackTrace();
								response.setInformacionImportacion(new ImportacionInformacionDTO());
								response.setCodigo(1);								 
								return ResponseEntity.ok(response);
							}	
						 
						 
					 }else {
		                    log.error("No se encontró el archivo en la solicitud.");
		                }
		            } else {
		                log.error("La solicitud no es una solicitud de tipo multipart.");
		            }				 
			}catch(Exception e) {				
				log.error(e);
			}
			response.setInformacionImportacion(new ImportacionInformacionDTO());
			response.setCodigo(1);
			return ResponseEntity.ok(response);
		
	}
	
	 
}