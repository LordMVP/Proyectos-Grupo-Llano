package com.bioagricola.hya.controller;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.aforos.service.impl.ProyectosServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Proyectos
 *
 * @author
 */
@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProyectosController {
    private final ProyectosServiceImpl proyectosService;

    public ProyectosController(ProyectosServiceImpl proyectosService) {
        this.proyectosService = proyectosService;
    }

    @GetMapping("ciudades")
    public List<StaticContentResponseDTO<String>> getAll() {
        return proyectosService.getMunicipiosActivosAforos();
    }
}
