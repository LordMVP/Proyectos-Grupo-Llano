package com.bioagricola.common.service;

import static java.util.Collections.emptyList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.bioagricola.common.dto.Usuario;

@Service
public class UsuarioDetailsServiceImpl implements UserDetailsService {

	//private UsuarioRepository usuarioRepository;

	/*public UsuarioDetailsServiceImpl(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}*/

	@Autowired
	BCryptPasswordEncoder encoder;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Usuario usuario = new Usuario();
		usuario.setUsername("jsps");
		usuario.setPassword("jimmy");
		System.out.println("Validando usuario "+username);
		return new User(usuario.getUsername(), encoder.encode(usuario.getPassword()), emptyList());
	}
}
