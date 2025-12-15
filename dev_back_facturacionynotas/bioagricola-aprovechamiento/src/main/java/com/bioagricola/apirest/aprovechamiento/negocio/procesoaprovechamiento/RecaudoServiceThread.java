package com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento;

import com.bioagricola.apirest.aprovechamiento.negocio.TaskSchedulerService;
import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoRecaudo;
import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodoRecaudo;
import com.bioagricola.apirest.modelo.entidades.aseo.EstadoProcesado;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprDistRecaudoPeriodo;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprSincRecaudoPeriodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorAprrecRecaudo;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

@Service
@EnableAsync
@EnableScheduling
public class RecaudoServiceThread {
    private static final Logger logger = Logger.getLogger(RecaudoServiceThread.class.getName());

    // Constants
    private static final Integer PRG_PROCESO_SINCRONIZACION = 1096;
    private static final Integer EMPRESA_BIO = 317;
    private static final char PROCESO_INACTIVO = 'I';
    private static final int BATCH_SIZE = 10;

    // Services
    private final IManejadorAprSincRecaudoPeriodo iManejadorAprSincRecaudoPeriodo;
    private final IManejadorAprDistRecaudoPeriodo iManejadorAprDistRecaudoPeriodo;
    private final ManejadorAprrecRecaudo manejadorAprrecRecaudo;
    private final TaskSchedulerService taskSchedulerService;
    private final Executor taskExecutor;

    // Task identifier
    private final String taskId = "recaudoTask";

    @Autowired
    public RecaudoServiceThread(
            IManejadorAprSincRecaudoPeriodo iManejadorAprSincRecaudoPeriodo,
            IManejadorAprDistRecaudoPeriodo iManejadorAprDistRecaudoPeriodo,
            ManejadorAprrecRecaudo manejadorAprrecRecaudo,
            TaskSchedulerService taskSchedulerService,
            @Qualifier("taskExecutor") Executor taskExecutor) {
        this.iManejadorAprSincRecaudoPeriodo = iManejadorAprSincRecaudoPeriodo;
        this.iManejadorAprDistRecaudoPeriodo = iManejadorAprDistRecaudoPeriodo;
        this.manejadorAprrecRecaudo = manejadorAprrecRecaudo;
        this.taskSchedulerService = taskSchedulerService;
        this.taskExecutor = taskExecutor;
    }

    // Scheduled tasks
    public void myScheduledTask() {
        executeSincronization(new ArrayList<>());
        iManejadorAprDistRecaudoPeriodo.insertDistinctRecFecpagoFromAprovechamiento();
        executeDistributionCron();
    }

    public String getCronExpression() {
        return taskSchedulerService.getCronExpression(taskId);
    }

    public void updateCronExpression(String newCron) {
        taskSchedulerService.updateCronExpression(taskId, newCron, this::myScheduledTask);
    }

    // Fetching methods
    public List<AprSincPeriodoRecaudo> findAllOrderByRecFecpagoDesc() {
        return iManejadorAprSincRecaudoPeriodo.getAllOrderedByRecFecpagoDesc();
    }

    public List<AprDistPeriodoRecaudo> findAllDistribucion() {
        return iManejadorAprDistRecaudoPeriodo.findAllByOrderByRecFecpagoDesc();
    }

    // Synchronization methods
    public void executeSincronization(List<AprSincPeriodoRecaudo> recaudos) {
        if (!manejadorAprrecRecaudo.validateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION)) {
            logger.info("Proceso de sincronización de recaudo ya en ejecución");
            return;
        }

