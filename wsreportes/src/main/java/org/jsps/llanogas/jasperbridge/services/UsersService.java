/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.services;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 *
 * @author jpsierra
 */
@Stateless
public class UsersService implements Serializable {

    private Connection connection;
    private Context ctx;
    private boolean error;
    private String errorMessage;

    public UsersService() {
        try {
            System.out.println("Iniciando  Contexto Metodo Constructor UsersService");
            ctx = new InitialContext();
        } catch (NamingException ex) {
            Logger.getLogger(UsersService.class.getName()).log(Level.SEVERE, null, ex);
            ex.getStackTrace();
            System.out.println("Error inicializando Contexto Metodo Constructor UsersService: " + ex.getMessage());
            this.errorMessage = ex.getMessage();
            this.error = true;
        }
    }

    private void loadConnection(String jndiJdbc) throws NamingException, SQLException {
        if (this.connection == null || this.connection.isClosed()) {
            System.out.println("Iniciando Conexicion a Base de datos ");
            this.connection = ((DataSource) ctx.lookup(jndiJdbc)).getConnection();
        }
    }

    public boolean valideUser(String jndiJdbc, Integer usu_ideregistro, String password)
    {

        boolean data = false;
        try {
            loadConnection(jndiJdbc);
            System.out.println(" Validando Usuario :" + usu_ideregistro);
            String sql = "SELECT * FROM usuarios WHERE usu_ideregistro = ? AND MD5(usuario_pas) = ? LIMIT 1";
            PreparedStatement statement = this.connection.prepareStatement(sql);
            statement.setInt(1, usu_ideregistro);
            statement.setString(2, password);
            ResultSet result = statement.executeQuery();
            data = result.next();
            result.close();
            statement.close();

        } catch (SQLException sqex) {
            System.out.println("SQLExcepcion: Error en Metodo ValideUser " + sqex.getMessage());
            sqex.getStackTrace();
        } catch (NamingException nmex) {
            System.out.println("NamingException: Error en Metodo ValideUser" + nmex.getMessage());
            nmex.getStackTrace();
        } catch (Exception ex) {
            System.out.println("Exception: Error en Metodo ValideUser" + ex.getMessage());
            ex.getStackTrace();
        } finally {
            try {
                if (this.connection != null) {
                    this.connection.close();

                }
                System.out.println("Cerrando Exitosamente Conexión a la Base de datos");
            } catch (SQLException ex) {
                Logger.getLogger(UsersService.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println("Error Cerrando la Conexion Jni:" + jndiJdbc);
            }

        }
        return data;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}
