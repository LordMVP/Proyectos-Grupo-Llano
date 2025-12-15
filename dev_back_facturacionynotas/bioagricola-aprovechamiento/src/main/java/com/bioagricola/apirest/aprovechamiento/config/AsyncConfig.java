package com.bioagricola.apirest.aprovechamiento.config;

import java.util.concurrent.Executor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(8); // Número mínimo de hilos activos
        executor.setMaxPoolSize(15); // Máximo de hilos activos simultáneamente
        executor.setQueueCapacity(200); // Capacidad de la cola de espera
        executor.setThreadNamePrefix("AsyncExecutor-"); // Prefijo para identificar los hilos
        executor.setRejectedExecutionHandler(new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}