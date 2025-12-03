package com.bioagricola.homologaciones.service.business;

import com.bioagricola.aforos.entity.dto.ProcesoInfoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.homologaciones.dto.response.ProcesoValidacionResponse;

import lombok.extern.log4j.Log4j2;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
public class ProcesoValidacionService {
    
    @Autowired
    private GenericSQLRepository genericSQLRepository;
    
    /**
     * Valida si un proceso está inactivo e incluye información del proceso activo si existe
     */
    public ProcesoValidacionResponse validarProcesoInactivo(Integer programaId, Integer empresaId, Long pUsuarioId) {
        try {
            // Buscar proceso activo con información completa
            String sql = "SELECT cpr_ideregistro, cpr_fecinicio, usu_ideregistro, cpr_idehilo, cpr_fecfinal, cpr_canregistro " +
                    "FROM cpr_ctrproceso " +
                    "WHERE prg_ideregistro = " + programaId + " AND emp_ideregistro = " + empresaId + " AND cpr_estado = 'A' AND usu_ideregistro = " + pUsuarioId + " " +
                    "ORDER BY cpr_fecinicio DESC LIMIT 1";

            Optional<List> resultado = genericSQLRepository.executeSelect(sql);
            if (resultado.isPresent() && !resultado.get().isEmpty()) {
                // Hay proceso activo
                Object[] row = (Object[]) resultado.get().get(0);
                Long procesoId = ((Number) row[0]).longValue();
                Timestamp fechaInicio = (Timestamp) row[1];
                Timestamp fechaFinal = (Timestamp) row[4];
                Long usuarioId = ((Number) row[2]).longValue();
                Long hiloId = ((Number) row[3]).longValue();
                Long cantidad = ((Number) row[5]).longValue();

                Duration tiempoTranscurrido = Duration.between(fechaInicio.toLocalDateTime(), LocalDateTime.now());

                ProcesoInfoDTO procesoInfo = new ProcesoInfoDTO(procesoId, fechaInicio, usuarioId, hiloId,fechaFinal, tiempoTranscurrido,cantidad);
                
                return new ProcesoValidacionResponse(false, procesoInfo,
                    "Existe un proceso activo");
            }

            // No hay procesos activos
            return new ProcesoValidacionResponse(true, null,
                "No hay procesos activos para el programa y empresa indicados");

        } catch (Exception e) {
            log.error("Error al validar estado del proceso", e);
            return new ProcesoValidacionResponse("Error al validar el estado del proceso: " + e.getMessage());
        }
    }

    /**
     * Inserta un nuevo proceso de control
     */
    public Long insertarProceso(Integer programaId, Integer empresaId, Long accionId, Long usuarioId, Long hiloId) {
        try {
            //Long hiloId = Thread.currentThread().getId();
            Timestamp fechaInicio = Timestamp.valueOf(LocalDateTime.now());

            String sql = "INSERT INTO cpr_ctrproceso (cpr_estado, cpr_fecinicio, prg_ideregistro, " +
                        "acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro) " +
                        "VALUES ('A', '" + fechaInicio + "', " + programaId + ", " + accionId + ", " +
                        empresaId + ", " + hiloId + ", " + usuarioId + ") RETURNING cpr_ideregistro";
            
            Optional<List> resultado = genericSQLRepository.executeSelect(sql);
            
            if (resultado.isPresent() && !resultado.get().isEmpty()) {
                BigInteger procesoId = (BigInteger) resultado.get().get(0);
                /*log.info("Proceso iniciado - ID: {}, Programa: {}, Empresa: {}, Usuario: {}", 
                         procesoId, programaId, empresaId, usuarioId);*/
                
                return procesoId.longValue();
            }
            
            throw new RuntimeException("No se pudo crear el proceso");
            
        } catch (Exception e) {
            log.error("Error al insertar proceso", e);
            throw new RuntimeException("Error al insertar proceso: " + e.getMessage());
        }
    }

    /**
     * Actualiza el estado de un proceso
     */
    public void actualizarEstadoProceso(Long procesoId, String estado, Long cantidadRegistros ) {
        try {
            Timestamp fechaFinal = Timestamp.valueOf(LocalDateTime.now());
            String sql;
            Integer filasAfectadas;
            
            if (cantidadRegistros != null) {
                sql = "UPDATE cpr_ctrproceso SET cpr_estado = '" + estado + "', cpr_fecfinal = '" + fechaFinal + 
                     "', cpr_canregistro = " + cantidadRegistros + " WHERE cpr_ideregistro = " + procesoId;
            } else {
                sql = "UPDATE cpr_ctrproceso SET cpr_estado = '" + estado + "', cpr_fecfinal = '" + fechaFinal + 
                     "' WHERE cpr_ideregistro = " + procesoId;
            }
            
            filasAfectadas = genericSQLRepository.executeUpdateWithReturning(sql);
            
            if (filasAfectadas > 0) {
                String estadoDescripcion = getEstadoDescripcion(estado);
                /*log.info("Proceso {} actualizado a estado: {} ({}).", 
                         procesoId, estado, estadoDescripcion);*/                
            } else {
                log.warn("No se pudo actualizar el proceso con ID: {}", procesoId);
            }
            
        } catch (Exception e) {
            log.error("Error al actualizar estado del proceso {}", procesoId, e);
            throw new RuntimeException("Error al actualizar estado del proceso: " + e.getMessage());
        }
    }

    private String getEstadoDescripcion(String estado) {
        switch (estado) {
            case "A": return "Activo";
            case "I": return "Inactivo/Completado";
            case "E": return "Error";
            default: return "Desconocido";
        }
    }  
}