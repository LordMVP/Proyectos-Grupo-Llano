package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Funcion;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para funciones
 */
public interface FuncionServicios {
	List<Funcion> findByFuntipo(String tipo);
}
