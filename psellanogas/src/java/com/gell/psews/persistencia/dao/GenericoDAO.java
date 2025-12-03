/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dao;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.PreparedStatementNamed;
import com.gell.psews.negocio.util.Validacion;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;

/**
 *
 * @author lrey
 */
public abstract class GenericoDAO {

    protected Connection cnn;
    private static final int ERROR_FUNCION = 42000;
    protected final static int ID = 1;

    public GenericoDAO(Connection cnn) {
        this.cnn = cnn;
    }

    protected void cerrar(PreparedStatement ps, ResultSet rs) {
        ConexionBD.cerrar(rs, ps);
    }

    protected void cerrar(PreparedStatementNamed ps, ResultSet rs) {
        ConexionBD.cerrar(rs, ps.getStatement());
    }

    protected void cerrar(PreparedStatement ps) {
        ConexionBD.cerrar(ps);
    }

    protected void cerrar(PreparedStatementNamed ps) {
        ConexionBD.cerrar(ps.getStatement());
    }

    protected AplicacionExcepcion procesarExcepcion(SQLException ex) {
        int numeroError = Validacion.getNumeroExcepcion(ex.getSQLState());
        if (numeroError == ERROR_FUNCION) {
            return new NegocioExcepcion(-numeroError, ex.getMessage());
        }
        return new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
    }

    protected static <T> T getObject(String nombre, Class<T> tipo, ResultSet rs) throws PersistenciaExcepcion {
        try {
            String objDato = rs.getString(nombre);
            if (objDato == null) {
                return null;
            }
            if (tipo == String.class) {
                return tipo.cast(objDato);
            }
            if (tipo == Boolean.class) {
                return tipo.cast(rs.getBoolean(nombre));
            }
            if (tipo == Long.class) {
                return tipo.cast(rs.getLong(nombre));
            }
            if (tipo == Integer.class) {
                return tipo.cast(rs.getInt(nombre));
            }
            if (tipo == Timestamp.class || tipo == Date.class) {
                return tipo.cast(rs.getTimestamp(nombre));
            }
            Object objValor = tipo.getMethod("valueOf", String.class).invoke(null, objDato);
            return tipo.cast(objValor);
        } catch (Exception ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONVERTIR);
        }
    }

}
