/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews;

import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 *
 * @author lrey
 */
public class Prueba {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        consultar(5000);
    }

    public static void consultar(int inicio) {
        try {
            System.out.println("Iniciando...");
            String sql = "SELECT DISTINCT dsus.* "
                    + "FROM dsus_detsuscrip dsus "
                    + "WHERE dsus.dsus_estado = 'A' AND dsus.dsus_ideregistr > 15000  "
                    + "ORDER BY dsus.dsus_ideregistr "
                    + "LIMIT 100 "
                    + "OFFSET ? ";
            Connection cnn = ConexionBD.conectar();
            System.out.println("Conectado...");
            cnn.setAutoCommit(true);
            PreparedStatement ps = cnn.prepareStatement(sql);
            ps.setInt(1, inicio);
            System.out.println("Ejecutando sentencia...");
            ResultSet rs = ps.executeQuery();
            PreparedStatement ps1 = cnn.prepareStatement("SELECT valorgas "
                    + "FROM getliq_facturacion_pse(?, 322) "
                    + "WHERE valorgas >0");
            boolean entro = false;
            while (rs.next()) {
                entro = true;
                String idsuscripcion = rs.getString("dsus_ideregistr");
                try {
                    ps1.setString(1, idsuscripcion);
                    ResultSet rs1 = ps1.executeQuery();
                    if (rs1.next()) {
                        if (rs1.getDouble("valorgas") > 0) {
                            System.out.println("idSuscripcion: " + idsuscripcion);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("suscripción: " + idsuscripcion + "  Mensaje: " + e.getMessage());
                }
            }
            if (entro) {
                consultar(inicio + 100);
            }
            rs.close();
            ps.close();
            ps1.close();
            cnn.close();
        } catch (Exception e) {
            LogUtil.error(e);
        }
    }

}
