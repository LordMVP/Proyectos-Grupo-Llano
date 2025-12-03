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
import com.gell.psews.persistencia.dto.DetalleFacturaDTO;
import com.gell.psews.persistencia.dto.FacturaDTO;
import com.gell.psews.persistencia.dto.InfoDetalleFacturaDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.google.gson.Gson;
import java.sql.Array;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Realiza la gestión de todas las facturas
 *
 * @author lrey
 */
public class FacturaDAO extends GenericoDAO {

    public FacturaDAO(Connection cnn) {
        super(cnn);
    }

    /**
     * Valida si las facturas de las suscripciones están consistentes
     *
     * @param listaSuscripciones Ids de las suscripciones que se le va a
     * realizar el pago
     * @throws NegocioExcepcion Si hay facturas inconsistentes
     * @throws PersistenciaExcepcion Error al ejecutar la sentencia
     */
    public void consultarConsistenciaFactura(Long[] listaSuscripciones) throws NegocioExcepcion, PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("SELECT ")
                    .append("   fac.fac_ideregistro, ")
                    .append("   fac.fac_vlrreal, ")
                    .append("   sum(dfac.dfac_vlrreal) ")
                    .append(" FROM fac_factura fac ")
                    .append("   INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro ")
                    .append("   INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto ")
                    .append(" WHERE fac.dsus_ideregistr = ANY(:ids::bigint[])")
                    .append("       AND fac.fac_estado = 'A' ")
                    .append("       AND con.con_operacion = 'S' ")
                    .append("       AND fac.fac_idepadre IS NULL ")
                    .append("       AND fac.fac_sdoreal > 0 ")
                    .append(" GROUP BY ")
                    .append("   fac.fac_ideregistro, ")
                    .append("   fac.fac_vlrreal ")
                    .append(" HAVING sum(dfac.dfac_vlrreal) <> fac.fac_vlrreal");//modifica funcion.
            ps = new PreparedStatementNamed(cnn, sb.toString());
            Array suscripciones = cnn.createArrayOf("bigint", listaSuscripciones);
            ps.setArray("ids", suscripciones);
            rs = ps.executeQuery();
            if (rs.next()) {
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURAS_INCONSISTENTES);
            }
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_FACTURAS);
        } finally {
            cerrar(ps, rs);
        }
    }

    public ArrayList<String> retornarJsonFacturappa(Long idSuscripcion, String empresa) throws PersistenciaExcepcion {
        List<FacturaDTO> lista = new ArrayList<>();
        PreparedStatementNamed ps = null;
        ResultSet rs = null;

        ArrayList<String> json = new ArrayList<>();
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT ppa_facturas FROM ppa_parapagoadicional  where idsuscriptor=:idsuscripcion and emp_ideregistro=:empresa and ppa_estado ='A' ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            ps.setObject("empresa", Integer.parseInt(empresa));

            rs = ps.executeQuery();
            while (rs.next()) {
                json.add(rs.getString("ppa_facturas"));
            }
            return json;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public ArrayList<String> retornarJsonFacturadwra(Long idSuscripcion) throws PersistenciaExcepcion {
        List<FacturaDTO> lista = new ArrayList<>();
        PreparedStatementNamed ps = null;
        ResultSet rs = null;

        ArrayList<String> json = new ArrayList<>();
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT dwra_idfacturas FROM public.dwra_detaplicarecaudo where idsuscriptor=:idsuscripcion and dwra_estaplicacion ='P' ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            rs = ps.executeQuery();
            while (rs.next()) {
                json.add(rs.getString("dwra_idfacturas"));
            }
            return json;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public int consultarFacturaAdicional(Long idsuscriptor, String idfactura, String empresa) throws PersistenciaExcepcion {
        ArrayList<String> s = new ArrayList<>();
        ArrayList<String> s2 = new ArrayList<>();

        ArrayList<FacturaDTO> lista = new ArrayList<>();
        FacturaDTO factura = new FacturaDTO();

        ArrayList<String> tramas = new ArrayList<>();
        int bandera2 = 0;
        int bandera = 0;

        // validamos facruras id hace parte de pago adicional ppa
        s2 = this.retornarJsonFacturappa(idsuscriptor, empresa);
        System.out.println("json facturas de adicionales seleccionados....");
        Gson g2 = new Gson();
        for (String string : s2) {
            System.out.println(string);

            String[] a = string.split(",");
            if (a != null) {

                for (String string1 : a) {

                    if (string1.equals(idfactura)) {
                        bandera2 = 1;
                    }
                }
            }

        }
//--------

        if (bandera2 == 1) {

            // validamos facruras id esta en el pago adicional seleccionada dwra
            s = this.retornarJsonFacturadwra(idsuscriptor);
            System.out.println("json factura seleccionado....");
            Gson g = new Gson();
            for (String string : s) {
                System.out.println(string);

                String[] a = g.fromJson(string, String[].class);
                if (a != null) {

                    for (String string1 : a) {
                        if (string1.equals(idfactura)) {
                            bandera = 1;

                            System.out.println("la factura " + idfactura + " hace parte de pago adicional");
                        }

                    }
                }

            }
        } else {// no hace parte de adicionales entonces aplica
            bandera = 1;
        }
//--------
// si id hace parte de adicionales pero no fue seleccionado por usuario en el front de pagos adicionales no aplica factura
        if (bandera2==1&&bandera==0) {bandera= 0;
            
        }

// si bandera = 1 permite añadirlo
        return bandera;

    }

    /**
     * Consulta las facturas con saldo de una suscripción
     *
     * @param idSuscripcion
     * @return
     * @throws PersistenciaExcepcion Error al ejecutar la sentencia
     */
    public List<FacturaDTO> consultarFacturasConSaldo(Long idSuscripcion, String empresa) throws PersistenciaExcepcion {
        List<FacturaDTO> lista = new ArrayList<>();
        LogUtil.info("FacturaDAO.ConsultarFacturasconSaldo Suscripción: " + idSuscripcion);
        int bandera = 0;
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT ")
                    .append("   fac.fac_ideregistro idfactura, ")
                    .append("   fac.fac_fecha       fecha, ")
                    .append("   fac.per_ideregistro idperiodo, ")
                    .append("   fac.uni_documento   iddocumento, ")
                    .append("   fac.uni_tipdocument idtipodocumento, ")
                    .append("   fac.fac_vlrreal     valorreal, ")
                    .append("   fac.fac_sdoreal     saldo, ")
                    .append("   fac.fac_version AS  version, ")
                    .append("   doc.doc_pagpriori   prioridad ")
                    .append(" FROM ")
                    .append("   fac_factura fac ")
                    .append("    INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento ")
                    .append("    inner join dsus_detsuscrip dd on dd.dsus_ideregistr = :idsuscripcion") //JLMENDOZA
                    //.append(" WHERE fac.dsus_ideregistr = :idsuscripcion ") 
                    .append(" WHERE fac.dsus_ideregistr = dd.dsus_ideregistr ")
                            //+ "and fac.sus_ideregistro = dd.sus_ideregistro ") 
                    .append("       AND fac.fac_sdoreal > 0 ")
                    .append("       AND fac.fac_estado = 'A' ")
                    .append("       AND fac.fac_idepadre IS NULL ")
                    .append("       AND fac.fac_ideregistro not in ( ")
                    .append("       select ff.fac_ideregistro  from aseo.fmg_facturacioncarterag ff ")
                    .append("       where ff.facmarc_estado  = 'A' and ff.dsus_ideregistr = fac.dsus_ideregistr ) ")
                    .append(" ORDER BY fac.per_ideregistro, fac.fac_fecha, prioridad, fac.fac_ideregistro");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            rs = ps.executeQuery();

            while (rs.next()) {
                FacturaDTO factura = new FacturaDTO();
                factura.setIdFactura(rs.getLong("idfactura"));
                factura.setFecha(rs.getTimestamp("fecha"));
                factura.setIdPeriodo(rs.getLong("idperiodo"));
                factura.setIdDocumento(rs.getLong("iddocumento"));
                factura.setIdTipoDocumento(rs.getLong("idtipodocumento"));
                factura.setValorReal(rs.getDouble("valorreal"));
                factura.setSaldo(rs.getDouble("saldo"));
                factura.setVersion(rs.getInt("version"));

                bandera = this.consultarFacturaAdicional(idSuscripcion, factura.getIdFactura().toString(), empresa);

                if (bandera == 1) {
                    lista.add(factura);
                }

            }
            return lista;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }
    
        /**
     * Consulta las facturas con saldo de una suscripción Cartera G
     *
     * @param idSuscripcion
     * @return
     * @throws PersistenciaExcepcion Error al ejecutar la sentencia
     */
    public List<FacturaDTO> consultarFacturasConSaldoG(Long idSuscripcion, String empresa) throws PersistenciaExcepcion {
        List<FacturaDTO> lista = new ArrayList<>();
        LogUtil.info("FacturaDAO.ConsultarFacturascon SaldoCARTERA G Suscripción: " + idSuscripcion);
        int bandera = 0;
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT ")
                    .append("   fac.fac_ideregistro idfactura, ")
                    .append("   fac.fac_fecha       fecha, ")
                    .append("   fac.per_ideregistro idperiodo, ")
                    .append("   fac.uni_documento   iddocumento, ")
                    .append("   fac.uni_tipdocument idtipodocumento, ")
                    .append("   fac.fac_vlrreal     valorreal, ")
                    .append("   fac.fac_sdoreal     saldo, ")
                    .append("   fac.fac_version AS  version, ")
                    .append("   doc.doc_pagpriori   prioridad ")
                    .append(" FROM ")
                    .append("   fac_factura fac ")
                    .append("    INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento ")
                    .append("    inner join dsus_detsuscrip dd on dd.dsus_ideregistr = :idsuscripcion") //JLMENDOZA
                    //.append(" WHERE fac.dsus_ideregistr = :idsuscripcion ") 
                    .append(" WHERE fac.dsus_ideregistr = dd.dsus_ideregistr ")
                            //+ "and fac.sus_ideregistro <> dd.sus_ideregistro ")
                    .append("       AND fac.fac_sdoreal > 0 ")
                    .append("       AND fac.fac_estado = 'A' ")
                    .append("       AND fac.fac_idepadre IS NULL ")
                    .append("       AND fac.fac_ideregistro in ( ")
                    .append("       select ff.fac_ideregistro  from aseo.fmg_facturacioncarterag ff ")
                    .append("       where ff.facmarc_estado  = 'A' and ff.dsus_ideregistr = fac.dsus_ideregistr ) ")
                    .append(" ORDER BY fac.per_ideregistro, fac.fac_fecha, prioridad, fac.fac_ideregistro");
            
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            rs = ps.executeQuery();
            
            while (rs.next()) {
                LogUtil.error("Recorriendo:");
                FacturaDTO factura = new FacturaDTO();
                factura.setIdFactura(rs.getLong("idfactura"));
                factura.setFecha(rs.getTimestamp("fecha"));
                factura.setIdPeriodo(rs.getLong("idperiodo"));
                factura.setIdDocumento(rs.getLong("iddocumento"));
                factura.setIdTipoDocumento(rs.getLong("idtipodocumento"));
                factura.setValorReal(rs.getDouble("valorreal"));
                factura.setSaldo(rs.getDouble("saldo"));
                factura.setVersion(rs.getInt("version"));

                bandera = this.consultarFacturaAdicional(idSuscripcion, factura.getIdFactura().toString(), empresa);

                if (bandera == 1) {
                    lista.add(factura);
                }

            }            
            return lista;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }
    
    
    
    

    /**
     * Se consulta el valor a pagar de las facturas
     *
     * @param idsSuscripciones arreglo con los identificadores de las
     * suscripciones
     * @return Saldo de todas las facturas de las suscripciones
     * @throws PersistenciaExcepcion
     */
    public Double consultarSaldoFacturasAdicional(Integer idsSuscripciones) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT sum(dwra_valor) saldo FROM dwra_detaplicarecaudo where idsuscriptor =:ids");
            ps = new PreparedStatementNamed(cnn, sql.toString());

            ps.setObject("ids", idsSuscripciones);
            rs = ps.executeQuery();
            rs.next();
            return rs.getDouble("saldo");
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Se consulta el valor a pagar de las facturas
     *
     * @param idsSuscripciones arreglo con los identificadores de las
     * suscripciones
     * @return Saldo de todas las facturas de las suscripciones
     * @throws PersistenciaExcepcion
     */
    public Double consultarSaldoFacturas(Long[] idsSuscripciones) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;        
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT ")
                    .append("   coalesce(sum(fac.fac_sdoreal), 0) saldo ")
                    .append(" FROM ")
                    .append("   fac_factura fac ")
                    .append("   inner join dsus_detsuscrip dd on dd.dsus_ideregistr = ANY(:ids::bigint[]) ")
                    .append(" WHERE fac.dsus_ideregistr = dd.dsus_ideregistr ")
                            //+ "and fac.sus_ideregistro = dd.sus_ideregistro ")
                    .append("       AND fac.fac_sdoreal > 0 ")
                    .append("       AND fac.fac_estado = 'A' ")
                    .append("       AND fac.fac_idepadre IS NULL ")
                    .append("       AND fac.fac_ideregistro not in ( ")
                    .append("       select ff.fac_ideregistro  from aseo.fmg_facturacioncarterag ff ")
                    .append("       where ff.facmarc_estado  = 'A' ); ");
                    
            /*sql.append("SELECT ")
                    .append("   coalesce(sum(fac.fac_sdoreal), 0) saldo ")
                    .append(" FROM ")
                    .append("   fac_factura fac ")
                    .append(" WHERE fac.dsus_ideregistr =ANY(:ids::bigint[]) ")
                    .append("       AND fac.fac_sdoreal > 0 ")
                    .append("       AND fac.fac_estado = 'A' ")
                    .append("       AND fac.fac_idepadre IS NULL ");*/ // ORIGINAL
            ps = new PreparedStatementNamed(cnn, sql.toString());
            Array suscripciones = cnn.createArrayOf("BIGINT", idsSuscripciones);
            ps.setObject("ids", suscripciones);
            rs = ps.executeQuery();
            rs.next();
            return rs.getDouble("saldo");
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public List<DetalleFacturaDTO> consultarDetallesConSaldo(Long idFactura) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        List<DetalleFacturaDTO> lista = new ArrayList();
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT ")
                    .append("   dfac.dfac_ideregistr   iddetallefactura, ")
                    .append("   dfac.dfac_estado   estado, ")
                    .append("   dfac.dfac_cantidad cantidad, ")
                    .append("   dfac.dfac_vlrunitari valorunitario, ")
                    .append("   dfac.dfac_vlrtotal valortotal, ")
                    .append("   dfac.dfac_vlrreal valorreal, ")
                    .append("   dfac.dfac_sdoreal saldo, ")
                    .append("   dfac.fac_ideregistro idfactura, ")
                    .append("   dfac.uni_concepto idconcepto, ")
                    .append("   dfac.dfac_version as version ")
                    .append(" FROM dfac_detfactura dfac ")
                    .append(" WHERE dfac.fac_ideregistro = :idfactura ")
                    .append("       AND dfac.dfac_sdoreal > 0 ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idfactura", idFactura);
            rs = ps.executeQuery();
            while (rs.next()) {
                DetalleFacturaDTO detalle = new DetalleFacturaDTO();
                detalle.setIdDetalleFactura(rs.getLong("iddetallefactura"));
                detalle.setEstado(rs.getString("estado"));
                detalle.setCantidad(rs.getDouble("cantidad"));
                detalle.setValorUnitario(rs.getDouble("valorunitario"));
                detalle.setValorTotal(rs.getDouble("valortotal"));
                detalle.setValorReal(rs.getDouble("valorreal"));
                detalle.setSaldo(rs.getDouble("saldo"));
                detalle.setFactura(new FacturaDTO(rs.getLong("idfactura")));
                detalle.setIdConcepto(rs.getLong("idconcepto"));
                detalle.setVersion(rs.getInt("version"));
                lista.add(detalle);
            }
            return lista;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DETALLES);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Consulta todos los detalles de la factura de acuerdo a la función de los
     * conceptos
     *
     * @param factura información de la factura
     * @return lista de detalles
     * @throws PersistenciaExcepcion
     */
    public List<InfoDetalleFacturaDTO> consultarDetallesFacturasConciliado(FacturaDTO factura) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        List<InfoDetalleFacturaDTO> listaDetalles = new ArrayList();
        try {
            String sql = "SELECT * FROM getconceptos(:idfactura::INTEGER)";
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("idfactura", factura.getIdFactura());
            rs = ps.executeQuery();
            while (rs.next()) {
                InfoDetalleFacturaDTO infoDetalle = new InfoDetalleFacturaDTO();
                infoDetalle.setIdDetalleFactura(rs.getLong("iddetallefactura"));
                infoDetalle.setConcepto(rs.getString("concepto"));
                infoDetalle.setIdConcepto(rs.getLong("idconcepto"));
                infoDetalle.setValor(rs.getDouble("valor"));
                infoDetalle.setValorPagado(rs.getDouble("valorpagado"));
                infoDetalle.setVersion(rs.getInt("version"));
                listaDetalles.add(infoDetalle);
            }
            return listaDetalles;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public void actualizarDetalleFactura(InfoDetalleFacturaDTO infoDetalle) throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        try {
            String sql = "update dfac_detfactura set dfac_vlrreal = :valorreal, dfac_sdoreal= :saldo, dfac_version=dfac_version+1 WHERE dfac_ideregistr = :iddetallefactura";
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("valorreal", infoDetalle.getValor());
            ps.setObject("saldo", infoDetalle.getValor() - infoDetalle.getValorPagado());
            ps.setObject("iddetallefactura", infoDetalle.getIdDetalleFactura());
            ps.executeUpdate();
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ACTUALIZAR_FACTURA);
        } finally {
            cerrar(ps);
        }
    }

    public void actualizarFactura(FacturaDTO factura) throws NegocioExcepcion, PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        try {
            String sql = "UPDATE fac_factura set fac_sdoreal = :saldo, fac_version= fac_version+1, fac_vlrreal = :valor WHERE fac_ideregistro=:idfactura AND fac_version = :version ";
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("saldo", factura.getSaldo());
            ps.setObject("valor", factura.getValorReal());
            ps.setObject("idfactura", factura.getIdFactura());
            ps.setObject("version", factura.getVersion());
            int resultado = ps.executeUpdate();
            if (resultado == 0) {
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_ACTUALIZAR_FACTURA);
            }
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ACTUALIZAR_FACTURA);
        } finally {
            cerrar(ps);
        }
    }

    public void estadodwra(int idsuscriptor) {
        PreparedStatementNamed ps = null;
        String sql = "update dwra_detaplicarecaudo set dwra_estaplicacion ='A'  where idsuscriptor= :id";
        try {
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("id", idsuscriptor);

            ps.executeUpdate();
        } catch (SQLException ex) {
            Logger.getLogger(FacturaDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    /**
     * @deprecated Se coloca en estado obsoleto para tomar la fecha de
     * vencimiento de la factura de gas.
     *
     * Valida todas las facturas vencidas de las suscripciones del convenio.
     * @param idsSuscripciones
     * @throws NegocioExcepcion
     * @throws PersistenciaExcepcion
     */
    public void validarFacturaVencidas(Long[] idsSuscripciones) throws NegocioExcepcion, PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(" SELECT count(*) cantidad ")
                    .append(" FROM fac_factura fac ")
                    .append(" WHERE fac.fac_sdoreal > 0 ")
                    .append("      AND fac.fac_estado = 'A' ")
                    .append("      AND fac.fac_idepadre IS NULL ")
                    .append("      AND fac.fac_fecvence::date < now()::date ")
                    .append("      AND fac.dsus_ideregistr = ANY(:ids::bigint[])");
            ps = new PreparedStatementNamed(cnn, sb.toString());
            Array suscripciones = cnn.createArrayOf("bigint", idsSuscripciones);
            ps.setArray("ids", suscripciones);
            rs = ps.executeQuery();
            rs.next();
            int cantidad = rs.getInt("cantidad");
            if (cantidad > 0) {
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_FACTURA_VENCIDA);
            }
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_FACTURAS);
        } finally {
            cerrar(ps, rs);
        }

    }

}
