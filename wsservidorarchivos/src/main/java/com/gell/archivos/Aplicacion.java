/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos;

import com.gell.archivos.negocio.util.SoapUtil;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.MultipartConfigElement;
import javax.sql.DataSource;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author god
 */
@Configuration
@ComponentScan
@EnableAutoConfiguration
public class Aplicacion extends SpringBootServletInitializer
{

  public static void main(String[] args)
  {
    System.out.println("Ejecutando spring boot");
    SpringApplication.run(Aplicacion.class, args);
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder)
  {
    return builder.sources(Aplicacion.class);
  }

  @Bean
  public DataSource getDataSource()
          throws Exception
  {
    Context context = new InitialContext();
    DataSource ds = (DataSource) context.lookup("java:/Poolllanogas");
    configurarSOAP();
    return ds;
  }

  /**
   * Método encargado de configurar el tamaño máximo de los archivos
   *
   * @return
   */
  @Bean
  public MultipartConfigElement multipartConfigElement()
  {
    MultipartConfigFactory factory = new MultipartConfigFactory();
    factory.setMaxFileSize("350MB");
    factory.setMaxRequestSize("350MB");
    return factory.createMultipartConfig();

  }

  private void configurarSOAP()
          throws Exception
  {
    SoapUtil.configurar();
  }
}
