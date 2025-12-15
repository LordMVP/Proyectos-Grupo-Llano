package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.DocDocumentoFacturaDTOResponse;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTOResponse;
import com.bioagricola.apirest.modelo.entidades.ConConcepto;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorFacFactura;
import com.bioagricola.apirest.modelo.entidades.ParLabParametrosLabels;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.*;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionAgrupamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionFiltro;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionOrdenamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.RangoConsulta;
import com.bioagricola.apirest.modelo.utils.UtilOperaciones;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

// protected region Incluya importaciones adicionales en esta seccion on begin


// protected region Incluya importaciones adicionales en esta seccion end


/**
 * Servicios para operaciones CRUD y de negocio sobre la entidad FacFactura
 *
 * @author GeneradorCRUD
 */
@Service
public class NegocioFacFactura extends NegocioAbstracto<FacFactura, FacFacturaDTO> {

    @Autowired
    private ManejadorFacFactura manejadorFacFactura;
    @Autowired
    private NegocioParParametro negocioParParametro;
    @Autowired
    private ManejadorConConcepto manejadorConConcepto;
    @Autowired
    private ManejadorDfacDetfactura manejadorDfacDetfactura;
    @Autowired
    private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;
    @Autowired
    private ManejadorParLabParametrosLabels manejadorParLabParametrosLabels;

    /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(NegocioFacFactura.class.getName());

    /**
     * Realiza un consulta en la entidad FacFactura aplicando los filtros, el ordenamiento,
     * y el rango (from y to) que se pasan como parámetro. Los parámetros filterBy y orderBy
     * pueden ser nulos. El parámetro from y to están relacionados. Si from es diferente de nulo
     * to puedo ser nulo, pero no al revés. Ambos pueden ser nulos, en cuyo caso no se aplica una
     * restricción de rango a la consulta.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     *                 de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     *                 por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     *                 Ej. Una secuencia de parámetros de filtrado puede ser {@literal facFacturaId>1&facFacturaName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     *                 no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     *                 parámetro debe ir separado por coma : ','.
     *                 Ej. Una secuencia de parámetros de ordenamiento puede ser: facFacturaId$ASC, facFacturaName$DESC
     * @param from     Número de registro inicial que se quiere retornar de la consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la consulta realizada. Entero mayor o igual al parámetro from
     * @return Una lista de DAOs de los FacFactura que se consultaron con los parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    public List<FacFacturaDTO> consultar(String filterBy,
                                         String orderBy, Integer from,
                                         Integer to)
            throws InvalidParameterException {
        // protected region Modifique el metodo consultar on begin
        logService(this.getClass().getName(), "consultar", filterBy, orderBy, from, to);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        List<InformacionOrdenamiento> ordenamiento = invocarDecodificacionOrdenamiento(orderBy);
        RangoConsulta rango = validarParametrosBloque(from, to);

        return convertirListaEntidadesADao(manejadorFacFactura.consultar(filtros, ordenamiento, rango));
        // protected region Modifique el metodo consultar end
    }

    /**
     * Crea el facFactura que se pasa como parámetro en la base de datos.
     *
     * @param facFacturaDTO El DAO de la entidad FacFactura a crear. Este se envía en el cuerpo de la
     *                      solicitud POST como un objeto JSON.
     * @return La insntancia de FacFactura recién creado
     */
    public FacFacturaDTO crear(FacFacturaDTO facFacturaDTO) {
        // protected region Modifique el metodo crear on begin

        logService(this.getClass().getName(), "crear", facFacturaDTO);

        FacFactura facFactura = new FacFactura();
        copiarPropiedades(facFactura, facFacturaDTO);

        manejadorFacFactura.save(facFactura);

        return facFacturaDTO;
        // protected region Modifique el metodo crear end
    }

    /**
     * Actualiza en la base de datos el facFactura que se pasa como parámetro.
     *
     * @param facFacturaDTO El DAO de la entidad FacFactura a actualizar. Este se envía en el cuerpo de la
     *                      solicitud PUT como un objeto JSON.
     * @return La instancia de la entidad FacFactura que ha sido actualizado
     */
    public FacFacturaDTO actualizar(FacFacturaDTO facFacturaDTO) {
        // protected region Modifique el metodo actualizar on begin

        logService(this.getClass().getName(), "actualizar", facFacturaDTO);

        FacFactura facFactura = manejadorFacFactura.getOne(facFacturaDTO.getFacIderegistro());
        copiarPropiedades(facFactura, facFacturaDTO);

        manejadorFacFactura.save(facFactura);

        return facFacturaDTO;
        // protected region Modifique el metodo actualizar end
    }

    /**
     * Elimina el facFactura con el identificador que se pasa como parámetro.
     *
     * @param facIderegistro Valor del atributo del identificador de la instancia de la entidad  facFactura a eliminar
     * @return El identificador del facFactura que ha sido eliminado
     */
    public String eliminar(Long facIderegistro) {
        // protected region Modifique el metodo eliminar on begin

        logService(this.getClass().getName(), "eliminar", facIderegistro);
        manejadorFacFactura.deleteById(facIderegistro);


        StringBuilder valores = new StringBuilder();
        valores.append(String.valueOf(facIderegistro));
        return valores.toString();
        // protected region Modifique el metodo eliminar end
    }

    /**
     * Cuenta la cantidad de registros que devuelve la consulta a la tabla de
     * aplicando los filtros o rangos que se pasen como parámetro. Estos
     * pueden ser nulos, en cuyo caso a la consulta no se le realiza ningún tipo de
     * filtrado.
     *
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     *                 de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     *                 por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     *                 Ej. Una secuencia de parámetros de filtrado puede ser {@literal facFacturaId>1&facFacturaName:LIKE:juan}
     * @param from     Número de registro inicial que se quiere retornar de la consulta realizada. Entero mayor o igual a 0
     * @param to       Número de registro final que se quiere retornar de la consulta realizada. Entero mayor o igual al parámetro from
     * @return El número de registros contados a partir de los parámetros enviados por el cliente
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    public String contar(String filterBy,
                         Integer from,
                         Integer to) throws InvalidParameterException {
        // protected region Modifique el metodo contar on begin

        logService(this.getClass().getName(), "contar", filterBy);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        RangoConsulta rango = validarParametrosBloque(from, to);

        return String.valueOf(manejadorFacFactura.consultarTotalRegistros(filtros,
                rango));
        // protected region Modifique el metodo contar end
    }

    /**
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     *                 de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     *                 por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     *                 Ej. Una secuencia de parámetros de filtrado puede ser {@literal facFacturaId>1&facFacturaName:LIKE:juan}
     * @param orderBy  Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     *                 está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y
     *                 posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     *                 no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     *                 parámetro debe ir separado por coma : ','.
     *                 Ej. Una secuencia de parámetros de ordenamiento puede ser: facFacturaId$ASC, facFacturaName$DESC
     * @param atributo Nombre del atributo de la entidad FacFactura del cual se quieren obtener los diferentes valores.
     * @return Una lista con los diferentes valores que se encuentran en la columna de la tabla asociada al atributo.
     * @throws InvalidParameterException Si el atributo no existe en la entidad o si los filtros y el ordenamiento
     *                                   contienen atributos de la entidad que no existen.
     */
    public List<String> consultarLista(String filterBy,
                                       String orderBy, String atributo) throws InvalidParameterException {
        // protected region Modifique el metodo consultarLista on begin

        logService(this.getClass().getName(), "contar", filterBy, orderBy, atributo);

        List<InformacionFiltro> filtros = invocarDecodificacionFiltro(filterBy);
        List<InformacionOrdenamiento> ordenamiento = invocarDecodificacionOrdenamiento(orderBy);
        InformacionAgrupamiento infoAgrupamiento = decodificarInformacionAgrupamiento(atributo);

        return UtilOperaciones.convertirListaObjetosAString(manejadorFacFactura.consultarLista(filtros, ordenamiento, infoAgrupamiento));
        // protected region Modifique el metodo consultarLista end
    }

    /**
     * {@inheritDoc}
     *
     * @param nombreAtributo {@inheritDoc}
     * @return {@inheritDoc}
     */
    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return FacFactura.contieneAtributo(nombreAtributo);
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
    protected FacFacturaDTO instanciarDAO() {
        return new FacFacturaDTO();
    }

    // protected region Use esta region para su implementacion de otros metodos on begin

    public Long getFacturaCicloPeriodoActual(Long idsuscripcion, Integer iddocumento, Integer idtipodocumento, Integer idciclo, Integer idperiodo, Short cicloanio) {
        return manejadorFacFactura.getFacturaCicloPeriodoActual(idsuscripcion, iddocumento, idtipodocumento, idciclo, idperiodo, cicloanio);
    }

    public Object[] getConsultarFacturasGeneradas(Integer idEmpresa, Integer idCiclo) {
        return manejadorFacFactura.getConsultarFacturasGeneradas(idEmpresa, idCiclo);
    }

