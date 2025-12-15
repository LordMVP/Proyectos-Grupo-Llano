package com.bioagricola.apirest.aprovechamiento.servicio.utils;


import com.bioagricola.apirest.aprovechamiento.negocio.NegocioParParametro;
import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.ParticipacionDTO;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.entidades.PdiaPardistribucionincentivo;
import com.bioagricola.apirest.modelo.entidades.VrtaVarterapr;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPdiaPardistribucionincentivo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorVrtaVarteapr;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.TIPO_APROVECHAMIENTO;
import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.TIPO_INCENTIVO_APROVECHAMIENTO;

@Service
public class UtilAprovechamiento {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(UtilAprovechamiento.class);

    @Autowired
    NegocioParParametro negocioParParametro;
    @Autowired
    private ManejadorVrtaVarteapr manejadorVrtaVarteapr;
    @Autowired
    private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;
    @Autowired
    private ManejadorPdiaPardistribucionincentivo manejadorPdiaPardistribucionincentivo;

    public String consAprovechamiento(String tipoAprovechamiento){
        tipoAprovechamiento = tipoAprovechamiento == null ? TIPO_APROVECHAMIENTO : tipoAprovechamiento;
        if(tipoAprovechamiento.equals("TIPO_INCENTIVO_APROVECHAMIENTO")){
            return TIPO_INCENTIVO_APROVECHAMIENTO;
        }else{
            return TIPO_APROVECHAMIENTO;
        }
    }

    public boolean isAprovechamiento(String tipoAprovechamiento){
        boolean isAprovechamiento = tipoAprovechamiento == null ? true : false;
        if(tipoAprovechamiento.equals("TIPO_INCENTIVO_APROVECHAMIENTO")){
            return false;
        }else{
            return true;
        }
    }

    public int getCantidadHilos() throws Exception{
        try {
            Map<String, Object> parametros = this.negocioParParametro.consultaParametrosAprovechamiento();
            return (Integer)(parametros.get(ConstantesServicios.NUMERO_HILOS_APROVECHAMIENTO));
        }catch (Exception ex ){
            LOGGER.error("Error al consultar la cantidad de hilos parametrizada");
            throw ex;
        }
    }

    public void inicializarConsolidado(AproCoapConsolidadoDTO consolidado){
        consolidado.setCoapSaldoFactCc(BigDecimal.ZERO);
        consolidado.setCoapSaldoFactTa(BigDecimal.ZERO);
        consolidado.setCoapCambioVlrCteTa(BigDecimal.ZERO);
        consolidado.setCoapPagoCteCc(BigDecimal.ZERO);
        consolidado.setCoapPagoCteTa(BigDecimal.ZERO);
        consolidado.setCoapFactAjusteCc(BigDecimal.ZERO);
        consolidado.setCoapFactAjusteTa(BigDecimal.ZERO);
        consolidado.setCoapPagoAjusteCc(BigDecimal.ZERO);
        consolidado.setCoapPagoAjusteTa(BigDecimal.ZERO);
        consolidado.setCoapCambioVlrPagoCte(BigDecimal.ZERO);
        consolidado.setCoapVlrCastigado(BigDecimal.ZERO);
        consolidado.setDinc(BigDecimal.ZERO);
        consolidado.setCoapSaldoFactIa(BigDecimal.ZERO);
        consolidado.setCoapCambioVlrCteIa(BigDecimal.ZERO);
        consolidado.setCoapPagoCteIa(BigDecimal.ZERO);
        consolidado.setCoapCambioVlrCteIa(BigDecimal.ZERO);
        consolidado.setCoapVlrCastigadoIa(BigDecimal.ZERO);
    }

    public List<ParticipacionDTO> getPorcentajesParticipacion(Integer uniConcepto, FacFactura fact, Boolean isAprovechamiento){
        List<ParticipacionDTO> listPorcentPart = new ArrayList<>();
        if(isAprovechamiento){
            List<VrtaVarterapr> porcentajeParticipacionTaras = manejadorVrtaVarteapr.getPorcentajeParticipacionTaras(fact.getPerIderegistro(), fact.getEmpIderegistro(), uniConcepto);

            for(VrtaVarterapr config: porcentajeParticipacionTaras){
                ParticipacionDTO participacionDTO = new ParticipacionDTO();
                participacionDTO.setValorParticipacion(config.getVrtaValor());
                participacionDTO.setIdTercero(config.getTerIderegistro());
                participacionDTO.setUniConcepto(Long.valueOf(uniConcepto));
                participacionDTO.setUniConcepto(fact.getFacIdeorigen());
                listPorcentPart.add(participacionDTO);
            }
            if(!listPorcentPart.isEmpty()){
                BigDecimal acum = BigDecimal.ZERO;
                for(ParticipacionDTO porcentara: listPorcentPart){
                    acum =  acum.add(porcentara.getValorParticipacion());
                }
                for(ParticipacionDTO porcentara: listPorcentPart){
                    porcentara.setValorParticipacion((porcentara.getValorParticipacion().divide(acum, 2 , RoundingMode.HALF_UP)));
                }
            }

        }else {
            Date fechaRango = fact.getFacFecha();
            Long municipio = manejadorDsusDetsuscrip.obtenerMunicipioCliente(fact.getTerIderegistro());
            PdiaPardistribucionincentivo porcentajeIA = manejadorPdiaPardistribucionincentivo.getPorcentajeIA(fechaRango,  municipio);
            ParticipacionDTO participacionDTO = new ParticipacionDTO();
            participacionDTO.setValorParticipacion(porcentajeIA.getPdiaPordistribucion());
            participacionDTO.setIdTercero(porcentajeIA.getTerIderegistro());
            participacionDTO.setUniConcepto(Long.valueOf(uniConcepto));
            participacionDTO.setUniConcepto(fact.getFacIdeorigen());
            listPorcentPart.add(participacionDTO);
        }
        return listPorcentPart;
    }
}
