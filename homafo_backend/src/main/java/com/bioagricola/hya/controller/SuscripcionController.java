package com.bioagricola.hya.controller;


import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.service.impl.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SuscripcionController {
    @Autowired
    private SuscripcionService service;

    @Autowired
    private AuthenticationFacade autoFacade;

    /**
     * @param id
     * @return
     */
    @GetMapping(value = "suscriptor/{id}")
    public SusSuscripcion findById(@PathVariable Long id) {
        return this.service.findById(id);
    }

    /**
     * Servicio para agregar convenios a tercero (crear suscriptor)
     *
     * @param entity suscripcion
     * @return suscriptor
     */
    @PostMapping("suscriptor")
    public SusSuscripcion create(@Valid @RequestBody SusSuscripcion entity) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();

        return service.create(entity, idUsu);
    }
}
