package com.bioagricola.hya.controller;

import com.bioagricola.hya.dto.DsusInfoAlternaDTO;
import com.bioagricola.hya.dto.DsusInfoDTO;
import com.bioagricola.hya.dto.FiltroDsusDTO;
import com.bioagricola.hya.service.DsusFiltroService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Clase que almacena los endpoints de los servicios relacionados con el filtro de suscripciones
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/api")
public class DsusFiltroController {

    private final DsusFiltroService dsusFiltroService;

    public DsusFiltroController(DsusFiltroService dsusFiltroService) {
        this.dsusFiltroService = dsusFiltroService;
    }

    @GetMapping("/barrios/empresa/{idempresa}")
    public ResponseEntity<List<Map<Integer,String>>> listarBarrios(@PathVariable Integer idempresa) {
        List<Map<Integer, String>> barrios = dsusFiltroService.getBarrios(idempresa);
        return new ResponseEntity<>(barrios, HttpStatus.OK);
    }

    /**
     * servicio que lista las unidades para el filtro
     * @return unidades para el filtro
     */
    @GetMapping("/suscripcion/filtro/unidades")
    public ResponseEntity<Map<String, Object>> ListarUnidadesFiltro(){
        Map<String, Object> unidades = dsusFiltroService.getUnidadesFiltro();
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }
    /**
     * Servicio que filtra suscripcion de acuerdo a los parametros establecidos
     * @param filtroDsusDto parametros de filtro
     * @param page pagina
     * @param size tamaño de pagina
     * @return listado de resultados de busqueda
     */
    @PostMapping("/suscripcion/filtrar/{page}/{size}")
    public ResponseEntity<Page<DsusInfoDTO>> filtrar(@Valid @RequestBody FiltroDsusDTO filtroDsusDto, @PathVariable("page") int page, @PathVariable("size") int size){
        Page<DsusInfoDTO> suscripciones = dsusFiltroService.filtrar(filtroDsusDto,page,size);
        return new ResponseEntity<>(suscripciones, HttpStatus.OK);
    }

    /**
     * Servicio para consultar info de suscripcion por id
     * @param dsuspcodigo codigo de suscripcion
     * @return info suscripcion
     */
    @GetMapping("/suscripcion/filtro/info/{dsuspcodigo}")
    public ResponseEntity<DsusInfoAlternaDTO> buscarInfoSuscripcion(@PathVariable("dsuspcodigo") String dsuspcodigo) {
        DsusInfoAlternaDTO response= dsusFiltroService.buscarInfoSuscripcion(dsuspcodigo);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
