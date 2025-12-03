package com.bioagricola.homologaciones.reportes;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@EnableConfigurationProperties
public class Config
{
	///conexion por jdbc
	
	
 
	
	 ///conexion por jdni
	 /*
	 @Bean
		@ConfigurationProperties(prefix = "spring.datasource.primary")
	    public JndiPropertyHolder primary() {
	        return new JndiPropertyHolder();
	    }
	 
	 @Bean(name = "maestro")
		@Primary
	    public DataSource primaryDataSource() {
	        JndiDataSourceLookup dataSourceLookup = new JndiDataSourceLookup();
	        DataSource dataSource = dataSourceLookup.getDataSource(primary().getJndiName());
	        return dataSource;
	    }
	 
	 @Bean(name = "jdniReportes")
	    @Autowired
	    public JdbcTemplate reportes(@Qualifier("maestro") DataSource esclavo) {
	        return new JdbcTemplate(esclavo);
	    }
	 
	 private static class JndiPropertyHolder {
	        private String jndiName;

	        public String getJndiName() {
	            return jndiName;
	        }

	        public void setJndiName(String jndiName) {
	            this.jndiName = jndiName;
	        }
	    }
	*/
}
