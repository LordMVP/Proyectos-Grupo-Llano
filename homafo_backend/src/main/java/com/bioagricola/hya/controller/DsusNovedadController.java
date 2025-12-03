package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.entity.GactGestionActualizacion;
import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.DsnovDsusNovedadDTO;
import com.bioagricola.hya.entity.TmpDsusNovedad;
import com.bioagricola.hya.service.DsusNovedadService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
 * Clase que almacena los endpoints de los servicios relacionados con novedades de suscripcion
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api/suscripcion/novedad")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DsusNovedadController {

    private final DsusNovedadService dsnovDsusNovedadService;

    private final AuthenticationFacade autoFacade;

    public DsusNovedadController(DsusNovedadService dsnovDsusNovedadService, AuthenticationFacade autoFacade) {
        this.dsnovDsusNovedadService = dsnovDsusNovedadService;
        this.autoFacade = autoFacade;
    }

    /**
     * Servicio para listar unidades
     * @return listado de unidades para el formulario
     */
    @GetMapping("/unidades")
    public ResponseEntity<Map<String,Object>> listarUnidadesFormulario() {
        Map<String,Object> response = this.dsnovDsusNovedadService.listarUnidadesFormulario();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para guardar una nueva novedad de suscripcion
     * @param files archivos
     * @param data formulario info
     * @param token token usuario autenticado
     * @return novedad guardada
     */
    @PostMapping(value = "", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<TmpDsusNovedad> guardar(@RequestPart("images") List<MultipartFile> files,
                                                  @Valid @RequestPart("data") String data,
                                                  @RequestHeader("authorization") String token) {
        TmpDsusNovedad dsusnovedad;
        try {
            ObjectMapper mapper = new ObjectMapper();
            dsusnovedad = mapper.readValue(data, TmpDsusNovedad.class);
        }catch (Exception e){
            throw new RuntimeException("El json no tiene la estructura adecuada. "+ e.getMessage());
        }
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        dsusnovedad.setUsuIderegistro(idUsu.longValue());
        TmpDsusNovedad dsusNovedad = this.dsnovDsusNovedadService.guardar(dsusnovedad,files,token);
        return new ResponseEntity<>(dsusNovedad, HttpStatus.CREATED);
    }

    @PostMapping("listar/{page}/{size}")
    public ResponseEntity<Page<DsnovDsusNovedadDTO>> listar(@PathVariable("page") int page, @PathVariable("size") int size, @RequestBody BasicSearchDTO search) {
        Page<DsnovDsusNovedadDTO> listaNovedades= this.dsnovDsusNovedadService.listar(search,page,size);
        return new ResponseEntity<>(listaNovedades, HttpStatus.OK);
    }

    /**
     * Servicio para listar registros de actualizacion pendientes
     * @return listado de registros pendientes
     */
    @GetMapping("/buscar/{dsusIderegistro}")
    public ResponseEntity<List<DsnovDsusNovedadDTO>> buscar(@PathVariable("dsusIderegistro") Long dsusIderegistro) {
        List<DsnovDsusNovedadDTO> listaNovedades= this.dsnovDsusNovedadService.buscar(dsusIderegistro);
        return new ResponseEntity<>(listaNovedades, HttpStatus.OK);
    }

    /**
     * Servicio para listar registros de actualizacion pendientes
     * @return listado de registros pendientes
     */
    @PutMapping("/{idnovedad}")
    public ResponseEntity eliminar(@PathVariable("idnovedad") Long idnovedad) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        this.dsnovDsusNovedadService.eliminar(idnovedad,idUsu);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * Servicio para consultar las imagenes asociadas a una novedad
     * @param idnovedad id de novedad
     * @param token token usuario autenticado
     * @return lista de imagenes
     */
    @GetMapping(value = "/imagenes/{idnovedad}")
    public ResponseEntity <List<Map<String,Object>>> consultaImagenes (@PathVariable("idnovedad") Long idnovedad,
                                                                       @RequestHeader("authorization") String token) {
        List<Map<String,Object>> imagenes = this.dsnovDsusNovedadService.consultaImagenes(idnovedad, token);
        return new ResponseEntity<>(imagenes, HttpStatus.OK);
    }

    /**
     * Servicio para aprobar o aceptar una novedad
     * @param idnovedad id de novedad a aprobar
     * @return Entidad resultante aprobacion
     */
    @PostMapping(value = "/aprobar/{idnovedad}")
    public ResponseEntity<GactGestionActualizacion> aprobarNovedad(@PathVariable("idnovedad")Long idnovedad) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        GactGestionActualizacion response= this.dsnovDsusNovedadService.aprobarnovedad(idnovedad,idUsu);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
