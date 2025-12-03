package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.entidades.Unidad;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para sectores "comunas"
 */
public interface SectorServicios {
	List<SectorComuna> findByAll();
}
