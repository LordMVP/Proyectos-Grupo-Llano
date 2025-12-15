package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.dto.CrearGiroMunicipioDTO;
import com.bioagricola.apirest.aprovechamiento.dto.EditarGiroMunicipioDTO;
import com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento.GirosMunicipioService;
import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.entidades.aseo.AprGirosMunicipio;
import com.gell.estandar.dto.AuditoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/giros-municipio")
public class GirosMunicipioServiceController {

    private final GirosMunicipioService girosMunicipioService;

    @Autowired
    public GirosMunicipioServiceController(GirosMunicipioService girosMunicipioService) {
        this.girosMunicipioService = girosMunicipioService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AprGirosMunicipio>> listar() {
        List<AprGirosMunicipio> giros = girosMunicipioService.listarTodos();
        return ResponseEntity.ok(giros);
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<AprGirosMunicipio> obtenerPorId(@PathVariable Integer id) {
        Optional<AprGirosMunicipio> giro = girosMunicipioService.obtenerPorId(id);
        
        if (giro.isPresent()) {
            return ResponseEntity.ok(giro.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@Valid @RequestBody CrearGiroMunicipioDTO dto) {
        try {
            AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
            String usuario = auditoriaDTO != null ? auditoriaDTO.getIdUsuario().toString() : "sistema";
            
            AprGirosMunicipio giroCreado = girosMunicipioService.crear(dto, usuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Giro municipal creado exitosamente");
            response.put("giro", giroCreado);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al crear el giro municipal");
            errorResponse.put("mensaje", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, 
                                   @Valid @RequestBody EditarGiroMunicipioDTO dto) {
        try {
            AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
            String usuario = auditoriaDTO != null ? auditoriaDTO.getIdUsuario().toString() : "sistema";
            
            AprGirosMunicipio giroActualizado = girosMunicipioService.editar(id, dto, usuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Giro municipal actualizado exitosamente");
            response.put("giro", giroActualizado);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al actualizar el giro municipal");
            errorResponse.put("mensaje", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor");
            errorResponse.put("mensaje", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            girosMunicipioService.eliminar(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Giro municipal eliminado exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al eliminar el giro municipal");
            errorResponse.put("mensaje", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor");
            errorResponse.put("mensaje", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/usuario/actual")
    public ResponseEntity<Map<String, Object>> getUsuarioActual() {
        Map<String, Object> response = new HashMap<>();
        response.put("usuario", "sistema");
        response.put("permisos", "editar_giros_municipio");
        return ResponseEntity.ok(response);
    }
}
