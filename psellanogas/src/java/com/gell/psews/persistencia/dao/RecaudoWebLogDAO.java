/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dao;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.PreparedStatementNamed;
import com.gell.psews.persistencia.dto.RecaudoWebLogDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

/**
 *
 * @author lrey
 */
public class RecaudoWebLogDAO extends GenericoDAO {

    public RecaudoWebLogDAO(Connection cnn) {
        super(cnn);
    }

    public void insertarRecaudoLog(RecaudoWebLogDTO recaudo) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO lwre_logwebrec( ")
                    .append("            wrec_ideregistro, lwre_fecha, lwre_returncode,  ")
                    .append("            lwre_state, wrec_paymentid, wrec_amount, wrec_vatamount, lwre_bankcode,  ")
                    .append("            wrec_servicecode, lwre_trazabilitycode, lwre_cyclenumber, wrec_referencenumber3,  ")
                    .append("            wrec_referencenumber2, wrec_referencenumber1, lwre_soliciteddate) ")
                    .append("    VALUES ( :idwebrecaudo, :fecha, :returncode,  ")
                    .append("            :state, :paymentid, :amount, :vatamount, :bankcode,  ")
                    .append("            :servicecode, :trazabilitycode, :cyclenumber, :referencenumber3,  ")
                    .append("            :referencenumber2, :referencenumber1, :soliciteddate)");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("idwebrecaudo", recaudo.getIdRecaudoWeb());
            ps.setObject("fecha", new Timestamp(recaudo.getFecha().getTime()));
            ps.setObject("returncode", recaudo.getReturnCode());
            ps.setObject("state", recaudo.getState());
            ps.setObject("paymentid", recaudo.getPaymentId());
            ps.setObject("amount", recaudo.getAmount());
            ps.setObject("vatamount", recaudo.getVatAmount());
            ps.setObject("bankcode", recaudo.getBankCode());
            ps.setObject("servicecode", recaudo.getServiceCode());
            ps.setObject("trazabilitycode", recaudo.getTrazabilityCode());
            ps.setObject("cyclenumber", recaudo.getCycleNumber());
            ps.setObject("referencenumber3", recaudo.getReferenceNumber3());
            ps.setObject("referencenumber2", recaudo.getReferenceNumber2());
            ps.setObject("referencenumber1", recaudo.getReferenceNumber1());
            ps.setObject("soliciteddate", (recaudo.getSolicitedDate() != null) ? new Timestamp(recaudo.getSolicitedDate().getTime()) : null);
            ps.executeUpdate();
            rs = ps.getStatement().getGeneratedKeys();
            rs.next();
            recaudo.setIdRecaudoWebLog(rs.getLong(ID));
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO);
        } finally {
            cerrar(ps, rs);
        }
    }

    public void actualizarRecaudoLog(RecaudoWebLogDTO recaudo) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE lwre_logwebrec SET  ")
                    .append("            wrec_ideregistro = :idwebrecaudo, lwre_returncode = :returncode,  ")
                    .append("            lwre_state = :state, wrec_paymentid = :paymentid, wrec_amount=:amount, wrec_vatamount = :vatamount, lwre_bankcode=:bankcode,  ")
                    .append("            wrec_servicecode = :servicecode, lwre_trazabilitycode = :trazabilitycode, lwre_cyclenumber = :cyclenumber, wrec_referencenumber3 = :referencenumber3,  ")
                    .append("            wrec_referencenumber2 = :referencenumber2, wrec_referencenumber1 = :referencenumber1, lwre_soliciteddate = :soliciteddate ")
                    .append(" WHERE lwre_ideregistro = :idRecaudoWebLog  ");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("idwebrecaudo", recaudo.getIdRecaudoWeb());
            ps.setObject("returncode", recaudo.getReturnCode());
            ps.setObject("state", recaudo.getState());
            ps.setObject("paymentid", recaudo.getPaymentId());
            ps.setObject("amount", recaudo.getAmount());
            ps.setObject("vatamount", recaudo.getVatAmount());
            ps.setObject("bankcode", recaudo.getBankCode());
            ps.setObject("servicecode", recaudo.getServiceCode());
            ps.setObject("trazabilitycode", recaudo.getTrazabilityCode());
            ps.setObject("cyclenumber", recaudo.getCycleNumber());
            ps.setObject("referencenumber3", recaudo.getReferenceNumber3());
            ps.setObject("referencenumber2", recaudo.getReferenceNumber2());
            ps.setObject("referencenumber1", recaudo.getReferenceNumber1());
            ps.setObject("soliciteddate", (recaudo.getSolicitedDate() != null) ? new Timestamp(recaudo.getSolicitedDate().getTime()) : null);
            ps.setObject("idRecaudoWebLog", recaudo.getIdRecaudoWebLog());
            ps.executeUpdate();
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Se actualiza el proceso de log
     *
     * @param recaudoWebLog
     * @throws com.gell.psews.persistencia.exception.PersistenciaExcepcion
     */
    public void actualizarLogEnvio(RecaudoWebLogDTO recaudoWebLog) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE lwre_logwebrec SET lwre_xmlinicio = :xmlinicio ")
                    .append(" WHERE lwre_ideregistro = (")
                    .append("  SELECT MAX(lwre_ideregistro) ")
                    .append("  FROM lwre_logwebrec ")
                    .append("  WHERE wrec_ideregistro = :idwebrecaudo ) ");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("xmlinicio", recaudoWebLog.getXmlInicio());
            ps.setObject("idwebrecaudo", recaudoWebLog.getIdRecaudoWeb());
            ps.executeUpdate();
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ACTUALIZAR_RECAUDO_LOG);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Se actualiza el proceso de log
     *
     * @param recaudoWebLog
     * @throws com.gell.psews.persistencia.exception.PersistenciaExcepcion
     */
    public void actualizarLogRespuesta(RecaudoWebLogDTO recaudoWebLog) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE lwre_logwebrec SET lwre_respuesta = :respuesta ")
                    .append(" WHERE lwre_ideregistro = (")
                    .append("  SELECT MAX(lwre_ideregistro) ")
                    .append("  FROM lwre_logwebrec ")
                    .append("  WHERE wrec_ideregistro = :idwebrecaudo ) ");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("respuesta", recaudoWebLog.getRespuesta());
            ps.setObject("idwebrecaudo", recaudoWebLog.getIdRecaudoWeb());
            ps.executeUpdate();
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ACTUALIZAR_RECAUDO_LOG);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Consulta el último log guardado de un recaudo web
     *
     * @param idRecaudoWeb
     * @return estado actual
     * @throws PersistenciaExcepcion
     */
    public RecaudoWebLogDTO consultar(Long idRecaudoWeb) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append(" SELECT split_part(lwre_bankcode,':',2) as lwre_bankcode, log1.* FROM lwre_logwebrec log1 ")
                    .append(" WHERE wrec_ideregistro = :idrecaudoweb AND lwre_fecha = ( ")
                    .append("   SELECT MAX(log2.lwre_fecha) FROM lwre_logwebrec log2 ")
                    .append("   WHERE log2.wrec_ideregistro = :idrecaudoweb  ")
                    .append(" ); ");

            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idrecaudoweb", idRecaudoWeb);
            rs = ps.executeQuery();
            if (rs.next()) {
                return getRecaudoWebLogDTO(rs);
            }
            return null;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DETALLES_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Crea un objeto de la clase RecaudoWebLogDTO a partir de una consulta
     *
     * @param rs ResultSet de la consulta
     * @return
     * @throws PersistenciaExcepcion
     */
    public static RecaudoWebLogDTO getRecaudoWebLogDTO(ResultSet rs) throws PersistenciaExcepcion {
        RecaudoWebLogDTO recaudoWebLogDTO = new RecaudoWebLogDTO();
        recaudoWebLogDTO.setIdRecaudoWebLog(getObject("lwre_ideregistro", Long.class, rs));
        recaudoWebLogDTO.setIdRecaudoWeb(getObject("wrec_ideregistro", Long.class, rs));
        recaudoWebLogDTO.setFecha(getObject("lwre_fecha", Timestamp.class, rs));
        recaudoWebLogDTO.setReturnCode(getObject("lwre_returncode", String.class, rs));
        recaudoWebLogDTO.setState(getObject("lwre_state", String.class, rs));
        recaudoWebLogDTO.setPaymentId(getObject("wrec_paymentid", String.class, rs));
        recaudoWebLogDTO.setAmount(getObject("wrec_amount", Double.class, rs));
        recaudoWebLogDTO.setVatAmount(getObject("wrec_vatamount", Double.class, rs));
        recaudoWebLogDTO.setBankCode(getObject("lwre_bankcode", String.class, rs));
        recaudoWebLogDTO.setServiceCode(getObject("wrec_servicecode", String.class, rs));
        recaudoWebLogDTO.setTrazabilityCode(getObject("lwre_trazabilitycode", String.class, rs));
        recaudoWebLogDTO.setCycleNumber(getObject("lwre_cyclenumber", Integer.class, rs));
        recaudoWebLogDTO.setReferenceNumber1(getObject("wrec_referencenumber3", String.class, rs));
        recaudoWebLogDTO.setReferenceNumber2(getObject("wrec_referencenumber2", String.class, rs));
        recaudoWebLogDTO.setReferenceNumber3(getObject("wrec_referencenumber1", String.class, rs));
        recaudoWebLogDTO.setSolicitedDate(getObject("lwre_soliciteddate", Timestamp.class, rs));
        return recaudoWebLogDTO;
    }
}
