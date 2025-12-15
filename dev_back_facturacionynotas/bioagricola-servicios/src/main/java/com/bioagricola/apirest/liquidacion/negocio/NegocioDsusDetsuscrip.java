package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.entidades.*;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.*;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionAgrupamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionFiltro;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionOrdenamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.RangoConsulta;
import com.bioagricola.apirest.modelo.utils.UtilOperaciones;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.apache.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

// protected region Incluya importaciones adicionales en esta seccion on begin

// protected region Incluya importaciones adicionales en esta seccion end

/**
 * Servicios para operaciones CRUD y de negocio sobre la entidad DsusDetsuscrip
 *
 * @author GeneradorCRUD
 */
@Service
public class NegocioDsusDetsuscrip extends NegocioAbstracto<DsusDetsuscrip, DsusDetsuscripDTO> {

    @Autowired
    private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;

    @Autowired
    private ManejadorDfacDetNovedad manejadorDfacDetNovedad;

    @Autowired
    private NegocioCosuConsuscrip negocioCosuConsuscrip;

    @Autowired
    private ManejadorCosuConsuscrip manejadorCosuConsuscrip;

    @Autowired
    private NegocioParParametro negocioParParametro;

    @Autowired
    private ManejadorDperDetperiodo manejadorDperDetperiodo;

    @Autowired
    private ManejadorAfoAforo manejadorAfoAforo;

    @Autowired
    private ManejadorPaenParametrosentradanota manejadorPaenParametrosentradanota;

    @Autowired
    private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;

    private int pages;

