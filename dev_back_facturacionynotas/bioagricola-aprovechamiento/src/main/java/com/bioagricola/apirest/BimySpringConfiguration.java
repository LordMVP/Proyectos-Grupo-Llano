package com.bioagricola.apirest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrudImpl;

@Configuration
@EnableJpaRepositories(basePackages = {"com.bioagricola.apirest.modelo.manejadores"}, repositoryBaseClass = ManejadorCrudImpl.class)
@ComponentScan(basePackages = {"com.bioagricola.apirest"})
public class BimySpringConfiguration {
	
	@Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        CorsFilter bean = new CorsFilter(source);

        return bean;
    }
	
}