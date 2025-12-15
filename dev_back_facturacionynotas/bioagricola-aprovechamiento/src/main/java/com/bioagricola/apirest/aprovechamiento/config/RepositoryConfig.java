package com.bioagricola.apirest.aprovechamiento.config;

import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrudImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = {"com.bioagricola.apirest.modelo.manejadores", "com.bioagricola.apirest.aprovechamiento.repository"},
        repositoryBaseClass = ManejadorCrudImpl.class
)
public class RepositoryConfig {
}