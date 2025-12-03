package com.bioagricola.hya.controller;

import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.hya.dto.AforoVisitaDto;
import com.bioagricola.hya.dto.DetalleVisitaDTO;
import com.bioagricola.hya.dto.ImgDescriptionDTO;
import com.bioagricola.hya.service.AforoVisitaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.models.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con los visitas de aforos
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api/aforo")
public class AforoVisitaController {

    private final AforoVisitaService aforoVisitaService;

    private final AuthenticationFacade autoFacade;

    public AforoVisitaController(AforoVisitaService aforoVisitaService, AuthenticationFacade autoFacade) {
        this.aforoVisitaService = aforoVisitaService;
        this.autoFacade = autoFacade;
    }

    /**
     * Servicio para listar unidades
     *
     * @return listado de unidades para el filtro de visitas
     */
    @GetMapping("/unidades")
    public ResponseEntity<Map<String, Object>> listarUnidadesFiltro() {
        Map<String, Object> response = this.aforoVisitaService.listarUnidades();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para listar las visitas por realizar por fecha actual y usuario logueado
     * @return listado de aforos - visitas
     */
    @GetMapping("/pendiente/listar")
    public ResponseEntity<List<AforoVisitaDto>> listarVisitasUsuario() {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        List<AforoVisitaDto> response = this.aforoVisitaService.listarVisitasUsuario(idUsu);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para listar las visitas realizadas por el usuario logueado
     * @return listado de aforos - visitas
     */
    @GetMapping("/realizado/listar")
    public ResponseEntity<List<AforoVisitaDto>> listarVisitasRealizadas() {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        List<AforoVisitaDto> response = this.aforoVisitaService.listarVisitasRealizadasUsuario(idUsu);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para listar las visitas canceladas por el usuario logueado
     * @return listado de aforos - visitas
     */
    @GetMapping("/cancelado/listar")
    public ResponseEntity<List<AforoVisitaDto>> listarVisitasCanceladas(@RequestHeader("authorization") String token) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        List<AforoVisitaDto> response = this.aforoVisitaService.listarVisitasCanceladasUsuario(idUsu,token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para cancelar una visita
     * @param images imagen de soporte
     * @param data info visita cancelada
     * @param token token usuario logueado
     * @return
     */
    @PostMapping(value = "/visita/cancelar",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> cancelarAforoVisita(@RequestPart("images") List<MultipartFile> images,
                                                            @Valid @RequestPart("data") String data,
                                                            @RequestHeader("authorization") String token) {
        DetalleVisitaDTO detalleVisitaDTO;
        try {
            ObjectMapper mapper = new ObjectMapper();
            detalleVisitaDTO = mapper.readValue(data, DetalleVisitaDTO.class);

            Map<String,String> detalleImagenMap=new HashMap<>();
            for (ImgDescriptionDTO imgDesDto:detalleVisitaDTO.getDetalleImagen()) {
                detalleImagenMap.put(imgDesDto.getName(),imgDesDto.getObser());
            }
            detalleVisitaDTO.setDetalleImagenMap(detalleImagenMap);
        }catch (Exception e){
            throw new RuntimeException("El json no tiene la estructura adecuada. "+ e.getMessage());
        }
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idempresa = autoFacade.getCredentials().getAuditoria().getIdEmpresa();
        boolean result = this.aforoVisitaService.cancelarAforoVisita(detalleVisitaDTO,images,token,idUsu,idempresa);
        ResponseDTO responseDTO;
        if(result){
             responseDTO = new ResponseDTO<Object>(true,"Almacenado con exito",detalleVisitaDTO);
        } else {
             responseDTO = new ResponseDTO<Object>(false,"La visita ya no se encuentra en estado pendiente.",detalleVisitaDTO);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * Servicio para tramitar o  crear registro de una visita realizada
     * @param images imagenes de soporte
     * @param data info visita tramitada
     * @param token token usuario logueado
     * @return lista de detalles de visita guardados
     */

    @PostMapping(value = "/visita/realizar",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> realizarAforoVisita(@RequestPart("images") List<MultipartFile> images,
                                                      @Valid @RequestPart("data") String data,
                                                      @RequestHeader("authorization") String token) {
        DetalleVisitaDTO detalleVisitaDTO;
        try {
            ObjectMapper mapper = new ObjectMapper();
            detalleVisitaDTO = mapper.readValue(data, DetalleVisitaDTO.class);

            Map<String,String> detalleImagenMap=new HashMap<>();
            for (ImgDescriptionDTO imgDesDto:detalleVisitaDTO.getDetalleImagen()) {
                detalleImagenMap.put(imgDesDto.getName(),imgDesDto.getObser());
            }
            detalleVisitaDTO.setDetalleImagenMap(detalleImagenMap);
        }catch (Exception e){
            throw new RuntimeException("El json no tiene la estructura adecuada. "+ e.getMessage());
        }
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idempresa = autoFacade.getCredentials().getAuditoria().getIdEmpresa();
        List<DetalleConceptoVisitaAforo> detallesVisitaGuardados=this.aforoVisitaService.realizarAforoVisita(detalleVisitaDTO,images,token,idUsu,idempresa);
        ResponseDTO responseDTO;
        if(detallesVisitaGuardados == null){
             responseDTO = new ResponseDTO<Object>(false,"La visita ya no se encuentra en estado pendiente.", null);
        }else{
            responseDTO = new ResponseDTO<Object>(true,"Almacenado con exito",detallesVisitaGuardados);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }
    
    
    /**
     * Servicio para validar una visita si ya ha sido sincronizada.
     * @param id visita
     * @param token token usuario logueado
     * @return información de la visita
     */

    @GetMapping(value = "/validar_visita/{id_aforo}/{id_visita}")
    public ResponseEntity<Object> validarAforoVisita(@PathVariable("id_aforo") Integer id_aforo,
    		@PathVariable("id_visita") Integer id_visita, @RequestHeader("authorization") String token) {
        
        Map<String, Object> visitaInformacion = this.aforoVisitaService.validarVisitaAforo(id_aforo, id_visita);
                
        return new ResponseEntity<>(visitaInformacion, HttpStatus.OK);
    }
}