        try {
            logger.info("Iniciando proceso de sincronización de recaudo");
            manejadorAprrecRecaudo.generateCpr(EMPRESA_BIO, EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION);
            processInBatches();
            logger.info("Proceso de sincronización de recaudo finalizado");
        } finally {
            manejadorAprrecRecaudo.updateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION, PROCESO_INACTIVO);
        }
    }

    private void processInBatches() {

        iManejadorAprSincRecaudoPeriodo.insertAprSincPeriodoRecaudo();
        List<AprSincPeriodoRecaudo> pendientes = iManejadorAprSincRecaudoPeriodo.findByEstadoOrderByRecFecpago(EstadoProcesado.N.toString());

        if (pendientes.isEmpty()) {
            logger.info("No hay registros pendientes de sincronización");
            return;
        }

        Map<Date, List<AprSincPeriodoRecaudo>> agrupados = pendientes.stream()
                .collect(Collectors.groupingBy(AprSincPeriodoRecaudo::getFechaPago));

        logger.info("Procesando " + agrupados.size() + " fechas de pago para sincronización");
    
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        int count = 0;

        for (Map.Entry<Date, List<AprSincPeriodoRecaudo>> entry : agrupados.entrySet()) {
            futures.add(processRecaudoAsync(entry.getValue()));
            count++;

            if (count % BATCH_SIZE == 0 || count == agrupados.size()) {
                CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();//10 terminan
                futures.clear();
                logger.info("Procesados " + count + " de " + agrupados.size() + " fechas de pago");
            }
        }

        logger.info("Sincronización de recaudos completada");
    }

    private CompletableFuture<Void> processRecaudoAsync(List<AprSincPeriodoRecaudo> procesos) {
        return CompletableFuture.runAsync(() -> {
            if (procesos.isEmpty()) {
                return;
            }

            List<Long> ids = procesos.stream().map(AprSincPeriodoRecaudo::getId).collect(Collectors.toList());
            java.sql.Date fechaPago = procesos.get(0).getFechaPago();

            logger.info("Procesando fecha de pago: " + fechaPago);
            System.out.println("std: Procesando fecha de pago: " + fechaPago);

            try {


                iManejadorAprSincRecaudoPeriodo.updateProcesado(EstadoProcesado.P.toString(), ids);
                manejadorAprrecRecaudo.generateSincRecV2(EMPRESA_BIO, fechaPago);
                iManejadorAprSincRecaudoPeriodo.updateProcesado(EstadoProcesado.T.toString(), ids);

                logger.info("Finalizado procesamiento de fecha: " + fechaPago);
                System.out.println("std: Finalizado procesamiento de fecha: " + fechaPago);
            } catch (Exception e) {
                iManejadorAprSincRecaudoPeriodo.updateProcesado(EstadoProcesado.E.toString(), ids);
                logger.error("Error al procesar fecha: " + fechaPago, e);
                System.out.println("std: Error al procesar fecha: " + fechaPago);
            }
        }, taskExecutor);
    }

    // Distribution methods
    private void executeDistributionCron() {
        if (!manejadorAprrecRecaudo.validateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION)) {
            logger.info("Proceso de distribución de recaudo ya en ejecución");
            return;
        }

        try {
            logger.info("Iniciando proceso de distribución de recaudo");
            manejadorAprrecRecaudo.generateCpr(EMPRESA_BIO, EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION);
            executeDistribution();
            logger.info("Proceso de distribución de recaudo finalizado");
        } finally {
            manejadorAprrecRecaudo.updateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION, PROCESO_INACTIVO);
        }
    }

    public void executeDistribution() {
        List<AprDistPeriodoRecaudo> pendientes = iManejadorAprDistRecaudoPeriodo.findByEstadoOrderedNative(EstadoProcesado.N.toString());

        if (pendientes.isEmpty()) {
            logger.info("No hay recaudos pendientes de distribución");
            return;
        }

        logger.info("Procesando " + pendientes.size() + " recaudos para distribución");
        System.out.println("Procesando " + pendientes.size() + " recaudos para distribución");

        processDistributionBatches(pendientes);

        logger.info("Distribución de recaudos completada");
        System.out.println("Distribución de recaudos completada");
    }

    private void processDistributionBatches(List<AprDistPeriodoRecaudo> pendientes) {
        for (int i = 0; i < pendientes.size(); i += BATCH_SIZE) {
            int end = Math.min(i + BATCH_SIZE, pendientes.size());
            List<AprDistPeriodoRecaudo> batch = pendientes.subList(i, end);

            logger.info("Procesando lote de " + batch.size() + " recaudos para distribución");
            System.out.println("Procesando lote de " + batch.size() + " recaudos para distribución");

            CompletableFuture.allOf(batch.stream()
                            .map(this::distributeRecaudoAsync)
                            .toArray(CompletableFuture[]::new))
                    .join();



            logger.info("Lote de distribución completado");
            System.out.println("Lote de distribución completado");
        }
    }
    private CompletableFuture<Void> distributeRecaudoAsync(AprDistPeriodoRecaudo recaudo) {
        return CompletableFuture.runAsync(() -> {
            logger.info("Procesando distribución de recaudo: " + recaudo.getRecFecpago());
            System.out.println("std: Procesando distribución de recaudo: " + recaudo.getRecFecpago());

            try {
                iManejadorAprDistRecaudoPeriodo.updateProcesado(EstadoProcesado.P.toString(), recaudo.getRecFecpago());
                manejadorAprrecRecaudo.distribuirRecaudo(EMPRESA_BIO, recaudo.getRecFecpago());
                iManejadorAprDistRecaudoPeriodo.updateProcesado(EstadoProcesado.T.toString(), recaudo.getRecFecpago());

                logger.info("Finalizada distribución de recaudo: " + recaudo.getRecFecpago());
                System.out.println("std: Finalizada distribución de recaudo: " + recaudo.getRecFecpago());
            } catch (Exception e) {
                logger.error("Error al procesar distribución de recaudo: " + recaudo.getRecFecpago(), e);
                System.out.println("std: Error al procesar distribución de recaudo: " + recaudo.getRecFecpago());

                iManejadorAprDistRecaudoPeriodo.updateProcesado(EstadoProcesado.E.toString(), recaudo.getRecFecpago());
            }
        }, taskExecutor);
    }

    /**
     * Inicia el procesamiento asíncrono de recaudo mensual.
     * Este método ejecuta un proceso en segundo plano y retorna inmediatamente.
     */
    public void procesarRecaudoMensualAsync() {
        CompletableFuture.runAsync(() -> {
            if (!manejadorAprrecRecaudo.validateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION)) {
                logger.info("Proceso de recaudo mensual ya en ejecución");
                return;
            }

            try {
                logger.info("Iniciando proceso de recaudo mensual");
                manejadorAprrecRecaudo.generateCpr(EMPRESA_BIO, EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION);

                List<BigInteger> registroIdsBig = manejadorAprrecRecaudo.obtenerDistinctAprConsIdeRegistr();
                List<Integer> registroIds = registroIdsBig.stream()
                        .map(BigInteger::intValue)
                        .collect(Collectors.toList());

                if (registroIds.isEmpty()) {
                    logger.info("No hay registros para procesar en recaudo mensual");
                    return;
                }

                logger.info("Procesando " + registroIds.size() + " registros para recaudo mensual");
// Procesar en lotes para no saturar el sistema
                processRecaudoMensualInBatches(registroIds);

                logger.info("Proceso de recaudo mensual finalizado exitosamente");
            } catch (Exception e) {
                logger.error("Error al procesar recaudo mensual", e);
            } finally {
                manejadorAprrecRecaudo.updateCpr(EMPRESA_BIO, PRG_PROCESO_SINCRONIZACION, PROCESO_INACTIVO);
            }
        }, taskExecutor);
    }

    /**
     * Procesa los registros de recaudo mensual en lotes
     */
    private void processRecaudoMensualInBatches(List<Integer> registroIds) {
        for (int i = 0; i < registroIds.size(); i += BATCH_SIZE) {
            int end = Math.min(i + BATCH_SIZE, registroIds.size());
            List<Integer> batch = registroIds.subList(i, end);

            logger.info("Procesando lote de " + batch.size() + " registros para recaudo mensual");

             //Procesar cada registro en su propio hilo
            List<CompletableFuture<Void>> futures = batch.stream()
                .map(this::procesarRegistroRecaudoMensualAsync)
                .collect(Collectors.toList());

             //Esperar a que todos terminen antes de continuar con el siguiente lote
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            logger.info("Lote de recaudo mensual completado: " + (i + 1) + " a " + end + " de " + registroIds.size());
        }
    }

    /**
     * Procesa un registro individual de recaudo mensual de forma asíncrona
     */
    private CompletableFuture<Void> procesarRegistroRecaudoMensualAsync(Integer aprConsIdeRegistr) {
        return CompletableFuture.runAsync(() -> {
            try {
                logger.info("Procesando registro ID: " + aprConsIdeRegistr);

                // Ejecutar la función para procesar el recaudo mensual
                manejadorAprrecRecaudo.procesarRecaudoMensual(aprConsIdeRegistr);

                logger.info("Procesamiento completado para registro ID: " + aprConsIdeRegistr);
                System.out.println("std: Procesamiento completado para registro ID: " + aprConsIdeRegistr);
            } catch (Exception e) {
                logger.error("Error al procesar registro ID: " + aprConsIdeRegistr, e);
                System.out.println("std: Error al procesar registro ID: " + e);
            }
        }, taskExecutor);
    }
    private void test (Integer aprConsIdeRegistr){
        try {
            logger.info("Procesando registro ID: " + aprConsIdeRegistr);

            // Ejecutar la función para procesar el recaudo mensual
            manejadorAprrecRecaudo.procesarRecaudoMensual(aprConsIdeRegistr);

            logger.info("Procesamiento completado para registro ID: " + aprConsIdeRegistr);
            System.out.println("std: Procesamiento completado para registro ID: " + aprConsIdeRegistr);
        } catch (Exception e) {
            logger.error("Error al procesar registro ID: " + aprConsIdeRegistr, e);
            System.out.println("std: Error al procesar registro ID: " + e);
        }
    }
}