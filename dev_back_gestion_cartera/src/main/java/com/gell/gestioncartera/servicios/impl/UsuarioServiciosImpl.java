package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Usuario;
import com.gell.gestioncartera.excepciones.NoDataFoundException;

import com.gell.gestioncartera.repositorios.UsuarioRepositorio;

import com.gell.gestioncartera.servicios.UsuarioServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para usuarios
 */
@Service
public class UsuarioServiciosImpl implements UsuarioServicios {

	@Autowired
	UsuarioRepositorio _repositorio;
		
	/**
	 * @param String tipo
	 * Método para busqueda de usuario
	 * @return lista de usuarios
	 */
	@Override
	public List<Usuario> findUsuarios(Long idEmpresa, List<Long> rango) {
		List<Usuario> items = (List<Usuario>)_repositorio.findUsuarios(idEmpresa, rango);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;				
	}

	@Override
	public Usuario findById(Long idUsuario) {
		Optional<Usuario> item = _repositorio.findById(idUsuario);
		
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}

}
