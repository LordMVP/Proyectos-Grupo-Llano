package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.transaction.Transactional;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IProcesoLiquidacionThread;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.UtilAprovechamiento;
import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.CprCtrprocesoDTO;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.dtos.ParticipacionDTO;
import com.bioagricola.apirest.modelo.entidades.AfoAforos;
import com.bioagricola.apirest.modelo.entidades.ConConcepto;
import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.entidades.DprlDetliquidacionapro;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.entidades.PdiaPardistribucionincentivo;
import com.bioagricola.apirest.modelo.entidades.VrtaVarterapr;
import com.bioagricola.apirest.modelo.manejadores.ManejadorAfoAforos;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCoapConsAproImp;
import com.bioagricola.apirest.modelo.manejadores.ManejadorColiConliquidaApro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConceptoAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDfacDetfactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDprlDetliquidacionapro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDrecDetrecaudo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorFacFactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPdiaPardistribucionincentivo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorRecaudoAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.ManejadorVrtaVarteapr;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@Scope("prototype")
public class PagoAprovechamientoThread implements Runnable, IProcesoLiquidacionThread {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(PagoAprovechamientoThread.class);

    @Autowired
    private ManejadorRecaudoAprovechamiento manejadorRecaudoAprovechamiento;
    @Autowired
    private ManejadorDrecDetrecaudo manejadorDrecDetrecaudo;
    @Autowired
    private ManejadorColiConliquidaApro manejadorColiConliquidaAprovechamiento;
    @Autowired
    private ManejadorDfacDetfactura manejadorDfacDetfactura;
    @Autowired
    private ManejadorPdiaPardistribucionincentivo manejadorPdiaPardistribucionincentivo;
    @Autowired
    private ManejadorFacFactura manejadorFacFactura;
    @Autowired
    private UtilAprovechamiento utilAprovechamiento;
    @Autowired
    private HandlerCprCtrProceso handlerCprCtrProceso;
    @Autowired
    private ManejadorVrtaVarteapr manejadorVrtaVarteapr;
    @Autowired
    private HandlerFacturaLiquidacion handlerFacturaLiquidacion;
    @Autowired
    private ManejadorCoapConsAproImp maanejadorCoapConsAproImp;
    @Autowired
    private ManejadorAfoAforos manejadorAfoAforos;
    @Autowired
    private ManejadorConConceptoAprovechamiento manejadorConConceptoAprovechamiento;
    @Autowired
    private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;
    @Autowired
    private ManejadorDprlDetliquidacionapro manejadorDprlDetliquidacionapro;

    private Integer idHilo;
    private FacFactura facFactura;
    private IniciarProcesoDTO iniciarProcesoDTO;
    private Long idProceso;
    private Integer idConsolidado;
    private boolean isAprovechamiento;
    private String tipoAprovechamiento;
    private BigDecimal valorTotal;
    private BigDecimal valorTotalRecaudado;
    private Map<String, Object> notas;
    private boolean wasValidate = false;
    private List<FacFactura> facBaseGen;
    private String tipoOperacion = "";

    @Override
    public void run() {
        LOGGER.info("Se esta ejecutando el proceso en el hilo " + idHilo);
        try {
            this.registrarProceso();
        } catch (Exception ex) {
            LOGGER.error("Se termina la ejecucion para la el proceso", ex);
        }
    }

