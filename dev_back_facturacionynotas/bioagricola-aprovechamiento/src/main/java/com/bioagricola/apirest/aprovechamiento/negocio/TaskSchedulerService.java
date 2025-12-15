package com.bioagricola.apirest.aprovechamiento.negocio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
public class TaskSchedulerService {
    private final TaskScheduler taskScheduler;
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    private final Map<String, String> cronExpressions = new HashMap<>();

    @Autowired
    public TaskSchedulerService(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    // Método para programar una tarea con una expresión cron
    public void scheduleTask(String taskId, Runnable task, String cronExpression) {
        // Si la tarea ya está programada, la cancelamos
        cancelTask(taskId);

        // Programamos la nueva tarea
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(task, new CronTrigger(cronExpression));
        scheduledTasks.put(taskId, scheduledTask);
        cronExpressions.put(taskId, cronExpression); // Guardamos la cron expresión
    }

    // Método para obtener la cron expresión de una tarea
    public String getCronExpression(String taskId) {
        return cronExpressions.get(taskId);
    }

    // Método para actualizar la cron expresión de una tarea
    public void updateCronExpression(String taskId, String newCronExpression, Runnable task) {
        // Cancelamos la tarea actual
        cancelTask(taskId);

        // Actualizamos la expresión
        cronExpressions.put(taskId, newCronExpression);

        // Programamos la tarea con la nueva cron expresión
        scheduleTask(taskId, task, newCronExpression);
    }

    // Método para cancelar una tarea programada por su ID
    public void cancelTask(String taskId) {
        if (scheduledTasks.containsKey(taskId)) {
            scheduledTasks.get(taskId).cancel(false);
            scheduledTasks.remove(taskId);
            cronExpressions.remove(taskId);
        }
    }
}