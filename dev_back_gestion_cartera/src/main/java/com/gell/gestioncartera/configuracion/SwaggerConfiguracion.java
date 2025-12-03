package com.gell.gestioncartera.configuracion;


import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * 
 * @author TSI
 * Configuracion del entorno Spring Boot para el manejo del Swagger
 */
@Configuration
@EnableSwagger2
public class SwaggerConfiguracion {
	//TODO Llevar los valores de la configuracion a variables de propiedades
	//@Value("${app.version}")
	//private String appVersion;

	/*
	 * @Value("${sbpg.init.swagger.title}") private String sbpgInitTwaggerTitle;
	 * 
	 * @Value("${sbpg.init.swagger.description}") private String
	 * sbpgInitDwaggerDescription;
	 */
	@Bean
	public Docket usersApi() {
		return new Docket(DocumentationType.SWAGGER_2).select()
				// .paths(userPaths())
				.apis(RequestHandlerSelectors.any())
				.build()
				.useDefaultResponseMessages(false)
				.apiInfo(usersApiInfo())
				.securitySchemes(Arrays.asList(apiKey()));
	}

	private ApiInfo usersApiInfo() {
		return new ApiInfoBuilder()
				.title("Gestión de Carteras")
				.description("")
				.version("1.0")
				.license("Apache License Version 2.0").build();
	}
	
	private ApiKey apiKey() {
        return new ApiKey("basicAuth", "Basic", "header");
      }
}
