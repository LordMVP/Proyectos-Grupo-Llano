package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioLogFacturaApiEmsa;
import com.bioagricola.apirest.liquidacion.negocio.NegocioParParametro;
import com.bioagricola.apirest.liquidacion.negocio.NegocioUspuUsuprgunid;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.interfaces.IAPI_EMSA;
import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.Payload.PayloadApi_EmsaDTO;
import com.bioagricola.apirest.liquidacion.web.servicio.Response.ResponseApi_EmsaDTO;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.EstructuraEmsaFileDTO;
import com.bioagricola.apirest.modelo.entidades.aseo.LogFacturaApiEmsa;
import com.bioagricola.apirest.modelo.projections.IPermisosUnidad;
import com.bioagricola.apirest.modelo.utils.HttpRequest;
import com.bioagricola.apirest.modelo.utils.UtilConstantes;
import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

/*
 * @author Yoner Silva
 */
@RestController
@RequestMapping("/webresources/servicios/API_EMSA")
public class ServicioAPI_EMSA implements IAPI_EMSA {

    private ResponseApi_EmsaDTO responseDto;
    private HttpRequest request;
    
    private final String ID_PROGRAMA_API_EMSA = System.getProperty("PRIASE_PRG_API_EMSA");

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(ServicioAPI_EMSA.class);

    @Autowired
    private NegocioParParametro negocioParParametro;
    
    @Autowired
    private NegocioLogFacturaApiEmsa negocioLogFactura;
    
    @Autowired
    private NegocioUspuUsuprgunid negocioUspuUsuUni;

    @Autowired
    public ServicioAPI_EMSA() {
        this.responseDto = new ResponseApi_EmsaDTO();
        this.request = new HttpRequest();
    }

