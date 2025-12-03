package com.bioagricola.arcgis.controller;

import com.bioagricola.arcgis.dto.BasicMapDto;
import com.bioagricola.arcgis.service.ArcGisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Clase que contiene los servicios de los mapas de ArcGis
 * @author cperez@progracol.com
 */
@RestController
@RequestMapping("/arcgis")
public class ArcGisController {

    private final ArcGisService arcGisService;

    public ArcGisController(ArcGisService arcGisService) {
        this.arcGisService = arcGisService;
    }

    /**
     * Servicio para listar mapas
     * @return lista de mapas
     */
    @GetMapping("/listar/mapas")
    public ResponseEntity<List<BasicMapDto>> listarMapas(){
        List<BasicMapDto> response = arcGisService.listarMapas();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Servicio para listar mapas
     * @return lista de mapas
     */
    @GetMapping("/buscar/{idmapa}")
    public ResponseEntity<Map<String,Object>> buscarDetalleMapa(@PathVariable("idmapa") String idmapa){
        Map<String,Object> infoMapa = arcGisService.buscarDetalleMapa(idmapa);
        return new ResponseEntity<>(infoMapa, HttpStatus.OK);
    }

    /**
     * Servicio que retorna token para implementacion de servicio ArcGis
     * @return token
     */
    @GetMapping("/token")
    public ResponseEntity<Map<String,String>> generarToken(){
        Map<String,String> token = arcGisService.generarTokenArcgis();
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
