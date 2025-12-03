/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.dao;

import co.com.llanogas.achagua.persistencia.conexion.BDConexion;
import co.com.llanogas.achagua.persistencia.dto.CicloPeriodoDTO;
import co.com.llanogas.achagua.persistencia.dto.DistribucionRecaudo;
import co.com.llanogas.achagua.persistencia.dto.FormaPagoRecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.InformacionAdicionalDTO;
import co.com.llanogas.achagua.persistencia.dto.InformacionRecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.RecaudoDTO;
import co.com.llanogas.achagua.persistencia.dto.SuscripcionDTO;
import co.com.llanogas.achagua.persistencia.excepcion.RegistroExcepcion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;

/**
 *
 * @author hrey
 */
public class RecaudoDAO {

    private Connection cnn;

    public RecaudoDAO(Connection cnn) {
        this.cnn = cnn;
    }

    public void insertarRecaudo(RecaudoDTO recaudo) throws RegistroExcepcion, SQLException {
        PreparedStatement sentencia = null;
        try {
            String sql = "INSERT INTO rec_recaudo( rec_fecha, rec_estado, rec_fecaplicado, "
                    + "rec_vlrpagado, rec_vlrcambio, rec_vlrajuste, rec_vlrreal, uni_medpago, cnre_ideregistr,"
                    + " emp_ideregistro, sus_ideregistro, ter_ideregistro, uni_documento,rec_ideorigen, "
                    + "rec_idepadre)"
                    + "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            sentencia.setTimestamp(1, new Timestamp(recaudo.getFecha().getTime()));
            sentencia.setString(2, recaudo.getEstado());
            sentencia.setTimestamp(3, new Timestamp(recaudo.getFechaAplicado().getTime()));
            sentencia.setDouble(4, recaudo.getValorPagado());
            sentencia.setDouble(5, recaudo.getValorCambio());
            sentencia.setDouble(6, recaudo.getValorAjuste());
            sentencia.setDouble(7, recaudo.getValorReal());
            sentencia.setLong(8, recaudo.getIdMedioPago());
            sentencia.setLong(9, recaudo.getIdConvenio());
            sentencia.setLong(10, recaudo.getIdEmpresa());
            sentencia.setLong(11, recaudo.getIdSuscriptor());
            sentencia.setLong(12, recaudo.getIdTercero());
            sentencia.setLong(13, recaudo.getIdDocumento());
            sentencia.setLong(14, recaudo.getIdOrigen());
            sentencia.setLong(15, recaudo.getIdPadre());
            sentencia.executeUpdate();
            ResultSet rs = sentencia.getGeneratedKeys();
            if (rs.next()) {
                recaudo.setIdRecaudo(rs.getLong(1));
            }
        } finally {
            BDConexion.desconectar(sentencia);
        }
    }

    public void insertarFormaPago(FormaPagoRecaudoDTO formaPago, InformacionRecaudoDTO informacion) throws SQLException {
        PreparedStatement sentencia = null;
        try {
            String sql = "INSERT INTO fpre_forpagreca(  rec_ideregistro, uni_forpago, fpre_vlrreal)"
                    + "    VALUES ( ?, ?, ?)";
            sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            sentencia.setLong(1, formaPago.getRecaudo().getIdRecaudo());
            sentencia.setLong(2, informacion.getIdFormaPago());
            sentencia.setDouble(3, formaPago.getRecaudo().getValorPagado());
            sentencia.executeUpdate();
            ResultSet rs = sentencia.getGeneratedKeys();
            if (rs.next()) {
                formaPago.setIdFormaPagoRecaudo(rs.getLong(1));
            }
        } finally {
            BDConexion.desconectar(sentencia);
        }
    }

