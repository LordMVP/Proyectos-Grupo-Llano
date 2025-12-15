package com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento;

import com.bioagricola.apirest.aprovechamiento.negocio.TaskSchedulerService;
import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoFacturacion;
import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodosFacturacion;
import com.bioagricola.apirest.modelo.entidades.aseo.EstadoProcesado;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprDistFacturacionPeriodo;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprDistSubsidiosContribuciones;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprSincFacturacionPeriodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorAprrecRecaudo;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
@EnableAsync
@EnableScheduling
public class FacturacionServiceThread {
    private static final Logger logger = Logger.getLogger(FacturacionServiceThread.class.getName());
    private static final Integer PRG_PROCESO_SINCRONIZACION = 1096;
    private static final Integer EMPRESA_BIO = 317;
    private static final char PROCESO_INACTIVO = 'I';
    private static final String TASK_ID = "facturacionTask";

    private final ManejadorAprrecRecaudo manejadorAprrecRecaudo;
    private final IManejadorAprDistFacturacionPeriodo iManejadorAprDistFacturacionPeriodo;
    private final IManejadorAprDistSubsidiosContribuciones iManejadorAprDistSubsidiosContribuciones;
    private final IManejadorAprSincFacturacionPeriodo iManejadorAprSincFacturacionPeriodo;
    private final TaskSchedulerService taskSchedulerService;
    private final Executor taskExecutor;

    @Autowired
    public FacturacionServiceThread(ManejadorAprrecRecaudo manejadorAprrecRecaudo,
                                    IManejadorAprDistFacturacionPeriodo iManejadorAprDistFacturacionPeriodo,
                                    IManejadorAprDistSubsidiosContribuciones iManejadorAprDistSubsidiosContribuciones,
                                    IManejadorAprSincFacturacionPeriodo iManejadorAprSincFacturacionPeriodo,
                                    TaskSchedulerService taskSchedulerService,
                                    @Qualifier("taskExecutor") Executor executor) {
        this.manejadorAprrecRecaudo = manejadorAprrecRecaudo;
        this.iManejadorAprDistFacturacionPeriodo = iManejadorAprDistFacturacionPeriodo;
        this.iManejadorAprDistSubsidiosContribuciones = iManejadorAprDistSubsidiosContribuciones;
        this.iManejadorAprSincFacturacionPeriodo = iManejadorAprSincFacturacionPeriodo;
        this.taskSchedulerService = taskSchedulerService;
        this.taskExecutor = executor;
    }

    public void myScheduledTask() {
        executeSincronization();
        executeDistribution();
    }

    public String getCronExpression() {
        return taskSchedulerService.getCronExpression(TASK_ID);
    }

    public void updateCronExpression(String newCron) {
        taskSchedulerService.updateCronExpression(TASK_ID, newCron, this::myScheduledTask);
    }

    public List<AprSincPeriodosFacturacion> findAllSincronizacion() {
        return iManejadorAprSincFacturacionPeriodo.findAllByOrderByPerIderegistro();
    }

    public List<AprDistPeriodoFacturacion> findAllDistribucion() {
        return iManejadorAprDistFacturacionPeriodo.findAllByOrderByPerFacturacionDesc();
    }

