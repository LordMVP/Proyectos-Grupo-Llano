/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dao;

import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.PreparedStatementNamed;
import com.gell.psews.persistencia.dto.DetalleAplicacionRecaudoDTO;
import com.gell.psews.persistencia.dto.DetalleRecaudoWebDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author lrey
 */
public class DetalleRecaudoWebDAO extends GenericoDAO {

    public DetalleRecaudoWebDAO(Connection cnn) {
        super(cnn);
    }

    public void insertarDetalleRecaudo(DetalleRecaudoWebDTO detalleRecaudo) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO dwre_detwebrec( ")
                    .append("             wrec_ideregistro, dsus_ideregistr, emp_ideregistro,  ")
                    .append("            dwre_fecha, dwre_valorpago, dwre_estpago, dwre_estaplpago, dwre_mensaje) ")
                    .append("    VALUES (:idrecaudoweb, :idsuscripcion, :idempresa,  ")
                    .append("            :fecha, :valorpago, :estadopago, :estadoaplicacionpago, :mensaje) ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idrecaudoweb", detalleRecaudo.getIdRecaudoWeb());
            ps.setObject("idsuscripcion", detalleRecaudo.getIdSuscripcion());
            ps.setObject("idempresa", detalleRecaudo.getIdEmpresa());
            ps.setObject("fecha", new Timestamp(detalleRecaudo.getFecha().getTime()));
            ps.setObject("valorpago", detalleRecaudo.getValorPago());
            ps.setObject("estadopago", detalleRecaudo.getEstadoPago());
            ps.setObject("estadoaplicacionpago", detalleRecaudo.getEstadoAplicacionPago());
            ps.setObject("mensaje", detalleRecaudo.getMensaje());
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
    }

    
    
    
    
    

    
    public int  insertarDetalleRecaudo2(DetalleRecaudoWebDTO detalleRecaudo) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        int valor=0;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO dwre_detwebrec( ")
                    .append("             wrec_ideregistro, dsus_ideregistr, emp_ideregistro,  ")
                    .append("            dwre_fecha, dwre_valorpago, dwre_estpago, dwre_estaplpago, dwre_mensaje) ")
                    .append("    VALUES (:idrecaudoweb, :idsuscripcion, :idempresa,  ")
                    .append("            :fecha, :valorpago, :estadopago, :estadoaplicacionpago, :mensaje) ");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("idrecaudoweb", detalleRecaudo.getIdRecaudoWeb());
            ps.setObject("idsuscripcion", detalleRecaudo.getIdSuscripcion());
            ps.setObject("idempresa", detalleRecaudo.getIdEmpresa());
            ps.setObject("fecha", new Timestamp(detalleRecaudo.getFecha().getTime()));
            ps.setObject("valorpago", detalleRecaudo.getValorPago());
            ps.setObject("estadopago", detalleRecaudo.getEstadoPago());
            ps.setObject("estadoaplicacionpago", detalleRecaudo.getEstadoAplicacionPago());
            ps.setObject("mensaje", detalleRecaudo.getMensaje());
            ps.executeUpdate();
          rs = ps.getGeneratedKeys();
      if (rs.next()) {
        valor = rs.getInt(1);
      }
            return valor;
            
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
        
    }

