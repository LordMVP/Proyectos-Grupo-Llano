package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.aprovechamiento.servicio.utils.UtilAprovechamiento;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorFacFactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorFacturaAprovechamiento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class HandlerFacturaLiquidacion {

    @Autowired
    private ManejadorFacturaAprovechamiento manejadorFacturaAprovechamiento;

    @Autowired
    private ManejadorFacFactura manejadorFacFactura;
    
    @Autowired
    private UtilAprovechamiento utilAprovechamiento;

    public List<FacFactura> getSaldoConCastigo(Long idFacturaPadre, Date fechaLimite){
        return this.manejadorFacFactura.getSaldoConCastigo(idFacturaPadre, fechaLimite);
    }
    public List<FacFactura> getSaldoFinanciado(Long idFacturaPadre, Date fechaLimite) {
        return this.manejadorFacFactura.getSaldoFinanciado(idFacturaPadre, fechaLimite);
    }

    public List<Object> getFacturasConRecaudo(List<String> estados, IniciarProcesoDTO iniciarProcesoDTO){
        return Collections.singletonList(
                this.manejadorFacturaAprovechamiento.getFacturasConRecaudo(estados, iniciarProcesoDTO.getIdCiclo(),
                        iniciarProcesoDTO.getAnoCiclo(),
                        iniciarProcesoDTO.getIdPeriodo(),
                        317,
                        getIsAprovechamiento(iniciarProcesoDTO.getTipoAprovechamiento())));
    }

    public List<FacFactura> getNotasFactura(Long idPadre, Date limiteProc, String tipo){
        return this.manejadorFacFactura.getNotasFactura(idPadre,limiteProc, tipo);
    }

    public BigDecimal getValorTotalFactura(Long facIdRegistro){
        return this.manejadorFacFactura.getValorTotal(facIdRegistro);
    }

    private String getIsAprovechamiento(String tipoAprovechamiento){
        return utilAprovechamiento.consAprovechamiento(tipoAprovechamiento);
    }
    List<FacFactura> getFacBaseFinanciacion(Long finIderegistro,  Date fechaLimite){
        return this.manejadorFacFactura.getFacBaseFinanciacion(finIderegistro, fechaLimite);
    }

    List<FacFactura> getFacBaseOrigen(Long facIdOrigen,  Date fechaLimite){
        return this.manejadorFacFactura.getFacBaseOrigen(facIdOrigen, fechaLimite);
    }

    public List<Object[]> ejecutarProcesoAproCast(Integer idEmpresa,Date corteFacturacion,Integer idUsuario) throws Exception{
        return this.manejadorFacturaAprovechamiento.ejecutarProcesoAproCast(idEmpresa, corteFacturacion, idUsuario);
    }
    
    public void ejecutarAprobarProcesoAprovCast(Long mapcrIdregistr){
        this.manejadorFacturaAprovechamiento.ejecutarAprobarProcesoAprovCast(mapcrIdregistr);
    }
    
    public void ejecutarDescartarProcesoAprovCast(Long mapcrIdregistr){
        this.manejadorFacturaAprovechamiento.ejecutarDescartarProcesoAprovCast(mapcrIdregistr);
    }
}