    /*
     * Metodo que se encarga de generar una petición para comunicarse con la api-emsa y obtener el token
     */
    @Override
    @PostMapping(path = "/iniciar_sesion")
    public ResponseApi_EmsaDTO loguearse(@RequestBody PayloadApi_EmsaDTO item) {
        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        
        try {
            if (item.getAutenticacion().equals("") || item.getAutenticacion() == null) {
                throw new Exception("¡Oops!, no se encontró datos de la autenticación.");
            }

            Map<String, Object> parametros = this.negocioParParametro.consultaParametros(idEmpresa, "API_EMSA");
            String URL_API_EMSA = parametros.get("URL_API_EMSA").toString();

            Map<String, Object> properties = new LinkedHashMap<>();
            ResponseEntity<Map> response = request.sendRequest(URL_API_EMSA + "autentica", UtilConstantes.GET, true, properties, item.getAutenticacion(), UtilConstantes.NONE, 60);
            if (response.getStatusCode().value() == 200) {
                //String TOKEN_API_EMSA = response.getBody().get("token_type").toString() + " " + response.getBody().get("access_token").toString();
                
                responseDto.setCodigoRespuesta(HttpStatus.OK.value());
                responseDto.setData(response.getBody());
                responseDto.setMensaje("Se inicio sesión con éxito.");
            } else {
                throw new Exception("¡Oops!, se generó un error al iniciar sesión, la contraseña es incorrecta.");
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            responseDto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDto.setData(null);
            responseDto.setMensaje(e.getMessage());
        }
        return responseDto;
    }
    
    /*
    * Metodo que se encarga de consultar los permisos del usuario sobre el programa api emsa.
    */
    @Override
    @GetMapping(path = "/consultar_permisos_usuario")
    public ResponseApi_EmsaDTO consultar_permisos_usuario() {
        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        
        try {
            List<IPermisosUnidad> permisos = negocioUspuUsuUni.consultarPermisosUsuarioPrograma(idUsuario, Integer.parseInt(ID_PROGRAMA_API_EMSA));
                
            responseDto.setCodigoRespuesta(HttpStatus.OK.value());
            responseDto.setData(permisos);
            responseDto.setMensaje("Se consultaron los permisos con éxito.");
        } catch (Exception e) {
            logger.error(e.getMessage());
            responseDto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDto.setData(null);
            responseDto.setMensaje(e.getMessage());
        }
        return responseDto;
    }

    /*
     * Metodo que se encarga de consultar un cliente emsa
     */
    @Override
    @PostMapping(path = "/consulta_cliente")
    public ResponseApi_EmsaDTO consulta_cliente(@Valid @RequestBody PayloadApi_EmsaDTO item) {

        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        try {
            //String TOKEN_API_EMSA = (String) this.loguearse(item).getData();

            Map<String, Object> parametros = this.negocioParParametro.consultaParametros(idEmpresa, "API_EMSA");
            String URL_API_EMSA = parametros.get("URL_API_EMSA").toString();
            String REFERENCIA_EMSA = parametros.get("REFERENCIA_EMSA").toString();

            String URL_REQUEST = URL_API_EMSA + "consulta_cliente" + "?searchValue=" + item.getCodigo_cliente() + "&" + "reference=" + REFERENCIA_EMSA;

            ResponseEntity<Map> response = request.sendRequest(URL_REQUEST, UtilConstantes.GET, true, null, item.getAutenticacion(), UtilConstantes.NONE, 60);
            if (response.getStatusCode().value() == 200) {
                
                
                responseDto.setCodigoRespuesta(HttpStatus.OK.value());
                responseDto.setData(response.getBody());
                responseDto.setMensaje("Se consultó de manera exitosa el código " + item.getCodigo_cliente());
            } else {
                throw new Exception("¡Oops!, se generó un error al consultar el código " + item.getCodigo_cliente());
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            responseDto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDto.setData(null);
            responseDto.setMensaje(e.getMessage());
        }
        return responseDto;
    }

    /*
     * Metodo que se encarga de actualizar un cliente emsa
     */
    @Override
    @PostMapping(path = "/actualiza_cliente")
    public ResponseApi_EmsaDTO actualiza_cliente(@Valid @RequestBody PayloadApi_EmsaDTO item) {

        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        try {
            //String TOKEN_API_EMSA = (String) this.loguearse(item).getData();

            Map<String, Object> parametros = this.negocioParParametro.consultaParametros(idEmpresa, "API_EMSA");
            
            String URL_API_EMSA = parametros.get("URL_API_EMSA").toString();
            String REFERENCIA_EMSA = parametros.get("REFERENCIA_EMSA").toString();

            String URL_REQUEST_CONSULTA = URL_API_EMSA + "consulta_cliente" + "?searchValue=" + item.getCodigo_cliente() + "&" + "reference=" + REFERENCIA_EMSA;

            ResponseEntity<Map> response_con = request.sendRequest(URL_REQUEST_CONSULTA, UtilConstantes.GET, true, null, item.getAutenticacion(), UtilConstantes.NONE, 60);
            if (response_con.getStatusCode().value() == 200) {
                Map<String, Object> body = response_con.getBody();
                Map<String, Object> statusMap = (Map<String, Object>) body.get("status");
                String innerStatus = (String) statusMap.get("status");

                if(!innerStatus.equals("FAILED")){
                    Map<String, Object> dataMap = (Map<String, Object>) body.get("data");

                    String URL_REQUEST_ACTUALIZACION = URL_API_EMSA + "actualiza_cliente";

                    Map<String, Object> properties = new LinkedHashMap<>();
                    properties.put("codigo_cliente", item.getCodigo_cliente());
                    properties.put("valor", item.getValor());
                    properties.put("referencia", REFERENCIA_EMSA);
                    properties.put("codigo_ean", item.getCodigo_ean());
                    ResponseEntity<Map> response_act = request.sendRequest(URL_REQUEST_ACTUALIZACION, UtilConstantes.POST, true, properties, item.getAutenticacion(), UtilConstantes.APPLICATION_JSON, 60);
                    if (response_act.getStatusCode().value() == 200) {
                        LogFacturaApiEmsa logFactura = new LogFacturaApiEmsa();
                        logFactura.setLog_tipo("MANUAL");
                        logFactura.setCodigo_bio(dataMap.get("codigo_entidad2").toString());
                        logFactura.setCodigo_emsa(item.getCodigo_cliente());
                        logFactura.setCodigo_ean(item.getCodigo_ean());
                        logFactura.setNum_factura(Long.valueOf(dataMap.get("factura_entidad2").toString()));
                        logFactura.setValor_anterior(new BigDecimal(dataMap.get("valor_entidad2").toString()));
                        logFactura.setValor_generado(new BigDecimal(item.getValor()));
                        logFactura.setUsu_ideregistro(idUsuario.longValue());
                        this.negocioLogFactura.save(logFactura);
                        
                        responseDto.setCodigoRespuesta(HttpStatus.OK.value());
                        responseDto.setData(response_act.getBody());
                        responseDto.setMensaje("Se actualizó de manera exitosa el código " + item.getCodigo_cliente());
                    } else {
                        throw new Exception("¡Oops!, se generó un error al actualizar el código " + item.getCodigo_cliente());
                    }
                } else {
                    responseDto.setCodigoRespuesta(HttpStatus.OK.value());
                    responseDto.setData(response_con.getBody());
                    responseDto.setMensaje("Hubo un problema al consultar el cliente para reliquidarlo, cliente: " + item.getCodigo_cliente());
                }                
            } else {
                throw new Exception("¡Oops!, se generó un error al consultar el código " + item.getCodigo_cliente());
            }

            
        } catch (Exception e) {
            logger.error(e.getMessage());
            responseDto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDto.setData(null);
            responseDto.setMensaje(e.getMessage());
        }
        return responseDto;
    }

    /*
     * Metodo que se encarga de cargar un archivo csv para reliquidar sus facturas.
     */
    @Override
    @PostMapping(path = "/cargar_archivo_reliquidacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseApi_EmsaDTO cargar_archivo_reliquidacion(@RequestPart("datos") PayloadApi_EmsaDTO item, @RequestPart("file") MultipartFile file) {

        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        try {
            //String TOKEN_API_EMSA = (String) this.loguearse(item).getData();

            int cant_registros = 0;
            Map<String, Object> parametros = this.negocioParParametro.consultaParametros(idEmpresa, "API_EMSA");
            String URL_API_EMSA = parametros.get("URL_API_EMSA").toString();
            String REFERENCIA_EMSA = parametros.get("REFERENCIA_EMSA").toString();

            List<EstructuraEmsaFileDTO> lista = new ArrayList<>();
            
            CSVParser parser = new CSVParserBuilder()
                .withSeparator(';')
                .withIgnoreQuotations(true) // Ignora las comillas dobles extras
                .build();
            
            try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(file.getInputStream()))
                .withCSVParser(parser).build()) {
                
                String[] headers = reader.readNext();

                for (int i = 0; i < headers.length; i++) {
                    headers[i] = headers[i].trim().toLowerCase();
                }

                String[] row;
                while ((row = reader.readNext()) != null) {
                    EstructuraEmsaFileDTO dto = new EstructuraEmsaFileDTO();
                    for (int i = 0; i < headers.length && i < row.length; i++) {
                        String columna = headers[i];
                        String valor = row[i].trim();

                        switch (columna) {
                            case "codigo_bio":
                                dto.setCodigo_bio(valor);
                                break;
                            case "codigo_emsa":
                                dto.setCodigo_emsa(valor);
                                break;
                            case "nombre":
                                dto.setNombre(valor);
                                break;
                            case "factura":
                                dto.setFactura(Long.valueOf(valor));
                                break;
                            case "periodo":
                                dto.setPeriodo(valor);
                                break;
                            case "valor":
                                dto.setValor(Integer.valueOf(valor));
                                break;
                            case "cod_baras":
                                dto.setCod_baras(valor);
                                break;
                        }
                    }
                    lista.add(dto);
                }
            }
            
            for (EstructuraEmsaFileDTO estructuraEmsaFileDTO : lista) {
                
                String URL_REQUEST_CONSULTA = URL_API_EMSA + "consulta_cliente" + "?searchValue=" + estructuraEmsaFileDTO.getCodigo_emsa() + "&" + "reference=" + REFERENCIA_EMSA;

                ResponseEntity<Map> response_con = request.sendRequest(URL_REQUEST_CONSULTA, UtilConstantes.GET, true, null, item.getAutenticacion(), UtilConstantes.NONE, 60);
                if (response_con.getStatusCode().value() == 200) {
                    Map<String, Object> body = response_con.getBody();
                    Map<String, Object> statusMap = (Map<String, Object>) body.get("status");
                    String innerStatus = (String) statusMap.get("status");

                    if(!innerStatus.equals("FAILED")){                        
                        Map<String, Object> dataMap = (Map<String, Object>) body.get("data");

                        String URL_REQUEST_ACTUALIZACION = URL_API_EMSA + "actualiza_cliente";

                        Map<String, Object> properties = new LinkedHashMap<>();
                        properties.put("codigo_cliente", estructuraEmsaFileDTO.getCodigo_emsa());
                        properties.put("valor", estructuraEmsaFileDTO.getValor());
                        properties.put("referencia", REFERENCIA_EMSA);
                        properties.put("codigo_ean", estructuraEmsaFileDTO.getCod_baras());
                        ResponseEntity<Map> response_act = request.sendRequest(URL_REQUEST_ACTUALIZACION, UtilConstantes.POST, true, properties, item.getAutenticacion(), UtilConstantes.APPLICATION_JSON, 60);
                        if (response_act.getStatusCode().value() == 200) {
                            LogFacturaApiEmsa logFactura = new LogFacturaApiEmsa();
                            logFactura.setLog_tipo("ARCHIVO");
                            logFactura.setCodigo_bio(estructuraEmsaFileDTO.getCodigo_bio());
                            logFactura.setCodigo_emsa(estructuraEmsaFileDTO.getCodigo_emsa());
                            logFactura.setCodigo_ean(estructuraEmsaFileDTO.getCod_baras());
                            logFactura.setNum_factura(estructuraEmsaFileDTO.getFactura());
                            logFactura.setValor_anterior(new BigDecimal(dataMap.get("valor_entidad2").toString()));
                            logFactura.setValor_generado(new BigDecimal(estructuraEmsaFileDTO.getValor()));
                            logFactura.setUsu_ideregistro(idUsuario.longValue());
                            this.negocioLogFactura.save(logFactura);
                            
                            cant_registros++;
                        }
                    }              
                }                
            }
            
            responseDto.setCodigoRespuesta(HttpStatus.OK.value());
            responseDto.setData(null);
            responseDto.setMensaje("Se actualizó de manera exitosa " + cant_registros + " registros del archivo.");
        } catch (Exception e) {
            logger.error(e.getMessage());
            responseDto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDto.setData(null);
            responseDto.setMensaje(e.getMessage());
        }
        return responseDto;
    }

