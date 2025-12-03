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
import com.gell.psews.persistencia.dto.CicloDTO;
import com.gell.psews.persistencia.dto.PagoAdicionalDTO;
import com.gell.psews.persistencia.dto.SuscripcionDTO;
import com.gell.psews.persistencia.dto.UsuarioDTO;
import com.gell.psews.persistencia.dto.pse.JsonFacturasDTO;
import com.gell.psews.persistencia.dto.pse.filtroDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Clase encargada de realizar las consultas de la información del usuario
 *
 * @author lrey
 */
public class SuscripcionDAO extends GenericoDAO {

    public SuscripcionDAO(Connection cnn) {
        super(cnn);
    }

    public Long consultarIDSuscripcion(String codigo, long idEmpresa)
            throws PersistenciaExcepcion, NegocioExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        StringBuilder sb = new StringBuilder();
        try {
            sb.append("SELECT ")
                    .append("   dsus1.dsus_ideregistr idsuscripcion ")
                    .append(" FROM dsus_detsuscrip dsus ")
                    .append("   LEFT JOIN dsus_detsuscrip dsus1 ON dsus.sus_ideregistro = dsus1.sus_ideregistro ")
                    .append(" WHERE (dsus.dsus_ideregistr::CHARACTER VARYING = :idsuscripcion OR dsus.dsus_pcodigo =:codigoanterior)  ")
                    .append("       AND dsus1.emp_ideregistro = :idempresa AND dsus.dsus_estado = 'A' AND dsus1.dsus_estado = 'A' ");
            ps = new PreparedStatementNamed(cnn, sb.toString());
            ps.setObject("idsuscripcion", codigo+"");
            ps.setObject("codigoanterior", codigo+"");
            ps.setObject("idempresa", idEmpresa);
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getLong("idsuscripcion");
            }
            LogUtil.info(EMensajes.ERROR_NEGOCIO_SUSCRIPCION_NO_ENCONTRADA.getMensaje() + " código:" + codigo + " IdEmpresa:" + idEmpresa);
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_SUSCRIPCION_NO_ENCONTRADA);
        } catch (SQLException ex) {
            LogUtil.error(ex);
            AplicacionExcepcion exe = procesarExcepcion(ex);
            if (exe instanceof NegocioExcepcion) {
                throw (NegocioExcepcion) exe;
            }
            throw (PersistenciaExcepcion) exe;
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Consulta la información del usuario que debe pagar por cada una de las
     * suscripciones
     *
     * @param codigo id suscripción o código anterior
     * @param idEmpresa Identificador de la empresa que está recaudando
     * (Llanogas o Cusiana)
     * @return UsuarioDTO con la información que debe pagar
     * @throws AplicacionExcepcion No se encontró la suscripción o tiene
     * facturas en mora
     */
    public UsuarioDTO consultarPago(String codigo, Integer idEmpresa)
            throws AplicacionExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        StringBuilder sb = new StringBuilder();
        UsuarioDTO usuario;
        try {
            sb.append("SELECT * ")
                    .append("FROM getliq_facturacion_pse(:idsuscripcion,:idempresa,'S')");
            ps = new PreparedStatementNamed(cnn, sb.toString());
            ps.setObject("idsuscripcion", codigo);
            ps.setObject("idempresa", idEmpresa);
            rs = ps.executeQuery();
            if (rs.next()) {
                usuario = new UsuarioDTO();
                usuario.setIdSuscripcion(rs.getLong("idsuscripcion"));
                usuario.setNombres(rs.getString("nombres"));
                usuario.setDireccion(rs.getString("direccion"));
                usuario.setFechaVencimiento(rs.getDate("fechavencimiento"));
                usuario.setValorGas(rs.getDouble("valorgas"));
                usuario.setValorAseo(rs.getDouble("valoraseo"));
                usuario.setCodigoanteriorAseo(rs.getString("codigoanterioraseo"));
                usuario.setNumeroFacturaAseo(rs.getString("numerofacturaaseo"));
                usuario.setIdSuscripcionAseo(rs.getLong("idsuscripcionaseo"));

                return usuario;
            }
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_SUSCRIPCION_NO_ENCONTRADA);
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw procesarExcepcion(ex);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Consulta todas las suscripciones asociadas a un convenio dependiendo del
     * usuario y de acuerdo a la prioridad de pago
     *
     * @param idSuscripcion idsuscripcion de la empresa de llanogas
     * @return lista de suscripciones
     * @throws PersistenciaExcepcion
     */
    public List<SuscripcionDTO> consultarSuscripcionesConvenio(Long idSuscripcion)
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        SuscripcionDTO suscripcion;
        List<SuscripcionDTO> lista = new ArrayList<>();
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("SELECT DISTINCT ")
                    .append("   dsus.dsus_ideregistr   idsuscripcion, ")
                    .append("   dsus.emp_ideregistro   idempresa, ")
                    .append("   dicn.dicn_pagprioridad prioridad, ")
                    .append("   dsus.cic_ideregistro   idciclo, ")
                    .append("   dsus.dsus_estado       estado, ")
                    .append("   dsus.dsus_descripcion  descripcion, ")
                    .append("   dsus.dsus_pcodigo      codigoanterior, ")
                    .append("   dsus.sus_ideregistro   idsuscriptor, ")
                    .append("   dsus.ter_ideregistro   idtercero, ")
                    .append("   dsus.pro_ideregistro   idpropiedad, ")
                    .append("   dsus1.uni_municipio    idmunicipio, ")
                    .append("   dsus.uni_barrio        idbarrio, ")
                    .append("   dsus.est_tipsuscripc   idestructuratiposuscripcion, ")
                    .append("   dsus.uni_tipsuscripc   idtiposuscripcion, ")
                    .append("   dsus.est_tipusosuscr   idestructuratipousosuscripcion, ")
                    .append("   dsus.uni_tipusosuscr   idtipousosuscripcion, ")
                    .append("   dsus.emp_ideregistro   idempresa, ")
                    .append("   dsus.est_liquidacion   idestructuraliquidacion, ")
                    .append("   dsus.uni_liquidacion   idliquidacion, ")
                    .append("   ter.uni_tiptercero     idtipotercero, ")
                    .append("   sus.cnre_ideregistr    idconvenio, ")
                    .append("   dicn.dicn_ideregistr   iddistribucionconvenio ")
                    .append(" FROM dsus_detsuscrip dsus1 ")
                    .append("   INNER JOIN sus_suscripcion sus ON dsus1.sus_ideregistro = sus.sus_ideregistro ")
                    .append("   INNER JOIN dicn_disconven dicn ON dicn.cnre_ideregistr = sus.cnre_ideregistr ")
                    .append("   INNER JOIN dsus_detsuscrip dsus ")
                    .append("     ON sus.sus_ideregistro = dsus.sus_ideregistro AND dicn.emp_ideregistro = dsus.emp_ideregistro ")
                    .append("   INNER JOIN ter_tercero ter ON dsus.ter_ideregistro = ter.ter_ideregistro ")
                    .append(" WHERE dsus1.dsus_ideregistr = :idsuscripcion  ")
                    .append("       AND dsus.dsus_estado = 'A' AND dsus.uni_tipsuscripc = dicn.uni_tipsuscripc  ")
                    .append(" ORDER BY dicn.dicn_pagprioridad;");
            ps = new PreparedStatementNamed(cnn, sb.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            rs = ps.executeQuery();
            while (rs.next()) {
                suscripcion = new SuscripcionDTO();
                suscripcion.setIdSuscripcion(rs.getLong("idsuscripcion"));
                suscripcion.setIdEmpresa(rs.getInt("idempresa"));
                suscripcion.setPrioridad(getObject("prioridad", Integer.class, rs));
                suscripcion.setIdCiclo(rs.getInt("idciclo"));
                suscripcion.setEstado(rs.getString("estado"));
                suscripcion.setDescripcion(rs.getString("descripcion"));
                suscripcion.setCodigoAnterior(rs.getString("codigoanterior"));
                suscripcion.setIdSuscriptor(rs.getLong("idsuscriptor"));
                suscripcion.setIdTercero(rs.getLong("idtercero"));
                suscripcion.setIdPropiedad(rs.getLong("idpropiedad"));
                suscripcion.setIdMunicipio(rs.getLong("idmunicipio"));
                suscripcion.setIdBario(rs.getLong("idbarrio"));
                suscripcion.setIdEstructuraTipo(rs.getLong("idestructuratiposuscripcion"));
                suscripcion.setIdTipo(rs.getLong("idtiposuscripcion"));
                suscripcion.setIdEstructuraTipoUso(rs.getLong("idestructuratipousosuscripcion"));
                suscripcion.setIdTipoUso(rs.getLong("idtipousosuscripcion"));
                suscripcion.setIdEstructuraLiquidacion(rs.getLong("idestructuraliquidacion"));
                suscripcion.setIdLiquidacion(rs.getLong("idliquidacion"));
                suscripcion.setIdTipoTercero(rs.getLong("idtipotercero"));
                suscripcion.setIdConvenio(rs.getLong("idconvenio"));
                suscripcion.setIdDistribucionConvenio(rs.getLong("iddistribucionconvenio"));
                lista.add(suscripcion);
            }
            return lista;
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_SUSCRIPCION_CONVENIO);
        } finally {
            cerrar(ps, rs);
        }
    }

    /**
     * Consulta la información del ciclo y del periodo activo
     *
     * @param idSuscripcion identificador de la suscripción
     * @return Información del ciclo y del periodo
     * @throws NegocioExcepcion No se encontró el ciclo
     * @throws PersistenciaExcepcion Error al ejecutar la consulta
     */
    public CicloDTO consultarCiclo(Long idSuscripcion)
            throws NegocioExcepcion, PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("SELECT ")
                    .append("     cic.cic_ideregistro idciclo, ")
                    .append("     cic.cic_nombre ciclo, ")
                    .append("     per.per_ideregistro idperiodo, ")
                    .append("     per.per_nombre periodo, ")
                    .append("     cic.cic_anoactual cicloanio, ")
                    .append("     per.per_fecvence fechavencimiento, ")
                    .append("     per.per_fecsuspens fechasuspension ")
                    .append(" FROM ")
                    .append("     cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro ")
                    .append("     inner join dsus_detsuscrip dsus ON dsus.cic_ideregistro=cic.cic_ideregistro ")
                    .append(" WHERE ")
                    .append("     per.per_estado = 'A' and dsus.dsus_ideregistr= :idsuscripcion");
            ps = new PreparedStatementNamed(cnn, sb.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            rs = ps.executeQuery();
            if (rs.next()) {
                CicloDTO ciclo = new CicloDTO();
                ciclo.setIdCiclo(rs.getLong("idciclo"));
                ciclo.setCiclo(rs.getString("ciclo"));
                ciclo.setIdPeriodo(rs.getLong("idperiodo"));
                ciclo.setPeriodo(rs.getString("periodo"));
                ciclo.setAnio(rs.getInt("cicloanio"));
                return ciclo;
            }
            throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CICLO_NO_ENCONTRADO);
        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
        } finally {
            cerrar(ps, rs);
        }
    }

    public String consultarNombreSuscripcion(Long idRecaudoWeb, int idEmpresaRecaudadora)
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append(" SELECT ter.ter_nomcompleto ")
                    .append(" FROM dwre_detwebrec dwre ")
                    .append("   INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = dwre.dsus_ideregistr ")
                    .append("   INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro ")
                    .append(" WHERE dwre.wrec_ideregistro = :idrecaudoweb AND dwre.emp_ideregistro = :idempresa ");

            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idrecaudoweb", idRecaudoWeb);
            ps.setObject("idempresa", idEmpresaRecaudadora);
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getString(1);
            }
            return "N/A";
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_DETALLES_RECAUDO_WEB);
        } finally {
            cerrar(ps, rs);
        }

    }

    public long consultaSuscripcionconSaldo(Long idSuscripcion)
            throws PersistenciaExcepcion {
        PreparedStatementNamed ps = null;
        LogUtil.info("Validando Saldo Facturas de Suscripción :" + idSuscripcion);
        ResultSet rs = null;
        long saldoSuscripcion = 0;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT ")
                    .append("   sum(fac.fac_sdoreal ) saldo ")
                    .append(" FROM ")
                    .append("   fac_factura fac ")
                    .append(" WHERE fac.dsus_ideregistr = :idsuscripcion ")
                    .append("       AND fac.fac_sdoreal > 0 ")
                    .append("       AND fac.fac_estado = 'A' ")
                    .append("       AND fac.fac_idepadre IS NULL ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("idsuscripcion", idSuscripcion);
            rs = ps.executeQuery();

            if (rs.next()) {
                saldoSuscripcion = rs.getLong("saldo");
            }
            LogUtil.info("Saldo Facturas de Suscripción :" + idSuscripcion + "  Valor :" + saldoSuscripcion);
            return saldoSuscripcion;

        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_SALDO_FACTURAS_SUSCRIPCION);
        } finally {
            cerrar(ps, rs);
        }

    }

    public PagoAdicionalDTO pagoAdicional()throws PersistenciaExcepcion {
        return null;

    }
    
    public void pagoAdicional(int dsuscripcion) throws PersistenciaExcepcion{
        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        Integer ppa_ideregistro= null;
        String filtro = null;
        try{
            StringBuilder sb = new StringBuilder();
            sb.append("insert into public.ppa_parapagoadicional (ppa_ideregistro ,ppa_estado,ppa_label,ppa_metodo,ppa_funcion,\n" +
                      " ppa_obligatorio,emp_ideregistro,ppa_tipo,ppa_facturas,idsuscriptor,ppa_valor ,ppa_dfacturas) ")
                    .append("  select nextval('sq_pse_bio_ppa') ,\n" +
                            " max(ff.fac_estado), (select jsonb_agg(row_to_json(fx)) from (select ffx.uni_documento documento "
                            + "from public.fac_factura ffx where ffx.dsus_ideregistr = ff.dsus_ideregistr group by ffx.uni_documento) fx) filtro"
                            + ",'Procedimiento SQL','facturasG','NO',317,'CG','',ff.dsus_ideregistr dsus,sum(ff.fac_sdoreal) valorG,'' \n" +
                            " from public.fac_factura ff \n" +
                            " inner join aseo.fmg_facturacioncarterag fm on fm.dsus_ideregistr = ff.dsus_ideregistr \n" +
                            " and fm.fac_ideregistro = ff.fac_ideregistro and fm.facmarc_estado = ff.fac_estado \n" +
                            " where ff.dsus_ideregistr = :idsuscripcion and ff.fac_estado = 'A'\n" +
                            " and ff.fac_sdoreal > 0 \n" +
                            " group by ff.dsus_ideregistr "
                            + " returning ppa_ideregistro,ppa_label ");

            ps = new PreparedStatementNamed(cnn, sb.toString());
            ps.setObject("idsuscripcion", dsuscripcion);
            rs = ps.executeQuery();
            while (rs.next()) {
                System.out.println("REGISTRO PPA ESTE METODO.........");
                ppa_ideregistro = Integer.parseInt(rs.getString("ppa_ideregistro"));
                filtro = rs.getString("ppa_label");
            }
            ps.close();
            if(ppa_ideregistro != null ){ 
            /**
             * INSERTAR DATOS EN FPPA
             */
            
            StringBuilder sbx = new StringBuilder();
            sbx.append("insert into fppa_filpagodicional (fppa_ideregistro,ppa_ideregistro,fppa_filtro) \n" +
                        " values (:ppa_ideregistro,:ppa_ideregistro,cast(:filtro as json))");
            ps = new PreparedStatementNamed(cnn, sbx.toString());
            ps.setObject("ppa_ideregistro", ppa_ideregistro);
            ps.setObject("filtro", filtro);
            rs = ps.executeQuery();
            ps.close();}
            
        } catch(SQLException e){
          LogUtil.error(e);  
        } finally {
            cerrar(ps, rs);
        }
    }

    public ArrayList<PagoAdicionalDTO> consultarMetodosG(int dsuscripcion, int tipo_dsus) throws PersistenciaExcepcion {

        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        ArrayList<String> funciones = new ArrayList<>();

        ArrayList<PagoAdicionalDTO> carteraG = new ArrayList<>();
        PagoAdicionalDTO carteraGobject; //= new PagoAdicionalDTO();
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("select pp.ppa_tipo,ff.fppa_filtro ,pp.ppa_ideregistro,pp.ppa_estado,pp.ppa_funcion,pp.ppa_obligatorio,pp.emp_ideregistro ,pp.ppa_label \n" +
                        " from public.ppa_parapagoadicional pp\n" +
                        " inner join public.fppa_filpagodicional ff on ff.ppa_ideregistro = pp.ppa_ideregistro ");
            /*  and idSuscriptor= :idsuscripcion*/
            ps = new PreparedStatementNamed(cnn, sb.toString());
            //ps.setObject("idsuscripcion", dsuscripcion);

            rs = ps.executeQuery();
            while (rs.next()) {
                carteraGobject = new PagoAdicionalDTO();
                System.out.println("LLEGO ESTE METODO........."+rs.getString("ppa_label"));
                carteraGobject.setFuncion(rs.getString("ppa_funcion"));
                carteraGobject.setDocumento(rs.getString("ppa_label"));
                carteraGobject.setPagoObligatorio(rs.getString("ppa_obligatorio"));
                carteraGobject.setFiltro(rs.getString("fppa_filtro"));
                carteraGobject.setPpa_ideregistro(rs.getString("ppa_ideregistro"));
                carteraGobject.setEmpresa(Integer.parseInt(rs.getString("emp_ideregistro")));

                carteraGobject.setTipo(tipo_dsus);
                //  carteraGobject.setTipo(tipo_dsus);

                carteraG.add(carteraGobject);
            }
            ps.close();

            return carteraG;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_SALDO_FACTURAS_SUSCRIPCION);
        } finally {
            cerrar(ps, rs);
        }

    }

    public ArrayList<PagoAdicionalDTO> llamarCarteraG(int dsuscripcion, int tipo_dsus) throws PersistenciaExcepcion {
        ArrayList<String> funciones = new ArrayList<>();

        int documento = 0;
        ArrayList<String> facturas = new ArrayList<>();
        ArrayList<PagoAdicionalDTO> carteraG = new ArrayList<>();
        PreparedStatementNamed ps = null;
        ResultSet rs = null;

        try {
            carteraG = consultarMetodosG(dsuscripcion, tipo_dsus);

            System.out.println("las funciones cartera g son:");
            for (int i = 0; i < carteraG.size(); i++) {

                Gson gson = new Gson();
                filtroDTO[] array = gson.fromJson(carteraG.get(i).getFiltro(), filtroDTO[].class);
                System.out.println(carteraG.get(i).getFuncion() + "-" + i);

                System.out.println("IMPRIMIENDO ARRAY");
                float valorfactura = 0;
                for (filtroDTO dTO : array) {
                    System.out.println("------------------------ inicio");

                    documento = dTO.getDocumento();

                    System.out.println("el documento para cartera G es" + documento);
                }

                StringBuilder sb = new StringBuilder();
                sb.append("    select * from ")
                        .append(carteraG.get(i).getFuncion())
                        .append("(:empresa,:ppa_ideregistro,:dsuscripcion)");
                ps = new PreparedStatementNamed(cnn, sb.toString());
                ps.setObject("empresa", carteraG.get(i).getEmpresa());
                ps.setObject("ppa_ideregistro",Integer.parseInt(carteraG.get(i).getPpa_ideregistro()));
                ps.setObject("dsuscripcion", dsuscripcion);
                rs = ps.executeQuery();
                ArrayList<String> facturasid = new ArrayList<>();
                //float valorfactura = 0;

                ArrayList<String> idfacturasD = new ArrayList<>();
                while (rs.next()) {
                    facturasid.add(rs.getString("idfactura"));
                    idfacturasD.add(rs.getString("dfactura"));

                    valorfactura = valorfactura + Float.parseFloat(rs.getString("saldo"));

                }

                carteraG.get(0).setFacturas(facturasid);

                carteraG.get(0).setSaldo(valorfactura);
                String facturasGuardar = "";
                StringBuilder fg = new StringBuilder();
                StringBuilder dFacturas = new StringBuilder();

                System.out.println("id facturas g");
                for (String string : facturasid) {
                    fg.append(string + ",");

                    System.out.println(string);
                }
                System.out.println("id del detalle de facturas g");

                for (String string : idfacturasD) {
                    dFacturas.append(string + ",");
                }

                System.out.println("Almacenando facturas...");
                System.out.println(fg.toString());

                //this.GuardarFacturas(Integer.parseInt(carteraG.get(i).getPpa_ideregistro()), fg.toString(), dFacturas.toString(), carteraG.get(i).getSaldo(), dsuscripcion);
            //}
                System.out.println(" cerrando conexion");
                ps.close();

            }
        } catch (SQLException ex) {
            Logger.getLogger(SuscripcionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        return carteraG;

    }

    public ArrayList<PagoAdicionalDTO> consultarMetodosServicioEspecial(int dsuscripcion, int empresaAseo, int empresaGas, int empresaSuscriptor) throws PersistenciaExcepcion {

        PreparedStatementNamed ps = null;
        ResultSet rs = null;
        ArrayList<String> funciones = new ArrayList<>();

        PagoAdicionalDTO carteraGobject = new PagoAdicionalDTO();
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(" SELECT  fppa_filtro,fppa_filpagodicional.ppa_ideregistro, ppa_estado,ppa_tipo, ppa_label, ppa_metodo, ppa_funcion, ppa_obligatorio, emp_ideregistro   \n"
                    + "FROM ppa_parapagoadicional \n"
                    + "INNER JOIN fppa_filpagodicional\n"
                    + "on ppa_parapagoadicional.ppa_ideregistro=fppa_filpagodicional.ppa_ideregistro WHERE ppa_tipo ='SE' and idSuscriptor= :idsuscripcion and emp_ideregistro=:empresa ");

            ps = new PreparedStatementNamed(cnn, sb.toString());
            ArrayList<PagoAdicionalDTO> carteraG = new ArrayList<>();
            ps.setObject("idsuscripcion", dsuscripcion);
            ps.setObject("empresa", empresaSuscriptor);
            rs = ps.executeQuery();
            while (rs.next()) {
                System.out.println("LLEGO ESTE METODO.........");
                carteraGobject.setFuncion(rs.getString("ppa_funcion"));
                carteraGobject.setDocumento(rs.getString("ppa_label"));
                carteraGobject.setPagoObligatorio(rs.getString("ppa_obligatorio"));
                carteraGobject.setFiltro(rs.getString("fppa_filtro"));
                carteraGobject.setPpa_ideregistro(rs.getString("ppa_ideregistro"));
                carteraGobject.setEmpresa(Integer.parseInt(rs.getString("emp_ideregistro")));

                if (Integer.parseInt(rs.getString("emp_ideregistro")) == empresaAseo) {
                    carteraGobject.setTipo(1);

                }

                if (Integer.parseInt(rs.getString("emp_ideregistro")) == empresaGas) {
                    carteraGobject.setTipo(2);

                }

                carteraG.add(carteraGobject);

            }
            ps.close();

            return carteraG;
        } catch (SQLException e) {
            LogUtil.error(e);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR_SALDO_FACTURAS_SUSCRIPCION);
        } finally {
            cerrar(ps, rs);
        }

    }

    public ArrayList<PagoAdicionalDTO> llamarServicioEspecial(int dsuscripcion, int empresaAseo, int empresaGas, int empresaSuscriptor) throws PersistenciaExcepcion {
        ArrayList<String> funciones = new ArrayList<>();

        //  System.out.println("se realizara proceso con dsus_ideregistro "+dsuscripcion+"y con la empresa "+empresa);
        int documento = 0;
        int tipodocumento = 0;
        int concepto = 0;
        float valorfactura = 0;

        ArrayList<String> facturas = new ArrayList<>();
        ArrayList<Float> valor = new ArrayList<>();

        ArrayList<PagoAdicionalDTO> carteraG = new ArrayList<>();
        PreparedStatementNamed ps = null;

        ArrayList<String> facturasid = new ArrayList<>();

        ArrayList<String> idfacturasD = new ArrayList<>();
        ResultSet rs = null;
        try {
            carteraG = consultarMetodosServicioEspecial(dsuscripcion, empresaAseo, empresaGas, empresaSuscriptor);

            System.out.println("las filtros son:");
            for (int i = 0; i < carteraG.size(); i++) {

                System.out.println(carteraG.get(i).getFiltro() + "-" + i);

                int tipo = 0;

                Gson gson = new Gson();
                filtroDTO[] array = gson.fromJson(carteraG.get(i).getFiltro(), filtroDTO[].class);
                System.out.println("IMPRIMIENDO ARRAY");
                for (filtroDTO dTO : array) {
                    System.out.println("------------------------ inicio");

                    documento = dTO.getDocumento();
                    tipodocumento = dTO.getTipodocumento();
                    concepto = dTO.getConcepto();

                    System.out.println("documento=" + documento);
                    System.out.println("cocepto=" + concepto);
                    System.out.println("tipo documento=" + tipodocumento);

                    tipo = tipoCursor(dTO.getDocumento(), dTO.getTipodocumento(), dTO.getConcepto());
                    System.out.println("------------------------ " + tipo);

                    StringBuilder sb = new StringBuilder();
                    sb.append("    select * from ")
                            .append(carteraG.get(i).getFuncion())
                            .append("(:empresa,:documento,:tipodocumento,:concepto,:dsuscripcion,:tipo)");

                    ps = new PreparedStatementNamed(cnn, sb.toString());

                    ps.setObject("empresa", carteraG.get(i).getEmpresa());
                    ps.setObject("documento", documento);
                    ps.setObject("tipodocumento", tipodocumento);
                    ps.setObject("concepto", concepto);
                    ps.setObject("dsuscripcion", dsuscripcion);
                    ps.setObject("tipo", tipo);
                    rs = ps.executeQuery();

                    while (rs.next()) {

                        if (!idfacturasD.contains(rs.getString("dfactura"))) {

                            idfacturasD.add(rs.getString("dfactura"));

                            facturasid.add(rs.getString("idfactura"));

                            valorfactura = valorfactura + Float.parseFloat(rs.getString("saldo"));
                        }

                    }
                    carteraG.get(i).setFacturas(facturasid);

                    carteraG.get(i).setSaldo(valorfactura);

                    System.out.println("valor de la factura son " + valorfactura);
                    /**
                     * for (String idfacturaD : idfacturasD) {
                     * System.out.println(idfacturaD); }*
                     */

                    StringBuilder fg = new StringBuilder();

                    StringBuilder dFactura = new StringBuilder();

                    System.out.println("id de las facturas");

                    for (String string : facturasid) {
                        fg.append(string + ",");

                        System.out.println(string);
                    }

                    System.out.println("detalle de las facturas");

                    for (String string : idfacturasD) {
                        dFactura.append(string + ",");
                        System.out.println(string);

                    }

                    System.out.println("Almacenando facturas Y detalle facturas...");

                    this.GuardarFacturas(Integer.parseInt(carteraG.get(i).getPpa_ideregistro()), fg.toString(), dFactura.toString(), carteraG.get(i).getSaldo(), dsuscripcion);

                    System.out.println("cerrando conexion");
                    ps.close();

                    System.out.println("------------------------ fin");

                }

            }
        } catch (SQLException ex) {
            Logger.getLogger(SuscripcionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        return carteraG;

    }

    public int tipoCursor(int documento, int tipododumento, int concepto) {

        if (documento != 0 && tipododumento == 0 && concepto == 0) {

            return 2;
        }

        if (documento != 0 && tipododumento > 0 && concepto > 0) {

            return 1;
        }

        if (documento != 0 && tipododumento > 0 && concepto == 0) {

            return 3;
        }

        if (documento != 0 && tipododumento == 0 && concepto > 0) {

            return 4;
        }

        return 0;
    }

    public void GuardarFacturas(Integer ppa_ideregistro, String facturas, String dfacturas, double valor, int dsuscripcion) throws PersistenciaExcepcion {
        System.out.println("guardando facturas con id " + ppa_ideregistro);
        PreparedStatementNamed ps = null;
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("UPDATE ppa_parapagoadicional ")
                    .append("   SET ppa_dfacturas=:dfacturas,ppa_facturas=:facturas ,ppa_valor=:ppa_valor ,idsuscriptor=:dsuscripcion")
                    .append(" WHERE ppa_ideregistro = :ppa_ideregistro ");
            ps = new PreparedStatementNamed(cnn, sql.toString());
            ps.setObject("ppa_ideregistro", ppa_ideregistro);
            ps.setObject("facturas", facturas);
            ps.setObject("dfacturas", dfacturas);
            ps.setObject("ppa_valor", valor);
            ps.setObject("dsuscripcion", dsuscripcion);

            ps.executeUpdate();

        } catch (SQLException ex) {
            LogUtil.error(ex);
            throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ACTUALIZAR_RECAUDO_WEB);
        } finally {
            cerrar(ps);
        }
    }

}
