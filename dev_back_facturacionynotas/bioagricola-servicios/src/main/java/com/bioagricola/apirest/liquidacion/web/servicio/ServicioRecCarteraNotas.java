package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioRecCarteraNotas;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.NegocioNotasResponseDTO;
import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.entidades.ImportacionNegDetalle;
import com.bioagricola.apirest.modelo.entidades.ImportacionNegEMSA;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("recaudo")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ServicioRecCarteraNotas {

    private final NegocioRecCarteraNotas negocioRecCarteraNotas;

    public ServicioRecCarteraNotas(NegocioRecCarteraNotas negocioRecCarteraNotas) {
        this.negocioRecCarteraNotas = negocioRecCarteraNotas;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            List<NegocioNotasResponseDTO> upload = this.negocioRecCarteraNotas.upload(file);

            if (upload.stream().anyMatch(entry -> entry.getCode() < 0))
                return new ResponseEntity<>(upload, HttpStatus.INTERNAL_SERVER_ERROR);
            else
                return ResponseEntity.ok(upload);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage() != null ? e.getMessage() : "Error en el archivo %s", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/process")
    public Map<String, List<ImportacionNegDetalle>> process(@Valid @RequestBody ImportacionNegativosDTO dto) {
        try {
            return Collections.singletonMap("Ok", this.negocioRecCarteraNotas.process(dto));
        } catch (Exception e) {
            return Collections.singletonMap("Fallo " + e.getCause().getCause().getLocalizedMessage(), Collections.emptyList());
        }
    }

    @GetMapping("imports")
    public Page<ImportacionNegEMSA> getAllImports(Pageable pageable) {
        return this.negocioRecCarteraNotas.getAllImports(pageable);
    }

    @PutMapping("detail/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (this.negocioRecCarteraNotas.delete(id).getId() != null) {
                return ResponseEntity.ok("Se elimino el id " + id);
            } else {
                return new ResponseEntity<>("Fallo al Eliminar el id " + id, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Fallo: " + e.getCause().getCause().getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> hardDelete(@PathVariable Long id) {
        try {
            this.negocioRecCarteraNotas.hardDelete(id);
            return ResponseEntity.ok("Se elimino el id " + id);
        } catch (Exception e) {
            return new ResponseEntity<>("Fallo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/note")
    public ResponseEntity<?> applyNote(@Valid @RequestBody ApplyNotesDTO applyNotesDTO) {
        try {
            this.negocioRecCarteraNotas.applyNote(applyNotesDTO);
            return ResponseEntity.ok(new ApplyNotesResponseDTO("00", "OK"));
        } catch (Exception e) {
            return new ResponseEntity<>(new ApplyNotesResponseDTO("02", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/search/detail")
    public Page<ImportacionNegDetalle> filterDetail(@Valid @RequestBody FiltroImportacionNegativosDtllDTO dto, Pageable pageable) {
        return negocioRecCarteraNotas.filterDetail(dto, pageable);
    }

    @PostMapping("/applied-notes")
    public ResponseEntity<?> getAllByStateAndAppliedDateProcess(@Valid @RequestBody NegocioRecCarteraNotasDTO negocioRecCarteraNotasDTO) {
        try {
            List<NoteResponseDTO> loaded = this.negocioRecCarteraNotas.getAllByStateAndAppliedDateProcess(negocioRecCarteraNotasDTO);

            if (!loaded.isEmpty())
                return ResponseEntity.ok(loaded);

            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
