package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IProcesoLiquidacionThread;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.UtilAprovechamiento;
import com.bioagricola.apirest.modelo.dtos.CprCtrprocesoDTO;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.dtos.PruebaDTO;
import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.manejadores.*;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Component
@Scope("prototype")
public class PagoNovedadesThread implements Runnable, IProcesoLiquidacionThread {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(PagoNovedadesThread.class);

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

    private Integer idHilo;
    private FacFactura novedad;
    private IniciarProcesoDTO iniciarProcesoDTO;
    private Long idProceso;
    private Long idConsolidado;
    private boolean isAprovechamiento;
    private String tipoAprovechamiento;

    @Override
    public void run() {
        LOGGER.info("Se esta ejecutando el proceso en el hilo " + idHilo);
        LOGGER.info("Se esta ejecutando el proceso para la factura " + this.novedad.getFacIderegistro());
        try {
            this.registrarProceso();
            this.getTipoAprovechamiento();
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
                this.actualizarHilo();
                this.registrarConsolidado();
                //continuar al agrupamiento
                this.agruparFactura();
            } else {
                //la factura no sirve para continuar con el proceso de liquidacion
                //debe finalizarse para que inicie otro proceso como la 115
                throw new Exception("No cumple con ninguna validación");
            }
        } catch (Exception ex) {
            LOGGER.error("Error al hacer las validaciones para la factura", ex);
            throw ex;
        }
    }

    private void registrarConsolidado() {
    }

    private boolean validarAprovechamiento() {
        boolean pasoValidaciones = false;
        boolean firstValidacion = this.validarRecaudo();
//        boolean secondValidacion = this.validarRecaudo();
        if (firstValidacion) {
            pasoValidaciones = true;
        }
        return pasoValidaciones;
    }

    private boolean validarIncentivoAprovechamiento() {
        boolean firstValidacion = this.validarRecaudo();
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
    }

    @Override
    public void calculosFactura() {
        //primerCalculo(PruebaDTO pruebaDTO);
    }

    private boolean validarRecaudo() {
        List<Object> listaFacturas = new ArrayList<>();
        listaFacturas.add(this.novedad);
        BigDecimal valorTotal = this.handlerFacturaLiquidacion.getValorTotalFactura(this.novedad.getFacIderegistro());
        return false;
    }

    private void validarRecaudoNotas() {
    }

    private void validarRecaudoCastigo() {
    }

    private List<BigDecimal> primerCalculo(PruebaDTO pruebaDTO) {
        List<BigDecimal> valoresOriginales = new ArrayList<>();

        pruebaDTO.getFacturas().forEach(f -> {

            f.getUniConcepto().forEach(c -> {
                //porcentaje de la parametrizacion coliconliquidaapro
                BigDecimal porcentaje = porcentajeParam(c);

                //porcentaje de participacion-->IA: pdiaParDistribucion| A:Taras
                //BigDecimal participacion = manejadorPdiaPardistribucionincentivo.getPorcentajeIA(fechaInicial, fechaFinal, municipio);
                BigDecimal participacion = f.getPorcentajeParticipacion().divide(BigDecimal.valueOf(100));

                //facturado originalmente
                BigDecimal factOriginal = valorConcepto(f.getFacIderegistro(), c);
                BigDecimal calculo = (porcentaje.multiply(factOriginal)).multiply(participacion);
                valoresOriginales.add(calculo);

                //recaudado originalmente
                BigDecimal recOriginal = manejadorDrecDetrecaudo.facturadoTotal(f.getFacIderegistro(), c);
                BigDecimal calculo2 = (porcentaje.multiply(recOriginal)).multiply(participacion);
                valoresOriginales.add(calculo2);

                //castigado ??
                BigDecimal valorCastigado = manejadorFacFactura.valorCastigado(f.getFacIderegistro(), c);
                BigDecimal calculo3 = (porcentaje.multiply(valorCastigado)).multiply(participacion);
                valoresOriginales.add(calculo3);

            });

        });
        return valoresOriginales;
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

    private void getPorcentajesParticipacion(Integer idPeriodo, Integer idEmpresa, Integer idConcepto) {
        manejadorVrtaVarteapr.getPorcentajeParticipacionTaras(idPeriodo, idEmpresa, idConcepto);
    }

    public Integer getIdHilo() {
        return idHilo;
    }

    public void setIdHilo(Integer idHilo) {
        this.idHilo = idHilo;
    }

    public FacFactura getNovedad() {
        return novedad;
    }

    public void setNovedad(FacFactura novedad) {
        this.novedad = novedad;
    }

    public void setIniciarProcesoDTO(IniciarProcesoDTO iniciarProcesoDTO) {
        this.iniciarProcesoDTO = iniciarProcesoDTO;
    }
}
