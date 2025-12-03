package com.bioagricola.apirest.liquidacion.web.servicio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/version")
public class ServicioVersion {

	
	  @GetMapping
	  public String version(){
		  return "APIversion - ok ...";
	  }
}
