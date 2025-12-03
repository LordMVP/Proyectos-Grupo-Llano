/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

/**
 *
 * @author lrey
 */
public class LogUtil {

    public static void info() {
        System.out.println("");
    }

    public static void info(Object mensaje) {
        System.out.println("wspse->" + mensaje);
        System.out.println("wspse->");
    }

    public static void error(String mensaje) {
        System.err.println("wspse->" + mensaje);
        System.out.println("wspse->");
    }

    public static void error(Throwable ex) {
        System.out.println("wspse->");
        ex.printStackTrace();
        System.out.println("wspse->");
    }

    public static void error(SQLException ex) {
        System.err.println(ex.getSQLState());
        System.out.println("wspse->");
        ex.printStackTrace();
        System.out.println("wspse->");
    }

    public static String getTraza(Throwable e) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        e.printStackTrace(new PrintStream(out));
        return new String(out.toByteArray(), StandardCharsets.UTF_8);
    }
}
