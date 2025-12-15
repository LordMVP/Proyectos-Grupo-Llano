package com.bioagricola.apirest;

import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrudImpl;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableScheduling
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = {"com.bioagricola.apirest.modelo.manejadores"},
    repositoryBaseClass = ManejadorCrudImpl.class,
    entityManagerFactoryRef = "pssqlEntityManagerFactory",
    transactionManagerRef = "pssqlTransactionManager"
)
@ComponentScan(basePackages = {"com.bioagricola.apirest"})
public class BimySpringConfiguration {

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSourceProperties pssqlDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    public DataSource pssqlDataSource(
            @Qualifier("pssqlDataSourceProperties") DataSourceProperties dataSourceProperties) {
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }

    @Primary
    @Bean(name = "pssqlEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean pssqlEntityManagerFactory(
            @Qualifier("pssqlDataSource") DataSource hubDataSource,
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(hubDataSource)
                .packages("com.bioagricola.apirest.modelo.entidades")
                .persistenceUnit("pssql")
                .build();
    }

    @Primary
    @Bean(name = "pssqlTransactionManager")
    public PlatformTransactionManager pssqlTransactionManager(
            @Qualifier("pssqlEntityManagerFactory") EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }

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
