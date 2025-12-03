package com.bioagricola.homologaciones.controller;


import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.validation.Valid;
import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.homologaciones.dto.RespuestaGenerica;
import com.bioagricola.homologaciones.dto.SuscripcionDto;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.service.impl.EmpresasService;
import com.bioagricola.homologaciones.service.impl.SuscripcionService;

import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping(path = "api/suscripcion")
public class SuscripcionRestController {

    @Autowired
    private SuscripcionService service;

    @Autowired
	private AuthenticationFacade autoFacade;
    
    @Autowired
    private TerTerceroRepository terRepository;
    
    @Autowired
    private SuscripcionService suService;
    

    @GetMapping(value = "/{id}",produces = "application/json")
    public SusSuscripcion findById(@PathVariable Long id){
            return this.service.findById(id);
    }
    
    @PostMapping("/creaSuscripcion")
    public ResponseEntity<RespuestaGenerica<DsusDetsuscrip>> creaSuscripcion(@Valid @RequestBody SuscripcionDto sus) {
    	Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();
        Integer idEmp = autoFacade.getCredentials().getAuditoria().getIdEmpresa();
        RespuestaGenerica<DsusDetsuscrip> response = new RespuestaGenerica<>();
        DsusDetsuscrip susNew = suService.creaSuscripcion(sus,idUsu,idEmp);
        response.setCodigo(1);
        response.setMensaje("La suscripcion Alterna ya cuenta con una Suscripcion de ASEO ");
        response.setObjeto(null);
        
        if(susNew != null) {
        	response.setCodigo(0);
        	response.setMensaje(String.format("Suscripcion (%d) Creada Con Exito",susNew.getDsusIderegistr()));
        	response.setObjeto(susNew);
        	
        }        
    	return new ResponseEntity<>(response,HttpStatus.OK);  	
    }   
    
}
