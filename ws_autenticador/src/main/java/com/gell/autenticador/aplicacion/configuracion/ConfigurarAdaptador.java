/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.aplicacion.configuracion;

import com.gell.autenticador.negocio.util.interpretador.JsonInterpretador;
import java.util.List;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

/**
 *
 * @author god
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan
public class ConfigurarAdaptador extends WebMvcConfigurationSupport {

  @Override
  protected void addArgumentResolvers(List<HandlerMethodArgumentResolver> list)
  {
    list.add(new JsonInterpretador());
  }

}