       public Integer parametro_aplicacion(Integer empresa) {
    PreparedStatementNamed ps = null;
        ResultSet rs = null;
        
        Integer valor=0;
        try {
            String sql ="select par_parametro->'PAGO_ADICIONAL' datos  from    par_parametro  where emp_ideregistro =:empresa";

            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("empresa",empresa); 
            
            rs = ps.executeQuery();
            while (rs.next()) {
                 valor = rs.getInt("datos");
            }
            return valor;
        } catch (SQLException e) {
            LogUtil.error(e);
        try {
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DETALLES_RECAUDO_WEB);
        } catch (PersistenciaExcepcion ex) {
            Logger.getLogger(DetalleRecaudoWebDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        } finally {
            cerrar(ps, rs);
        }
        return null;
    }
        public void insertarDetalleAplicacionRecaudo(DetalleAplicacionRecaudoDTO detalleAplicacionRecaudoDTO,int dwre_ideregistro,Integer uni_aplicarecaudo,int idSuscriptor ) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO dwra_detaplicarecaudo(")
                    .append(" dwre_ideregistro, uni_aplicarecaudo, dwra_valor, ppa_ideregistro,")
                    .append("dwra_idfacturas,dwra_idfactudetalle,dwra_estaplicacion,idsuscriptor)")
                    .append("VALUES ( :dwre_ideregistro,:uni_aplicarecaudo,:dwra_valor, :ppa_ideregistro,:dwra_idfacturas ::jsonb,:dwra_idfactudetalle::jsonb,:dwra_estaplicacion,:idsuscriptor)");
                  
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("dwre_ideregistro",dwre_ideregistro);
            ps.setObject("uni_aplicarecaudo",uni_aplicarecaudo);
            ps.setObject("dwra_valor", detalleAplicacionRecaudoDTO.getDwra_valor());
            ps.setObject("ppa_ideregistro", detalleAplicacionRecaudoDTO.getPpa_ideregistro());
            ps.setObject("dwra_idfacturas",detalleAplicacionRecaudoDTO.getDwra_idfacturas());
            ps.setObject("dwra_idfactudetalle",detalleAplicacionRecaudoDTO.getDwra_idfacturasd());

            ps.setObject("dwra_estaplicacion", detalleAplicacionRecaudoDTO.getDwra_estaplicacion());
            ps.setObject("idsuscriptor", idSuscriptor);
            
            
          
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /**
     * Consulta todos los detalles de un recaudo web
     *
     * @param idRecaudoWeb identificador
     * @return
     * @throws PersistenciaExcepcion
     */
    public List<DetalleRecaudoWebDTO> consultar(Long idRecaudoWeb) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        List<DetalleRecaudoWebDTO> lista = new ArrayList<>();
        try {
            String sql = "select * from dwre_detwebrec where wrec_ideregistro = :idrecaudoweb";
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("idrecaudoweb", idRecaudoWeb); 
            rs = ps.executeQuery();
            while (rs.next()) {
                lista.add(getDetalleRecaudoWebDTO(rs));
            }
            return lista;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DETALLES_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
    }

    public void actualizar(DetalleRecaudoWebDTO detalleRecaudo) {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE dwre_detwebrec ")
                    .append("   SET  wrec_ideregistro=:idrecaudoweb, dsus_ideregistr=:idsuscripcion, emp_ideregistro=:idempresa,  ")
                    .append("       dwre_fecha= now(), dwre_valorpago=:valorpago, dwre_estpago=:estadopago, dwre_estaplpago=:estadoaplicacionpago,  ")
                    .append("       dwre_mensaje=:mensaje ")
                    .append(" WHERE dwre_ideregistro = :iddetallerecaudoweb");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idrecaudoweb", detalleRecaudo.getIdRecaudoWeb());
            ps.setObject("idsuscripcion", detalleRecaudo.getIdSuscripcion());
            ps.setObject("idempresa", detalleRecaudo.getIdEmpresa());
//            ps.setObject("fecha", detalleRecaudo.getFecha());
            ps.setObject("valorpago", detalleRecaudo.getValorPago());
            ps.setObject("estadopago", detalleRecaudo.getEstadoPago());
            ps.setObject("estadoaplicacionpago", detalleRecaudo.getEstadoAplicacionPago());
            ps.setObject("mensaje", detalleRecaudo.getMensaje());
            ps.setObject("iddetallerecaudoweb", detalleRecaudo.getIdDetalleRecaudoWeb());
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                detalleRecaudo.setIdDetalleRecaudoWeb(rs.getLong(1));
            }
        } catch (SQLException e) {
            LogUtil.error(e);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Consulta la cantidad de transacciones pendientes que tiene una
     * suscripción
     *
     * @param idSuscripcion identificador de la suscripción
     * @return
     * @throws PersistenciaExcepcion
     */
    public int consultarTransaccionesPendientes(Long idSuscripcion) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            String sql = "SELECT count(*) cantidad FROM  dwre_detwebrec "
                    + " WHERE dsus_ideregistr=:idsuscripcion "
                    + " AND (dwre_estpago=:estado OR  ((dwre_estaplpago=:estadoaplicacion OR dwre_estaplpago=:estadoaplicacionerror) AND dwre_estpago=:estadopago ))";
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("idsuscripcion", idSuscripcion);
            ps.setObject("estado", EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
            ps.setObject("estadoaplicacion", EEstado.DetalleRecaudoWeb.Aplicacion.PENDIENTE);
            ps.setObject("estadoaplicacionerror", EEstado.DetalleRecaudoWeb.Aplicacion.ERROR_APLICACION);
            ps.setObject("estadopago", EEstado.DetalleRecaudoWeb.Pago.OK);
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("cantidad");
            }
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_TRANSACCIONES);
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_TRANSACCIONES);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Crea un objeto de la clase DetalleRecaudoWebDTO a partir de una consulta
     *
     * @param rs ResultSet de la consulta
     * @return
     * @throws PersistenciaExcepcion
     */
    public static DetalleRecaudoWebDTO getDetalleRecaudoWebDTO(ResultSet rs) throws PersistenciaExcepcion {
        DetalleRecaudoWebDTO detalleRecaudoWebDTO = new DetalleRecaudoWebDTO();
        detalleRecaudoWebDTO.setIdDetalleRecaudoWeb(getObject("dwre_ideregistro", Long.class, rs));
        detalleRecaudoWebDTO.setIdRecaudoWeb(getObject("wrec_ideregistro", Long.class, rs));
        detalleRecaudoWebDTO.setIdSuscripcion(getObject("dsus_ideregistr", Long.class, rs));
        detalleRecaudoWebDTO.setIdEmpresa(getObject("emp_ideregistro", Long.class, rs));
        detalleRecaudoWebDTO.setFecha(getObject("dwre_fecha", Timestamp.class, rs));
        detalleRecaudoWebDTO.setValorPago(getObject("dwre_valorpago", Double.class, rs));
        detalleRecaudoWebDTO.setEstadoPago(getObject("dwre_estpago", String.class, rs));
        detalleRecaudoWebDTO.setEstadoAplicacionPago(getObject("dwre_estaplpago", String.class, rs));
        detalleRecaudoWebDTO.setMensaje(getObject("dwre_mensaje", String.class, rs));
        return detalleRecaudoWebDTO;
    }

}
