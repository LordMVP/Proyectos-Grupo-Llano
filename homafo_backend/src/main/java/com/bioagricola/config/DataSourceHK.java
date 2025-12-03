package com.bioagricola.config;

import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class DataSourceHK {

	private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;
 
    static {
        config.setJdbcUrl( "jdbc:postgresql://190.14.232.148:7432/Tecnicoaseo?stringtype=unspecified" );
        config.setUsername( "startcorp" );
        config.setPassword( "1MDuRhJ6vu9evHCp0dHX" );
        config.addDataSourceProperty( "cachePrepStmts" , "true" );
        config.addDataSourceProperty( "prepStmtCacheSize" , "250" );
        config.addDataSourceProperty( "prepStmtCacheSqlLimit" , "2048" );
        ds = new HikariDataSource( config );
    }
 
    private DataSourceHK() {}
 
    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
}
