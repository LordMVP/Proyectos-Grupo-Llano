package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.NegocioPrunPrgunidad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/webresources/servicios/permisos")
public class ServicioPermisos {

    @Autowired
    private NegocioPrunPrgunidad negocioPrunPrgunidad;

    @GetMapping("hasPermissions")
    public ResponseEntity<?> hasPermissions(@RequestParam Integer idPrograma) throws Exception{
        Map<String, Object> message = new HashMap<>();
        message.put("hasPermission" , this.negocioPrunPrgunidad.hasPermission(idPrograma));
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
