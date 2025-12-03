package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.TmpActSuscripcionDTO;
import com.bioagricola.hya.entity.TmpActSuscripcion;
import com.bioagricola.hya.service.ActHomologacionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con la tabla intermedia de actualizacion de suscripciones
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ActHomologacionController {

    private final ActHomologacionService actHomologacionService;

    private final AuthenticationFacade autoFacade;

    public ActHomologacionController(ActHomologacionService actHomologacionService, AuthenticationFacade autoFacade) {
        this.actHomologacionService = actHomologacionService;
        this.autoFacade = autoFacade;
    }

    /**
     * Servicio para listar barrios para el formulario
     * @param dsusIderegistro idsuscripcion
     * @return listado de barrios
     */
    @GetMapping("/barrios/suscripcion/{dsusIderegistro}")
    public ResponseEntity<List<Map<String,Object>>> listarBarrios(@PathVariable("dsusIderegistro") Long dsusIderegistro) {
        Integer idempresa = autoFacade.getCredentials().getAuditoria().getIdEmpresa();
        List<Map<String,Object>> barrios= this.actHomologacionService.listarBarrios(dsusIderegistro,idempresa);
        return new ResponseEntity<>(barrios, HttpStatus.OK);
    }

    /**
     * Servicio para listar unidades
     * @return listado de unidades para el formulario
     */
    @GetMapping("/actualizar/suscripcion/unidades")
    public ResponseEntity<Map<String,Object>> listarUnidadesFormulario() {
        Map<String,Object> response = this.actHomologacionService.listarUnidadesFormulario();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para guardar un nuevo registro de actualizacion de suscripcion
     * @param data informacion formulario suscripcion
     * @return registro insertado correctamente
     */
    @PostMapping(value = "/actualizar/suscripcion",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
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
        TmpActSuscripcion response= this.actHomologacionService.guardar(tmpActSuscripcion,images,token);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Servicio para listar registros de actualizacion pendientes
     * @return lista de registros pendientes
     */
    @PostMapping("/actualizar/suscripcion/listar_others/{page}/{size}")
    public ResponseEntity<Page<TmpActSuscripcionDTO>> listar_others(@PathVariable("page") int page, @PathVariable("size") int size, @RequestBody BasicSearchDTO search) {
        Page<TmpActSuscripcionDTO> response= this.actHomologacionService.listarTableOthers(search,page,size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Servicio para listar registros de actualizacion pendientes
     * @return lista de registros pendientes
     */
    @PostMapping("/actualizar/suscripcion/listar_punto/{page}/{size}")
    public ResponseEntity<Page<TmpActSuscripcionDTO>> listar_punto(@PathVariable("page") int page, @PathVariable("size") int size) {
        Page<TmpActSuscripcionDTO> response= this.actHomologacionService.listarTablePunto(page,size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Servicio para listar registros de actualizacion sincronizados por suscripción
     * @return lista de registros sincronizados
     */
    @PostMapping("/actualizar/suscripcion/listar_registros_sincronizados/{id}/{page}/{size}")
    public ResponseEntity<Page<TmpActSuscripcionDTO>> listar_registros_sincronizados(@PathVariable("id") Long id,@PathVariable("page") int page, @PathVariable("size") int size) {
        Page<TmpActSuscripcionDTO> response= this.actHomologacionService.listarRegSyncSuscripcion(id,page,size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para eliminar un registro de actualizacion pendiente
     * @param idTmpDsus id registro
     * @return eliminado correctamente (no-content)
     */
    @PutMapping("/actualizar/suscripcion/eliminar/{idTmpDsus}")
    public ResponseEntity eliminar(@PathVariable("idTmpDsus")Long idTmpDsus) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        this.actHomologacionService.eliminar(idTmpDsus,idUsu);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * Servicio para consultar las imagenes asociadas a una novedad
     * @param actsusIderegistro id de novedad
     * @param token token usuario autenticado
     * @return lista de imagenes
     */
    @GetMapping(value = "/actualizar/suscripcion/imagenes/{actsusIderegistro}")
    public ResponseEntity <List<Map<String,Object>>> consultaImagenes (@PathVariable("actsusIderegistro") Long actsusIderegistro,
                                                                       @RequestHeader("authorization") String token) {
        List<Map<String,Object>> imagenes = this.actHomologacionService.consultaImagenes(actsusIderegistro,token);
        return new ResponseEntity<>(imagenes, HttpStatus.OK);
    }

    /**
     * Metodo para actualizacion suscripcion a partir de registro de solicitud de actualizacion tabla intermedia tmp_actsus_actsuscripcion
     * @param idTmpDsus id de registro actualizacion aprobado
     * @return registro actualizacion aprobado y aplicado
     */
    @PostMapping(value = "/actualizar/suscripcion/aprobar/{idTmpDsus}")
    public ResponseEntity<TmpActSuscripcion> aprobarActualizacion(@PathVariable("idTmpDsus") Long idTmpDsus) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        TmpActSuscripcion response= this.actHomologacionService.aprobarActualizacion(idTmpDsus,idUsu);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    
    /**
     * Metodo para actualizacion suscripcion a partir de registro de solicitud de actualizacion tabla intermedia tmp_actsus_actsuscripcion
     * @param data Object actualizacion actualizado
     * @return registro actualizacion actualizado
     */
    @PostMapping(value = "/actualizar/suscripcion/actualizar", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<TmpActSuscripcion> actualizarActualizacion(@RequestBody TmpActSuscripcionDTO tmpActSuscripcion,@RequestHeader("authorization") String token) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        
        TmpActSuscripcion response= this.actHomologacionService.actualizarActualizacion(tmpActSuscripcion);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
