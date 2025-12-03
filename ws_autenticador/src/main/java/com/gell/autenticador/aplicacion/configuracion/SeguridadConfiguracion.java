/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.aplicacion.configuracion;

import com.gell.autenticador.aplicacion.seguridad.JwtFiltroAutenticador;
import com.gell.autenticador.negocio.constante.ERuta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 *
 * @author god
 */
@Configuration
@EnableWebSecurity
public class SeguridadConfiguracion extends WebSecurityConfigurerAdapter {

  @Bean
  public JwtFiltroAutenticador getJwtFiltroAutenticador()
  {
    return new JwtFiltroAutenticador();
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth)
          throws Exception
  {
    auth.inMemoryAuthentication()
            .withUser("ask")
            .password("123")
            .roles("ADMIN");
  }

  @Override
  protected void configure(HttpSecurity http)
          throws Exception
  {
    http.csrf()
            .disable()
            .authorizeRequests()
            .antMatchers(
                    ERuta.Global.INICIO_SESION,
                    ERuta.Global.INICIO_SESION_PRISMA,
                    ERuta.Global.INICIO_SESION_NOCON_EXTERNO,
                    "/*"
            ).permitAll()
            .anyRequest().authenticated();
    http.addFilterBefore(getJwtFiltroAutenticador(), UsernamePasswordAuthenticationFilter.class);
  }

}
