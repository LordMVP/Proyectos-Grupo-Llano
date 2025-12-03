package com.bioagricola.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.bioagricola.common.service.UsuarioDetailsServiceImpl;
import com.bioagricola.filters.JWTAuthenticationFilter;
import com.bioagricola.filters.JWTAuthorizationFilter;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;

@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UsuarioDetailsServiceImpl userDetailsService;
	
	@Value("${gell.estandar.api.autenticador.url}")
	private String urlAutenticador;
	
	
	
	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
		.cors().and()
		.csrf().disable()
		.authorizeRequests().antMatchers(HttpMethod.POST, "/login").permitAll()
		.antMatchers(HttpMethod.POST, "/homologacion/rememberpass").permitAll()
		.antMatchers(HttpMethod.PUT, "/homologacion/restorepass").permitAll()
		.antMatchers(HttpMethod.POST, "/api/global/empresas").permitAll()
		.antMatchers(HttpMethod.GET, "/api/importacion/test/*").permitAll()
		.antMatchers(HttpMethod.GET, "/arcgis/token").permitAll()
		//.antMatchers(HttpMethod.GET, "/arcgis/listar/mapas").permitAll()
		//.antMatchers(HttpMethod.POST, "/homologacion/sesion").permitAll()
		//.antMatchers(HttpMethod.GET, "/api/empresas/alternasOld").permitAll()
		.anyRequest().authenticated().and()
			.addFilter(new JWTAuthenticationFilter(clienteToken()))
			.addFilter(new JWTAuthorizationFilter(authenticationManager(),clienteToken()));
	}
	
	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		// Se define la clase que recupera los usuarios y el algoritmo para procesar las passwords
		auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
	}
	
	@Bean
	public ClienteToken clienteToken() {
		//http://10.43.51.29:8080/autenticador/ 
		return new ClienteToken(EAplicacion.VEPOS,urlAutenticador);
		//return new ClienteToken(EAplicacion.VEPOS,"http://190.14.232.146:8080");
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
}