    @Override
    public void validarFactura() throws Exception {
        boolean pasoValidacion;
        try {
            if (this.isAprovechamiento) {
                pasoValidacion = this.validarAprovechamiento();
            } else {
                pasoValidacion = this.validarIncentivoAprovechamiento();
            }
            if (pasoValidacion) {
                this.wasValidate = true;
                //continuar al agrupamiento
                this.agruparFactura();
            } else {
                //la factura no sirve para continuar con el proceso de liquidacion
                //debe finalizarse para que inicie otro proceso como la 115
                throw new Exception("No cumple con ninguna validación");
            }
        } catch (Exception ex) {
            LOGGER.error("Error al hacer las validaciones para la factura", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public void registrarProceso() {
        Integer idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        Integer idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
        long idAcceso = Long.parseLong(JwtUtil.auditoriaDTO.getId());

        CprCtrprocesoDTO proceso = new CprCtrprocesoDTO();
        proceso.setCprEstado("A");
        proceso.setCprFecinicio(new Date());
        proceso.setCprCanregistro(0L);
        proceso.setPrgIderegistro(this.iniciarProcesoDTO.getPrograma());
        proceso.setAccIderegistro(idAcceso);
        proceso.setEmpIderegistro(idEmpresa);
        proceso.setCprIdehilo(Long.valueOf(this.idHilo));
        proceso.setUsuIderegistro(Long.valueOf(idUsuario));
        try {
            CprCtrProceso cprCtrProceso = handlerCprCtrProceso.existeEjecucionHilo(proceso);
            if (cprCtrProceso == null) {
                this.idProceso = handlerCprCtrProceso.registrarProcesoApro(proceso);
            } else {
                this.idProceso = cprCtrProceso.getCprIderegistro();
            }
        } catch (Exception ex) {
            LOGGER.error("No fue posible registrar el proceso", ex);
        }
    }

    @Override
    public void agruparFactura() {
        try {
            this.facBaseGen = new ArrayList<>();
            if (this.isAprovechamiento && this.esAforado()) {
                //HU AFORADOS
                return;
            }
            if (this.facFactura.getFinIderegistro() != null) {
                this.tipoOperacion = "FACTURAS_FINANCIACION";
                facBaseGen.addAll(this.agruparFinanciacion());
            } else if (this.facFactura.getFacIdeorigen() != null) {
                facBaseGen.addAll(this.agruparFacOrigen());
                this.tipoOperacion = "FACTURAS_ORIGEN";
            } else {
                facBaseGen.add(this.facFactura);
            }
            this.calculosFactura();
        } catch (Exception ex) {
            LOGGER.error("Error al agrupar las facturas", ex);
        }
    }

    @Override
    public void calculosFactura() {
        try {
            for (FacFactura fact : this.facBaseGen) {
                List<ConConcepto> conceptos = this.getConceptosApro(fact.getFacIderegistro());
                this.calculoPago(fact, conceptos);
            }
        } catch (Exception ex) {
            LOGGER.error("Error Realizando los calculos ", ex);
        }
    }

    private List<ConConcepto> getConceptosApro(Long idFactura) {
        return this.manejadorConConceptoAprovechamiento.getConceptosFactura(this.tipoAprovechamiento, idFactura);
    }

    private List<FacFactura> agruparFinanciacion() {

        return this.handlerFacturaLiquidacion.getFacBaseFinanciacion(this.facFactura.getFinIderegistro(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento());
    }

    private List<FacFactura> agruparFacOrigen() {
        return this.handlerFacturaLiquidacion.getFacBaseOrigen(this.facFactura.getFacIdeorigen(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento());
    }

    private void inicializarConsolidado(AproCoapConsolidadoDTO consolidado) {
        this.utilAprovechamiento.inicializarConsolidado(consolidado);
    }

    protected void registrarConsolidado(AproCoapConsolidadoDTO consolidado) {
        consolidado.setFechaReg(new Date());
        consolidado.setEstado("P");
        consolidado.setUsuIderegistro(JwtUtil.auditoriaDTO.getIdUsuario());
        this.idConsolidado = this.maanejadorCoapConsAproImp.insertarConsolidado(consolidado, JwtUtil.auditoriaDTO.getIdEmpresa(), JwtUtil.auditoriaDTO.getIdUsuario(), new Date());
    }

    private boolean validarAprovechamiento() {
        boolean pasoValidaciones = false;
        boolean recaudoVal = this.validarRecaudo();
        boolean recadoNotasVal = this.validarRecaudoNotas();
        boolean recaudoCastVal = this.validarRecaudoCastigo();
        boolean recaudoFinanciacionVal = this.validarRecaudoFinanciacion();
        if (recaudoVal || recadoNotasVal || recaudoCastVal || recaudoFinanciacionVal) {
            pasoValidaciones = true;
        }
        return pasoValidaciones;
    }

    private boolean validarIncentivoAprovechamiento() {
        boolean pasoValidaciones = false;
        boolean recaudoVal = this.validarRecaudo();
        boolean recadoNotasVal = this.validarRecaudoNotas();
        boolean recaudoCastVal = this.validarRecaudoCastigo();
        boolean recaudoFinanciacionVal = this.validarRecaudoFinanciacion();
        if (recaudoVal || recadoNotasVal || recaudoCastVal || recaudoFinanciacionVal) {
            pasoValidaciones = true;
        }
        return pasoValidaciones;
    }

    private boolean validarRecaudo() {
        //Se trae el valor total de los recaudos
        try {
            return this.valorTotalRecaudado.compareTo(this.valorTotal) == 0;
        } catch (ClassCastException cce) {
            LOGGER.error("No se pudo recuperar el recaudo para la factura");
        }
        return false;
    }

    private boolean validarRecaudoNotas() {
        //Validar si tiene registros de recaudo con concepto de aprovechamiento
        BigDecimal recaudoAprovechamiento = (BigDecimal) this.manejadorRecaudoAprovechamiento.getRecaudoAprovechamiento(this.iniciarProcesoDTO.getFechaLimiteProcesamiento(), this.tipoAprovechamiento, this.facFactura.getFacIderegistro().intValue());
        if (recaudoAprovechamiento != null) {
            try {
                List<FacFactura> ND = this.notas.get("ND") != null ? (List<FacFactura>) this.notas.get("ND") : null;
                List<FacFactura> NC = this.notas.get("NC") != null ? (List<FacFactura>) this.notas.get("NC") : null;
                BigDecimal valorND = valorTotalNotas(ND);
                BigDecimal valorNC = valorTotalNotas(NC);
                return (this.valorTotal.add(valorND)).compareTo((this.valorTotalRecaudado.add(valorNC))) == 0;
            } catch (Exception ex) {
                LOGGER.error("error al validar recaudoNotas", ex.getMessage());
            }
        }
        return false;
    }

    public BigDecimal valorTotalNotas(List<FacFactura> notas) {
        BigDecimal valor = BigDecimal.ZERO;
        if (notas != null && !notas.isEmpty()) {
            for (FacFactura nota : notas) {
                valor.add(this.handlerFacturaLiquidacion.getValorTotalFactura(nota.getFacIderegistro()));
            }
        }
        return valor;
    }

    private boolean validarRecaudoCastigo() {
        BigDecimal recaudoAprovechamiento = (BigDecimal) this.manejadorRecaudoAprovechamiento.getRecaudoAprovechamiento(this.iniciarProcesoDTO.getFechaLimiteProcesamiento(), this.tipoAprovechamiento, this.facFactura.getFacIderegistro().intValue());
        if (recaudoAprovechamiento != null) {
            try {
                List<FacFactura> saldoConCastigo = this.handlerFacturaLiquidacion.getSaldoConCastigo(this.facFactura.getFacIderegistro(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento());
                boolean tieneSaldoConCastigo = saldoConCastigo != null && !saldoConCastigo.isEmpty();
                return this.valorTotalRecaudado.compareTo(this.valorTotal) < 0 && tieneSaldoConCastigo;
            } catch (Exception ex) {
                LOGGER.error("error al validar validarRecaudoCastigo()", ex.getMessage());
            }
        }
        return false;
    }

    private boolean validarRecaudoFinanciacion() {
        BigDecimal recaudoAprovechamiento = (BigDecimal) this.manejadorRecaudoAprovechamiento.getRecaudoAprovechamiento(this.iniciarProcesoDTO.getFechaLimiteProcesamiento(), this.tipoAprovechamiento, this.facFactura.getFacIderegistro().intValue());
        if (recaudoAprovechamiento != null) {
            try {
                List<FacFactura> saldoFinanciado = this.handlerFacturaLiquidacion.getSaldoFinanciado(this.facFactura.getFacIderegistro(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento());
                boolean tieneSaldoFinanciado = saldoFinanciado != null && !saldoFinanciado.isEmpty();
                return this.valorTotalRecaudado.compareTo(this.valorTotal) < 0 && tieneSaldoFinanciado;
            } catch (Exception ex) {
                LOGGER.error("error al validar validarRecaudoFinanciacion()", ex.getMessage());
            }
        }
        return false;
    }

    @Transactional
    public void calculoPago(FacFactura fact, List<ConConcepto> conceptos) {

        for (ConConcepto concepto : conceptos) {
            BigDecimal valorConcepto = porcentajeParam(concepto.getUniConcepto());
            List<ParticipacionDTO> porcentajesParticipacion = this.getPorcentajesParticipacion(concepto.getUniConcepto(), fact);
            porcentajesParticipacion.forEach(porcentajeConfig -> {

                DprlDetliquidacionapro detliquidacionapro = setDetalleProceso(fact, concepto, porcentajeConfig);

                BigDecimal participacion = porcentajeConfig.getValorParticipacion();
                try {
                    AproCoapConsolidadoDTO consolidadoDTO = new AproCoapConsolidadoDTO();
                    this.inicializarConsolidado(consolidadoDTO);
                    consolidadoDTO.setDprlIderegistro(detliquidacionapro.getDprlIderegistr());

                    //facturado originalmente
                    BigDecimal factOriginal = valorConcepto(fact.getFacIderegistro(), concepto.getUniConcepto());
                    factOriginal = factOriginal != null ? factOriginal : BigDecimal.ZERO;
                    BigDecimal calculo = (valorConcepto.multiply(factOriginal)).multiply(participacion);

                    //recaudado originalmente
                    BigDecimal recOriginal = manejadorDrecDetrecaudo.facturadoTotal(fact.getFacIderegistro(), concepto.getUniConcepto());
                    recOriginal = recOriginal != null ? recOriginal : BigDecimal.ZERO;
                    BigDecimal calculo2 = (valorConcepto.multiply(recOriginal)).multiply(participacion);

                    //castigado
                    BigDecimal valorCastigado = manejadorFacFactura.valorCastigado(fact.getFacIderegistro(), concepto.getUniConcepto());
                    valorCastigado = valorCastigado != null ? valorCastigado : BigDecimal.ZERO;
                    BigDecimal calculo3 = (valorConcepto.multiply(valorCastigado)).multiply(participacion);

                    Map<String, String> conPropiedad = new ObjectMapper().readValue(concepto.getConPropiedad(),
                            HashMap.class);
                    String clase_concepto_aprovechamiento = conPropiedad.get("clase_concepto_aprovechamiento");
                    if (this.isAprovechamiento) {
                        consolidadoDTO.setAprovechamiento("A");
                        consolidadoDTO.setCoapVlrCastigado(calculo3);
                        switch (clase_concepto_aprovechamiento != null ? clase_concepto_aprovechamiento.toUpperCase() : "") {
                            case "CC":
                                consolidadoDTO.setCoapSaldoFactCc(calculo);
                                consolidadoDTO.setCoapPagoCteCc(calculo2);
                                break;
                            case "TA":
                                consolidadoDTO.setCoapSaldoFactTa(calculo);
                                consolidadoDTO.setCoapPagoCteTa(calculo2);
                                break;
                            case "AJUSTETA":
                                consolidadoDTO.setCoapFactAjusteTa(calculo);
                                consolidadoDTO.setCoapPagoAjusteTa(calculo2);
                                break;
                            case "AJUSTECC":
                                consolidadoDTO.setCoapFactAjusteCc(calculo);
                                consolidadoDTO.setCoapPagoAjusteCc(calculo2);
                                break;
                            default:
                                LOGGER.info("El concepto no tiene configurado la clase de concepto :: uni_concepto:" + concepto.getUniConcepto());
                        }
                    }
                    if (!this.isAprovechamiento) {
                        consolidadoDTO.setAprovechamiento("I");
                        consolidadoDTO.setCoapSaldoFactIa(calculo);
                        consolidadoDTO.setCoapPagoCteIa(calculo2);
                        consolidadoDTO.setCoapVlrCastigadoIa(calculo3);
                    }
                    this.registrarConsolidado(consolidadoDTO);
                    this.actualizarHilo();
                } catch (Exception exception) {
                    LOGGER.error("No se pudieron realizar los calculos ", exception.getMessage());
                }

            });
        }
    }

    @Transactional
    protected DprlDetliquidacionapro setDetalleProceso(FacFactura fact, ConConcepto concepto, ParticipacionDTO porcentajeConfig) {
        DprlDetliquidacionapro detliquidacionapro = new DprlDetliquidacionapro();
        detliquidacionapro.setPrlIderegistro(this.iniciarProcesoDTO.getIdProceso());
        detliquidacionapro.setFacIderegistro(fact.getFacIderegistro());
        detliquidacionapro.setUniConcepto(concepto.getUniConcepto());
        detliquidacionapro.setTerIderegistro(Long.valueOf(porcentajeConfig.getIdTercero()));
        detliquidacionapro.setIdEmpresa(JwtUtil.auditoriaDTO.getIdEmpresa());
        detliquidacionapro.setEstado("P");
        return this.manejadorDprlDetliquidacionapro.save(detliquidacionapro);
    }

    private BigDecimal porcentajeParam(Integer uniconcepto) {
        BigDecimal porcentaje = manejadorColiConliquidaAprovechamiento.findByUniConcepto(uniconcepto).divide(BigDecimal.valueOf(100));
        return porcentaje;

    }

    private BigDecimal valorConcepto(Long facIderegistro, Integer uniconcepto) {
        BigDecimal dfacVlrtotal = manejadorDfacDetfactura.getValorTotalConcepto(facIderegistro, uniconcepto);
        if (Objects.nonNull(dfacVlrtotal) && dfacVlrtotal.compareTo(BigDecimal.ZERO) == 0) {
            return dfacVlrtotal.ZERO;
        } else {
            return dfacVlrtotal;
        }
    }

    private List<ParticipacionDTO> getPorcentajesParticipacion(Integer uniConcepto, FacFactura fact) {
        List<ParticipacionDTO> listPorcentPart = new ArrayList<>();
        if (this.isAprovechamiento) {
            List<VrtaVarterapr> porcentajeParticipacionTaras = manejadorVrtaVarteapr.getPorcentajeParticipacionTaras(fact.getPerIderegistro(), fact.getEmpIderegistro(), uniConcepto);

            for (VrtaVarterapr config : porcentajeParticipacionTaras) {
                ParticipacionDTO participacionDTO = new ParticipacionDTO();
                participacionDTO.setValorParticipacion(config.getVrtaValor());
                participacionDTO.setIdTercero(config.getTerIderegistro());
                participacionDTO.setUniConcepto(Long.valueOf(uniConcepto));
                participacionDTO.setIdFact(fact.getFacIdeorigen());
                listPorcentPart.add(participacionDTO);
            }
            if (!listPorcentPart.isEmpty()) {
                BigDecimal acum = BigDecimal.ZERO;
                for (ParticipacionDTO porcentara : listPorcentPart) {
                    acum = acum.add(porcentara.getValorParticipacion());
                }
                for (ParticipacionDTO porcentara : listPorcentPart) {
                    porcentara.setValorParticipacion((porcentara.getValorParticipacion().divide(acum, 2, RoundingMode.HALF_UP)));
                }
            }

        } else {
            Date fechaRango = fact.getFacFecha();
            Long municipio = manejadorDsusDetsuscrip.obtenerMunicipioCliente(fact.getTerIderegistro());
            PdiaPardistribucionincentivo porcentajeIA = manejadorPdiaPardistribucionincentivo.getPorcentajeIA(fechaRango, municipio);
            ParticipacionDTO participacionDTO = new ParticipacionDTO();
            participacionDTO.setValorParticipacion(porcentajeIA.getPdiaPordistribucion().divide(BigDecimal.valueOf(100)));
            participacionDTO.setIdTercero(porcentajeIA.getTerIderegistro());
            participacionDTO.setUniConcepto(Long.valueOf(uniConcepto));
            participacionDTO.setUniConcepto(fact.getFacIdeorigen());
            listPorcentPart.add(participacionDTO);
        }
        return listPorcentPart;
    }

    private void actualizarHilo() {
        CprCtrProceso cprCtrProceso = handlerCprCtrProceso.findById(this.idProceso);
        if (cprCtrProceso != null) {
            this.handlerCprCtrProceso.actualizarCantidadHilo(cprCtrProceso);
        }
    }

    private boolean esAforado() {
        List<AfoAforos> terceroAforado = this.manejadorAfoAforos.getTerceroAforado(this.facFactura.getTerIderegistro());
        if (terceroAforado != null && !terceroAforado.isEmpty()) {
            return true;
        }
        return false;
    }

    public Integer getIdHilo() {
        return idHilo;
    }

    public void setIdHilo(Integer idHilo) {
        this.idHilo = idHilo;
    }

    public FacFactura getFacFactura() {
        return facFactura;
    }

    public void setFacFactura(FacFactura facFactura) {
        this.facFactura = facFactura;
    }

    public void setIniciarProcesoDTO(IniciarProcesoDTO iniciarProcesoDTO) {
        this.iniciarProcesoDTO = iniciarProcesoDTO;
    }

    public boolean wasValidate() {
        return wasValidate;
    }
}
