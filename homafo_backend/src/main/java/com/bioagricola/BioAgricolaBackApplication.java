package com.bioagricola;


import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.util.BasicReflectionConvert;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import com.google.gson.Gson;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.client.RestTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.DispatcherServlet;

import javax.annotation.PostConstruct;
import java.util.TimeZone;


/**
 * Se utiliza como entrada común entre los desarrollos de Bitpointer y Starcorp
 **/

@SpringBootApplication
@EnableJpaAuditing
@ComponentScan({"com.bioagricola"})
@EnableScheduling
//@EnableAutoConfiguration(exclude = {MultipartAutoConfiguration.class})
public class BioAgricolaBackApplication {

    @PostConstruct
    public void init() {
        // Setting Spring Boot SetTimeZone
        TimeZone.setDefault(TimeZone.getTimeZone("America/Bogota"));
    }

    public static void main(String[] args) {
        SpringApplication.run(BioAgricolaBackApplication.class, args);
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return mapper;
    }

    @Bean(name = "unidadDTOConverter")
    public BasicReflectionConvert<UniUnidad> getUnidadDTOConverter() {
        BasicReflectionConvert<UniUnidad> dtoConverter = new BasicReflectionConvert<UniUnidad>(UniUnidad.class,
                "uniIderegistro", "uniNombre1", "uniCodigo", "uniPropiedad");
        return dtoConverter;
    }

    @Bean(name = "HOMOLOGACIONES_APP")
    public String getHomologacionesParametros() {
        return "HOMOLOGACIONES";
    }

    @Bean(name = "EMPRESA")
    public Integer getEmpresa() {
        return 317;
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {
            System.out.println("Let's inspect the beans provided by Spring Boot:");
            /*
             * generadorRepository.findAll(); GenGenerador gen = new GenGenerador();
             * gen.setGenDesde(1); gen.setGenHasta(2); gen.setUniTipouso(1); UniUnidad uni =
             * new UniUnidad(); EstEstructura est = new EstEstructura();
             * est.setEstIderegistro(167); uni.setEstIderegistro(est);
             * uni.setUniCodigo("KIO2"); //uni.setUniCodigo1("KIO1");
             * uni.setUniNombre1("KIO1"); uni.setUsuIderegistro(288); gen.setUnidad(uni);
             * generadorRepository.save(gen);
             */

        };
    }

    /*
     * @Bean public CorsFilter corsFilter() { final UrlBasedCorsConfigurationSource
     * source = new UrlBasedCorsConfigurationSource(); final CorsConfiguration
     * config = new CorsConfiguration(); config.setAllowCredentials(true); // Don't
     * do this in production, use a proper list of allowed origins
     * config.setAllowedOrigins(Collections.singletonList("*"));
     * config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept"));
     * config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS",
     * "DELETE", "PATCH")); source.registerCorsConfiguration("/**", config); return
     * new CorsFilter(source); }
     */

    /*
     * @Bean public WebMvcConfigurer corsConfigurer() { return new
     * WebMvcConfigurer() {
     *
     * @Override public void addCorsMappings(CorsRegistry registry) {
     * registry.addMapping("/api/**").allowedOrigins("http://localhost:3000");
     * registry.addMapping("/*").allowedOrigins("*"); } }; }
     */
    
      /*@Bean(name = "multipartResolver") public CommonsMultipartResolver
      getCommonsMultipartResolver() { CommonsMultipartResolver multipartResolver =
      new CommonsMultipartResolver(); multipartResolver.setMaxUploadSize(20971520);
      multipartResolver.setMaxInMemorySize(1048576); return multipartResolver; }*/
     

	/*@Bean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME)
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setResolveLazily(false);
        return multipartResolver;
    }*/

    @Bean()
    public ClienteToken getClienteToken() {
        ClienteToken clienteToken = new ClienteToken(EAplicacion.HOMAFO, "http://10.43.51.30:8080");
        return clienteToken;
    }

    @Bean()
    public Gson getGson() {
        return new Gson();
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    /*
     * @Bean public HikariDataSource getHikariDataSource() { HikariConfig config =
     * new HikariConfig();//new HikariConfig(); HikariDataSource ds;
     * config.setJdbcUrl(
     * "jdbc:postgresql://190.14.232.148:7432/Tecnicoaseo?stringtype=unspecified" );
     * config.setUsername( "startcorp" ); config.setPassword( "1MDuRhJ6vu9evHCp0dHX"
     * ); config.setMinimumIdle(2); config.setMaximumPoolSize(2);
     * config.addDataSourceProperty( "cachePrepStmts" , "true" );
     * config.addDataSourceProperty( "prepStmtCacheSize" , "250" );
     * config.addDataSourceProperty( "prepStmtCacheSqlLimit" , "2048" );
     * config.addDataSourceProperty("maximumPoolSize",5);
     * config.addDataSourceProperty("idleTimeout",10000);
     * //config.addDataSourceProperty("minimumIdle",3); ds = new HikariDataSource(
     * config ); ds.setMinimumIdle(1); ds.setMaximumPoolSize(1);
     * ds.getHikariPoolMXBean().getIdleConnections(); return ds; }
     */

}
