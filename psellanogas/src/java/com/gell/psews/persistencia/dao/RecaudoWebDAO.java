/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dao;

import com.gell.psews.negocio.constantes.EEmpresa;
import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.PreparedStatementNamed;
import com.gell.psews.persistencia.dto.DetalleAplicacionRecaudoDTO;
import com.gell.psews.persistencia.dto.PagoAdicionalDTO;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.pse.filtroDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author lrey
 */
public class RecaudoWebDAO extends GenericoDAO {

    public RecaudoWebDAO(Connection cnn) {
        super(cnn);
    }

    public DetalleAplicacionRecaudoDTO obtenerFacturas(String id, int suscriptor)
            throws PersistenciaExcepcion {

        ArrayList<DetalleAplicacionRecaudoDTO> respuesta = new ArrayList<>();

        DetalleAplicacionRecaudoDTO objectDetalle = new DetalleAplicacionRecaudoDTO();
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        String valor = "";
        String valorDetalleFac = "";
        String saldo = "";
        int ppa_ideregistro = 0;
        SuscripcionDAO sus = new SuscripcionDAO(cnn);
        ArrayList<String> facturas = new ArrayList<>();
        ArrayList<PagoAdicionalDTO> carteraG = new ArrayList<>();
        int tipo_dsus = 1;
        String json = "";
        String jsonDfactura = "";
        LogUtil.error("MENSAJE PAGO ADICIONAL -> " + suscriptor + " +++++ " + id); 
        try {                        
            carteraG = sus.consultarMetodosG(suscriptor, tipo_dsus);
            for (int i = 0; i < carteraG.size(); i++) {

                Gson gson = new Gson();
                filtroDTO[] array = gson.fromJson(carteraG.get(i).getFiltro(), filtroDTO[].class);
                System.out.println(carteraG.get(i).getFuncion() + "-" + i);

                System.out.println("IMPRIMIENDO ARRAY");
                float valorfactura = 0;

                StringBuilder sb = new StringBuilder();
                sb.append("    select * from ")
                        .append(carteraG.get(i).getFuncion())
                        .append("(:empresa,:ppa_ideregistro,:dsuscripcion)");
                ps = new PreparedStatementNamed(cnn, sb.toString());
                ps.setObject("empresa", carteraG.get(i).getEmpresa());
                ps.setObject("ppa_ideregistro",Integer.parseInt(carteraG.get(i).getPpa_ideregistro()));
                ps.setObject("dsuscripcion", suscriptor);
                rs = ps.executeQuery();
                ArrayList<String> facturasid = new ArrayList<>();
                //float valorfactura = 0;

                ArrayList<String> idfacturasD = new ArrayList<>();
                while (rs.next()) {
                    LogUtil.error(rs.getString("idfactura"));
                    facturasid.add(rs.getString("idfactura"));
                    idfacturasD.add(rs.getString("dfactura"));

                    valorfactura = valorfactura + Float.parseFloat(rs.getString("saldo"));

                }
                
                
                 if (!facturasid.isEmpty()) {
                    String[] arrayfinalFacturas = facturasid.stream().toArray(String[]::new);                     
                    String[] arrayfinalFacturasD = idfacturasD.stream().toArray(String[]::new);

                    Gson g = new Gson();
                    json = g.toJson(arrayfinalFacturas);
                    
                    jsonDfactura=g.toJson(arrayfinalFacturasD);

                    objectDetalle.setDwra_valor(valorfactura);
                    objectDetalle.setDwra_idfacturas(json);
                    objectDetalle.setDwra_idfacturasd(jsonDfactura);
                    objectDetalle.setPpa_ideregistro(Integer.parseInt(id));
                    objectDetalle.setDwra_estaplicacion("P");
                }

                System.out.println(" cerrando conexion");
                ps.close();

            }    
            
            /*StringBuilder sql = new StringBuilder();
            sql.append("  SELECT ppa_dfacturas, ppa_ideregistro,ppa_facturas,ppa_valor FROM ppa_parapagoadicional where  idSuscriptor=:suscriptor and ppa_ideregistro=:id");

            ps = new PreparedStatementNamed(cnn, sql.toString(), true);

            ps.setInt("suscriptor", suscriptor);
            ps.setInt("id", Integer.parseInt(id));

            rs = ps.executeQuery();
            String json = "";
            String jsonDfactura = "";
            if (rs.next()) {

                valor = rs.getString("ppa_facturas");
                valorDetalleFac=rs.getString("ppa_dfacturas");

                saldo = rs.getString("ppa_valor");
                ppa_ideregistro = Integer.parseInt(rs.getString("ppa_ideregistro"));

                if (!valor.isEmpty()) {
                    String[] arrayfinalFacturas = valor.split(",");
                    
                     String[] arrayfinalFacturasD = valorDetalleFac.split(",");

                    Gson g = new Gson();
                    json = g.toJson(arrayfinalFacturas);
                    
                    jsonDfactura=g.toJson(arrayfinalFacturasD);

                    objectDetalle.setDwra_valor(Double.parseDouble(saldo));
                    objectDetalle.setDwra_idfacturas(json);
                    objectDetalle.setDwra_idfacturasd(jsonDfactura);
                    objectDetalle.setPpa_ideregistro(ppa_ideregistro);
                    objectDetalle.setDwra_estaplicacion("P");
                }

                //respuesta.add(objectDetalle);
            }

            
        */
        return objectDetalle;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public void insertarRecaudoWeb(RecaudoWebDTO recaudoWeb)
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO wrec_webrec( ")
                    .append("             wrec_fecha, wrec_vlrpagototal, wrec_estado,  ")
                    .append("            wrec_mensaje, wrec_amount, wrec_vatamount,  ")
                    .append("             wrec_paymentdescription, wrec_referencenumber1,  ")
                    .append("            wrec_referencenumber2, wrec_referencenumber3, wrec_servicecode,  ")
                    .append("            wrec_email, wrec_paymentidentifier,  uni_medpago, wrec_fields) ")
                    .append("    VALUES (now(), :valortotal, :estado,  ")
                    .append("            :mensaje, :amount, :vatamount,  ")
                    .append("            :paymentdescription, :referencenumber1,  ")
                    .append("            :referencenumber2, :referencenumber3, :servicecode,  ")
                    .append("            :email, :paymentidentifier, :mediopago, :campos::JSON)");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("valortotal", recaudoWeb.getValorPagoTotal());
            ps.setObject("estado", recaudoWeb.getEstado());
            ps.setObject("mensaje", recaudoWeb.getMensaje());
            ps.setObject("amount", recaudoWeb.getValorPagoTotal());
            ps.setObject("vatamount", recaudoWeb.getVatAmount());
            ps.setObject("paymentdescription", recaudoWeb.getPaymentDescription());
            ps.setObject("referencenumber1", recaudoWeb.getReferenceNumber1());
            ps.setObject("referencenumber2", recaudoWeb.getReferenceNumber2());
            ps.setObject("referencenumber3", recaudoWeb.getReferenceNumber3());
            ps.setObject("servicecode", recaudoWeb.getServiceCode());
            ps.setObject("email", recaudoWeb.getEmail());
            ps.setObject("paymentidentifier", recaudoWeb.getPaymentIdentifier());
            ps.setObject("mediopago", recaudoWeb.getMedioPago());
            ps.setObject("campos", recaudoWeb.getCamposPagador());
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                recaudoWeb.setPaymentId(rs.getString("wrec_ideregistro"));
                recaudoWeb.setIdRecaudoWeb(rs.getLong("wrec_ideregistro"));
                actualizarRecaudoWeb(recaudoWeb);
            }
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
    }

    public void insertarRecaudoWeb2(RecaudoWebDTO recaudoWeb, String facturasJson)
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("INSERT INTO wrec_webrec( ")
                    .append("             wrec_fecha, wrec_vlrpagototal, wrec_estado,  ")
                    .append("            wrec_mensaje, wrec_amount, wrec_vatamount,  ")
                    .append("             wrec_paymentdescription, wrec_referencenumber1,  ")
                    .append("            wrec_referencenumber2, wrec_referencenumber3, wrec_servicecode,  ")
                    .append("            wrec_email, wrec_paymentidentifier,  uni_medpago, wrec_fields) ")
                    .append("    VALUES (now(), :valortotal, :estado,  ")
                    .append("            :mensaje, :amount, :vatamount,  ")
                    .append("            :paymentdescription, :referencenumber1,  ")
                    .append("            :referencenumber2, :referencenumber3, :servicecode,  ")
                    .append("            :email, :paymentidentifier, :mediopago, :campos::JSON)");
            ps = new PreparedStatementNamed(cnn, sql.toString(), true);
            ps.setObject("valortotal", recaudoWeb.getValorPagoTotal());
            ps.setObject("estado", recaudoWeb.getEstado());
            ps.setObject("mensaje", recaudoWeb.getMensaje());
            ps.setObject("amount", recaudoWeb.getValorPagoTotal());
            ps.setObject("vatamount", recaudoWeb.getVatAmount());
            ps.setObject("paymentdescription", recaudoWeb.getPaymentDescription());
            ps.setObject("referencenumber1", recaudoWeb.getReferenceNumber1());
            ps.setObject("referencenumber2", recaudoWeb.getReferenceNumber2());
            ps.setObject("referencenumber3", recaudoWeb.getReferenceNumber3());
            ps.setObject("servicecode", recaudoWeb.getServiceCode());
            ps.setObject("email", recaudoWeb.getEmail());
            ps.setObject("paymentidentifier", recaudoWeb.getPaymentIdentifier());
            ps.setObject("mediopago", recaudoWeb.getMedioPago());
            ps.setObject("campos", recaudoWeb.getCamposPagador());
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                recaudoWeb.setPaymentId(rs.getString("wrec_ideregistro"));
                recaudoWeb.setIdRecaudoWeb(rs.getLong("wrec_ideregistro"));
                actualizarRecaudoWeb(recaudoWeb);
            }
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }
    }

    /* 
 public void insertarWrac(String facturasJson)
          throws PersistenciaExcepcion
  {
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      StringBuilder sql = new StringBuilder();
      sql.append("INSERT INTO wrec_webrec( ")
              .append("             wrec_fecha, wrec_vlrpagototal, wrec_estado,  ")
              .append("            wrec_mensaje, wrec_amount, wrec_vatamount,  ")
              .append("             wrec_paymentdescription, wrec_referencenumber1,  ")
              .append("            wrec_referencenumber2, wrec_referencenumber3, wrec_servicecode,  ")
              .append("            wrec_email, wrec_paymentidentifier,  uni_medpago, wrec_fields) ")
              .append("    VALUES (now(), :valortotal, :estado,  ")
              .append("            :mensaje, :amount, :vatamount,  ")
              .append("            :paymentdescription, :referencenumber1,  ")
              .append("            :referencenumber2, :referencenumber3, :servicecode,  ")
              .append("            :email, :paymentidentifier, :mediopago, :campos::JSON)");
      ps = new PreparedStatementNamed(cnn, sql.toString(), true);
      ps.setObject("facturasJson", facturasJson);

      ps.executeUpdate();
      rs = ps.getGeneratedKeys();
     
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_INSERTAR_RECAUDO_WEB);
    } finally {
      cerrar(ps, rs);
    }
  }**/
    public void actualizarRecaudoWeb(RecaudoWebDTO recaudoWeb)
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE wrec_webrec ")
                    .append("   SET wrec_fecha=:fecha, wrec_vlrpagototal=:valottotal, wrec_estado=:estado,  ")
                    .append("       wrec_mensaje=:mensaje, wrec_ticketofficeid=:ticketofficeid, wrec_amount=:amount, wrec_vatamount=:vatamount,  ")
                    .append("       wrec_paymentid=:paymentid, wrec_paymentdescription=:paymentdescription, wrec_referencenumber1=:referencenumber1,  ")
                    .append("       wrec_referencenumber2=:referencenumber2, wrec_referencenumber3=:referencenumber3, wrec_servicecode=:servicecode,  ")
                    .append("       wrec_email=:email, wrec_paymentidentifier=:paymentidentifier, uni_medpago=:mediopago ")
                    .append(" WHERE wrec_ideregistro = :idrecaudoweb ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idrecaudoweb", recaudoWeb.getIdRecaudoWeb());
            ps.setObject("fecha", new Timestamp(recaudoWeb.getFecha().getTime()));
            ps.setObject("valottotal", recaudoWeb.getValorPagoTotal());
            ps.setObject("estado", recaudoWeb.getEstado());
            ps.setObject("mensaje", recaudoWeb.getMensaje());
            ps.setObject("ticketofficeid", recaudoWeb.getTicketOfficeId());
            ps.setObject("amount", recaudoWeb.getValorPagoTotal());
            ps.setObject("vatamount", recaudoWeb.getVatAmount());
            ps.setObject("paymentid", Long.valueOf(recaudoWeb.getPaymentId()));
            ps.setObject("paymentdescription", recaudoWeb.getPaymentDescription());
            ps.setObject("referencenumber1", recaudoWeb.getReferenceNumber1());
            ps.setObject("referencenumber2", recaudoWeb.getReferenceNumber2());
            ps.setObject("referencenumber3", recaudoWeb.getReferenceNumber3());
            ps.setObject("servicecode", recaudoWeb.getServiceCode());
            ps.setObject("email", recaudoWeb.getEmail());
            ps.setObject("paymentidentifier", recaudoWeb.getPaymentIdentifier());
            ps.setObject("mediopago", recaudoWeb.getMedioPago());
            ps.executeUpdate();

        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ACTUALIZAR_RECAUDO_WEB);
        } finally {
            cerrar(ps);
        }
    }

    public RecaudoWebDTO consultar(Long idWebRecaudo)
            throws NegocioExcepcion, PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        RecaudoWebDTO resultado = null;
        try {
            String sql = "select * from wrec_webrec where wrec_ideregistro = :idrecaudoweb ";
            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("idrecaudoweb", idWebRecaudo);
            rs = ps.executeQuery();
            if (rs.next()) {
                resultado = getRecaudoWebDTO(rs);
            }
            rs.close();

            if (resultado == null) {
                throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONSULTAR_RECAUDO_WEB);
            }

            return resultado;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Este metodo filtra los wrec dependiendo de la empresa, en caso de
     * consumir el servicio para Llanogas se dee cambiar la empresa con
     * ID_LLANOGAS, y para el caso de cusiana se debe colocar ID_CUSIANAGAS
     *
     * @return
     * @throws PersistenciaExcepcion
     */
    public List<RecaudoWebDTO> consultarPendientes()
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        List<RecaudoWebDTO> lista = new ArrayList<>();
        try {
            String sql = "select      * "
                    + "   from        wrec_webrec wrec "
                    + "   inner join (select	(datos->>'pse.servicecode')::TEXT service_code "
                    + "               from 	(   select  (pp.par_parametro::JSON->>'PSE_PARAMETROS')::JSON datos "
                    + "                           from    par_parametro pp "
                    + "                           where   pp.emp_ideregistro = :empresa) dattos) param on param.service_code = wrec.wrec_servicecode "
                    + "   where       wrec_estado = :estado ";

            ps = new PreparedStatementNamed(cnn, sql);
            ps.setObject("empresa", EEmpresa.ID_LLANOGAS);
            ps.setObject("estado", EEstado.RecaudoWeb.PENDIENTE);
            rs = ps.executeQuery();
            while (rs.next()) {
                lista.add(getRecaudoWebDTO(rs));
            }
            return lista;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Este metodo filtra los wrec dependiendo de la empresa, en caso de
     * consumir el servicio para Llanogas se dee cambiar la empresa con
     * ID_LLANOGAS, y para el caso de cusiana se debe colocar ID_CUSIANAGAS
     *
     * @return
     * @throws PersistenciaExcepcion
     */
    public List<RecaudoWebDTO> consultarPendientesPago()
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        List<RecaudoWebDTO> lista = new ArrayList<>();
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(" SELECT * ")
                    .append(" FROM wrec_webrec wrec ")
                    .append(" WHERE wrec.wrec_ideregistro IN ( ")
                    .append("  SELECT DISTINCT wrec.wrec_ideregistro ")
                    .append("  FROM wrec_webrec wrec ")
                    .append("  INNER JOIN (   SELECT  key, value")
                    .append("                 FROM    json_each_text((SELECT  (pp.par_parametro::JSON->>'PSE_PARAMETROS')::JSON datos ")
                    .append("                                         FROM    par_parametro pp ")
                    .append("                                         WHERE   pp.emp_ideregistro = :empresa)) dattos ")
                    .append("                 WHERE       key = 'pse.servicecode') param on param.value = wrec.wrec_servicecode ")
                    .append("  INNER JOIN dwre_detwebrec dwre ON wrec.wrec_ideregistro = dwre.wrec_ideregistro ")
                    .append("  WHERE wrec.wrec_estado = :estado ")
                    .append("        AND dwre.dwre_estpago = :estadopago ")
                    .append("        AND (dwre.dwre_estaplpago = :estadoaplicacion OR dwre.dwre_estaplpago = :estadoaplicacion1 )")
                    .append(")");
            ps = new PreparedStatementNamed(cnn, sb.toString());
            ps.setObject("empresa", EEmpresa.ID_BIOAGRICOLA);
            ps.setObject("estado", EEstado.RecaudoWeb.ENVIADO);
            ps.setObject("estadopago", EEstado.DetalleRecaudoWeb.Pago.OK);
            ps.setObject("estadoaplicacion", EEstado.DetalleRecaudoWeb.Aplicacion.PENDIENTE);
            ps.setObject("estadoaplicacion1", EEstado.DetalleRecaudoWeb.Aplicacion.ERROR_APLICACION);
            rs = ps.executeQuery();
            LogUtil.error("empresa: "+EEmpresa.ID_BIOAGRICOLA+  " -- estado: "+EEstado.RecaudoWeb.ENVIADO);
            while (rs.next()) {
                lista.add(getRecaudoWebDTO(rs));
            }
            return lista;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public static RecaudoWebDTO getRecaudoWebDTO(ResultSet rs)
            throws PersistenciaExcepcion {
        RecaudoWebDTO recaudoDTO = new RecaudoWebDTO();
        recaudoDTO.setIdRecaudoWeb(getObject("wrec_ideregistro", Long.class, rs));
        recaudoDTO.setFecha(getObject("wrec_fecha", Timestamp.class, rs));
        recaudoDTO.setValorPagoTotal(getObject("wrec_vlrpagototal", Double.class, rs));
        recaudoDTO.setEstado(getObject("wrec_estado", String.class, rs));
        recaudoDTO.setMensaje(getObject("wrec_mensaje", String.class, rs));
        recaudoDTO.setTicketOfficeId(getObject("wrec_ticketofficeid", Integer.class, rs));
        recaudoDTO.setVatAmount(getObject("wrec_vatamount", Double.class, rs));
        recaudoDTO.setPaymentId(getObject("wrec_paymentid", String.class, rs));
        recaudoDTO.setPaymentDescription(getObject("wrec_paymentdescription", String.class, rs));
        recaudoDTO.setReferenceNumber1(getObject("wrec_referencenumber1", String.class, rs));
        recaudoDTO.setReferenceNumber2(getObject("wrec_referencenumber2", String.class, rs));
        recaudoDTO.setReferenceNumber3(getObject("wrec_referencenumber3", String.class, rs));
        recaudoDTO.setServiceCode(getObject("wrec_servicecode", String.class, rs));
        recaudoDTO.setEmail(getObject("wrec_email", String.class, rs));
        recaudoDTO.setPaymentIdentifier(getObject("wrec_paymentidentifier", String.class, rs));
        recaudoDTO.setMedioPago(getObject("uni_medpago", Long.class, rs));
        return recaudoDTO;
    }

}
