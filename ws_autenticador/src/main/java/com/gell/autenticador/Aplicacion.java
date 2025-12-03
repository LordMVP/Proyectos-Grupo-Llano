package com.gell.autenticador;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
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
public class Aplicacion extends SpringBootServletInitializer {

    public static void main(String[] args) {
        System.out.println("Ejecutando spring boot");
        SpringApplication.run(Aplicacion.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Aplicacion.class);
    }

    @Bean
    @Qualifier("prisma")
    public DataSource getDataSource()
            throws Exception {
        Context context = new InitialContext();
        DataSource ds = (DataSource) context.lookup("java:/Poolllanogas");
        //DataSource ds = (DataSource) context.lookup("java:/PoolDesarrollo");
        return ds;
    }

    @Bean
    @Qualifier("seven")
    public DataSource getDataSourceSeven() throws Exception {
        Context context = new InitialContext();
        DataSource ds = (DataSource) context.lookup("java:/PoolSeven");
        //DataSource ds = (DataSource) context.lookup("java:/Poolkactus20211006");
        //DataSource ds = (DataSource) context.lookup("java:/PoolSeven");
        return ds;
    }

    @Bean
    @Qualifier("risise")
    public DataSource getDataSourceRisise() throws Exception {
        Context context = new InitialContext();
        DataSource ds = (DataSource) context.lookup("java:/PoolRISISE");
        return ds;
    }

    @Bean
    @Qualifier("targas")
    public DataSource getDataSourceTargas() throws Exception {
        Context context = new InitialContext();
        DataSource ds = (DataSource) context.lookup("java:/PoolTecnico120");
        return ds;
    }

    @Bean
    @Qualifier("kactus")
    public DataSource getDataSourceKactus() throws Exception {
        Context context = new InitialContext();
        DataSource ds = (DataSource) context.lookup("java:/chereportes");
        //DataSource ds = (DataSource) context.lookup("java:/sevenpruebas");
        return ds;
    }
}
