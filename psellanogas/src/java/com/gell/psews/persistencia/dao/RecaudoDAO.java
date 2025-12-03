/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dao;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.DateUtil;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.PreparedStatementNamed;
import com.gell.psews.persistencia.dto.DetalleRecaudoDTO;
import com.gell.psews.persistencia.dto.DistribucionRecaudoDTO;
import com.gell.psews.persistencia.dto.FacturaDTO;
import com.gell.psews.persistencia.dto.RecaudoDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Gestiona las tablas que tienen relación al recaudo
 *
 * @author lrey
 */
public class RecaudoDAO extends GenericoDAO
{

  public RecaudoDAO(Connection cnn)
  {
    super(cnn);
  }

  public void insertarRecaudo(RecaudoDTO recaudo)
          throws PersistenciaExcepcion
  {
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      StringBuilder sql = new StringBuilder();
      sql.append("INSERT INTO rec_recaudo( ")
              .append("         rec_fecha, rec_estado, rec_fecaplicado, rec_vlrpagado,  ")
              .append("         rec_vlrcambio, rec_vlrajuste, rec_vlrreal, uni_medpago, cnre_ideregistr,  ")
              .append("         emp_ideregistro, sus_ideregistro, ter_ideregistro, uni_documento,  ")
              .append("         rec_fecpago, uni_municipio, usu_ideregistro, rec_version) ")
              .append(" VALUES (:fecha, :estado, :fechaaplicado, :valorpagado,  ")
              .append("         :valorcambio, :valorajuste, :valorreal, :mediopago, :idconvenio,  ")
              .append("         :idempresa, :idsuscriptor, :idtercero, :iddocumento,  ")
              .append("         :fechapago, :idmunicipio, :idusuario, :version);");
      ps = new PreparedStatementNamed(cnn, sql.toString(), true);
      ps.setObject("fecha", DateUtil.parseTimeStamp(recaudo.getFecha()));
      ps.setObject("estado", recaudo.getEstado());
      ps.setObject("fechaaplicado", DateUtil.parseTimeStamp(recaudo.getFechaAplicado()));
      ps.setObject("valorpagado", recaudo.getValorPagado());
      ps.setObject("valorcambio", recaudo.getValorCambio());
      ps.setObject("valorajuste", recaudo.getValorAjuste());
      ps.setObject("valorreal", recaudo.getValorReal());
      ps.setObject("mediopago", recaudo.getIdMedioPago());
      ps.setObject("idconvenio", recaudo.getIdConvenio());
      ps.setObject("idempresa", recaudo.getIdEmpresa());
      ps.setObject("idsuscriptor", recaudo.getIdSuscriptor());
      ps.setObject("idtercero", recaudo.getIdTercero());
      ps.setObject("iddocumento", recaudo.getIdDocumento());
      ps.setObject("fechapago", DateUtil.parseTimeStamp(recaudo.getFechaPago()));
      ps.setObject("idmunicipio", recaudo.getIdMunicipio());
      ps.setObject("idusuario", recaudo.getIdUsuario());
      ps.setObject("version", recaudo.getVersion());
      ps.executeUpdate();
      rs = ps.getStatement().getGeneratedKeys();
      rs.next();
      recaudo.setIdRecaudo(rs.getLong(ID));
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO);
    } finally {
      cerrar(ps, rs);
    }
  }

  /**
   * Consulta el documento y tipo de documento
   *
   * @param tipo
   * @param idSuscripcion
   * @return
   * @throws PersistenciaExcepcion
   * @throws NegocioExcepcion
   */
  public Long consultarDocumentoRecaudo(String tipo, Long idSuscripcion)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      StringBuilder sb = new StringBuilder();
      sb.append("SELECT ")
              .append("  ddot.uni_documento  iddocumento, ")
              .append("  uni.est_ideregistro idestructuradocumento ")
              .append("FROM ")
              .append("  ddot_detdoctipo ddot INNER JOIN doti_doctipo doti ON ddot.doti_ideregistr = doti.doti_ideregistr ")
              .append("  INNER JOIN uni_unidad uni ON ddot.uni_documento = uni.uni_ideregistro ")
              .append("  INNER JOIN liq_liquidacion liq ON doti.uni_documento = liq.uni_documento ")
              .append("                                    AND doti.uni_tipdocument = liq.uni_tipdocument ")
              .append("  INNER JOIN dsus_detsuscrip dsus ON dsus.uni_liquidacion = liq.uni_liquidacion ")
              .append("WHERE ")
              .append("  dsus.dsus_ideregistr = :idsuscripcion ")
              .append("  AND ddot.ddot_tipo = :tipo");
      ps = new PreparedStatementNamed(cnn, sb.toString());
      ps.setObject("tipo", tipo);
      ps.setObject("idsuscripcion", idSuscripcion);
      rs = ps.executeQuery();
      if (rs.next()) {
        return rs.getLong("iddocumento");
      }
      throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONSULTAR_DOCUMENTO,
              "tipo: " + tipo + " idsuscripcion: " + idSuscripcion);
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DOCUMENTO);
    } finally {
      cerrar(ps, rs);
    }
  }

  public Long consultarDocumentoRecaudo(String tipo)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      StringBuilder sb = new StringBuilder();
      sb.append("select uni_documento iddocumento from doc_documento doc where doc.doc_tipo=:tipo ");
      ps = new PreparedStatementNamed(cnn, sb.toString());
      ps.setObject("tipo", tipo);
      rs = ps.executeQuery();
      if (rs.next()) {
        return rs.getLong("iddocumento");
      }
      throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONSULTAR_DOCUMENTO, "tipo: " + tipo);
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DOCUMENTO);
    } finally {
      cerrar(ps, rs);
    }
  }

  public void insertarDistribucion(DistribucionRecaudoDTO distribucion)
  {
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      StringBuilder sql = new StringBuilder();
      sql.append("INSERT INTO dire_disrecaudo( ")
              .append("            dire_vlrrecaudo, dire_sdorecaudo, rec_ideregistro,  ")
              .append("            dicn_ideregistr, dsus_ideregistr, uni_documento, uni_tipdocument,  ")
              .append("            uni_concepto, per_ideregistro, cic_ideregistro, emp_ideregistro,  ")
              .append("            cic_ano,  usu_ideregistro, dire_version) ")
              .append("    VALUES (:valorrecaudo, :saldorecaudo, :idrecaudo, ")
              .append("            :iddistribucionconvenio, :idsuscripcion, :iddocumento, :idtipodocumento,  ")
              .append("            :idconcepto, :idperiodo, :idciclo, :idempresa,  ")
              .append("            :anio, :idusuario, :version)");
      ps = new PreparedStatementNamed(cnn, sql.toString(), true);
      ps.setObject("valorrecaudo", distribucion.getValorRecaudo());
      ps.setObject("saldorecaudo", distribucion.getSaldoRecaudo());
      ps.setObject("idrecaudo", distribucion.getRecaudo().getIdRecaudo());
      ps.setObject("iddistribucionconvenio", distribucion.getIdDistribucionConvenio());
      ps.setObject("idsuscripcion", distribucion.getIdSuscripcion());
      ps.setObject("iddocumento", distribucion.getIdDocumento());
      ps.setObject("idtipodocumento", distribucion.getIdTipoDocumento());
      ps.setObject("idconcepto", distribucion.getIdConcepto());
      ps.setObject("idperiodo", distribucion.getIdPeriodo());
      ps.setObject("idciclo", distribucion.getIdCiclo());
      ps.setObject("idempresa", distribucion.getIdEmpresa());
      ps.setObject("anio", distribucion.getAnio());
      ps.setObject("idusuario", distribucion.getIdUsuario());
      ps.setObject("version", distribucion.getVersion());
      ps.executeUpdate();
      rs = ps.getStatement().getGeneratedKeys();
      if (rs.next()) {
        distribucion.setIdDistribucion(rs.getLong("dire_ideregistr"));
      }
    } catch (SQLException ex) {
      LogUtil.error(ex);
    } finally {
      cerrar(ps, rs);
    }

  }
    
  public void insertarDetalleRecaudo(DetalleRecaudoDTO detalleRecaudo)
          throws PersistenciaExcepcion
  {
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      StringBuilder sql = new StringBuilder();
      sql.append("INSERT INTO drec_detrecaudo( ")
              .append("            rec_ideregistro, drec_vlrtotal, drec_vlrreal, ")
              .append("            drec_fecha, fac_ideregistro, cic_ideregistro, ")
              .append("            per_ideregistro, uni_documento, uni_tipdocument, dfac_ideregistr, ")
              .append("            dire_ideregistr,  cic_ano, usu_ideregistro,drec_version) ")
              .append("    VALUES (:idrecaudo, :valortotal, :valorreal, ")
              .append("            :fecha,  :idfactura, :idciclo, ")
              .append("            :idperiodo, :iddocumento, :idtipodocumento, :iddetallefactura, ")
              .append("            :iddistribucionrecaudo, :anio, :idusuario, ")
              .append("            :version )");
      ps = new PreparedStatementNamed(cnn, sql.toString(), true);
      ps.setObject("idrecaudo", detalleRecaudo.getRecaudo().getIdRecaudo());
      ps.setObject("valortotal", detalleRecaudo.getValorTotal());
      ps.setObject("valorreal", detalleRecaudo.getValorReal());
      ps.setObject("fecha", DateUtil.parseTimeStamp(detalleRecaudo.getFecha()));
      ps.setObject("idfactura", detalleRecaudo.getIdFactura());
      ps.setObject("idciclo", detalleRecaudo.getIdCiclo());
      ps.setObject("idperiodo", detalleRecaudo.getIdPeriodo());
      ps.setObject("iddocumento", detalleRecaudo.getIdDocumento());
      ps.setObject("idtipodocumento", detalleRecaudo.getIdTipoDocumento());
      ps.setObject("iddetallefactura", detalleRecaudo.getIdDetalleFactura());
      ps.setObject("iddistribucionrecaudo", detalleRecaudo.getDistribucionRecaudo().getIdDistribucion());
      ps.setObject("anio", detalleRecaudo.getAnio());
      ps.setObject("idusuario", detalleRecaudo.getIdUsuario());
      ps.setObject("version", detalleRecaudo.getVersion());
      ps.executeUpdate();
      rs = ps.getStatement().getGeneratedKeys();
      if (rs.next()) {
        detalleRecaudo.setIdDetalleRecaudo(rs.getLong(ID));
      }
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_DETALLE_RECAUDO);
    } finally {
      cerrar(ps, rs);
    }
  }

  public void insertarFormasRecaudo(RecaudoDTO recaudo, ConfiguracionDTO configuracion)
          throws PersistenciaExcepcion
  {
    PreparedStatementNamed ps = null;
    try {
      String sql = "INSERT INTO fpre_forpagreca "
              + "            (rec_ideregistro, uni_forpago, fpre_vlrreal,usu_ideregistro) "
              + "    VALUES (:idrecaudo, :idformapago, :valorreal, :idusuario)";
      ps = new PreparedStatementNamed(cnn, sql);
      ps.setObject("idrecaudo", recaudo.getIdRecaudo());
      ps.setObject("idformapago", configuracion.getRecaudo().getFormaPago());
      ps.setObject("valorreal", recaudo.getValorReal());
      ps.setObject("idusuario", recaudo.getIdUsuario());
      ps.executeUpdate();
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_RECAUDO_FORMA, ex.getMessage());
    } finally {
      cerrar(ps);
    }
  }

  public void insertarRecaudoFactura(Long idRecaudo)
          throws PersistenciaExcepcion
  {
    PreparedStatementNamed ps = null;
    try {
      StringBuilder sql = new StringBuilder();
      sql.append("INSERT INTO fare_facrecaudo ")
              .append("  SELECT nextval('sq_fare_ideregistr'), ")
              .append("    drec.fac_ideregistro, ")
              .append("    dire.dsus_ideregistr, ")
              .append("    dire.dire_ideregistr, ")
              .append("    dire.emp_ideregistro, ")
              .append("    dire.usu_ideregistro, ")
              .append("    'D' ")
              .append("  FROM drec_detrecaudo drec ")
              .append("    INNER JOIN dire_disrecaudo dire ON dire.dire_ideregistr = drec.dire_ideregistr ")
              .append("  WHERE dire.rec_ideregistro=:idrecaudo AND drec.rec_ideregistro=:idrecaudo ");
      ps = new PreparedStatementNamed(cnn, sql.toString());
      ps.setObject("idrecaudo", idRecaudo);
      ps.executeUpdate();
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_RECAUDO_FACTURA);
    } finally {
      cerrar(ps);
    }

  }

  public long consultaTipoDocumentoSuscripcion(long idSuscripcion)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    ResultSet rs = null;
    LogUtil.info("Consultando Tipo Documento Suscripcion" + idSuscripcion);
    PreparedStatementNamed ps = null;
    try {
      String Sql = " SELECT  liq.uni_tipdocument idtipodocumento from dsus_detsuscrip dsus "
              + " INNER join liq_liquidacion liq on liq.uni_liquidacion = dsus.uni_liquidacion "
              + " WHERE dsus_ideregistr = :idsuscripcion";
      ps = new PreparedStatementNamed(cnn, Sql);
      ps.setObject("idsuscripcion", idSuscripcion);
      rs = ps.executeQuery();
      while (rs.next()) {
        LogUtil.info("Tipo de Documento Generado " + rs.getLong("idtipodocumento"));
        return rs.getLong("idtipodocumento");
      }
      throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONSULTAR_TIPODOCUMENTO, "Suscripcion: " + idSuscripcion);
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_RECAUDO_FACTURA);
    } finally {
      cerrar(ps, rs);
    }
  }

}
