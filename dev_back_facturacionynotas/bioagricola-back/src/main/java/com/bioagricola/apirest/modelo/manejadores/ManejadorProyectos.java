package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.Proyectos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Configurable
@Service
public interface ManejadorProyectos 
extends ManejadorCrud<Proyectos, String>, IManejadorCrud<Proyectos, String> {
	
	@Query("SELECT p from Proyectos p where p.proyectoIderegistro in :proyectoId")
	public List<Object> getMunicipios(@Param ("proyectoId") Integer proyectoId);

}
