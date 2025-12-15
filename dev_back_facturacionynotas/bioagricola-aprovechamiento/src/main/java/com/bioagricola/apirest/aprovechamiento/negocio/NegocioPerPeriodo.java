package com.bioagricola.apirest.aprovechamiento.negocio;


import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IPeriodo;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.PerPeriodoDTO;
import com.bioagricola.apirest.aprovechamiento.payload.PeriodoFacturacionPrestacionForm;
import com.bioagricola.apirest.modelo.dtos.PeriodoLiquidacionDTO;
import com.bioagricola.apirest.modelo.entidades.DperDetperiodo;
import com.bioagricola.apirest.modelo.entidades.PerPeriodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDperDetperiodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPerPeriodo;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class NegocioPerPeriodo extends NegocioAbstracto<DperDetperiodo, PeriodoLiquidacionDTO>implements IPeriodo {

    private static final String ACTIVIDAD_PERIODO_CIERRE_FACTURACION = "Cierre Fact Aprovechamiento";
    private static final String ACTIVIDAD_PERIODO_LIMITE_PROCESAMIENTO = "Fecha max procesa Aprovec";

    @Autowired
    NegocioParParametro negocioParParametro;

    @Autowired
    ManejadorDperDetperiodo manejadorDperDetperiodo;

    @Autowired
    ManejadorPerPeriodo manejadorPerPeriodo;

    @Override
    public Object getPeriodo() throws Exception{
        Map<String, Object> consultaParametro;
        consultaParametro = this.negocioParParametro.consultaParametrosAprovechamiento();
        Integer idCiclo = (Integer)(consultaParametro.get(ConstantesServicios.CICLO_LIQUIDACION));
        PeriodoLiquidacionDTO periodoLiquidacionDTO = null;

        if(idCiclo != null){
            validarPeriodosPorCiclo(idCiclo);
            List<DperDetperiodo> fechasLiquidacionAprovechamiento = this.manejadorDperDetperiodo.getFechasLiquidacionAprovechamiento(idCiclo);
            if(fechasLiquidacionAprovechamiento != null && !fechasLiquidacionAprovechamiento.isEmpty()){
                periodoLiquidacionDTO = new PeriodoLiquidacionDTO();
                this.validarFechasParametrizadas(fechasLiquidacionAprovechamiento);

                DperDetperiodo per1 = fechasLiquidacionAprovechamiento.get(0);
                DperDetperiodo per2 = fechasLiquidacionAprovechamiento.get(1);
                periodoLiquidacionDTO.setFechaCorteFacturacion(per1.getDperActividad().equalsIgnoreCase(ACTIVIDAD_PERIODO_CIERRE_FACTURACION) ? per1.getDperFeccierre():per2.getDperFeccierre());
                periodoLiquidacionDTO.setFechaLimiteProcesamiento(per1.getDperActividad().equalsIgnoreCase(ACTIVIDAD_PERIODO_LIMITE_PROCESAMIENTO) ? per1.getDperFeccierre():per2.getDperFeccierre());
                periodoLiquidacionDTO.setIdCiclo(idCiclo);
                periodoLiquidacionDTO.setIdPeriodo(per1.getPerPeriodo().getPerIderegistro());
                periodoLiquidacionDTO.setAnoCiclo(per1.getCicCiclo().getCicAnoactual());
                try {
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(per1.getPerPeriodo().getPerFecfinal());
                    int anoInicioFacturacion = calendar.get(Calendar.YEAR);
                    periodoLiquidacionDTO.setPerNombre(per1.getPerPeriodo().getPerNombre().toUpperCase() +" "+ anoInicioFacturacion);
                }catch (Exception ex ){
                    periodoLiquidacionDTO.setPerNombre(per1.getPerPeriodo().getPerNombre());
                }
            }else{
                throw new Exception("Ya se realizó la consolidación del periodo activo de facturación de aprovechamiento");
            }
        }else{
            throw new Exception("No se encuentra la configuración para liquidar aprovechamiento");
        }
        return periodoLiquidacionDTO;
    }

    private void validarFechasParametrizadas(List<DperDetperiodo> fechasLiquidacionAprovechamiento) throws Exception {
            if(fechasLiquidacionAprovechamiento.size()==1){
                if(fechasLiquidacionAprovechamiento.get(0).getDperActividad().equalsIgnoreCase(ACTIVIDAD_PERIODO_CIERRE_FACTURACION)){
                    throw new Exception("No existe Fecha límite procesamiento, por favor configúrela e intente de nuevo");
                }else if(fechasLiquidacionAprovechamiento.get(0).getDperActividad().equalsIgnoreCase(ACTIVIDAD_PERIODO_LIMITE_PROCESAMIENTO)){
                    throw new Exception("No existe Fecha corte facturación, por favor configúrela e intente de nuevo");
                }
            }
    }

    private void validarPeriodosPorCiclo(Integer idCiclo) throws Exception {
        List<PerPeriodo> perPeriodoByCiclo = manejadorPerPeriodo.getPerPeriodoByCiclo(idCiclo);
        if(perPeriodoByCiclo == null || perPeriodoByCiclo.isEmpty()){
            throw new Exception("No existe configuración de un periodo para la consolidación de aprovechamiento, por favor verifique e intente de nuevo");
        }
    }

    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return false;
    }

    @Override
    protected Logger getLogger() {
        return null;
    }

    @Override
    protected PeriodoLiquidacionDTO instanciarDAO() {
        return new PeriodoLiquidacionDTO();
    }

    @Override
    public List<PerPeriodoDTO> getPeriodos() {
        List<PerPeriodoDTO> perPeriodoDTOS = new ArrayList<>();
        List<Map<String, Object>> perPeriodos = this.manejadorPerPeriodo.getPerPeriodos(Arrays.asList("C", "A"));
        for (Map<String, Object> perPeriodo : perPeriodos) {
            PerPeriodoDTO perPeriodoDTO = new PerPeriodoDTO();
            perPeriodoDTO.setPerIderegistro((Integer) perPeriodo.get("per_ideregistro"));
            perPeriodoDTO.setPerIdeorden((Short) perPeriodo.get("per_ideorden"));
            perPeriodoDTO.setPerEstado( perPeriodo.get("per_estado").toString());
            perPeriodoDTO.setPerFecinicial((Date) perPeriodo.get("per_fecinicial"));
            perPeriodoDTO.setPerFecfinal((Date) perPeriodo.get("per_fecfinal"));
            perPeriodoDTO.setPerNombre((String) perPeriodo.get("periodo_corte"));
            perPeriodoDTO.setMaprcIderegistro(Integer.parseInt(perPeriodo.get("maprc_ideregistr").toString()));
            perPeriodoDTOS.add(perPeriodoDTO);
        }
        return perPeriodoDTOS;
    }
    @Override
    public List<PerPeriodoDTO> getPeriodosCon() {
        List<PerPeriodoDTO> perPeriodoDTOS = new ArrayList<>();

        int idempresa = JwtUtil.auditoriaDTO.getIdEmpresa();

            this.manejadorPerPeriodo.getPeriodosCon(idempresa)
                .forEach(objects -> {
                    Date initDate = new Date();
                    Date endDate = new Date();
                    try {
                        initDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(objects[2].toString());
                        endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(objects[3].toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    PerPeriodo pp = new PerPeriodo();
                    pp.setPerIderegistro(Integer.valueOf(objects[0].toString()));
                    pp.setPerEstado(objects[1].toString());
                    pp.setPerFecinicial(initDate);
                    pp.setPerFecfinal(endDate);

                    PerPeriodoDTO perPeriodoDTO = new PerPeriodoDTO();

                    copiarPropiedades(perPeriodoDTO, pp);
                    perPeriodoDTOS.add(perPeriodoDTO);
                });
        return perPeriodoDTOS;
    }

    @Override
    public List<PeriodoFacturacionPrestacionForm> getPeriodosApro(Integer maprcIderegistro) {
        List<PeriodoFacturacionPrestacionForm> perPeriodoDTOS = new ArrayList<>();
        List<Map<String, Object>> periodosLiquidacionPrestacionApr = this.manejadorPerPeriodo.getPeriodosLiquidacionPrestacionApr(maprcIderegistro);
        for (Map<String, Object> periodoLiquidacionPrestacionApr : periodosLiquidacionPrestacionApr) {
            PeriodoFacturacionPrestacionForm periodoFacturacionPrestacionForm = new PeriodoFacturacionPrestacionForm();
            periodoFacturacionPrestacionForm.setIdPeriodo((Integer) periodoLiquidacionPrestacionApr.get("per_ideregistro"));
            periodoFacturacionPrestacionForm.setPerFacturacion((Integer) periodoLiquidacionPrestacionApr.get("per_facturacion"));
            periodoFacturacionPrestacionForm.setPerNombreFacturacion((String) periodoLiquidacionPrestacionApr.get("per_nombre_facturacion"));
            periodoFacturacionPrestacionForm.setPerPrestacion((Integer) periodoLiquidacionPrestacionApr.get("per_prestacion"));
            periodoFacturacionPrestacionForm.setPerNombrePrestacion((String) periodoLiquidacionPrestacionApr.get("per_nombre_prestacion"));
            perPeriodoDTOS.add(periodoFacturacionPrestacionForm);
        }
        return perPeriodoDTOS;
    }

}
