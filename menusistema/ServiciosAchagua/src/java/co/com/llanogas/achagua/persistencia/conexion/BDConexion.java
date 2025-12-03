/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.conexion;

import co.com.llanogas.achagua.persistencia.excepcion.BaseDatosException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 *
 * @author hrey
 */
public class BDConexion {

    private BDConexion() {
    }

    public static Connection conectar() throws BaseDatosException {
        try {
            InitialContext contexto = new InitialContext();
            DataSource ds = (DataSource) contexto.lookup("");
            Connection cnn = ds.getConnection();
            cnn.setAutoCommit(false);
            return cnn;
        } catch (NamingException ex) {
            Logger.getLogger(BDConexion.class.getName()).log(Level.SEVERE, null, ex);
            throw new BaseDatosException(-1, "Error en la configuración");
        } catch (SQLException ex) {
            Logger.getLogger(BDConexion.class.getName()).log(Level.SEVERE, null, ex);
            throw new BaseDatosException(-2, "Error generar con la conexion");
        }
    }

    public static void desconectar(Connection cnn, PreparedStatement sentencia) {

        try {
            if (sentencia != null) {
                sentencia.close();
            }
            if (cnn != null) {
                cnn.close();
            }
        } catch (SQLException ex) {
            Logger.getLogger(BDConexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static void desconectar(Connection cnn) {
        BDConexion.desconectar(cnn, null);
    }

    public static void desconectar(PreparedStatement sentencia) {
        BDConexion.desconectar(null, sentencia);
    }

    public static void rollBack(Connection cnn) {
        if (cnn != null) {
            try {
                cnn.rollback();
            } catch (SQLException ex) {
                Logger.getLogger(BDConexion.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public static void commit(Connection cnn) {
        if (cnn != null) {
            try {
                cnn.commit();
            } catch (SQLException ex) {
                Logger.getLogger(BDConexion.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

}