    @Override
    @PostMapping(path = "/obtener_log_facturas")
    public ResponseApi_EmsaDTO obtener_log_facturas(@RequestBody PayloadApi_EmsaDTO item) {
        responseDto.setCodigoRespuesta(HttpStatus.OK.value());
        responseDto.setData(this.negocioLogFactura.findAllByRangeDate(item.getRango_fecha_desde(), item.getRango_fecha_hasta()));
        responseDto.setMensaje("Se consultó la información de manera exitosa.");
        return responseDto;
    }
    
    /*
     * Metodo que se encarga de actualizar un cliente emsa
     */
    @Override
    @PostMapping(path = "/generar_reporte_recaudo_pse")
    public ResponseApi_EmsaDTO generar_reporte_recaudo_pse(@Valid @RequestBody PayloadApi_EmsaDTO item) {

        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        try {
            //String TOKEN_API_EMSA = (String) this.loguearse(item).getData();

            Map<String, Object> parametros = this.negocioParParametro.consultaParametros(idEmpresa, "API_EMSA");
            
            String URL_API_EMSA = parametros.get("URL_API_EMSA").toString();
            String REFERENCIA_EMSA = parametros.get("REFERENCIA_EMSA").toString();

            String URL_REQUEST_CONSULTA = URL_API_EMSA + "recaudo_pse" + "?fecha=" + item.getFecha_reporte() + "&" + "reference=" + REFERENCIA_EMSA;

            ResponseEntity<Map> response_con = request.sendRequest(URL_REQUEST_CONSULTA, UtilConstantes.GET, true, null, item.getAutenticacion(), UtilConstantes.NONE, 60);
            if (response_con.getStatusCode().value() == 200) {          
                responseDto.setCodigoRespuesta(HttpStatus.OK.value());
                responseDto.setData(response_con.getBody());
                responseDto.setMensaje("Se generó de manera exitosa la información de recaudo pse.");             
            } else {
                throw new Exception("¡Oops!, se generó un error al generar el reporte recaudo pse.");
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            responseDto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDto.setData(null);
            responseDto.setMensaje(e.getMessage());
        }
        return responseDto;
    }
}