    public void insertarDistribucionRecaudo(DistribucionRecaudo distribucionRecaudo) throws SQLException {
        PreparedStatement sentencia = null;
        String sql = "INSERT INTO dire_disrecaudo("
                + "            dire_vlrrecaudo, dire_sdorecaudo, rec_ideregistro, "
                + "            dicn_ideregistr, dsus_ideregistr, per_ideregistro, "
                + "            cic_ideregistro, emp_ideregistro)"
                + "    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            sentencia.setDouble(1, distribucionRecaudo.getRecaudo().getValorReal());
            sentencia.setDouble(2, distribucionRecaudo.getRecaudo().getValorReal());
            sentencia.setLong(3, distribucionRecaudo.getRecaudo().getIdRecaudo());
            sentencia.setLong(4, distribucionRecaudo.getRecaudo().getIdConvenio());
            sentencia.setLong(5, distribucionRecaudo.getRecaudo().getIdSuscripcion());
            sentencia.setLong(6, distribucionRecaudo.getIdPeriodo());
            sentencia.setLong(7, distribucionRecaudo.getIdCiclo());
            sentencia.setLong(8, distribucionRecaudo.getRecaudo().getIdEmpresa());
            sentencia.executeUpdate();
            ResultSet rs = sentencia.getGeneratedKeys();
            if (rs.next()) {
                distribucionRecaudo.setIdDistribucionRecaudo(rs.getLong(1));
            }
        } finally {
            BDConexion.desconectar(sentencia);
        }

    }

    public SuscripcionDTO consultarSuscripcion(long idSuscripcion) throws SQLException, RegistroExcepcion {
        PreparedStatement sentencia = null;
        SuscripcionDTO suscripcion;
        try {
            String sql = "SELECT dsus_estado, dsus_descripcion, dsus_pcodigo, sus_ideregistro, "
                    + "       dsus_ideregistr, ter_ideregistro, pro_ideregistro, uni_municipio, "
                    + "       uni_barrio, est_tipsuscripc, uni_tipsuscripc, est_tipusosuscr, "
                    + "       uni_tipusosuscr, emp_ideregistro, est_liquidacion, uni_liquidacion, "
                    + "       cic_ideregistro, dsus_fecinicio, dsus_fecexpira, pro_catestrato, "
                    + "       dsus_iniestado, dsus_finestado"
                    + "  FROM dsus_detsuscrip where dsus_ideregistr=?";
            sentencia = cnn.prepareStatement(sql);
            sentencia.setLong(1, idSuscripcion);
            ResultSet rs = sentencia.executeQuery();
            if (rs.next()) {
                suscripcion = new SuscripcionDTO();
                suscripcion.setEstado(rs.getString("dsus_estado"));
                suscripcion.setDescripcion(rs.getString("dsus_descripcion"));
                suscripcion.setCodigoAnterior(rs.getString("dsus_pcodigo"));
                suscripcion.setIdSuscriptor(rs.getLong("sus_ideregistro"));
                suscripcion.setIdSuscripcion(idSuscripcion);
                suscripcion.setIdTercero(rs.getLong("ter_ideregistro"));
                suscripcion.setIdPropiedad(rs.getLong("pro_ideregistro"));
                suscripcion.setIdMunicipio(rs.getLong("uni_municipio"));
                suscripcion.setIdBarrio(rs.getLong("uni_barrio"));
                suscripcion.setIdEstructuraTipoSuscripcion(rs.getLong("est_tipsuscripc"));
                suscripcion.setIdTipoSuscripcion(rs.getLong("uni_tipsuscripc"));
                suscripcion.setIdEstructuraTipoUsoSuscripcion(rs.getLong("est_tipusosuscr"));
                suscripcion.setIdTipoUsoSuscripcion(rs.getLong("uni_tipusosuscr"));
                suscripcion.setIdEmpresa(rs.getLong("emp_ideregistro"));
                suscripcion.setIdEstructuraLiquidacion(rs.getLong("est_liquidacion"));
                suscripcion.setIdLiquidacion(rs.getLong("uni_liquidacion"));
                suscripcion.setIdCiclo(rs.getLong("cic_ideregistro"));
                suscripcion.setFechaInicio(rs.getDate("dsus_fecinicio"));
                suscripcion.setFechaExpira(rs.getDate("dsus_fecexpira"));
                suscripcion.setIdPropiedadEstrato(rs.getLong("pro_catestrato"));
                suscripcion.setInicioEstado(rs.getDate("dsus_iniestado"));
                suscripcion.setFinEstado(rs.getDate("dsus_finestado"));
                return suscripcion;
            }
        } finally {
            BDConexion.desconectar(sentencia);
        }
        throw new RegistroExcepcion(-4, "No se encontró la suscripción " + idSuscripcion);
    }

    public CicloPeriodoDTO consultarCicloPeriodo(long idSuscripcion) throws SQLException, RegistroExcepcion {
        PreparedStatement sentencia = null;
        CicloPeriodoDTO cicloPeriodo;
        String sql = "SELECT "
                + "     cic.cic_ideregistro idciclo,"
                + "     cic.cic_nombre ciclo, "
                + "     per.per_ideregistro idperiodo, "
                + "     per.per_nombre periodo"
                + "   FROM "
                + "     cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro"
                + "	inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro"
                + "   WHERE "
                + "     per.per_estado = 'A' and"
                + "     dsus.dsus_ideregistr= ?";
        try {
            sentencia = cnn.prepareStatement(sql);
            sentencia.setLong(1, idSuscripcion);
            ResultSet rs = sentencia.executeQuery();
            if (rs.next()) {
                cicloPeriodo = new CicloPeriodoDTO();
                cicloPeriodo.setIdCiclo(rs.getLong("idciclo"));
                cicloPeriodo.setIdPeriodo(rs.getLong("idperiodo"));
                return cicloPeriodo;
            }
        } finally {
            BDConexion.desconectar(sentencia);
        }
        throw new RegistroExcepcion(-5, "No se puede encontrar el ciclo periodo");

    }

    public void insertarInformacionAdicional(InformacionAdicionalDTO informacionAdicional) throws SQLException {
        PreparedStatement sentencia = null;
        try {
            String sql = "INSERT INTO infp_infforpago(infp_informacio, infp_estado, infp_descripcio,"
                    + "            fpre_ideregistr, uni_forpago, infp_grpinform, tip_ideregistro,"
                    + "            dtip_ideregistr, tip_nombre)"
                    + "   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            sentencia = cnn.prepareStatement(sql);
            sentencia.setString(1, informacionAdicional.getInformacion());
            sentencia.setString(2, informacionAdicional.getEstado());
            sentencia.setString(3, informacionAdicional.getDescripcion());
            sentencia.setLong(4, informacionAdicional.getFormaPago().getIdFormaPagoRecaudo());
            sentencia.setInt(5, informacionAdicional.getGrupoInformacion());
            sentencia.setLong(6, informacionAdicional.getIdTipo());
            sentencia.setLong(7, informacionAdicional.getIdDetalleTipo());
            sentencia.setString(8, informacionAdicional.getTipoNombre());
            sentencia.executeUpdate();
        } finally {
            BDConexion.desconectar(sentencia);
        }
    }

}