    /**
     * Llena una lista con los datos que trae la consulta para listar las facturas
     *
     * @param dateInit
     * @param dateEnd
     * @param dsusId
     * @param codBefore
     * @param numInvoice
     * @return
     */
    public Page<FacFacturaDTOResponse> filterInvoice(Date dateInit, Date dateEnd, Long dsusId, String codBefore, Long numInvoice, Pageable pageable) {
        List<FacFacturaDTOResponse> dtoResponseList = new ArrayList<>();
        int idEmp = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<Integer> uniDocumentDueList = new ArrayList<>();
        List<Integer> uniDocumentInvoiceServiceList = new ArrayList<>();
        List<Integer> uniDocumentFeeList = new ArrayList<>();
        List<Integer> uniDocumentBalanceList = new ArrayList<>();
        List<Integer> uniDocumentfinanciacionList = new ArrayList<>();

        fillUniDocumentList(idEmp, uniDocumentDueList, uniDocumentInvoiceServiceList, uniDocumentFeeList, uniDocumentBalanceList,uniDocumentfinanciacionList,uniDocumentInvoiceServiceList);

        for (Object[] object : manejadorFacFactura.getFilterInvoice(dateInit, dateEnd, dsusId, codBefore, numInvoice)) {
            Long idInvoice = (Long) object[6];
            FacFacturaDTOResponse dtoResponse = fillOtherFieldsDto(object);
            
            dtoResponse.setDeuda(manejadorFacFactura.sumSaldoRealByClientFactura(idInvoice)); //dtoResponse.getFacFecha(),
            dtoResponse.setDeudaNota(manejadorFacFactura.sumSaldoDeudaNota(dtoResponse.getFacFechaEnd() ,dtoResponse.getDsusIderegistr(), uniDocumentDueList)); //dtoResponse.getFacFecha(),
            dtoResponse.setMora(manejadorFacFactura.sumSaldoRealByUniDocumentList(dtoResponse.getFacFechaEnd(), dtoResponse.getDsusIderegistr(), uniDocumentFeeList));
            dtoResponse.setMoraNota(manejadorFacFactura.sumSaldoRealMoraNota(dtoResponse.getFacFechaEnd(), dtoResponse.getDsusIderegistr(), uniDocumentFeeList));
            dtoResponse.setOtros(manejadorFacFactura.sumSaldoRealByUniDocumentList(dtoResponse.getFacFechaEnd(), dtoResponse.getDsusIderegistr(), uniDocumentBalanceList));
            dtoResponse.setSaldosaFavor(manejadorFacFactura.sumSaldoReal(dtoResponse.getPerIderegistro(), dtoResponse.getDsusIderegistr(), uniDocumentBalanceList));
            
            dtoResponse.setCuotafinanciacion(manejadorFacFactura.sumCuotaFinanciacionDocumentList(dtoResponse.getFacFechaEnd(), dtoResponse.getDsusIderegistr(), uniDocumentfinanciacionList,(long) dtoResponse.getPerIderegistro()));
             dtoResponse.setCuotafinanciacionNota(manejadorFacFactura.sumCuotaFinanciacionNota(dtoResponse.getFacFechaEnd(), dtoResponse.getDsusIderegistr(), uniDocumentfinanciacionList,(long) dtoResponse.getPerIderegistro()));
            
            dtoResponse.setValortarifa(manejadorFacFactura.sumValorTarifaDocumentList(dtoResponse.getFacNumero()));
            dtoResponse.setTarifacomercializacion(manejadorFacFactura.sumTarifacomercializacionDocumentList(dtoResponse.getFacNumero()));
            dtoResponse.setNombreCompleto(manejadorFacFactura.NombreTercero(dtoResponse.getDsusIderegistr()));
            dtoResponse.setCodAnterior(manejadorFacFactura.codAnterior(dtoResponse.getDsusIderegistr()));
            dtoResponse.setValorRecaudado(manejadorFacFactura.valorRecaudado(dtoResponse.getFacNumero()));
            dtoResponse.setFechaRecaudo(manejadorFacFactura.fechaRecaudo(dtoResponse.getFacNumero()));
            dtoResponse.setDocumentoTercero(manejadorFacFactura.DocumentoTercero(dtoResponse.getDsusIderegistr()));
            dtoResponse.setTotal(manejadorFacFactura.sumSaldoRealByUniDocumentList(dtoResponse.getFacFecha(), dtoResponse.getDsusIderegistr(), uniDocumentInvoiceServiceList));
            dtoResponse.setEmpresaAlterna(manejadorDsusDetsuscrip.obtenerEmpresaHomolgadaXSuscripNombre(dtoResponse.getDsusIderegistr(), idEmp));
            dtoResponse.setTotalDeudaMora((dtoResponse.getMora() != null ? dtoResponse.getMora() : 0) + (dtoResponse.getDeuda() != null ? dtoResponse.getDeuda() : 0));
            dtoResponse.setIdInvoice((Long) object[7]);

            List<ConConcepto> uniConceptList = manejadorConConcepto.ccUniConceptoByKey(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO);

            fillFieldsDiscount(dtoResponse, idInvoice, uniConceptList);
            fillFieldsSubsidyAndContribution(dtoResponse, idInvoice, uniConceptList);

            List<ParLabParametrosLabels> parLabParametersLabelsList = this.manejadorParLabParametrosLabels.findAll();
            Long idStructure = parLabParametersLabelsList.get(0).getEstIdeRegistro();
            List<Object[]> detailInvoiceParamsList = this.manejadorFacFactura.getFnGetlabelsfacturacion(dtoResponse.getDsusIderegistr(), idInvoice, 0L, idEmp, idStructure, true);

            for (Object[] row : detailInvoiceParamsList) {
                for (ParLabParametrosLabels parLabParametrosLabels : parLabParametersLabelsList) {
                    if (parLabParametrosLabels.getParLabLabel().equals(row[12])) {
                        dtoResponse.getRateDetail().merge((String) row[12], ((BigDecimal) row[14]).doubleValue(),Double::sum);
                    }
                }
            }

            fillDetailsInvoice(dtoResponse, detailInvoiceParamsList);
            dtoResponseList.add(dtoResponse);
        }

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), dtoResponseList.size());

        return new PageImpl<>(dtoResponseList.subList(start, end), pageable, dtoResponseList.size());
    }

    private Double calculateSubTotalForRate(List<Object[]> detailInvoiceParamsList, String subTotalRateString) {
        List<String> subTotalRateList = Arrays.asList(subTotalRateString.split(",", -1));
        Double subTotalRate = 0.0;

        for (String st : subTotalRateList) {
            for (Object[] row : detailInvoiceParamsList) {
                if (st.equals(row[12])) {
                    subTotalRate += ((BigDecimal) row[14]).doubleValue();
                }
            }
        }
        return subTotalRate;
    }

    private void fillDetailsInvoice(FacFacturaDTOResponse dtoResponse, List<Object[]> detailInvoiceParamsList) {

        Double subtotalTarifaFija = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_comergasaseo,tar_comeremsa,tar_limpiezaurbana,tar_barridoylimpieza,comer_aprovechamiento");

        dtoResponse.getRateDetail().put("subtotalTarifaFija", subtotalTarifaFija);

        Double subtotalTarifaVariable = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_recoleccionytransporte,tar_disposicionfinal,tar_lixiviados");

        dtoResponse.getRateDetail().put("subtotalTarifaVariable", subtotalTarifaVariable);

        Double subtotalTarifaOtros = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_aprovechamiento,tar_incentivoaprovechamiento,comer_aprovechamiento_terceros");

        dtoResponse.getRateDetail().put("subtotalTarifaOtros", subtotalTarifaOtros);
        
        Double totalGeneralTarifa = (subtotalTarifaFija != null ? subtotalTarifaFija : 0) +
                (subtotalTarifaVariable != null ? subtotalTarifaVariable : 0) +
                (subtotalTarifaOtros != null ? subtotalTarifaOtros : 0);

        dtoResponse.getRateDetail().put("totalGeneralTarifa", totalGeneralTarifa);

        Double totalDescuentosIndicadores = calculateSubTotalForRate(detailInvoiceParamsList,
                "dcto_indcalrecoleccion,dcto_indcalcomercializacion,dcto_indcalcompactacion");

        dtoResponse.getRateDetail().put("totalDescuentosIndicadores", totalDescuentosIndicadores);

        Double totalDescuentos = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_devoluciones,tar_devoluciones_ter,dcto_sinpuertapuerta,dcto_deshabitados");

        dtoResponse.getRateDetail().put("totalDescuentos", totalDescuentos);
        
        Double devoluciones = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_devoluciones,tar_devoluciones_ter");

        dtoResponse.getRateDetail().put("devoluciones", devoluciones);
        
        Double AjustesAprovechamiento = calculateSubTotalForRate(detailInvoiceParamsList,
                "AjusteTA_conDINC," + "AjusteTA_sinDINC");
         dtoResponse.getRateDetail().put("AjustesAprovechamiento", AjustesAprovechamiento);
        
        Double totalAjustes2 = calculateSubTotalForRate(detailInvoiceParamsList,
                "ajuste_ccsaseogas,ajuste_ccsenergia");
        Double totalAjustes = totalAjustes2 + AjustesAprovechamiento;

        dtoResponse.getRateDetail().put("totalAjustes", totalAjustes);

        Double totalServiciosAdcionales = calculateSubTotalForRate(detailInvoiceParamsList,
                "servicio_adicional,iva_servicioadicional");

        dtoResponse.getRateDetail().put("totalServiciosAdcionales", totalServiciosAdcionales);
        
        Double subContNota = calculateSubTotalForRate(detailInvoiceParamsList, "nc_valor_subsidio,nc_valor_contribucion");
       
        dtoResponse.getRateDetail().put("subContNota",subContNota * -1);

        Double totalGeneralLiquidacion = (totalGeneralTarifa != null ? totalGeneralTarifa: 0)+
                        (dtoResponse.getSubCont() != null ? dtoResponse.getSubCont() : 0)+
                        (totalDescuentosIndicadores != null ? totalDescuentosIndicadores: 0)+
                        (totalDescuentos != null ? totalDescuentos: 0)+
                        (totalAjustes != null ? totalAjustes: 0)+
                (dtoResponse.getTotalDeudaMora() != null ? dtoResponse.getTotalDeudaMora() : 0) +
                (dtoResponse.getSaldosaFavor() != null ? dtoResponse.getSaldosaFavor() : 0) + 
                (totalServiciosAdcionales != null ? totalServiciosAdcionales : 0)+
                (dtoResponse.getCuotafinanciacion() != null ? dtoResponse.getCuotafinanciacion() : 0) ;

        dtoResponse.getRateDetail().put("totalGeneralLiquidacion", totalGeneralLiquidacion);
                
        Double totalLiquidacionAseo = totalGeneralLiquidacion - (totalServiciosAdcionales != null ? totalServiciosAdcionales : 0)-
                (dtoResponse.getCuotafinanciacion() != null ? dtoResponse.getCuotafinanciacion() : 0) ;
        dtoResponse.getRateDetail().put ("totalLiquidacionAseo",totalLiquidacionAseo);

        Double subtotalTarifaFijaNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_tar_comergasaseo,nc_tar_comeremsa,nc_tar_limpiezaurbana,nc_tar_barridoylimpieza,NC_comer_aprovechamiento," +
                        "nd_tar_comergasaseo,nd_tar_comeremsa,nd_tar_limpiezaurbana,nd_tar_barridoylimpieza,ND_comer_aprovechamiento");

        dtoResponse.getRateDetail().put("subtotalTarifaFijaNota", subtotalTarifaFijaNota);

        Double serviciosAdicionales = calculateSubTotalForRate(detailInvoiceParamsList,
                "servicio_adicional");
         dtoResponse.getRateDetail().put("servicio_adicional", serviciosAdicionales);
         
        Double serviciosAdicionalesNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_servicio_adicional," +
                        "nd_servicio_adicional");
         dtoResponse.getRateDetail().put("serviciosAdicionalesNota", serviciosAdicionalesNota);
         
         Double serviciosAdicionalesDif = serviciosAdicionales-serviciosAdicionalesNota;
         
          dtoResponse.getRateDetail().put("serviciosAdicionalesDif", serviciosAdicionalesDif);     
          
          
          Double IVAserviciosAdicionales = calculateSubTotalForRate(detailInvoiceParamsList,
                "iva_servicioadicional");
         dtoResponse.getRateDetail().put("IVAserviciosAdicionales", IVAserviciosAdicionales);
        
         Double IVAserviciosAdicionalesNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_iva_servicioadicional," +
                        "nd_iva_servicioadicional");
         dtoResponse.getRateDetail().put("IVAserviciosAdicionalesNota", IVAserviciosAdicionalesNota);
         
         Double IVAserviciosAdicionalesDif = IVAserviciosAdicionales-IVAserviciosAdicionalesNota;
         
          dtoResponse.getRateDetail().put("IVAserviciosAdicionalesDif", IVAserviciosAdicionalesDif); 
        
        Double subtotalTarifaVariableNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_tar_recoleccionytransporte,nc_tar_disposicionfinal,nc_tar_lixiviados," +
                        "nd_tar_recoleccionytransporte,nd_tar_disposicionfinal,nd_tar_lixiviados");

        dtoResponse.getRateDetail().put("subtotalTarifaVariableNota", subtotalTarifaVariableNota);

        Double subtotalTarifaOtrosNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_tar_aprovechamiento,nc_tar_incentivoaprovechamiento,nc_comer_aprovechamiento_terceros," +
                        "nd_tar_aprovechamiento,nd_tar_incentivoaprovechamiento,nd_comer_aprovechamiento_terceros");

        dtoResponse.getRateDetail().put("subtotalTarifaOtrosNota", subtotalTarifaOtrosNota);

        Double totalGeneralTarifaNota = (subtotalTarifaFijaNota != null ? subtotalTarifaFijaNota : 0) +
                (subtotalTarifaVariableNota != null ? subtotalTarifaVariableNota : 0) +
                (subtotalTarifaOtrosNota != null ? subtotalTarifaOtrosNota : 0);

        dtoResponse.getRateDetail().put("totalGeneralTarifaNota", totalGeneralTarifaNota);

        Double totalDescuentosIndicadoresNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_dcto_indcalrecoleccion,nc_dcto_indcalcomercializacion,nc_dcto_indcalcompactacion," +
                        "nd_dcto_indcalrecoleccion,nd_dcto_indcalcomercializacion,nd_dcto_indcalcompactacion");

        dtoResponse.getRateDetail().put("totalDescuentosIndicadoresNota", totalDescuentosIndicadoresNota);

        Double totalDescuentosNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_dcto_sinpuertapuerta,nc_dcto_deshabitados,nc_tar_devoluciones,nc_tar_devoluciones_ter," +
                        "nd_dcto_sinpuertapuerta,nd_dcto_deshabitados,nd_tar_devoluciones,nd_tar_devoluciones_ter");

        dtoResponse.getRateDetail().put("totalDescuentosNota", totalDescuentosNota);
        
        Double AjustesAprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "NC_AjusteTA_sinDINC,NC_AjusteTA_conDINC," +
                        "ND_AjusteTA_sinDINC,ND_AjusteTA_conDINC");

        dtoResponse.getRateDetail().put("AjustesAprovechamientoNota", AjustesAprovechamientoNota);
        
        Double totalAjustesNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_ajuste_ccsaseogas,nc_ajuste_ccsenergia,NC_AjusteTA_sinDINC,NC_AjusteTA_conDINC," +
                        "nd_ajuste_ccsaseogas,nd_ajuste_ccsenergia,ND_AjusteTA_sinDINC,ND_AjusteTA_conDINC");

        dtoResponse.getRateDetail().put("totalAjustesNota", totalAjustesNota);

        Double subtotalTarifaFijaDif = subtotalTarifaFija + subtotalTarifaFijaNota;

        dtoResponse.getRateDetail().put("subtotalTarifaFijaDif", subtotalTarifaFijaDif);

        Double subtotalTarifaVariableDif = subtotalTarifaVariable + subtotalTarifaVariableNota;

        dtoResponse.getRateDetail().put("subtotalTarifaVariableDif", subtotalTarifaVariableDif);

        Double subtotalTarifaOtrosDif = subtotalTarifaOtros + subtotalTarifaOtrosNota;

        dtoResponse.getRateDetail().put("subtotalTarifaOtrosDif", subtotalTarifaOtrosDif);

        Double totalGeneralTarifaDif = totalGeneralTarifa + totalGeneralTarifaNota;

        dtoResponse.getRateDetail().put("totalGeneralTarifaDif", totalGeneralTarifaDif);

        Double totalDescuentosIndicadoresDif = totalDescuentosIndicadores + totalDescuentosIndicadoresNota;

        dtoResponse.getRateDetail().put("totalDescuentosIndicadoresDif", totalDescuentosIndicadoresDif);

        Double totalDescuentosDif = totalDescuentos + totalDescuentosNota;

        dtoResponse.getRateDetail().put("totalDescuentosDif", totalDescuentosDif);

        Double AjustesAprovechamientoDif = AjustesAprovechamiento + AjustesAprovechamientoNota;

        dtoResponse.getRateDetail().put("AjustesAprovechamientoDif", AjustesAprovechamientoDif);
        
        Double totalAjustesDif = totalAjustes + totalAjustesNota;

        dtoResponse.getRateDetail().put("totalAjustesDif", totalAjustesDif);

        Double tarComergasaseoNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_comergasaseo,nc_tar_comergasaseo");

        dtoResponse.getRateDetail().put("tar_comergasaseo_nota", tarComergasaseoNota);
        
        Double comerAprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList, "ND_comer_aprovechamiento,NC_comer_aprovechamiento");

        dtoResponse.getRateDetail().put("comer_aprovechamiento_nota", comerAprovechamientoNota);
        
        Double comerAprovechamientoTercerosNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_comer_aprovechamiento_terceros,nc_comer_aprovechamiento_terceros");

        dtoResponse.getRateDetail().put("comer_aprovechamiento_terceros_nota", comerAprovechamientoTercerosNota);

        Double tarComeremsaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_comeremsa,nc_tar_comeremsa");

        dtoResponse.getRateDetail().put("tar_comeremsa_nota", tarComeremsaNota);

        Double tarLimpiezaurbanaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_limpiezaurbana,nc_tar_limpiezaurbana");

        dtoResponse.getRateDetail().put("tar_limpiezaurbana_nota", tarLimpiezaurbanaNota);

        Double tarBarridoylimpiezaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_barridoylimpieza,nc_tar_barridoylimpieza");

        dtoResponse.getRateDetail().put("tar_barridoylimpieza_nota", tarBarridoylimpiezaNota);

        Double tarRecoleccionytransporteNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_recoleccionytransporte,nc_tar_recoleccionytransporte");

        dtoResponse.getRateDetail().put("tar_recoleccionytransporte_nota", tarRecoleccionytransporteNota);

        Double tarDisposicionfinalNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_disposicionfinal,nc_tar_disposicionfinal");

        dtoResponse.getRateDetail().put("tar_disposicionfinal_nota", tarDisposicionfinalNota);

        Double tarLixiviadosNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_lixiviados,nc_tar_lixiviados");

        dtoResponse.getRateDetail().put("tar_lixiviados_nota", tarLixiviadosNota);

        Double tarAprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_aprovechamiento,nc_tar_aprovechamiento");

        dtoResponse.getRateDetail().put("tar_aprovechamiento_nota", tarAprovechamientoNota);
        
        Double tarajusteTAsindinNota = calculateSubTotalForRate(detailInvoiceParamsList, "ND_AjusteTA_sinDINC,NC_AjusteTA_sinDINC");

        dtoResponse.getRateDetail().put("AjusteTA_sinDINC_nota", tarajusteTAsindinNota);
        
        Double tarajusteTAcondinNota = calculateSubTotalForRate(detailInvoiceParamsList, "ND_AjusteTA_conDINC,NC_AjusteTA_conDINC");

        dtoResponse.getRateDetail().put("AjusteTA_conDINC_nota", tarajusteTAcondinNota);
        
       Double ajusteTAcompletonota = tarajusteTAsindinNota + tarajusteTAcondinNota;

        dtoResponse.getRateDetail().put("ajusteta_completo_nota", ajusteTAcompletonota);

        Double tarIncentivoaprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_incentivoaprovechamiento,nc_tar_incentivoaprovechamiento");

        dtoResponse.getRateDetail().put("tar_incentivoaprovechamiento_nota", tarIncentivoaprovechamientoNota);
        
        Double dctoIndcalrecoleccionNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_indcalrecoleccion,nc_dcto_indcalrecoleccion");

        dtoResponse.getRateDetail().put("dcto_indcalrecoleccion_nota", dctoIndcalrecoleccionNota);
        
        Double tar_devoluciones_ter_nota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_devoluciones_ter,nc_tar_devoluciones_ter");

        dtoResponse.getRateDetail().put("tar_devoluciones_ter_nota", tar_devoluciones_ter_nota);

        Double dctoIndcalcomercializacionNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_indcalcomercializacion,nc_dcto_indcalcomercializacion");

        dtoResponse.getRateDetail().put("dcto_indcalcomercializacion_nota", dctoIndcalcomercializacionNota);

        Double dctoIndcalcompactacionNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_indcalcompactacion,nc_dcto_indcalcompactacion");

        dtoResponse.getRateDetail().put("dcto_indcalcompactacion_nota", dctoIndcalcompactacionNota);

        Double dctoSinpuertapuertaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_sinpuertapuerta,nc_dcto_sinpuertapuerta");

        dtoResponse.getRateDetail().put("dcto_sinpuertapuerta_nota", dctoSinpuertapuertaNota);

        Double dctoDeshabitadosNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_deshabitados,nc_dcto_deshabitados");

        dtoResponse.getRateDetail().put("dcto_deshabitados_nota", dctoDeshabitadosNota);

        Double tarDevolucionesNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_devoluciones,nc_tar_devoluciones");

        dtoResponse.getRateDetail().put("tar_devoluciones_nota", tarDevolucionesNota);
        
        Double tar_devoluciones_total_nota = tarDevolucionesNota +tar_devoluciones_ter_nota;
                
        dtoResponse.getRateDetail().put("tar_devoluciones_total_nota", tar_devoluciones_total_nota);

        Double ajusteTaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_ajuste_ta,nc_ajuste_ta");

        dtoResponse.getRateDetail().put("ajuste_ta_nota", ajusteTaNota);

        Double ajusteCcsaseogasNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_ajuste_ccsaseogas,nc_ajuste_ccsaseogas");

        dtoResponse.getRateDetail().put("ajuste_ccsaseogas_nota", ajusteCcsaseogasNota);

        Double ajusteCcsenergiaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_ajuste_ccsenergia,nc_ajuste_ccsenergia");

        dtoResponse.getRateDetail().put("ajuste_ccsenergia_nota", ajusteCcsenergiaNota);

        Double tarComergasaseoDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_comergasaseo") + tarComergasaseoNota;

        dtoResponse.getRateDetail().put("tar_comergasaseo_dif", tarComergasaseoDif);
        
        Double comerAprovechamientoDif = calculateSubTotalForRate(detailInvoiceParamsList, "comer_aprovechamiento") + comerAprovechamientoNota;

        dtoResponse.getRateDetail().put("comer_aprovechamiento_dif", comerAprovechamientoDif);
        
        Double comerAprovechamientoTercerosDif = calculateSubTotalForRate(detailInvoiceParamsList, "comer_aprovechamiento_terceros") + comerAprovechamientoTercerosNota;

        dtoResponse.getRateDetail().put("comer_aprovechamiento_terceros_dif", comerAprovechamientoTercerosDif);

        Double tarComeremsaDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_comeremsa") + tarComeremsaNota;

        dtoResponse.getRateDetail().put("tar_comeremsa_dif", tarComeremsaDif);

        Double tarLimpiezaurbanaDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_limpiezaurbana") + tarLimpiezaurbanaNota;

        dtoResponse.getRateDetail().put("tar_limpiezaurbana_dif", tarLimpiezaurbanaDif);

        Double tarBarridoylimpiezaDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_barridoylimpieza") + tarBarridoylimpiezaNota;

        dtoResponse.getRateDetail().put("tar_barridoylimpieza_dif", tarBarridoylimpiezaDif);

        Double tarRecoleccionytransporteDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_recoleccionytransporte") + tarRecoleccionytransporteNota;

        dtoResponse.getRateDetail().put("tar_recoleccionytransporte_dif", tarRecoleccionytransporteDif);

        Double tarDisposicionfinalDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_disposicionfinal") + tarDisposicionfinalNota;

        dtoResponse.getRateDetail().put("tar_disposicionfinal_dif", tarDisposicionfinalDif);

        Double tarLixiviadosDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_lixiviados") + tarLixiviadosNota;

        dtoResponse.getRateDetail().put("tar_lixiviados_dif", tarLixiviadosDif);

        Double tarAprovechamientoDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_aprovechamiento") + tarAprovechamientoNota;

        dtoResponse.getRateDetail().put("tar_aprovechamiento_dif", tarAprovechamientoDif);
        
        Double tarajusteTAsindinDif = calculateSubTotalForRate(detailInvoiceParamsList, "AjusteTA_sinDINC") + tarajusteTAsindinNota;

        dtoResponse.getRateDetail().put("AjusteTA_sinDINC_dif", tarajusteTAsindinDif);
        
        Double tarajusteTAcondinDif = calculateSubTotalForRate(detailInvoiceParamsList, "AjusteTA_conDINC") + tarajusteTAcondinNota;

        dtoResponse.getRateDetail().put("AjusteTA_conDINC_dif", tarajusteTAcondinDif);
         
        Double ajusteTAcompletodif = tarajusteTAsindinDif + tarajusteTAcondinDif;

        dtoResponse.getRateDetail().put("ajusteta_completo_dif", ajusteTAcompletodif);

        Double tarIncentivoaprovechamientoDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_incentivoaprovechamiento") + tarIncentivoaprovechamientoNota;

        dtoResponse.getRateDetail().put("tar_incentivoaprovechamiento_dif", tarIncentivoaprovechamientoDif);

        Double dctoIndcalrecoleccionDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_indcalrecoleccion") + dctoIndcalrecoleccionNota;

        dtoResponse.getRateDetail().put("dcto_indcalrecoleccion_dif", dctoIndcalrecoleccionDif);
                
        Double tar_devoluciones_ter_dif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_devoluciones_ter") + tar_devoluciones_ter_nota;

        dtoResponse.getRateDetail().put("tar_devoluciones_ter_dif", tar_devoluciones_ter_dif);

        Double dctoIndcalcomercializacionDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_indcalcomercializacion") + dctoIndcalcomercializacionNota;

        dtoResponse.getRateDetail().put("dcto_indcalcomercializacion_dif", dctoIndcalcomercializacionDif);

        Double dctoIndcalcompactacionDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_indcalcompactacion") + dctoIndcalcompactacionNota;

        dtoResponse.getRateDetail().put("dcto_indcalcompactacion_dif", dctoIndcalcompactacionDif);

        Double dctoSinpuertapuertaDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_sinpuertapuerta") + dctoSinpuertapuertaNota;

        dtoResponse.getRateDetail().put("dcto_sinpuertapuerta_dif", dctoSinpuertapuertaDif);

        Double dctoDeshabitadosDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_deshabitados") + dctoDeshabitadosNota;

        dtoResponse.getRateDetail().put("dcto_deshabitados_dif", dctoDeshabitadosDif);

        Double tarDevolucionesDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_devoluciones") + tarDevolucionesNota;

        dtoResponse.getRateDetail().put("tar_devoluciones_dif", tarDevolucionesDif);
        
        Double tar_devoluciones_total_dif = tar_devoluciones_ter_dif + tarDevolucionesDif;
        
        dtoResponse.getRateDetail().put("tar_devoluciones_total_dif", tar_devoluciones_total_dif);

        Double ajusteTaDif = calculateSubTotalForRate(detailInvoiceParamsList, "ajuste_ta") + ajusteTaNota;

        dtoResponse.getRateDetail().put("ajuste_ta_dif", ajusteTaDif);

        Double ajusteCcsaseogasDif = calculateSubTotalForRate(detailInvoiceParamsList, "ajuste_ccsaseogas") + ajusteCcsaseogasNota;

        dtoResponse.getRateDetail().put("ajuste_ccsaseogas_dif", ajusteCcsaseogasDif);

        Double ajusteCcsenergiaDif = calculateSubTotalForRate(detailInvoiceParamsList, "ajuste_ccsenergia") + ajusteCcsenergiaNota;

        dtoResponse.getRateDetail().put("ajuste_ccsenergia_dif", ajusteCcsenergiaDif);

        Double costCdfViat = calculateSubTotalForRate(detailInvoiceParamsList, "cost_cdf,cost_viat");

        dtoResponse.getRateDetail().put("cost_cdf_viat", costCdfViat);
    }

    private void fillFieldsSubsidyAndContribution(FacFacturaDTOResponse dtoResponse, Long idInvoice, List<ConConcepto> uniConceptoList) {
//        List<ConConcepto> uniConceptoSubList = uniConceptoList.stream().filter(cc ->
//                {
//                    try {
//                        return new ObjectMapper().readValue(cc.getConPropiedad(), HashMap.class)
//                                .get(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO).equals(ConstantesServicios.CON_CONCEPTOS_SUBSIDIO) ||
//                                new ObjectMapper().readValue(cc.getConPropiedad(), HashMap.class)
//                                        .get(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO).equals(ConstantesServicios.CON_CONCEPTOS_CONTRIBUCION);
//                    } catch (IOException e) {
//                        return false;
//                    }
//                }
//        ).collect(Collectors.toList());
    	double finalValue = 0; 
        for (ConConcepto conConcepto : uniConceptoList) {
            List<BigDecimal> vlrTotalList = manejadorDfacDetfactura.findAllVlrUnitariByDfacIderegistrAndUniConcepto(idInvoice, conConcepto.getUniConcepto());
            double sumSld = vlrTotalList.stream().reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue();            
            try {
                Map<String, String> propiedad = new ObjectMapper().readValue(conConcepto.getConPropiedad(), HashMap.class);
                switch (propiedad.get(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO)) {
				case ConstantesServicios.CON_CONCEPTOS_SUBSIDIO:
					finalValue = finalValue - sumSld;					
					manejadorFacFactura.insertaAseoLogTransacciones("Subsidio"+propiedad.get(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO),"Valor:"+finalValue);
					break;
				case  ConstantesServicios.CON_CONCEPTOS_CONTRIBUCION:					
					finalValue = finalValue + sumSld;  
					manejadorFacFactura.insertaAseoLogTransacciones("Contribucion :"+propiedad.get(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO) ,"Valor:"+finalValue);
					break; 
				default:
					break;
				}
                System.out.println("Valor Final " + finalValue);
                 dtoResponse.setSubCont(finalValue);
                
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void fillFieldsDiscount(FacFacturaDTOResponse dtoResponse, Long idInvoice, List<ConConcepto> uniConceptoList) {
        for (ConConcepto conConcepto : uniConceptoList) {
            List<BigDecimal> vlrTotalList = manejadorDfacDetfactura.findAllVlrTotalByDfacIderegistrAndUniConcepto(idInvoice, conConcepto.getUniConcepto());
            double sumSld = vlrTotalList.stream().reduce(BigDecimal.ZERO, BigDecimal::add).doubleValue();
            try {
                Map<String, String> propiedad = new ObjectMapper().readValue(conConcepto.getConPropiedad(), HashMap.class);
                switch (propiedad.get(ConstantesServicios.CON_CONCEPTOS_REPORTE_CLASIFICACION_CONCEPTO)) {
                    case ConstantesServicios.CON_CONCEPTOS_DESCUENTO_INDICADOR_CALIDAD:
                        dtoResponse.setDctosInd(sumSld);
                        break;
                    case ConstantesServicios.CON_CONCEPTOS_AJUSTES:
                        dtoResponse.setAjuste(sumSld);
                        break;
                    case ConstantesServicios.CON_CONCEPTOS_DESCUENTO_DESCUENTOS_Y_O_DEVOLUCIONES:
                        dtoResponse.setDctos(sumSld);
                        break;
                    default:
                        break;
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void fillUniDocumentList(int idEmp, List<Integer> uniDocumentDueList, List<Integer> uniDocumentInvoiceServiceList,
                                     List<Integer> uniDocumentFeeList, List<Integer> uniDocumentBalanceList,List<Integer> uniDocumentfinanciacionList,List<Integer> uniValortarifaList) {
        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametros(idEmp, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
            Collection<Integer> collectionFee = (Collection<Integer>) parameters.get(ConstantesServicios.UNI_DOCUMENTOS_INTERES_MORA);
            Collection<Integer> collectionBalance = (Collection<Integer>) parameters.get(ConstantesServicios.UNI_DOCUMENTOS_SALDO_A_FAVOR);
            Collection<Integer> collectionFinanciacion = (Collection<Integer>) parameters.get(ConstantesServicios.UNI_DOCUMENTO_FINANCIACION);
            Collection<Integer> collectionValortarifa = (Collection<Integer>) parameters.get(ConstantesServicios.UNI_DOCUMENTOS_FACTURA_SERVICIO);

            uniDocumentDueList.addAll(collectionFee);
            uniDocumentDueList.addAll(collectionBalance);
            uniDocumentFeeList.addAll(collectionFee);
            uniDocumentBalanceList.addAll(collectionBalance);
            uniDocumentfinanciacionList.addAll(collectionFinanciacion);
            uniValortarifaList.addAll(collectionValortarifa);
            uniDocumentInvoiceServiceList.addAll((Collection<Integer>) parameters.get(ConstantesServicios.UNI_DOCUMENTOS_FACTURA_SERVICIO));
        } catch (IOException e) {
            logger.info("Error no controlado consultando el concepto interes mora, saldo a favor o amortizaciones {}", e);
        }
    }

    private FacFacturaDTOResponse fillOtherFieldsDto(Object[] object) {
        FacFacturaDTOResponse dtoResponse = new FacFacturaDTOResponse();

        dtoResponse.setCicAno(object[0].toString());
        dtoResponse.setFacEstado(object[1].toString());
        dtoResponse.setPerIderegistro((Integer) object[2]);                    
        dtoResponse.setFacVlrreal(new BigDecimal(object[3].toString()));
        dtoResponse.setFacFecha((Date) object[4]);
        dtoResponse.setDsusIderegistr((Long) object[5]);
        dtoResponse.setPerNombre(object[8].toString());
        dtoResponse.setFacNumero((Long) object[9]);
        dtoResponse.setFacFechaEnd((Date) object[12]);
        return dtoResponse;
    }

    public Page<DocDocumentoFacturaDTOResponse> associatedDocument(Long idInvoice, Long dsusIderegistr, Pageable pageable) {
        List<DocDocumentoFacturaDTOResponse> dtoDocumentResponseList = new ArrayList<>();
        List<Object[]> dtoDocumentoDsusFactura;
        int idEmp = JwtUtil.auditoriaDTO.getIdEmpresa();
        FacFactura facFactura = this.manejadorFacFactura.findById(idInvoice).orElse(null);
        List<ParLabParametrosLabels> parLabParametersLabelsList = this.manejadorParLabParametrosLabels.findAll();
        Long idStructure = parLabParametersLabelsList.get(0).getEstIdeRegistro();
        List<Object[]> detailInvoiceParamsList = this.manejadorFacFactura.getFnGetlabelsfacturacion(dsusIderegistr, idInvoice, 0L, idEmp, idStructure, true);
        dtoDocumentoDsusFactura = this.manejadorFacFactura.getDocumentosDsusFactura(dsusIderegistr, idInvoice);
        List<Integer> uniDocumentServiceList = new ArrayList<>();
        try {
            Map<String, Object> parameters = negocioParParametro.consultaParametros(idEmp, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
            uniDocumentServiceList = (List<Integer>) parameters.get(ConstantesServicios.UNI_DOCUMENTOS_FACTURA_SERVICIO);
        } catch (IOException e) {
            logger.info("{}", e);
        }
        Double parentFeeValue = manejadorFacFactura.sumSaldoRealByUniDocumentList(facFactura.getFacFecha(), facFactura.getDsusIderegistr(), uniDocumentServiceList);
        DocDocumentoFacturaDTOResponse dtoResponse = new DocDocumentoFacturaDTOResponse();
        for (Object[] doc : dtoDocumentoDsusFactura ){ //Documentos Notas
            for (Object[] row : detailInvoiceParamsList) {
                System.out.println(doc[6] + "  ---  " + row[4]);
                if(((BigInteger)row[4]).intValue() == (Integer)doc[6]){
                    for (ParLabParametrosLabels parLabParametrosLabels : parLabParametersLabelsList) {
                        if (parLabParametrosLabels.getParLabLabel().equals(row[12])){
                                dtoResponse.getDocumentDetail().put((String) row[12], ((BigDecimal) row[14]).doubleValue());
                                dtoResponse.setParentFeeValue(parentFeeValue);
                                fillDetailsDocuments(dtoResponse, detailInvoiceParamsList);                                
                                setDtoResponseDataDocumento(doc, dtoResponse);
                        }
                    }
                }
            }           
        }
        /*for (Object[] row : detailInvoiceParamsList) {
            //DocDocumentoFacturaDTOResponse dtoResponse = new DocDocumentoFacturaDTOResponse();
            for (ParLabParametrosLabels parLabParametrosLabels : parLabParametersLabelsList) {
                if (parLabParametrosLabels.getParLabLabel().equals(row[12])){
                    dtoResponse.getDocumentDetail().put((String) row[12], ((BigDecimal) row[14]).doubleValue());

                dtoResponse.setParentFeeValue(parentFeeValue);
                setDtoResponseData(row, dtoResponse);
                fillDetailsDocuments(dtoResponse, detailInvoiceParamsList);
                }
            }            
        }*/
        dtoDocumentResponseList.add(dtoResponse);
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), dtoDocumentResponseList.size());

        return new PageImpl<>(dtoDocumentResponseList.subList(start, end), pageable, dtoDocumentResponseList.size());
    }

    private void setDtoResponseData(Object[] row, DocDocumentoFacturaDTOResponse dtoResponse) {
        dtoResponse.setYear(row[18] != null ? ((BigInteger) row[18]).longValue() : 0);
        dtoResponse.setStatus(row[26] != null ? (String) row[26] : "");
        dtoResponse.setAlternateCompany(row[19] != null ? (String) row[19] : "");
        dtoResponse.setPeriod(row[17] != null ? (String) row[17] : "");
        dtoResponse.setIdFatherInvoice(row[20] != null ? ((BigInteger) row[20]).longValue() : 0);
        dtoResponse.setParentDocument(row[21] != null ? ((BigInteger) row[21]).longValue() : 0);
        dtoResponse.setNoteDocument(row[22] != null ? (String) row[22] : "");
        dtoResponse.setTypeDocument(row[25] != null ? (String) row[25] : "");
        dtoResponse.setNote(row[16] != null ? ((BigInteger) row[16]).longValue() : 0);
        dtoResponse.setReasonNote(row[23] != null ? (String) row[23] : "");
        dtoResponse.setObservationNote(row[24] != null ? (String) row[24] : "");
    }
    
        private void setDtoResponseDataDocumento(Object[] row, DocDocumentoFacturaDTOResponse dtoResponse) {
        dtoResponse.setYear(row[0] != null ? Long.parseLong((String)row[0]) : 0);
        dtoResponse.setStatus(row[1] != null ? (String) row[1] : "");
        dtoResponse.setAlternateCompany(row[2] != null ? (String) row[2] : "");
        dtoResponse.setPeriod(row[3] != null ? (String) row[3] : "");
        dtoResponse.setIdFatherInvoice(row[4] != null ? ((BigInteger)row[4]).longValue() : 0);
        dtoResponse.setParentDocument(row[5] != null ? ((Integer) row[5]).longValue() : 0);
        dtoResponse.setNoteDocument(row[6] != null ?  String.valueOf(row[6]) : "");
        dtoResponse.setTypeDocument(row[7] != null ? (String) row[7] : "");
        dtoResponse.setNote(row[8] != null ? ((BigInteger) row[8]).longValue() : 0);
        dtoResponse.setReasonNote(row[11] != null ? (String) row[11] : "");
        dtoResponse.setObservationNote(row[12] != null ? (String) row[12] : "");
    }

    private void fillDetailsDocuments(DocDocumentoFacturaDTOResponse dtoResponse, List<Object[]> detailInvoiceParamsList) {

        Double subtotalTarifaFija = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_comergasaseo,tar_comeremsa,tar_limpiezaurbana,tar_barridoylimpieza,comer_aprovechamiento");

        dtoResponse.getDocumentDetail().put("subtotalTarifaFija", subtotalTarifaFija);

        Double subtotalTarifaVariable = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_recoleccionytransporte,tar_disposicionfinal,tar_lixiviados");

        dtoResponse.getDocumentDetail().put("subtotalTarifaVariable", subtotalTarifaVariable);

        Double subtotalTarifaOtros = calculateSubTotalForRate(detailInvoiceParamsList,
                "tar_aprovechamiento,tar_incentivoaprovechamiento,ajuste_ta,comer_aprovechamiento_terceros");

        dtoResponse.getDocumentDetail().put("subtotalTarifaOtros", subtotalTarifaOtros);

        Double totalGeneralTarifa = (subtotalTarifaFija != null ? subtotalTarifaFija : 0) +
                (subtotalTarifaVariable != null ? subtotalTarifaVariable : 0) +
                (subtotalTarifaOtros != null ? subtotalTarifaOtros : 0);

        dtoResponse.getDocumentDetail().put("totalGeneralTarifa", totalGeneralTarifa);

        Double totalDescuentosIndicadores = calculateSubTotalForRate(detailInvoiceParamsList,
                "dcto_indcalrecoleccion,dcto_indcalcomercializacion,dcto_indcalcompactacion");

        dtoResponse.getDocumentDetail().put("totalDescuentosIndicadores", totalDescuentosIndicadores);

        Double totalAjustes = calculateSubTotalForRate(detailInvoiceParamsList,
                "ajuste_ta,ajuste_ccsaseogas,ajuste_ccsenergia,AjusteTA_conDINC, AjusteTA_sinDINC");
        
        dtoResponse.getDocumentDetail().put("totalAjustes", totalAjustes);

        Double totalServiciosAdcionales = calculateSubTotalForRate(detailInvoiceParamsList,
                "servicio_adicional,iva_servicioadicional");

        dtoResponse.getDocumentDetail().put("totalServiciosAdcionales", totalServiciosAdcionales);

        Double deudaAnterior = calculateSubTotalForRate(detailInvoiceParamsList, "deuda_anterior");

        dtoResponse.getDocumentDetail().put("deudaAnterior", deudaAnterior);

        Double interesMora = calculateSubTotalForRate(detailInvoiceParamsList, "interes_mora");

        dtoResponse.getDocumentDetail().put("interesMora", interesMora);

        Double deudaMora = deudaAnterior + interesMora;

        dtoResponse.getDocumentDetail().put("deudaMora", deudaMora);

        Double saldoFavor = calculateSubTotalForRate(detailInvoiceParamsList, "saldo_favor");

        dtoResponse.getDocumentDetail().put("saldoFavor", saldoFavor);

        Double totalGeneralLiquidacion = deudaMora + saldoFavor + (totalServiciosAdcionales != null ? totalServiciosAdcionales : 0);

        dtoResponse.getDocumentDetail().put("totalGeneralLiquidacion", totalGeneralLiquidacion);
        
        Double subtotalTarifaFijaNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_tar_comergasaseo,nc_tar_comeremsa,nc_tar_limpiezaurbana,nc_tar_barridoylimpieza,NC_comer_aprovechamiento," +
                        "nd_tar_comergasaseo,nd_tar_comeremsa,nd_tar_limpiezaurbana,nd_tar_barridoylimpieza,ND_comer_aprovechamiento");

        dtoResponse.getDocumentDetail().put("subtotalTarifaFijaNota", subtotalTarifaFijaNota);

        Double subtotalTarifaVariableNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_tar_recoleccionytransporte,nc_tar_disposicionfinal,nc_tar_lixiviados," +
                        "nd_tar_recoleccionytransporte,nd_tar_disposicionfinal,nd_tar_lixiviados");

        dtoResponse.getDocumentDetail().put("subtotalTarifaVariableNota", subtotalTarifaVariableNota);

        Double subtotalTarifaOtrosNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_tar_aprovechamiento,nc_tar_incentivoaprovechamiento,nc_comer_aprovechamiento_terceros," +
                        "nd_tar_aprovechamiento,nd_tar_incentivoaprovechamiento,nd_comer_aprovechamiento_terceros");

        dtoResponse.getDocumentDetail().put("subtotalTarifaOtrosNota", subtotalTarifaOtrosNota);

        Double totalGeneralTarifaNota = (subtotalTarifaFijaNota != null ? subtotalTarifaFijaNota : 0) +
                (subtotalTarifaVariableNota != null ? subtotalTarifaVariableNota : 0) +
                (subtotalTarifaOtrosNota != null ? subtotalTarifaOtrosNota : 0);

        dtoResponse.getDocumentDetail().put("totalGeneralTarifaNota", totalGeneralTarifaNota);

        Double totalDescuentosIndicadoresNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_dcto_indcalrecoleccion,nc_dcto_indcalcomercializacion,nc_dcto_indcalcompactacion," +
                        "nd_dcto_indcalrecoleccion,nd_dcto_indcalcomercializacion,nd_dcto_indcalcompactacion");

        dtoResponse.getDocumentDetail().put("totalDescuentosIndicadoresNota", totalDescuentosIndicadoresNota);

        Double totalAjustesNota = calculateSubTotalForRate(detailInvoiceParamsList,
                "nc_ajuste_ccsaseogas,nc_ajuste_ccsenergia,NC_AjusteTA_sinDINC,NC_AjusteTA_conDINC," +
                        "nd_ajuste_ccsaseogas,nd_ajuste_ccsenergia,ND_AjusteTA_sinDINC,ND_AjusteTA_conDINC");

        dtoResponse.getDocumentDetail().put("totalAjustesNota", totalAjustesNota);

        Double subtotalTarifaFijaDif = subtotalTarifaFija - subtotalTarifaFijaNota;

        dtoResponse.getDocumentDetail().put("subtotalTarifaFijaDif", subtotalTarifaFijaDif);

        Double subtotalTarifaVariableDif = subtotalTarifaVariable - subtotalTarifaVariableNota;

        dtoResponse.getDocumentDetail().put("subtotalTarifaVariableDif", subtotalTarifaVariableDif);

        Double subtotalTarifaOtrosDif = subtotalTarifaOtros - subtotalTarifaOtrosNota;

        dtoResponse.getDocumentDetail().put("subtotalTarifaOtrosDif", subtotalTarifaOtrosDif);

        Double totalGeneralTarifaDif = totalGeneralTarifa - totalGeneralTarifaNota;

        dtoResponse.getDocumentDetail().put("totalGeneralTarifaDif", totalGeneralTarifaDif);

        Double totalDescuentosIndicadoresDif = totalDescuentosIndicadores - totalDescuentosIndicadoresNota;

        dtoResponse.getDocumentDetail().put("totalDescuentosIndicadoresDif", totalDescuentosIndicadoresDif);

        Double totalAjustesDif = totalAjustes - totalAjustesNota;

        dtoResponse.getDocumentDetail().put("totalAjustesDif", totalAjustesDif);

        Double tarComergasaseoNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_comergasaseo,nc_tar_comergasaseo");

        dtoResponse.getDocumentDetail().put("tar_comergasaseo_nota", tarComergasaseoNota);
               
        Double comerAprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList, "ND_comer_aprovechamiento,NC_comer_aprovechamiento");
        
        dtoResponse.getDocumentDetail().put("comer_aprovechamiento_nota", comerAprovechamientoNota);
        
        Double comerAprovechamientoTercerosNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_comer_aprovechamiento_terceros,nc_comer_aprovechamiento_terceros");
        
        dtoResponse.getDocumentDetail().put("comer_aprovechamiento_terceros_nota", comerAprovechamientoTercerosNota);

        Double tarComeremsaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_comeremsa,nc_tar_comeremsa");

        dtoResponse.getDocumentDetail().put("tar_comeremsa_nota", tarComeremsaNota);

        Double tarLimpiezaurbanaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_limpiezaurbana,nc_tar_limpiezaurbana");

        dtoResponse.getDocumentDetail().put("tar_limpiezaurbana_nota", tarLimpiezaurbanaNota);

        Double tarBarridoylimpiezaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_barridoylimpieza,nc_tar_barridoylimpieza");

        dtoResponse.getDocumentDetail().put("tar_barridoylimpieza_nota", tarBarridoylimpiezaNota);

        Double tarRecoleccionytransporteNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_recoleccionytransporte,nc_tar_recoleccionytransporte");

        dtoResponse.getDocumentDetail().put("tar_recoleccionytransporte_nota", tarRecoleccionytransporteNota);

        Double tarDisposicionfinalNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_disposicionfinal,nc_tar_disposicionfinal");

        dtoResponse.getDocumentDetail().put("tar_disposicionfinal_nota", tarDisposicionfinalNota);

        Double tarLixiviadosNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_lixiviados,nc_tar_lixiviados");

        dtoResponse.getDocumentDetail().put("tar_lixiviados_nota", tarLixiviadosNota);

        Double tarAprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_aprovechamiento,nc_tar_aprovechamiento");

        dtoResponse.getDocumentDetail().put("tar_aprovechamiento_nota", tarAprovechamientoNota);
        
        Double tarajusteTAsindinNota = calculateSubTotalForRate(detailInvoiceParamsList, "ND_AjusteTA_sinDINC,NC_AjusteTA_sinDINC");

        dtoResponse.getDocumentDetail().put("AjusteTA_sinDINC_nota", tarajusteTAsindinNota);
        
        Double tarajusteTAcondinNota = calculateSubTotalForRate(detailInvoiceParamsList, "ND_AjusteTA_conDINC,NC_AjusteTA_conDINC");

        dtoResponse.getDocumentDetail().put("AjusteTA_conDINC_nota", tarajusteTAcondinNota);
        
        Double ajusteTAcompletonota = tarajusteTAsindinNota + tarajusteTAcondinNota;

        dtoResponse.getDocumentDetail().put("ajusteta_completo_nota", ajusteTAcompletonota);

        Double tarIncentivoaprovechamientoNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_incentivoaprovechamiento,nc_tar_incentivoaprovechamiento");

        dtoResponse.getDocumentDetail().put("tar_incentivoaprovechamiento_nota", tarIncentivoaprovechamientoNota);

        Double dctoIndcalrecoleccionNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_indcalrecoleccion,nc_dcto_indcalrecoleccion");

        dtoResponse.getDocumentDetail().put("dcto_indcalrecoleccion_nota", dctoIndcalrecoleccionNota);

        Double dctoIndcalcomercializacionNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_indcalcomercializacion,nc_dcto_indcalcomercializacion");

        dtoResponse.getDocumentDetail().put("dcto_indcalcomercializacion_nota", dctoIndcalcomercializacionNota);

        Double dctoIndcalcompactacionNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_indcalcompactacion,nc_dcto_indcalcompactacion");

        dtoResponse.getDocumentDetail().put("dcto_indcalcompactacion_nota", dctoIndcalcompactacionNota);

        Double dctoSinpuertapuertaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_sinpuertapuerta,nc_dcto_sinpuertapuerta");

        dtoResponse.getDocumentDetail().put("dcto_sinpuertapuerta_nota", dctoSinpuertapuertaNota);

        Double dctoDeshabitadosNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_dcto_deshabitados,nc_dcto_deshabitados");

        dtoResponse.getDocumentDetail().put("dcto_deshabitados_nota", dctoDeshabitadosNota);

        Double tarDevolucionesNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_tar_devoluciones,nc_tar_devoluciones");

        dtoResponse.getDocumentDetail().put("tar_devoluciones_nota", tarDevolucionesNota);
        Double ajusteTaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_ajuste_ta,nc_ajuste_ta");

        dtoResponse.getDocumentDetail().put("ajuste_ta_nota", ajusteTaNota);

        Double ajusteCcsaseogasNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_ajuste_ccsaseogas,nc_ajuste_ccsaseogas");

        dtoResponse.getDocumentDetail().put("ajuste_ccsaseogas_nota", ajusteCcsaseogasNota);

        Double ajusteCcsenergiaNota = calculateSubTotalForRate(detailInvoiceParamsList, "nd_ajuste_ccsenergia,nc_ajuste_ccsenergia");

        dtoResponse.getDocumentDetail().put("ajuste_ccsenergia_nota", ajusteCcsenergiaNota);

        Double tarComergasaseoDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_comergasaseo") - tarComergasaseoNota;

        dtoResponse.getDocumentDetail().put("tar_comergasaseo_dif", tarComergasaseoDif);
        
        Double comerAprovechamientoDif = calculateSubTotalForRate(detailInvoiceParamsList, "comer_aprovechamiento") - comerAprovechamientoNota;

        dtoResponse.getDocumentDetail().put("comer_aprovechamiento_dif", comerAprovechamientoDif);
        
        Double comerAprovechamientoTercerosDif = calculateSubTotalForRate(detailInvoiceParamsList, "comer_aprovechamiento_terceros") - comerAprovechamientoTercerosNota;

        dtoResponse.getDocumentDetail().put("comer_aprovechamiento_terceros_dif", comerAprovechamientoTercerosDif);

        Double tarComeremsaDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_comeremsa") - tarComeremsaNota;

        dtoResponse.getDocumentDetail().put("tar_comeremsa_dif", tarComeremsaDif);

        Double tarLimpiezaurbanaDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_limpiezaurbana") - tarLimpiezaurbanaNota;

        dtoResponse.getDocumentDetail().put("tar_limpiezaurbana_dif", tarLimpiezaurbanaDif);

        Double tarBarridoylimpiezaDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_barridoylimpieza") - tarBarridoylimpiezaNota;

        dtoResponse.getDocumentDetail().put("tar_barridoylimpieza_dif", tarBarridoylimpiezaDif);

        Double tarRecoleccionytransporteDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_recoleccionytransporte") - tarRecoleccionytransporteNota;

        dtoResponse.getDocumentDetail().put("tar_recoleccionytransporte_dif", tarRecoleccionytransporteDif);

        Double tarDisposicionfinalDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_disposicionfinal") - tarDisposicionfinalNota;

        dtoResponse.getDocumentDetail().put("tar_disposicionfinal_dif", tarDisposicionfinalDif);

        Double tarLixiviadosDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_lixiviados") - tarLixiviadosNota;

        dtoResponse.getDocumentDetail().put("tar_lixiviados_dif", tarLixiviadosDif);

        Double tarAprovechamientoDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_aprovechamiento") - tarAprovechamientoNota;

        dtoResponse.getDocumentDetail().put("tar_aprovechamiento_dif", tarAprovechamientoDif);

        Double tarajusteTAsindinDif = calculateSubTotalForRate(detailInvoiceParamsList, "AjusteTA_sinDINC") - tarajusteTAsindinNota;

        dtoResponse.getDocumentDetail().put("AjusteTA_sinDINC_dif", tarajusteTAsindinDif);
        
        Double tarajusteTAcondinDif = calculateSubTotalForRate(detailInvoiceParamsList, "AjusteTA_conDINC") - tarajusteTAcondinNota;

        dtoResponse.getDocumentDetail().put("AjusteTA_conDINC_dif", tarajusteTAcondinDif);
        
        Double ajusteTAcompletodif = tarajusteTAsindinDif + tarajusteTAcondinDif;

        dtoResponse.getDocumentDetail().put("ajusteta_completo_dif", ajusteTAcompletodif);

        Double tarIncentivoaprovechamientoDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_incentivoaprovechamiento") - tarIncentivoaprovechamientoNota;

        dtoResponse.getDocumentDetail().put("tar_incentivoaprovechamiento_dif", tarIncentivoaprovechamientoDif);

        Double dctoIndcalrecoleccionDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_indcalrecoleccion") - dctoIndcalrecoleccionNota;

        dtoResponse.getDocumentDetail().put("dcto_indcalrecoleccion_dif", dctoIndcalrecoleccionDif);

        Double dctoIndcalcomercializacionDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_indcalcomercializacion") - dctoIndcalcomercializacionNota;

        dtoResponse.getDocumentDetail().put("dcto_indcalcomercializacion_dif", dctoIndcalcomercializacionDif);

        Double dctoIndcalcompactacionDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_indcalcompactacion") - dctoIndcalcompactacionNota;

        dtoResponse.getDocumentDetail().put("dcto_indcalcompactacion_dif", dctoIndcalcompactacionDif);

        Double dctoSinpuertapuertaDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_sinpuertapuerta") - dctoSinpuertapuertaNota;

        dtoResponse.getDocumentDetail().put("dcto_sinpuertapuerta_dif", dctoSinpuertapuertaDif);

        Double dctoDeshabitadosDif = calculateSubTotalForRate(detailInvoiceParamsList, "dcto_deshabitados") - dctoDeshabitadosNota;

        dtoResponse.getDocumentDetail().put("dcto_deshabitados_dif", dctoDeshabitadosDif);

        Double tarDevolucionesDif = calculateSubTotalForRate(detailInvoiceParamsList, "tar_devoluciones") - tarDevolucionesNota;

        dtoResponse.getDocumentDetail().put("tar_devoluciones_dif", tarDevolucionesDif);
        
        Double ajusteTaDif = calculateSubTotalForRate(detailInvoiceParamsList, "ajuste_ta") - ajusteTaNota;

        dtoResponse.getDocumentDetail().put("ajuste_ta_dif", ajusteTaDif);

        Double ajusteCcsaseogasDif = calculateSubTotalForRate(detailInvoiceParamsList, "ajuste_ccsaseogas") - ajusteCcsaseogasNota;

        dtoResponse.getDocumentDetail().put("ajuste_ccsaseogas_dif", ajusteCcsaseogasDif);

        Double ajusteCcsenergiaDif = calculateSubTotalForRate(detailInvoiceParamsList, "ajuste_ccsenergia") - ajusteCcsenergiaNota;

        dtoResponse.getDocumentDetail().put("ajuste_ccsenergia_dif", ajusteCcsenergiaDif);

        Double costCdfViat = calculateSubTotalForRate(detailInvoiceParamsList, "cost_cdf,cost_viat");

        dtoResponse.getDocumentDetail().put("cost_cdf_viat", costCdfViat);

        Double deudaAnteriorNota = calculateSubTotalForRate(detailInvoiceParamsList, "nc_deuda_anterior,nd_deuda_anterior");

        dtoResponse.getDocumentDetail().put("deudaAnteriorNota", deudaAnteriorNota);

        Double interesMoraNota = calculateSubTotalForRate(detailInvoiceParamsList, "nc_interes_mora,nd_interes_mora");

        dtoResponse.getDocumentDetail().put("interesMoraNota", interesMoraNota);

        Double deudaAnteriorDif = calculateSubTotalForRate(detailInvoiceParamsList, "deuda_anterior") - deudaAnteriorNota;

        dtoResponse.getDocumentDetail().put("deudaAnteriorDif", deudaAnteriorDif);

        Double interesMoraDif = calculateSubTotalForRate(detailInvoiceParamsList, "interes_mora") - interesMoraNota;

        dtoResponse.getDocumentDetail().put("interesMoraDif", interesMoraDif);

        Double totalDeudaMoraNota = calculateSubTotalForRate(detailInvoiceParamsList, "nc_interes_mora,nd_interes_mora,nc_deuda_anterior,nd_deuda_anterior");

        dtoResponse.getDocumentDetail().put("totalDeudaMoraNota", totalDeudaMoraNota);

        Double totalDeudaMoraDif = deudaMora - totalDeudaMoraNota;

        dtoResponse.getDocumentDetail().put("totalDeudaMoraDif", totalDeudaMoraDif);

        Double saldoFavorNota = calculateSubTotalForRate(detailInvoiceParamsList, "nc_saldo_favor,nd_saldo_favor");

        dtoResponse.getDocumentDetail().put("saldoFavorNota", saldoFavorNota);

        Double saldoFavorDif = saldoFavor - saldoFavorNota;

        dtoResponse.getDocumentDetail().put("saldoFavorDif", saldoFavorDif);

        Double totalNote = totalGeneralTarifaNota + totalDescuentosIndicadoresNota + totalAjustesNota + totalDeudaMoraNota + saldoFavorNota;

        dtoResponse.setValueNote(totalNote);

        dtoResponse.setValueFinal(dtoResponse.getParentFeeValue() - dtoResponse.getValueNote());
    }
    // protected region Use esta region para su implementacion de otros metodos end
}