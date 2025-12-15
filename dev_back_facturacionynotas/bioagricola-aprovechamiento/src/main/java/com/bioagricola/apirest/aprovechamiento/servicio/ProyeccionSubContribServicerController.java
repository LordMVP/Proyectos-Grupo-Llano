package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.entidades.aseo.AprProyeccionSubContrib;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.ProyeccionSubContribService;
import com.gell.estandar.dto.AuditoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proyeccion-sub-contrib")
public class ProyeccionSubContribServicerController {

    private final ProyeccionSubContribService proyeccionService;

    @Autowired
    public ProyeccionSubContribServicerController(ProyeccionSubContribService proyeccionService) {
        this.proyeccionService = proyeccionService;
    }


    @GetMapping("/listar")
    public ResponseEntity<List<AprProyeccionSubContrib>> listar() {
        return ResponseEntity.ok(proyeccionService.listarTodos());
    }
    @GetMapping("/obtener_estratos")
    public ResponseEntity<List<Map<String, Object>>> obtenerEstratos() {
        return ResponseEntity.ok(proyeccionService.obtenerEstratos());
    }
    @GetMapping("/listar/anio/{anio}")
    public ResponseEntity<List<AprProyeccionSubContrib>> listarPorAnio(@PathVariable Integer anio) {
        return ResponseEntity.ok(proyeccionService.listarPorAnio(anio));
    }

    @GetMapping("/listar/actuales")
    public ResponseEntity<List<AprProyeccionSubContrib>> listarActuales() {
        return ResponseEntity.ok(proyeccionService.listarActuales());
    }

    @PostMapping("/crear")
    public ResponseEntity<AprProyeccionSubContrib> crear(@RequestBody AprProyeccionSubContrib proyeccion) {
        AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
        Integer usuarioId = auditoriaDTO.getIdUsuario();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(proyeccionService.crear(proyeccion, usuarioId.toString()));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<AprProyeccionSubContrib> actualizar(
            @PathVariable Long id,
            @RequestBody AprProyeccionSubContrib proyeccion) {
        AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
        Integer usuarioId = auditoriaDTO.getIdUsuario();
        return ResponseEntity.ok(proyeccionService.actualizar(id, proyeccion, usuarioId.toString()));
    }

    @PutMapping("/actualizar/actual/{id}")
    public ResponseEntity<AprProyeccionSubContrib> actualizarActual(
            @PathVariable Long id) {
        AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
        Integer usuarioId = auditoriaDTO.getIdUsuario();
        return ResponseEntity.ok(proyeccionService.actualizar(id, usuarioId.toString()));
    }

    @GetMapping("/usuario/actual")
    public ResponseEntity<Map<String, Object>> getUsuarioActual() {
        Map<String, Object> response = new HashMap<>();
        // Dummy implementation to always allow creation
        response.put("usuario", "sistema");
        response.put("permisos", "editar_proyecciones");
        return ResponseEntity.ok(response);
    }
}