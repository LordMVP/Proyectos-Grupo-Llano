package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.Usuario;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para usuarios
 */
public interface UsuarioServicios {
	List<Usuario> findUsuarios(Long idEmpresa, List<Long> rango);
	Usuario findById(Long idUsuario);
}
