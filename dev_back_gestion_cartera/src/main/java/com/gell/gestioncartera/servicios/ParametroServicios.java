package com.gell.gestioncartera.servicios;
import com.gell.gestioncartera.entidades.Parametro;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para parametros
 */
public interface ParametroServicios {
	Parametro findByEmpideregistro(Long Id);
}
