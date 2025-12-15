package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.ILiquidacion;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion.HandlerGestionProceso;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.dtos.ProgresoLiqAprovDTO;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConceptoAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrproceso;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPrlLiquidacionapro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.ERROR_CONCEPTOS;
import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.TIPO_APROVECHAMIENTO;
import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.TIPO_INCENTIVO_APROVECHAMIENTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoConsolidadoDTO;
import com.bioagricola.apirest.modelo.projections.PeriodoFactProjection;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class NegocioLiquidacion implements ILiquidacion {

    private static Logger logger = Logger.getLogger(NegocioLiquidacion.class.getName());
    @Autowired
    private ManejadorCprCtrproceso manejadorCprCtrproceso;

    @Autowired
    private ManejadorConConceptoAprovechamiento manejadorConConceptoAprovechamiento;

    @Autowired
    private ManejadorPrlLiquidacionapro manejadorPrlLiquidacionapro;

    @Autowired
    private NegocioPrunPrgunidad negocioPrunPrgunidad;

    @Autowired
    private HandlerGestionProceso handlerGestionProceso;

    @Override
    public CompletableFuture<Long> iniciarLiquidacion(IniciarProcesoDTO iniciarProcesoDTO) throws Exception {
        iniciarProcesoDTO.setIdEmpresa(JwtUtil.auditoriaDTO.getIdEmpresa());
        iniciarProcesoDTO.setIdUsuario(JwtUtil.auditoriaDTO.getIdUsuario());

        //this.validarPermisos(iniciarProcesoDTO);
        //this.validarParam();
        this.validarEjecucionProceso(iniciarProcesoDTO);
        return this.iniciarProceso(iniciarProcesoDTO);
    }

    public void validarEjecucionProceso(IniciarProcesoDTO iniciarProcesoDTO) throws NegocioException {
        Integer cantidadEjecutandose = this.manejadorPrlLiquidacionapro.consultarLiquidacionPorEstado("E");
        Integer cantidadPorLiquidar = this.manejadorPrlLiquidacionapro.consultarLiquidacionPorEstado("P");
        if (cantidadEjecutandose == 0 && cantidadPorLiquidar == 0) {
            return;
        } else if (cantidadEjecutandose > 0) {
            throw new NegocioException("Hay un proceso en ejecución", 4);
        } else if (cantidadPorLiquidar > 0) {
            throw new NegocioException("Hay un proceso pendiente por aprobar", 4);
        }
    }

    @Override
    public ProgresoLiqAprovDTO progresoLiquidacion(Integer idPrograma) {
        ProgresoLiqAprovDTO respuesta = new ProgresoLiqAprovDTO();

        Integer cantidadEjecutandose = this.manejadorPrlLiquidacionapro.consultarLiquidacionPorEstado("E");
        Integer cantidadPorLiquidar = this.manejadorPrlLiquidacionapro.consultarLiquidacionPorEstado("P");
        if (cantidadEjecutandose > 0) {
            respuesta.setEstadoProceso("1");
            getCantidadRegistros(idPrograma, respuesta);
        } else if (cantidadPorLiquidar > 0) {
            respuesta.setEstadoProceso("2");
            getCantidadRegistros(idPrograma, respuesta);
        } else {
            respuesta.setEstadoProceso("0");
        }
        return respuesta;
    }

    private void getCantidadRegistros(Integer idPrograma, ProgresoLiqAprovDTO respuesta) {
        List<Object> progresoLiquidacion = this.manejadorCprCtrproceso.getProcesoEjecucionAprovechamiento(idPrograma, JwtUtil.auditoriaDTO.getIdEmpresa());
        if (progresoLiquidacion != null && !progresoLiquidacion.isEmpty()) {
            Object[] respuestaProgreso = (Object[]) progresoLiquidacion.get(0);
            respuesta.setCantidadRegistros(respuestaProgreso[2] != null ? Byte.parseByte(respuestaProgreso[2].toString()) : 0);
        }
    }

    private void validarPermisos(IniciarProcesoDTO iniciarProcesoDTO) throws Exception {
        boolean hasPerm = this.negocioPrunPrgunidad.hasPermission(iniciarProcesoDTO.getPrograma());
        if (!hasPerm) {
            throw new NegocioException("No cuenta con permisos para acceder a la liquidación", 4);
        }
    }

    public CompletableFuture<Long> iniciarProceso(IniciarProcesoDTO iniciarProcesoDTO) {
        CompletableFuture<Long> proceso_apro = null;
        try {
            proceso_apro = this.handlerGestionProceso.lanzarProcesos(iniciarProcesoDTO);
        } catch (Exception ex) {
            logger.log(Level.SEVERE, ex.getMessage());
        }
        return proceso_apro;
    }

    private void validarParam() throws Exception {
        List<Object> conConceptos = this.manejadorConConceptoAprovechamiento.validarParam(TIPO_APROVECHAMIENTO, TIPO_INCENTIVO_APROVECHAMIENTO);

        if (conConceptos != null && conConceptos.size() > 0) {
            throw new NegocioException(ERROR_CONCEPTOS);
        }
    }

    @Override
    public void aprobarProceso() {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        try {
            String[] estados = {"P"};
            //Busca los periodos que estan pendientes por aprobar
            List<Object[]> periodosConsolidados = this.manejadorPrlLiquidacionapro.consultarPeriodosConsolidado(estados);
            if (periodosConsolidados.isEmpty()) {
                throw new NegocioException("No hay periodos para aprobar en este momento.");
            } else {
                for (Object[] periodoCon : periodosConsolidados) {
                    this.manejadorPrlLiquidacionapro.aprobarPeriodoConsolidado( Long.parseLong(periodoCon[0].toString()), new Date(System.currentTimeMillis()));
                    this.handlerGestionProceso.gestionarProceso( Long.parseLong(periodoCon[2].toString()), "APROBAR");
                }
            }
        } catch (Exception e) {
            logger.info(e.getMessage());
        }
    }

    @Override
    public void descartarProceso() {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        try {
            String[] estados = {"P"};
            //Busca los periodos que estan pendientes por aprobar
            List<Object[]> periodosConsolidados = this.manejadorPrlLiquidacionapro.consultarPeriodosConsolidado(estados);
            if (periodosConsolidados.isEmpty()) {
                throw new NegocioException("No hay periodos para descartar en este momento.");
            } else {
                for (Object[] periodoCon : periodosConsolidados) {
                    this.manejadorPrlLiquidacionapro.descartarPeriodoConsolidado(Long.parseLong(periodoCon[0].toString()));
                    this.handlerGestionProceso.gestionarProceso( Long.parseLong(periodoCon[2].toString()), "DESCARTAR");
                }
            }
        } catch (Exception e) {
            logger.info(e.getMessage());
        }
    }

}
