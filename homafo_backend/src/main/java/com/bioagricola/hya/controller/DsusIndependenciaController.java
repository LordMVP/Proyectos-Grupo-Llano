package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.hya.entity.TmpActSuscripcion;
import com.bioagricola.hya.service.DsusIndependenciaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

/**
 * Clase que almacena los endpoints de los servicios relacionados con el registro de independencia
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api/suscripcion/independencia")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DsusIndependenciaController {

    private final DsusIndependenciaService dsusIndependenciaService;

    private final AuthenticationFacade autoFacade;

    public DsusIndependenciaController(DsusIndependenciaService dsusIndependenciaService, AuthenticationFacade autoFacade) {
        this.dsusIndependenciaService = dsusIndependenciaService;
        this.autoFacade = autoFacade;
    }

    /**
     * Servicio para guardar un nuevo registro de independencia
     * @param data info formulario suscripcion
     * @return registro insertado correctamente
     */
    @PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<TmpActSuscripcion> guardar(@RequestPart("images") List<MultipartFile> images,
                                                     @Valid @RequestPart("data") String data,
                                                     @RequestHeader("authorization") String token) {
        TmpActSuscripcion tmpActSuscripcion;
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            tmpActSuscripcion = mapper.readValue(data, TmpActSuscripcion.class);
        }catch (Exception e){
            throw new RuntimeException("El json no tiene la estructura adecuada. "+ e.getMessage());
        }
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        tmpActSuscripcion.setUsuIderegistro(idUsu.longValue());
        TmpActSuscripcion response= this.dsusIndependenciaService.guardar(tmpActSuscripcion,images,token);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
