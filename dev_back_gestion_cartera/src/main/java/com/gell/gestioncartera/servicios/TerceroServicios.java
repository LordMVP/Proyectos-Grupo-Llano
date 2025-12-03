package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Tercero;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para tereceros
 */
public interface TerceroServicios {
	Tercero findByDocumento(String documento);
	List<Tercero> findByNomcompletoContaining(String nombre);
}
