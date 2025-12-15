package com.bioagricola.aforos.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.entity.dto.LiafocoDTO;
import com.bioagricola.aforos.service.impl.LiafocoServiceImpl;

@RestController
@RequestMapping("/api/liafoco")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LiafocoController {

    private static final Logger log = LoggerFactory.getLogger(LiafocoController.class);

    @Autowired
    private LiafocoServiceImpl liafocoService;

    /**
     * Obtener liquidaciones de conceptos adicionales por hafo_ideregistro
     * GET /api/liafoco/{hafoId}
     */
    @GetMapping("/{hafoId}")
    public ResponseEntity<Map<String, Object>> obtenerLiquidacionesPorHafo(@PathVariable Integer hafoId) {
        try {
            log.info("Obteniendo liquidaciones para hafo_ideregistro: {}", hafoId);

            List<LiafocoDTO> liquidaciones = liafocoService.obtenerLiquidacionesPorHafo(hafoId);

            Map<String, Object> response = new HashMap<>();

            if (liquidaciones == null || liquidaciones.isEmpty()) {
                response.put("mensaje", "No hay datos disponibles para este aforo");
                response.put("data", null);
                return ResponseEntity.ok(response);
            }

            response.put("mensaje", "Datos encontrados");
            response.put("data", liquidaciones);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error al obtener liquidaciones por hafo: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Error al obtener los datos");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Cambiar el estado de cobro de una liquidación
     * PUT /api/liafoco/{liafocoId}/cambiar-estado-cobro
     */
    @PutMapping("/{liafocoId}/cambiar-estado-cobro")
    public ResponseEntity<Map<String, Object>> cambiarEstadoCobro(
            @PathVariable Integer liafocoId,
            @RequestBody Map<String, Boolean> request) {
        try {
            log.info("Cambiando estado de cobro para liquidación ID: {}", liafocoId);

            Boolean nuevoEstado = request.get("cobro");

            if (nuevoEstado == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("mensaje", "El campo 'cobro' es requerido");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            boolean actualizado = liafocoService.cambiarEstadoCobro(liafocoId, nuevoEstado);

            Map<String, Object> response = new HashMap<>();

            if (!actualizado) {
                response.put("mensaje", "No se encontró la liquidación con ID: " + liafocoId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("mensaje", "Estado de cobro actualizado exitosamente");
            response.put("cobro", nuevoEstado);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error al cambiar estado de cobro: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Error al actualizar el estado de cobro");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