    private Integer codigoExitoso = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_EXITOSA);
    private Integer codigoFallido = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_FALLIDA);

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(NegocioDsusDetsuscrip.class.getName());
    org.slf4j.Logger log = LoggerFactory.getLogger(this.getClass());

    // protected region Declare atributos adicionales en esta seccion on begin

    // protected region Declare atributos adicionales en esta seccion end

    /**
     * Realiza un consulta en la entidad DsusDetsuscrip aplicando los filtros, el
     * ordenamiento, y el rango (from y to) que se pasan como parámetro. Los
     * parámetros filterBy y orderBy pueden ser nulos. El parámetro from y to están
     * relacionados. Si from es diferente de nulo to puedo ser nulo, pero no al
     * revés. Ambos pueden ser nulos, en cuyo caso no se aplica una restricción de
     * rango a la consulta.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere filtrar, seguido por un operador de comparación que
     *                 puede tomar los valores
     *                 {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'},
     *                 y por último el valor por el que se quiere filtrar. Los
     *                 filtros se concatenan por el símbolo
     *                 {@literal '&' (AND) o '|' (OR)}. Ej. Una secuencia de
     *                 parámetros de filtrado puede ser
     *                 {@literal dsusDetsuscripId>1&dsusDetsuscripName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos
     *                 ultimos valores son opcionales ya que si no se especifica por
     *                 defecto se asume que el ordenamiento es de forma Ascendente.
     *                 Si se coloca más de un parámetro debe ir separado por coma :
     *                 ','. Ej. Una secuencia de parámetros de ordenamiento puede
     *                 ser: dsusDetsuscripId$ASC, dsusDetsuscripName$DESC
     * @param from     Número de registro inicial que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual al parámetro from
     * @return Una lista de DAOs de los DsusDetsuscrip que se consultaron con los
     * parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los
     *                                   parámetros de la url tenía un error de
     *                                   sintáxis por lo que no pudo ser procesado
     *                                   correctamente
     */
    public List<DsusDetsuscripDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
            throws InvalidParameterException {
        // protected region Modifique el metodo consultar on begin
        logService(this.getClass().getName(), "consultar", filterBy, orderBy, from, to);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        List<InformacionOrdenamiento> ordenamiento = invocarDecodificacionOrdenamiento(orderBy);
        RangoConsulta rango = validarParametrosBloque(from, to);

        return convertirListaEntidadesADao(manejadorDsusDetsuscrip.consultar(filtros, ordenamiento, rango));
        // protected region Modifique el metodo consultar end
    }

    /**
     * Crea el dsusDetsuscrip que se pasa como parámetro en la base de datos.
     *
     * @param dsusDetsuscripDTO El DAO de la entidad DsusDetsuscrip a crear. Este se
     *                          envía en el cuerpo de la solicitud POST como un
     *                          objeto JSON.
     * @return La insntancia de DsusDetsuscrip recién creado
     */
    public DsusDetsuscripDTO crear(DsusDetsuscripDTO dsusDetsuscripDTO) {
        // protected region Modifique el metodo crear on begin

        logService(this.getClass().getName(), "crear", dsusDetsuscripDTO);

        DsusDetsuscrip dsusDetsuscrip = new DsusDetsuscrip();
        copiarPropiedades(dsusDetsuscrip, dsusDetsuscripDTO);

        manejadorDsusDetsuscrip.save(dsusDetsuscrip);

        return dsusDetsuscripDTO;
        // protected region Modifique el metodo crear end
    }

    /**
     * Actualiza en la base de datos el dsusDetsuscrip que se pasa como parámetro.
     *
     * @param dsusDetsuscripDTO El DAO de la entidad DsusDetsuscrip a actualizar.
     *                          Este se envía en el cuerpo de la solicitud PUT como
     *                          un objeto JSON.
     * @return La instancia de la entidad DsusDetsuscrip que ha sido actualizado
     */
    public DsusDetsuscripDTO actualizar(DsusDetsuscripDTO dsusDetsuscripDTO) {
        // protected region Modifique el metodo actualizar on begin

        logService(this.getClass().getName(), "actualizar", dsusDetsuscripDTO);

        DsusDetsuscrip dsusDetsuscrip = manejadorDsusDetsuscrip.getOne(dsusDetsuscripDTO.getDsusIderegistr());
        copiarPropiedades(dsusDetsuscrip, dsusDetsuscripDTO);

        manejadorDsusDetsuscrip.save(dsusDetsuscrip);

        return dsusDetsuscripDTO;
        // protected region Modifique el metodo actualizar end
    }

    /**
     * Elimina el dsusDetsuscrip con el identificador que se pasa como parámetro.
     *
     * @param dsusIderegistr Valor del atributo del identificador de la instancia de
     *                       la entidad dsusDetsuscrip a eliminar
     * @return El identificador del dsusDetsuscrip que ha sido eliminado
     */
    public String eliminar(Long dsusIderegistr) {
        // protected region Modifique el metodo eliminar on begin

        logService(this.getClass().getName(), "eliminar", dsusIderegistr);
        manejadorDsusDetsuscrip.deleteById(dsusIderegistr);

        StringBuilder valores = new StringBuilder();
        valores.append(String.valueOf(dsusIderegistr));
        return valores.toString();
        // protected region Modifique el metodo eliminar end
    }

    /**
     * Cuenta la cantidad de registros que devuelve la consulta a la tabla de
     * aplicando los filtros o rangos que se pasen como parámetro. Estos pueden ser
     * nulos, en cuyo caso a la consulta no se le realiza ningún tipo de filtrado.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere filtrar, seguido por un operador de comparación que
     *                 puede tomar los valores
     *                 {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'},
     *                 y por último el valor por el que se quiere filtrar. Los
     *                 filtros se concatenan por el símbolo
     *                 {@literal '&' (AND) o '|' (OR)}. Ej. Una secuencia de
     *                 parámetros de filtrado puede ser
     *                 {@literal dsusDetsuscripId>1&dsusDetsuscripName:LIKE:juan}
     * @param from     Número de registro inicial que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la
     *                 consulta realizada. Entero mayor o igual al parámetro from
     * @return El número de registros contados a partir de los parámetros enviados
     * por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los
     *                                   parámetros de la url tenía un error de
     *                                   sintáxis por lo que no pudo ser procesado
     *                                   correctamente
     */
    public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException {
        // protected region Modifique el metodo contar on begin

        logService(this.getClass().getName(), "contar", filterBy);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        RangoConsulta rango = validarParametrosBloque(from, to);

        return String.valueOf(manejadorDsusDetsuscrip.consultarTotalRegistros(filtros, rango));
        // protected region Modifique el metodo contar end
    }

    /**
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere filtrar, seguido por un operador de comparación que
     *                 puede tomar los valores
     *                 {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'},
     *                 y por último el valor por el que se quiere filtrar. Los
     *                 filtros se concatenan por el símbolo
     *                 {@literal '&' (AND) o '|' (OR)}. Ej. Una secuencia de
     *                 parámetros de filtrado puede ser
     *                 {@literal dsusDetsuscripId>1&dsusDetsuscripName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada
     *                 parámetro está compuesto por el nombre del campo por el que
     *                 se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos
     *                 ultimos valores son opcionales ya que si no se especifica por
     *                 defecto se asume que el ordenamiento es de forma Ascendente.
     *                 Si se coloca más de un parámetro debe ir separado por coma :
     *                 ','. Ej. Una secuencia de parámetros de ordenamiento puede
     *                 ser: dsusDetsuscripId$ASC, dsusDetsuscripName$DESC
     * @param atributo Nombre del atributo de la entidad DsusDetsuscrip del cual se
     *                 quieren obtener los diferentes valores.
     * @return Una lista con los diferentes valores que se encuentran en la columna
     * de la tabla asociada al atributo.
     * @throws InvalidParameterException Si el atributo no existe en la entidad o si
     *                                   los filtros y el ordenamiento contienen
     *                                   atributos de la entidad que no existen.
     */
    public List<String> consultarLista(String filterBy, String orderBy, String atributo)
            throws InvalidParameterException {
        // protected region Modifique el metodo consultarLista on begin

        logService(this.getClass().getName(), "contar", filterBy, orderBy, atributo);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        List<InformacionOrdenamiento> ordenamiento = invocarDecodificacionOrdenamiento(orderBy);
        InformacionAgrupamiento infoAgrupamiento = decodificarInformacionAgrupamiento(atributo);

        return UtilOperaciones.convertirListaObjetosAString(
                manejadorDsusDetsuscrip.consultarLista(filtros, ordenamiento, infoAgrupamiento));
        // protected region Modifique el metodo consultarLista end
    }

    /**
     * Método encargado de manejar la lógica de negocio para la consulta de detalles
     * de suscripción
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param pagina
     * @param tamanoPagina
     * @param fechaHasta
     * @param fechaDesde
     * @param consultaPaginador
     * @return
     * @throws InvalidParameterException
     * @throws ParseException
     */

    public ResponseConsultaDetalleSuscripcionDTO consultaDetalle(Long idSuscripcion, String nombreTercero,
                                                                 String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
                                                                 String codAntSuscripcion, Integer pagina, Integer tamanoPagina, String fechaDesde, String fechaHasta) {

        List<Object[]> listaDetalle;

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<ConsultaDetalleSuscripcionDTO> listaResultados = new ArrayList<>();
        Timestamp desde = null;
        Timestamp hasta = null;

        nombreTercero = stringVacio(nombreTercero);
        nombreTercero = nombreTercero != null ? nombreTercero.toLowerCase() : nombreTercero;

        documentoTercero = stringVacio(documentoTercero);
        numCatastral = stringVacio(numCatastral);
        codAntSuscripcion = stringVacio(codAntSuscripcion);
        fechaDesde = stringVacio(fechaDesde);
        fechaHasta = stringVacio(fechaHasta);

        if (fechaDesde != null && fechaHasta != null) {
            desde = negocioCosuConsuscrip.toTimestamp(fechaDesde);
            hasta = negocioCosuConsuscrip.toTimestamp(fechaHasta);
        }

        BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalle(idSuscripcion, nombreTercero,
                documentoTercero, ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde,
                hasta);
        pages = (int) Math.ceil(cantResultados.intValue() / (float) tamanoPagina);

        Pageable pageItems = PageRequest.of(pagina, tamanoPagina);
        listaDetalle = manejadorDsusDetsuscrip.consultaDetalle(idSuscripcion, nombreTercero, documentoTercero, ciclo,
                documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde, hasta, pageItems);

        // Mapeo de los objetos de respuesta de la consulta al DTO de respuesta del
        // servicio
        for (Object[] row : listaDetalle) {
            ConsultaDetalleSuscripcionDTO consultaDetSus = new ConsultaDetalleSuscripcionDTO();
            consultaDetSus.setIdSuscripcion((Long) row[0]);
            consultaDetSus.setCodigo((String) row[1]);
            consultaDetSus.setEstado(row[2].toString());
            consultaDetSus.setTipoUso((String) row[3]);
            consultaDetSus.setEstrato((Short) row[4]);
            consultaDetSus.setNombreCompletoTercero((String) row[5]);
            consultaDetSus.setDocumentoTercero((String) row[6]);
            consultaDetSus.setDireccion((String) row[7]);
            consultaDetSus.setBarrio((String) row[8]);
            consultaDetSus.setCatastral((String) row[9]);
            consultaDetSus.setCiclo((String) row[10]);
            listaResultados.add(consultaDetSus);
        }

        ResponseConsultaDetalleSuscripcionDTO reponseConsultaDetalle = new ResponseConsultaDetalleSuscripcionDTO();
        reponseConsultaDetalle.setData(listaResultados);
        reponseConsultaDetalle.setPages(pages);

        return reponseConsultaDetalle;
    }

    /**
     * Método encargado de manejar la lógica de negocio para la consulta de detalles
     * de suscripción para cambio de estrato
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param pagina
     * @param tamanoPagina
     * @param fechaHasta
     * @param fechaDesde
     * @param consultaPaginador
     * @return
     * @throws InvalidParameterException
     * @throws ParseException
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */

    public ResponseConsultaDetalleSuscripcionDTO consultaDetalleEstrato(Long idSuscripcion, String nombreTercero,
                                                                        String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
                                                                        String codAntSuscripcion, Integer pagina, Integer tamanoPagina, String fechaDesde, String fechaHasta)
            throws IOException {

        List<Object[]> listaDetalle;

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Map<String, Object> consulta = negocioParParametro.consultaParametros(idEmpresa,
                ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
        List<ConsultaDetalleSuscripcionDTO> listaResultados = new ArrayList<>();
        Timestamp desde = null;
        Timestamp hasta = null;

        // Se mapean en DTO's y se añaden a una lista para ser mostrados en una lista
        // desplegable en la aplicación
        ParParametroStringDTO tipoDocumentoArray = new ParParametroStringDTO(
                (ArrayList<Integer>) (consulta.get(ConstantesServicios.UNI_DOCUMENTO_FACTURA_SERVICIO)),
                ConstantesServicios.UNI_DOCUMENTO_FACTURA_SERVICIO);

        ParParametroDTO parametroEstado = new ParParametroDTO(
                (Integer) (consulta.get(ConstantesServicios.UNI_CONCEPTO_ESTRATO)),
                ConstantesServicios.UNI_CONCEPTO_ESTRATO);

        Integer tipoDocumentoParametrp = tipoDocumentoArray.getIdParametro().get(0);
        
        nombreTercero = stringVacio(nombreTercero);
        nombreTercero = nombreTercero != null ? nombreTercero.toLowerCase() : nombreTercero;

        documentoTercero = stringVacio(documentoTercero);
        numCatastral = stringVacio(numCatastral);
        codAntSuscripcion = stringVacio(codAntSuscripcion);
        fechaDesde = stringVacio(fechaDesde);
        fechaHasta = stringVacio(fechaHasta);

        if (fechaDesde != null && fechaHasta != null) {
            desde = negocioCosuConsuscrip.toTimestamp(fechaDesde);
            hasta = negocioCosuConsuscrip.toTimestamp(fechaHasta);
        }

        BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalleEstrato(idSuscripcion, nombreTercero,
                documentoTercero, ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde,
                hasta, tipoDocumentoParametrp, parametroEstado.getIdParametro());
        pages = (int) Math.ceil(cantResultados.intValue() / (float) tamanoPagina);

        Pageable pageItems = PageRequest.of(pagina, tamanoPagina);
        listaDetalle = manejadorDsusDetsuscrip.consultaDetalleEstrato(idSuscripcion, nombreTercero, documentoTercero,
                ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde, hasta,
                tipoDocumentoParametrp, parametroEstado.getIdParametro(), pageItems);
        
        // Mapeo de los objetos de respuesta de la consulta al DTO de respuesta del
        // servicio
        for (Object[] row : listaDetalle) {
            ConsultaDetalleSuscripcionDTO consultaDetSus = new ConsultaDetalleSuscripcionDTO();
            consultaDetSus.setIdSuscripcion((Long) row[0]);
            consultaDetSus.setCodigo((String) row[1]);
            consultaDetSus.setEstado(row[2].toString());
            consultaDetSus.setTipoUso((String) row[3]);
            consultaDetSus.setEstrato((Short) row[4]);
            consultaDetSus.setNombreCompletoTercero((String) row[5]);
            consultaDetSus.setDocumentoTercero((String) row[6]);
            consultaDetSus.setDireccion((String) row[7]);
            consultaDetSus.setBarrio((String) row[8]);
            consultaDetSus.setCatastral((String) row[9]);
            consultaDetSus.setCiclo((String) row[10]);
            consultaDetSus.setFacNumero((Long) row[14]);
            consultaDetSus.setPerNombre((String) row[15]);
            consultaDetSus.setEstratoAnterior((BigDecimal) row[16]);
            BigDecimal estratoAntes = (BigDecimal) row[16];
            consultaDetSus.setDisabled(estratoAntes.shortValueExact() == (Short) row[4]);
            listaResultados.add(consultaDetSus);
        }

        ResponseConsultaDetalleSuscripcionDTO reponseConsultaDetalle = new ResponseConsultaDetalleSuscripcionDTO();
        reponseConsultaDetalle.setData(listaResultados);
        reponseConsultaDetalle.setPages(pages);

        return reponseConsultaDetalle;
    }

    /**
     * Método encargado de manejar la lógica de negocio para la consulta de detalles
     * de suscripción para cambio de tipo de uso
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param pagina
     * @param tamanoPagina
     * @param fechaHasta
     * @param fechaDesde
     * @param consultaPaginador
     * @return
     * @throws InvalidParameterException
     * @throws ParseException
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */

    public ResponseConsultaDetalleSuscripcionDTO consultaDetalleTipoUso(Long idSuscripcion, String nombreTercero,
                                                                        String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
                                                                        String codAntSuscripcion, Integer pagina, Integer tamanoPagina, String fechaDesde, String fechaHasta) {

        List<Object[]> listaDetalle;

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        List<ConsultaDetalleSuscripcionDTO> listaResultados = new ArrayList<>();
        Timestamp desde = null;
        Timestamp hasta = null;

        nombreTercero = stringVacio(nombreTercero);
        nombreTercero = nombreTercero != null ? nombreTercero.toLowerCase() : nombreTercero;
        documentoTercero = stringVacio(documentoTercero);
        numCatastral = stringVacio(numCatastral);
        codAntSuscripcion = stringVacio(codAntSuscripcion);
        fechaDesde = stringVacio(fechaDesde);
        fechaHasta = stringVacio(fechaHasta);

        if (fechaDesde != null && fechaHasta != null) {
            desde = negocioCosuConsuscrip.toTimestamp(fechaDesde);
            hasta = negocioCosuConsuscrip.toTimestamp(fechaHasta);
        }

        BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalleTipoUso(idSuscripcion, nombreTercero,
                documentoTercero, ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde,
                hasta);
        pages = (int) Math.ceil(cantResultados.intValue() / (float) tamanoPagina);

        Pageable pageItems = PageRequest.of(pagina, tamanoPagina);
        listaDetalle = manejadorDsusDetsuscrip.consultaDetalleTipoUso(idSuscripcion, nombreTercero, documentoTercero,
                ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde, hasta, pageItems);

        // Mapeo de los objetos de respuesta de la consulta al DTO de respuesta del
        // servicio
        for (Object[] row : listaDetalle) {
            ConsultaDetalleSuscripcionDTO consultaDetSus = new ConsultaDetalleSuscripcionDTO();
            consultaDetSus.setIdSuscripcion((Long) row[0]);
            consultaDetSus.setCodigo((String) row[1]);
            consultaDetSus.setFacNumero((Long) row[2]);
            consultaDetSus.setPerNombre((String) row[3]);
            consultaDetSus.setTipoUsoAnterior((String) row[4]);
            consultaDetSus.setTipoUso((String) row[5]);
            consultaDetSus.setEstado(row[6].toString());
            consultaDetSus.setEstrato((Short) row[7]);
            consultaDetSus.setNombreCompletoTercero((String) row[8]);
            consultaDetSus.setDocumentoTercero((String) row[9]);
            consultaDetSus.setDireccion((String) row[10]);
            consultaDetSus.setBarrio((String) row[11]);
            consultaDetSus.setCatastral((String) row[12]);
            consultaDetSus.setCiclo((String) row[13]);
            consultaDetSus.setDisabled(row[4].equals(row[5]));
            listaResultados.add(consultaDetSus);
        }

        ResponseConsultaDetalleSuscripcionDTO reponseConsultaDetalle = new ResponseConsultaDetalleSuscripcionDTO();
        reponseConsultaDetalle.setData(listaResultados);
        reponseConsultaDetalle.setPages(pages);

        return reponseConsultaDetalle;
    }

    public List<ConsultaMedidorSuscriptcionDTO> consultaIdMedidor(String empresaId, String numeroMedidor,
                                                                  String codigoAnterior) {

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<Object[]> listaResultados;

        empresaId = stringVacio(empresaId);
        numeroMedidor = stringVacio(numeroMedidor);
        codigoAnterior = stringVacio(codigoAnterior);

        listaResultados = manejadorDsusDetsuscrip.consultaMedidorSus(empresaId, numeroMedidor, codigoAnterior);

        List<ConsultaMedidorSuscriptcionDTO> listaId = new ArrayList<>();

        for (Object[] row : listaResultados) {
            ConsultaMedidorSuscriptcionDTO resposeConsultaMedidor = new ConsultaMedidorSuscriptcionDTO();
            resposeConsultaMedidor.setIdSuscripcion((Long) row[0]);
            resposeConsultaMedidor.setNombreCompletoTercero((String) row[1]);
            resposeConsultaMedidor
                    .setSuscripcionAseo(manejadorDsusDetsuscrip.consultaFacturacionConjunta(idEmpresa, (Long) row[0]));
            listaId.add(resposeConsultaMedidor);
        }

        return listaId;
    }

    /**
     * Método encargado de manejar la lógica de negocio para la consulta de detalles
     * de suscripción por deshabitado
     *
     * @param idSuscripcion
     * @return
     * @throws InvalidParameterException
     */

    public List<ConsultaConceptosDeshabitadoDTO> consultaConceptosDeshabitado(Long idSuscripcion) {

        List<Object[]> listaDetalle;

        List<ConsultaConceptosDeshabitadoDTO> listaResultados = new ArrayList<>();

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        listaDetalle = manejadorDsusDetsuscrip.consultaConceptosDeshabitado(idSuscripcion, idEmpresa);

        // Mapeo de los objetos de respuesta de la consulta al DTO de respuesta del
        // servicio
        for (Object[] row : listaDetalle) {
            ConsultaConceptosDeshabitadoDTO consultaCon = new ConsultaConceptosDeshabitadoDTO();
            consultaCon.setNombreConcepto((String) row[0]);

            listaResultados.add(consultaCon);
        }

        return listaResultados;
    }

    /**
     * Método encargado de manejar la lógica de negocio para la consulta de los
     * conceptos de suscripción por deshabitado
     *
     * @param idSuscripcion
     * @return
     * @throws InvalidParameterException
     */

    public ResponseConsulSuscripReliquidadasDTO consultaDetalleSusDeshabitado(Long idSuscripcion) {

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<Object[]> listaDetalle;
        List<ConsultaDetalleDeshabitadoDTO> listaResultados = new ArrayList<>();

        listaDetalle = manejadorDsusDetsuscrip.consultaDetalleSusDeshabitado(idSuscripcion, idEmpresa);

        // Mapeo de los objetos de respuesta de la consulta al DTO de respuesta del
        // servicio
        for (Object[] row : listaDetalle) {
            ConsultaDetalleDeshabitadoDTO consultaDetSus = new ConsultaDetalleDeshabitadoDTO();
            consultaDetSus.setIdSuscripcion((Long) row[0]);
            consultaDetSus.setNumeroFactura((Long) row[1]);
            consultaDetSus.setCodigoUsuarioAnterior((String) row[2]);
            consultaDetSus.setEstrato(String.valueOf(row[5]));
            consultaDetSus.setNombreCompletoTercero((String) row[6]);
            consultaDetSus.setTipoUso((String) row[4]);
            consultaDetSus.setPeriodo("");
            consultaDetSus.setCiclo(String.valueOf(row[11]));
            consultaDetSus.setEmpresaAlterna("");
            consultaDetSus.setTarifaFinal((BigDecimal) row[14]);
            consultaDetSus.setTarifaDescuento((BigDecimal) row[14]);
            consultaDetSus.setTotalDescuento((BigDecimal) row[14]);
            consultaDetSus.setDireccion((String) row[8]);
            consultaDetSus.setNumeroDocumentoReq(String.valueOf(row[13]));
            consultaDetSus.setEsDeshabitado("NO");
            listaResultados.add(consultaDetSus);
        }

        return new ResponseConsulSuscripReliquidadasDTO();

    }

    /**
     * Método encargado de realizar la consulta de facturas para suscripciones
     * aforadas
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param pagina
     * @param tamanoPagina
     * @param fechaDesde
     * @param fechaHasta
     * @param fechaPqr
     * @param tipoNota
     * @param numeroPqr
     * @return
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     * @throws ParseException
     */
    public ResponseConsultaDetalleSuscripcionDTO consultaDetalleAforados(Integer idSuscripcion, String nombreTercero,
                                                                         String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
                                                                         String codAntSuscripcion, Integer pagina, Integer tamanoPagina, String fechaDesde, String fechaHasta,
                                                                         String fechaPqr, Integer tipoNota, Integer numeroPqr) throws IOException, ParseException {

        List<ConsultaDetalleSuscripcionDTO> listaDetalle = new ArrayList<>();
        List<Object []> listaDetalleObject = new ArrayList<>();
        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        AforoExtraOrdinarioDTO aforadoExtraordinario;
        Timestamp desde = null;
        Timestamp hasta = null;
        Timestamp fechaPqrT = null;
        int pagesconsulta = 0;

        Map<String, Object> parametros = negocioParParametro.consultaParametros(idEmpresa,
                ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
        Integer uniTipoAforoOrdinario = (Integer) parametros.get(ConstantesServicios.UNI_TIPO_AFORO_ORDINARIO);
        Integer uniTipoAforoExtraOrdinario = (Integer) parametros
                .get(ConstantesServicios.UNI_TIPO_AFORO_EXTRAORDINARIO);
        Integer uniConeptoAforoExtraOrdinario = (Integer) parametros
                .get(ConstantesServicios.UNI_CONCEPTO_AFORO_EXTRAORDINARIO);
        Integer uniAforoIndividual = (Integer) parametros.get(ConstantesServicios.UNI_AFORO_INDIVIDUAL);
        Integer uniAforoMultiusuario = (Integer) parametros.get(ConstantesServicios.UNI_AFORO_MULTIUSUARIO);

        nombreTercero = stringVacio(nombreTercero);
        nombreTercero = nombreTercero != null ? nombreTercero.toLowerCase() : nombreTercero;

        documentoTercero = stringVacio(documentoTercero);
        numCatastral = stringVacio(numCatastral);
        codAntSuscripcion = stringVacio(codAntSuscripcion);
        fechaDesde = stringVacio(fechaDesde);
        fechaHasta = stringVacio(fechaHasta);
        fechaPqr = stringVacio(fechaPqr);

        if (fechaDesde != null && fechaHasta != null && fechaPqr != null) {
            desde = negocioCosuConsuscrip.toTimestamp(fechaDesde);
            hasta = negocioCosuConsuscrip.toTimestamp(fechaHasta);
            fechaPqrT = negocioCosuConsuscrip.toTimestamp(fechaPqr);
        }

        // Validaciones de aforo extraordinario
        /*List<Object[]> listaAforos = manejadorAfoAforo.consultarUltimoAforoExtraordinario(uniTipoAforoOrdinario,
                uniTipoAforoExtraOrdinario, idSuscripcion, fechaPqrT, uniAforoIndividual, uniAforoMultiusuario);*/
        List<Object[]> listaAforos = manejadorAfoAforo.consultarUltimoAforoExtraordinario(uniConeptoAforoExtraOrdinario,uniTipoAforoExtraOrdinario, idSuscripcion);
        

        if (!listaAforos.isEmpty()) {
            aforadoExtraordinario = mapResultToDto(listaAforos);
            if (aforadoExtraordinario.getValorTafnaExtraOrdinario().doubleValue() > 0) {

                validarExistenciaParametrosPaen(tipoNota, idEmpresa, uniConeptoAforoExtraOrdinario, idUsuario,
                        aforadoExtraordinario.getValorTafnaExtraOrdinario());

                // Se valida la diferencia de los dos años
                float diferenciaAnios = validarDiferenciaAniosFecha(aforadoExtraordinario.getHmafFecharegistro());

                if (diferenciaAnios <= 2) {

                    /*BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalleAforados(
                            Long.valueOf(idSuscripcion), nombreTercero, documentoTercero, ciclo, documento,
                            tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde, hasta,
                            uniConeptoAforoExtraOrdinario, numeroPqr.toString());*/
                    BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalleAforados(
                            Long.valueOf(idSuscripcion), //codAntSuscripcion, 
                            idEmpresa, desde, hasta,
                            uniConeptoAforoExtraOrdinario);
                    pagesconsulta = (int) Math.ceil(cantResultados.intValue() / (float) tamanoPagina);

                    Pageable pageItems = PageRequest.of(pagina, tamanoPagina);
                    /*listaDetalle = manejadorDsusDetsuscrip.consultaDetalleAforados(Long.valueOf(idSuscripcion),
                            nombreTercero, documentoTercero, ciclo, documento, tipoDocumento, numCatastral,
                            codAntSuscripcion, idEmpresa, desde, hasta, uniConeptoAforoExtraOrdinario,
                            numeroPqr.toString(), pageItems);*/
                    listaDetalleObject = manejadorDsusDetsuscrip.consultaDetalleAforados(Long.valueOf(idSuscripcion),
                            //codAntSuscripcion, 
                            idEmpresa, desde, hasta, uniConeptoAforoExtraOrdinario, pageItems);
                    
                    for(Object[] detalle : listaDetalleObject){
                        ConsultaDetalleSuscripcionDTO e = new ConsultaDetalleSuscripcionDTO();
                        e.setIdSuscripcion(((BigInteger)detalle[0]).longValueExact());
                        e.setCodigo((String)detalle[1]);
                        e.setFacNumero(((BigInteger)detalle[2]).longValueExact());
                        e.setPerNombre((String)detalle[3]);
                        e.setTafnaFactura((BigDecimal) detalle[4]);
                        e.setEstrato((short)detalle[5]);
                        e.setEstado(String.valueOf(detalle[6]));
                        e.setTipoUso((String)detalle[7]);
                        e.setNombreCompletoTercero((String)detalle[8]);
                        e.setDocumentoTercero((String)detalle[9]);
                        e.setDireccion((String)detalle[10]);
                        e.setBarrio((String)detalle[11]);
                        e.setCatastral((String)detalle[12]);
                        e.setCiclo((String)detalle[13]);
                        listaDetalle.add(e);
                    }

                    for (ConsultaDetalleSuscripcionDTO detalle : listaDetalle) {
                        detalle.setTafnaExtraOrdinario(aforadoExtraordinario.getValorTafnaExtraOrdinario());
                    }
                }
            }
        }

        ResponseConsultaDetalleSuscripcionDTO reponseConsultaDetalle = new ResponseConsultaDetalleSuscripcionDTO();
        reponseConsultaDetalle.setData(listaDetalle);
        reponseConsultaDetalle.setPages(pagesconsulta);

        return reponseConsultaDetalle;
    }

    /**
     * Método de negocio de manejo de las variables para la consulta de facturas de
     * una suscripción para la adición o eliminación de deuda
     *
     * @param idSuscripcion
     * @param nombreTercero
     * @param documentoTercero
     * @param ciclo
     * @param documento
     * @param tipoDocumento
     * @param numCatastral
     * @param codAntSuscripcion
     * @param pagina
     * @param tamanoPagina
     * @param fechaDesde
     * @param fechaHasta
     * @param tipoNota
     * @param paginador
     * @param accionARealizar
     * @return
     */
    public ResponseConsultaDetalleSuscripcionDTO consultaDetalleNotaDeuda(Integer idSuscripcion, String nombreTercero,
                                                                          String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
                                                                          String codAntSuscripcion, Integer pagina, Integer tamanoPagina, String fechaDesde, String fechaHasta,
                                                                          Integer tipoNota, Boolean paginador, Integer accionARealizar) {

        List<ConsultaDetalleSuscripcionDTO> listaDetalle;

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        Timestamp desde = null;
        Timestamp hasta = null;
        int pagesconsulta = 0;

        // Eliminación de detalles previos sin confirmar cuando se consulta por primera vez
        if (Boolean.FALSE.equals(paginador)) {
            manejadorDfacDetNovedad.eliminarRegistroTMPBuscar(idEmpresa, idUsuario, tipoNota);
        }
        nombreTercero = stringVacio(nombreTercero);
        nombreTercero = nombreTercero != null ? nombreTercero.toLowerCase() : nombreTercero;

        documentoTercero = stringVacio(documentoTercero);
        numCatastral = stringVacio(numCatastral);
        codAntSuscripcion = stringVacio(codAntSuscripcion);
        fechaDesde = stringVacio(fechaDesde);
        fechaHasta = stringVacio(fechaHasta);

        if (fechaDesde != null && fechaHasta != null) {
            desde = negocioCosuConsuscrip.toTimestamp(fechaDesde);
            hasta = negocioCosuConsuscrip.toTimestamp(fechaHasta);
        }

        BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalleNotaDeuda(Long.valueOf(idSuscripcion),
                nombreTercero, documentoTercero, ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion,
                idEmpresa, desde, hasta);
        pagesconsulta = (int) Math.ceil(cantResultados.intValue() / (float) tamanoPagina);

        Pageable pageItems = PageRequest.of(pagina, tamanoPagina);
        listaDetalle = manejadorDsusDetsuscrip.consultaDetalleNotaDeuda(Long.valueOf(idSuscripcion), nombreTercero,
                documentoTercero, ciclo, documento, tipoDocumento, numCatastral, codAntSuscripcion, idEmpresa, desde,
                hasta, pageItems);

        if (accionARealizar.equals(2)) {
            for (ConsultaDetalleSuscripcionDTO detalle : listaDetalle) {
                if (detalle.getValorEmitidoFactura().compareTo(BigDecimal.ZERO) == 0) {
                    detalle.setDisabled(true);
                }
            }
        }
        ResponseConsultaDetalleSuscripcionDTO reponseConsultaDetalle = new ResponseConsultaDetalleSuscripcionDTO();
        reponseConsultaDetalle.setData(listaDetalle);
        reponseConsultaDetalle.setPages(pagesconsulta);

        return reponseConsultaDetalle;
    }

    /**
     * Método que retorna el dto de la consulta de la info de un aforo
     * extraordinario (Hace el mapeo de Object a DTO)
     *
     * @param listaAforos
     * @return
     * @throws ParseException
     */
    private AforoExtraOrdinarioDTO mapResultToDto(List<Object[]> listaAforos) throws ParseException {
        AforoExtraOrdinarioDTO aforado = new AforoExtraOrdinarioDTO();
        for (Object[] row : listaAforos) {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String fecha = dateFormat.format(row[4]);
            aforado.setDsusIderegistr(((BigInteger) row[0]).intValue());
            aforado.setPerIderegistro((Integer) row[1]);
            aforado.setValorTafnaExtraOrdinario((BigDecimal) row[2]);
            aforado.setMnafTafna((BigDecimal) row[3]);
            aforado.setHmafFecharegistro(dateFormat.parse(fecha));
        }

        return aforado;
    }

    /**
     * Método encargado de validar la existencia de parámetros de entrada para un
     * posterior reliquidación en caso de que se necesite
     *
     * @param tipoNota
     * @param idEmpresa
     * @param uniConeptoAforoExtraOrdinario
     * @param idUsuario
     * @param long1
     */
    private void validarExistenciaParametrosPaen(Integer tipoNota, int idEmpresa, Integer uniConeptoAforoExtraOrdinario,
                                                 int idUsuario, BigDecimal uniConceptoValor) {
        PaenParametrosentradanota existePaen = manejadorPaenParametrosentradanota.consultaPaen(Long.valueOf(tipoNota),
                idEmpresa, Long.valueOf(uniConeptoAforoExtraOrdinario), Long.valueOf(idUsuario));
        if (existePaen != null) {
            existePaen.setPaenValor(uniConceptoValor);
        } else {
            existePaen = new PaenParametrosentradanota();
            existePaen.setEmpIderegistro(idEmpresa);
            existePaen.setPaenTipocalculo("V");
            existePaen.setPaenValor(uniConceptoValor);
            existePaen.setPrgIderegistro(Long.valueOf(tipoNota));
            existePaen.setUniConcepto(Long.valueOf(uniConeptoAforoExtraOrdinario));
            existePaen.setUsuIderegistro(Long.valueOf(idUsuario));
        }
        manejadorPaenParametrosentradanota.save(existePaen);
    }

    /**
     * Método encargado de comparar la diferencia entre años de la fecha actual y
     * una fecha pasada como parámetro
     *
     * @param hmafFecharegistro
     * @return
     */
    private float validarDiferenciaAniosFecha(Date hmafFecharegistro) {

        LocalDateTime now = LocalDateTime.now();
        Timestamp fechaRegistroT = new Timestamp(hmafFecharegistro.getTime());
        LocalDateTime hmafFecharegistroC = fechaRegistroT.toLocalDateTime();

        long diffDays = ChronoUnit.DAYS.between(hmafFecharegistroC, now);

        return ((float) diffDays / 365);

    }

    /**
     * Método encargado de manejar la lógica de los datos para consultar las
     * suscripciones a las que se les quiere aplicar la marcación a futuro
     *
     * @param requestConsultaMarcacionTarifaDTO
     * @return
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     * @throws ParseException
     */
    public ResponseMarcacionTarifaDeshabitadoDTO consultaMarcacionTarifa(
            RequestConsultaMarcacionTarifaDTO requestConsultaMarcacionTarifaDTO) throws IOException, ParseException {

        ResponseMarcacionTarifaDeshabitadoDTO response = new ResponseMarcacionTarifaDeshabitadoDTO();
        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Timestamp inicioVigencia = stringToTimestamp(requestConsultaMarcacionTarifaDTO.getVigenciaDesde());
        Pageable pageItems = PageRequest.of(requestConsultaMarcacionTarifaDTO.getPagina(),
                requestConsultaMarcacionTarifaDTO.getTamanoPagina());

        BigInteger cantResultados = manejadorDsusDetsuscrip.conteoConsultaDetalleMarcacionTarifa(
                requestConsultaMarcacionTarifaDTO.getListaSuscripciones(), idEmpresa);
        int paginas = (int) Math
                .ceil(cantResultados.intValue() / (float) requestConsultaMarcacionTarifaDTO.getTamanoPagina());

        List<MarcacionTarifaDTO> listaRespuesta = manejadorDsusDetsuscrip.consultaDetalleMarcacionTarifa(
                requestConsultaMarcacionTarifaDTO.getListaSuscripciones(), idEmpresa, pageItems);

        Map<String, Object> parametros = negocioParParametro.consultaParametros(idEmpresa,
                ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
        int idProgramaLiquidacion = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);

        for (MarcacionTarifaDTO respuestaMarcacionTarifaDTO : listaRespuesta) {
            DperDetperiodo actividades = manejadorDperDetperiodo
                    .consultaActividades(respuestaMarcacionTarifaDTO.getIdSuscripcion(), idProgramaLiquidacion);
            Optional<DsusDetsuscrip> detalleSuscripcion1 = manejadorDsusDetsuscrip
                    .findById(respuestaMarcacionTarifaDTO.getIdSuscripcion());
            if (detalleSuscripcion1.isPresent()) {
                DsusDetsuscrip detalleSuscripcion = detalleSuscripcion1.get();
                CosuConsuscrip cosuValidar = manejadorCosuConsuscrip.validarCosuConsuscrip(
                        detalleSuscripcion.getDsusIderegistr(), detalleSuscripcion.getUniLiquidacion(),
                        requestConsultaMarcacionTarifaDTO.getConceptoNota());
                respuestaMarcacionTarifaDTO.setPeriodoDesde(requestConsultaMarcacionTarifaDTO.getVigenciaDesde());
                respuestaMarcacionTarifaDTO.setPeriodoHasta(requestConsultaMarcacionTarifaDTO.getVigenciaHasta());

                if (inicioVigencia.compareTo(actividades.getDperFecinicial()) >= 0
                        && inicioVigencia.compareTo(actividades.getDperFecfinal()) <= 0) {
                    respuestaMarcacionTarifaDTO.setSeCruza(true);
                    respuestaMarcacionTarifaDTO
                            .setAccionDeMarcacion("Error: fecha inicial igual a fecha de liquidación");
                } else if (cosuValidar != null) {
                    respuestaMarcacionTarifaDTO.setSeCruza(false);
                    respuestaMarcacionTarifaDTO.setAccionDeMarcacion("Modificar existente " + "("
                            + cosuValidar.getCosuFecinicio().toLocalDateTime().toLocalDate() + " - "
                            + cosuValidar.getCosuFecfinal().toLocalDateTime().toLocalDate() + ")");
                } else {
                    respuestaMarcacionTarifaDTO.setSeCruza(false);
                    respuestaMarcacionTarifaDTO.setAccionDeMarcacion("Crear");
                }
            }

        }

        response.setData(listaRespuesta);
        response.setPaginas(paginas);

        return response;
    }

    /**
     * Método encargado de manejar la lógica y la paginación para el servicio de
     * consulta de las suscripciones reliquidadas
     *
     * @param requestConsulSuscripReliquidadasDTO
     * @return
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    public ResponseConsulSuscripReliquidadasDTO consultaSuscripcionesReliquidadas(
            RequestConsulSuscripReliquidadasDTO requestConsulSuscripReliquidadasDTO) throws IOException {
        ResponseConsulSuscripReliquidadasDTO response = new ResponseConsulSuscripReliquidadasDTO();
        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        List<SuscripcionReliquidadaDTO> listaRespuesta = new ArrayList<>();
        Map<String, Object> consulta = negocioParParametro.consultaParametros(idEmpresa,
                ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
        Integer uniConceptoEstrato = (Integer) consulta.get(ConstantesServicios.UNI_CONCEPTO_ESTRATO);
        BigInteger cantResultados = null;
        Pageable pageItems = PageRequest.of(requestConsulSuscripReliquidadasDTO.getPagina(),
                requestConsulSuscripReliquidadasDTO.getTamanoPagina());

        switch (requestConsulSuscripReliquidadasDTO.getTipoNota()) {
            // Consulta para suscripciones reliquidadas por cambio de estrato
            case ConstantesServicios.ID_PROGRAMA_ESTRATO:
                cantResultados = manejadorDsusDetsuscrip.conteoConsultaSuscripcionesReliquidadasEstrato(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota(), uniConceptoEstrato);
                listaRespuesta = manejadorDsusDetsuscrip.consultaSuscripcionesReliquidadasEstrato(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, pageItems, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota(), uniConceptoEstrato);
                break;
            // Consulta para el caso de cambio de tipo de uso
            case ConstantesServicios.ID_PROGRAMA_TIPO_DE_USO:
                cantResultados = manejadorDsusDetsuscrip.conteoConsultaSuscripcionesReliquidadasTipoUso(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota());
                listaRespuesta = manejadorDsusDetsuscrip.consultaSuscripcionesReliquidadasTipoUso(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, pageItems, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota());
                break;

            // Consulta para el caso de inclusión/eliminación de deuda
            case ConstantesServicios.ID_PROGRAMA_INCLUSION_ELIMINACION_DEUDA:
                List<Object[]> listaRespuesta2;

                cantResultados = manejadorCprCtrprocesoRespository.conteoConsultaSuscripcionesReliquidadasDeuda(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota());
                listaRespuesta2 = manejadorCprCtrprocesoRespository.consultaSuscripcionesReliquidadasDeuda(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota());

                asignaValoresDeuda(listaRespuesta2, listaRespuesta);

                break;
            // Consulta para suscripciones reliquidadas por descuento de deshabitado, puerta
            // a puerta o por aforo extraordinario
            default:
                cantResultados = manejadorDsusDetsuscrip.conteoConsultaSuscripcionesReliquidadas(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota());
                listaRespuesta = manejadorDsusDetsuscrip.consultaSuscripcionesReliquidadas(
                        requestConsulSuscripReliquidadasDTO.getListaSuscripciones(), idEmpresa, pageItems, idUsuario,
                        requestConsulSuscripReliquidadasDTO.getTipoNota());
                break;
        }

        int paginas = (int) Math
                .ceil(cantResultados.intValue() / (float) requestConsulSuscripReliquidadasDTO.getTamanoPagina());

        response.setData(listaRespuesta);
        response.setPaginas(paginas);

        return response;
    }

    private void asignaValoresDeuda(List<Object[]> listaRespuesta2, List<SuscripcionReliquidadaDTO> listaRespuesta) {
        for (Object[] item : listaRespuesta2) {

            SuscripcionReliquidadaDTO res = new SuscripcionReliquidadaDTO();

            res.setIdSuscripcion(item[0] != null ? Long.parseLong(item[0].toString()) : 0);
            res.setCodigoAnterior(item[1].toString());
            res.setNumeroFactura(item[2] != null ? Long.parseLong(item[2].toString()) : 0);
            res.setPeriodo(item[3].toString());
            res.setNombreTercero(item[4].toString());
            res.setDocumentoTercero(item[5].toString());
            res.setDireccion(item[6].toString());
            res.setBarrio(item[7].toString());
            res.setCatastral(item[8].toString());
            res.setEliminaCod(item[9].toString());
            res.setValorEmitido(item[0] != null ? new BigDecimal(item[10].toString()) : BigDecimal.ZERO);
            res.setValorAjustar(item[0] != null ? new BigDecimal(item[11].toString()) : BigDecimal.ZERO);
            res.setSaldoElimina(item[0] != null ? new BigDecimal(item[12].toString()) : BigDecimal.ZERO);
            res.setSaldoAdiciona(item[0] != null ? new BigDecimal(item[13].toString()) : BigDecimal.ZERO);

            listaRespuesta.add(res);
        }

    }

    /**
     * Método encargado de consultar los conceptos con diferencia de una suscripción
     * reliquidada
     *
     * @param facIderegistro
     * @return
     */
    public List<ConceptoSuscripcionReliquidadaDTO> consultaConceptosSuscripcionesReliquidadas(Long facIderegistro) {

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        return manejadorDsusDetsuscrip.consultaConceptosSuscripcionesReliquidadas(facIderegistro, idEmpresa, idUsuario);

    }

    public ConceptoSuscripcionDeudaDTO consultaConceptosDeuda(Long facIderegistro, Integer tipoNota) {

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        ConceptoSuscripcionDeudaDTO response = new ConceptoSuscripcionDeudaDTO();

        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        List<ConceptoSuscripcionReliquidadaDTO> listaConceptos = manejadorDsusDetsuscrip
                .consultaConceptosDeuda(facIderegistro, idEmpresa, idUsuario, tipoNota);

        ConceptoSuscripcionReliquidadaDTO terceroDeuda = manejadorDsusDetsuscrip.consultaTerceroDeuda(facIderegistro);

        if (listaConceptos.isEmpty()) {
            logger.info("No se encontro informacion para la factura: " + facIderegistro + " ");
            return response;
        }

        if (terceroDeuda == null) {
            logger.info("No se encontro informacion de tercero para la factura: " + facIderegistro + " ");
            return response;
        }

        response.setListaConceptos(listaConceptos);
        response.setDocumento(terceroDeuda.getDocumento());
        response.setNombreTercero(terceroDeuda.getNombreTercero());
        response.setTipoDocumento(terceroDeuda.getTipoDocumento());
        response.setCodigoAnterior(terceroDeuda.getCodigoAnterior());
        response.setDireccion(terceroDeuda.getDireccion());

        return response;
    }

    public ConceptoSuscripcionDeudaDTO consultaConceptosDeudaReliq(Long facIderegistro) {

        // Obtención del Id de la empresa en sesión como parámetro de la consulta
        ConceptoSuscripcionDeudaDTO response = new ConceptoSuscripcionDeudaDTO();

        List<ConceptoSuscripcionReliquidadaDTO> listaConceptos = manejadorDsusDetsuscrip
                .consultaConceptosDeudaReliq(facIderegistro);

        ConceptoSuscripcionReliquidadaDTO terceroDeuda = manejadorDsusDetsuscrip
                .consultaTerceroDeudaReliq(facIderegistro);

        if (listaConceptos.isEmpty()) {
            logger.info("No se encontro informacion para la factura: " + facIderegistro + " ");
            return response;
        }

        if (terceroDeuda == null) {
            logger.info("No se encontro informacion de tercero para la factura: " + facIderegistro + " ");
            return response;
        }

        response.setListaConceptos(listaConceptos);
        response.setDocumento(terceroDeuda.getDocumento());
        response.setNombreTercero(terceroDeuda.getNombreTercero());
        response.setTipoDocumento(terceroDeuda.getTipoDocumento());
        response.setCodigoAnterior(terceroDeuda.getCodigoAnterior());
        response.setDireccion(terceroDeuda.getDireccion());

        return response;
    }

    /**
     * Método que valida si un parámetro es vacío para volverlo nulo
     *
     * @param parametro
     * @return
     */
    public String stringVacio(String parametro) {
        if (parametro.equals("")) {
            parametro = null;
        }

        return parametro;
    }

    /**
     * Método encagrado de hacer la conversión de string a date
     *
     * @param fecha
     * @return
     * @throws ParseException
     */
    public Date stringToDate(String fecha) throws ParseException {
        return new SimpleDateFormat("dd-MM-yyyy").parse(fecha);

    }

    /**
     * Método encagrado de hacer la conversión de string a Timestamp
     *
     * @param fecha
     * @return
     * @throws ParseException
     */
    public Timestamp stringToTimestamp(String fecha) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = dateFormat.parse(fecha);
        return new Timestamp(date.getTime());
    }

    /**
     * {@inheritDoc}
     *
     * @param nombreAtributo {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return DsusDetsuscrip.contieneAtributo(nombreAtributo);
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    protected Logger getLogger() {
        return logger;
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    protected DsusDetsuscripDTO instanciarDAO() {
        return new DsusDetsuscripDTO();
    }

    public GenericResponseDTO insertarDeudaTmp(RequestInsertarDeudaDTO requestInsertarDeudaDTO) {
        GenericResponseDTO genericResponseDTO = new GenericResponseDTO();

        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

        Long idfactura = Long.valueOf(requestInsertarDeudaDTO.getIdFactura().toString());
        Integer tipoNota = requestInsertarDeudaDTO.getTipoNota();

        manejadorDfacDetNovedad.eliminarRegistroTMP(idEmpresa, idUsuario, tipoNota, idfactura);

        for (RequestConceptoDeuda conceptos : requestInsertarDeudaDTO.getListaConceptos()) {
            DfacDetnovedad novedad = new DfacDetnovedad();

            novedad.setEmpIderegistro(idEmpresa);
            novedad.setUsuIderegistro(idUsuario);
            novedad.setTipoNota(tipoNota);
            novedad.setDfacEstado("A");
            novedad.setDfacCantidad(BigDecimal.ZERO);
            novedad.setDfacVlrunitari(BigDecimal.ZERO);
            novedad.setDfacVlrtotal(BigDecimal.ZERO);
            novedad.setDfacSdoreal(conceptos.getValorAdiciona());
            novedad.setUniConcepto(0);
            novedad.setUniConcepto(conceptos.getIdConcepto());
            novedad.setDfacVlrreal(conceptos.getValorAdiciona());
            novedad.setFacIderegistro(idfactura);

            try {
                manejadorDfacDetNovedad.save(novedad);
            } catch (Exception e) {
                genericResponseDTO.setCodResp(codigoFallido);
                genericResponseDTO
                        .setError(" Error al insertar los cambios de deuda en las tablas TMP para el concepto "
                                + conceptos.getIdConcepto() + " " + e.getMessage());
                return genericResponseDTO;

            }
        }

        genericResponseDTO.setCodResp(codigoExitoso);
        genericResponseDTO.setError("Proceso finalizado");
        return genericResponseDTO;

    }

    /**
     * servicio que busca las subcripciones por cliente e id empresa
     *
     * @param idClient parámetro de cliente suscrito
     * @return
     */
    public List<SusSuscripcionDTO> searchSubscriptionsByIdClient(Long idClient) {
        List<SusSuscripcionDTO> response = new ArrayList<>();
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        this.manejadorDsusDetsuscrip.searchSubscriptionsByIdEmpAndIdClient(idEmpresa, idClient).forEach(source -> {
            SusSuscripcionDTO target = new SusSuscripcionDTO();

            copiarPropiedades(target, source);
            response.add(target);
        });

        return response;
    }
}
