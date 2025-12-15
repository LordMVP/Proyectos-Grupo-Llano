package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IProcesoLiquidacionThread;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.UtilAprovechamiento;
import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.entidades.*;
import com.bioagricola.apirest.modelo.manejadores.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Component
@Scope("prototype")
public class PagoAproCartCastigadaThread implements Runnable, IProcesoLiquidacionThread {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(PagoAproCartCastigadaThread.class);

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
    private ManejadorDprlDetliquidacionapro manejadorDprlDetliquidacionapro;
    @Autowired
    private HandlerFacturaLiquidacion handlerFacturaLiquidacion;
    @Autowired
    private ManejadorAfoAforos manejadorAfoAforos;
    @Autowired
    private ManejadorConConceptoAprovechamiento manejadorConConceptoAprovechamiento;
    @Autowired
    private ManejadorCoapConsAproImp maanejadorCoapConsAproImp;

    private Integer idHilo;
    private FacFactura facFactura;
    private IniciarProcesoDTO iniciarProcesoDTO;
    private Long idProceso;
    private Integer idConsolidado;
    private boolean isAprovechamiento;
    private String tipoAprovechamiento;
    private BigDecimal valorTotal;
    private Map<String, Object> notas;
    private List<FacFactura> facBaseGen;
    private String tipoOperacion = "";

    @Override
    public void run() {
        LOGGER.info(String.format("Se esta ejecutando el proceso de cartera castigada en el hilo %d", idHilo));
        LOGGER.info(String.format("Liquidando la factura %s", this.facFactura.getFacIderegistro()));
        try {
            this.registrarProceso();
            this.getTipoAprovechamiento();
            this.getValorFactura();
            this.getNotasFactura();
            this.validarFactura();
        } catch (Exception ex) {
            LOGGER.error("se termina la ejecucion para la factura ", ex);
            if (this.idConsolidado != null) {
                //actualizar el registro en el consolidado a F
            }
        }
    }

    private void getTipoAprovechamiento() {
        this.isAprovechamiento = this.utilAprovechamiento.isAprovechamiento(this.iniciarProcesoDTO.getTipoAprovechamiento());
        this.tipoAprovechamiento = this.utilAprovechamiento.consAprovechamiento(this.iniciarProcesoDTO.getTipoAprovechamiento());
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
                this.agruparFactura();
            } else {
                throw new Exception("No cumple con ninguna validación");
            }
        } catch (Exception ex) {
            LOGGER.error("Error al hacer las validaciones para la factura", ex);
            throw ex;
        }
    }

    @Transactional
    protected void registrarConsolidado(AproCoapConsolidadoDTO consolidado) {
        consolidado.setFechaReg(new Date());
        consolidado.setEstado("P");
        consolidado.setUsuIderegistro(JwtUtil.auditoriaDTO.getIdUsuario());
        this.idConsolidado = this.maanejadorCoapConsAproImp.insertarConsolidado(consolidado, JwtUtil.auditoriaDTO.getIdEmpresa(), JwtUtil.auditoriaDTO.getIdUsuario(), new Date());
    }

    private boolean validarAprovechamiento() {
        boolean pasoValidaciones = false;
        boolean firstValidacion = this.validarRegistrosCastigo();
//        boolean secondValidacion = this.validarRecaudo();
        if (firstValidacion) {
            pasoValidaciones = true;
        }
        return pasoValidaciones;
    }

    private boolean validarIncentivoAprovechamiento() {
        boolean firstValidacion = this.validarRegistrosCastigo();
        return false;
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

    private void actualizarHilo() {
        CprCtrProceso cprCtrProceso = handlerCprCtrProceso.findById(this.idProceso);
        if (cprCtrProceso != null) {
            this.handlerCprCtrProceso.actualizarCantidadHilo(cprCtrProceso);
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
                this.calculo(fact, conceptos);
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

    private boolean validarRegistrosCastigo() {
        List<Object> listaFacturas = new ArrayList<>();
        listaFacturas.add(this.facFactura);
        BigDecimal valorTotal = this.handlerFacturaLiquidacion.getValorTotalFactura(this.facFactura.getFacIderegistro());
        return false;
    }

    private void validarRegistrosNotas() {
    }

    private void validarRecaudoCastigo() {
    }

    @Transactional
    public void calculo(FacFactura fact, List<ConConcepto> conceptos) {

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

    private boolean esAforado() {
        List<AfoAforos> terceroAforado = this.manejadorAfoAforos.getTerceroAforado(this.facFactura.getTerIderegistro());
        if (terceroAforado != null && !terceroAforado.isEmpty()) {
            return true;
        }
        return false;
    }

    private List<ParticipacionDTO> getPorcentajesParticipacion(Integer uniConcepto, FacFactura fact) {
        return this.utilAprovechamiento.getPorcentajesParticipacion(uniConcepto, fact, this.isAprovechamiento);
    }

    private void getValorFactura() {
        try {
            this.valorTotal = this.handlerFacturaLiquidacion.getValorTotalFactura(this.facFactura.getFacIderegistro());
        } catch (Exception ex) {
            this.valorTotal = BigDecimal.ZERO;
        }
    }

    private void getNotasFactura() {
        this.notas = new HashMap<>();
        this.notas.put("ND", this.handlerFacturaLiquidacion.getNotasFactura(this.facFactura.getFacIderegistro(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento(), "ND"));
        this.notas.put("NC", this.handlerFacturaLiquidacion.getNotasFactura(this.facFactura.getFacIderegistro(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento(), "NC"));
        this.notas.put("NSF", this.handlerFacturaLiquidacion.getNotasFactura(this.facFactura.getFacIderegistro(), this.iniciarProcesoDTO.getFechaLimiteProcesamiento(), "NSF"));
    }

    private void inicializarConsolidado(AproCoapConsolidadoDTO consolidado) {
        this.utilAprovechamiento.inicializarConsolidado(consolidado);
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
}