    public void executeSincronization() {
        if (!manejadorAprrecRecaudo.validateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION)) {
            logger.info("Proceso de sincronización ya en ejecución");
            return;
        }
        try {
            manejadorAprrecRecaudo.generateCpr(EMPRESA_BIO, EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION);
            logger.info("Insertando registros pendientes de sincronización...");
            manejadorAprrecRecaudo.insertPendingSyncRecords(EMPRESA_BIO);
            logger.info("Registros pendientes de sincronización insertados correctamente.");

            int currentPage = 0;
            while (true) {
                Page<AprSincPeriodosFacturacion> procesosPage =
                    iManejadorAprSincFacturacionPeriodo.findAllByEstadoProcesado(EstadoProcesado.N, PageRequest.of(currentPage, 10));
                List<AprSincPeriodosFacturacion> procesos = procesosPage.getContent();
                if (procesos.isEmpty()) {
                    logger.info("No hay más procesos pendientes.");
                    break;
                }
                processSyncBatch(procesos);
                currentPage++;
            }
        } finally {
            manejadorAprrecRecaudo.updateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION, PROCESO_INACTIVO);
        }
    }

    public void executeDistribution() {
        if (!manejadorAprrecRecaudo.validateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION)) {
            logger.info("Proceso de distribución ya en ejecución");
            return;
        }
        try {
            manejadorAprrecRecaudo.generateCpr(EMPRESA_BIO, EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION);
            manejadorAprrecRecaudo.insertPendingDistributionRecords();
            logger.info("Registros pendientes de distribución insertados correctamente.");

            int currentPage = 0;
            while (true) {
                Page<AprDistPeriodoFacturacion> procesosPage =
                    iManejadorAprDistFacturacionPeriodo.findAllByEstado(EstadoProcesado.N, PageRequest.of(currentPage, 10));
                List<AprDistPeriodoFacturacion> procesos = procesosPage.getContent();
                if (procesos.isEmpty()) {
                    logger.info("No hay más procesos pendientes.");
                    break;
                }
                processDistributionBatch(procesos);
                currentPage++;
            }
        } finally {
            manejadorAprrecRecaudo.updateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION, PROCESO_INACTIVO);
        }
    }

    private void processSyncBatch(List<AprSincPeriodosFacturacion> batch) {
        logger.info("Procesando lote de " + batch.size() + " registros de sincronización.");
        CompletableFuture.allOf(batch.stream()
                .map(this::processFacturacionAsync2)
                .toArray(CompletableFuture[]::new))
                .join();
        logger.info("Lote de sincronización completado.");
    }

    private void processDistributionBatch(List<AprDistPeriodoFacturacion> batch) {
        logger.info("Procesando lote de " + batch.size() + " registros de distribución.");
        CompletableFuture.allOf(batch.stream()
                .map(item -> processFacturacionAsync(item.getPerFacturacion()))
                .toArray(CompletableFuture[]::new))
                .join();
        logger.info("Lote de distribución completado.");
    }

    public CompletableFuture<Void> processFacturacionAsync2(AprSincPeriodosFacturacion item) {
        return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Procesando ID: " + item);
                iManejadorAprSincFacturacionPeriodo.updateProcesado(EstadoProcesado.P.toString(), item.getPerIderegistro());
                manejadorAprrecRecaudo.generateSincFaV3(EMPRESA_BIO, item.getPerIderegistro());
                iManejadorAprSincFacturacionPeriodo.updateProcesado(EstadoProcesado.T.toString(), item.getPerIderegistro());
                logger.info("Finalizado ID: " + item);
            } catch (Exception e) {
                iManejadorAprSincFacturacionPeriodo.updateProcesado(EstadoProcesado.E.toString(), item.getPerIderegistro());
                logger.error("Error al procesar ID: " + item, e);
            }
        }, taskExecutor);
    }

    public CompletableFuture<Void> processFacturacionAsync(int id) {
        return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Procesando ID: " + id);
                iManejadorAprDistFacturacionPeriodo.updateProcesado(EstadoProcesado.P.toString(), id);
                iManejadorAprDistSubsidiosContribuciones.procesarSubsidiosPeriodoSimple(id);
                manejadorAprrecRecaudo.generateMarcacionDistribucionFacturacion(EMPRESA_BIO, id);
                iManejadorAprDistFacturacionPeriodo.updateProcesado(EstadoProcesado.T.toString(), id);
                logger.info("Finalizado ID: " + id);
            } catch (Exception e) {
                logger.error("Error al procesar ID: " + id, e);
                iManejadorAprDistFacturacionPeriodo.updateProcesado(EstadoProcesado.E.toString(), id);
            }
        }, taskExecutor);
    }

    public void test(AprSincPeriodosFacturacion item) {
        try {
            logger.info("Procesando ID: " + item);
            iManejadorAprSincFacturacionPeriodo.updateProcesado(EstadoProcesado.P.toString(), item.getPerIderegistro());
            manejadorAprrecRecaudo.generateSincFaV3(EMPRESA_BIO, item.getPerIderegistro());
            iManejadorAprSincFacturacionPeriodo.updateProcesado(EstadoProcesado.T.toString(), item.getPerIderegistro());
            logger.info("Finalizado ID: " + item);
        } catch (Exception e) {
            iManejadorAprSincFacturacionPeriodo.updateProcesado(EstadoProcesado.E.toString(), item.getPerIderegistro());
            logger.error("Error al procesar ID: " + item, e);
        }
    }
}