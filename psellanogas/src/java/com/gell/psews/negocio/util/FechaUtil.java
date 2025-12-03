/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author god
 */
public class FechaUtil {

    public static Date getFechaActual() {
        try {
            SimpleDateFormat formato = new SimpleDateFormat("yyyy-MM-dd");
            return formato.parse(formato.format(new Date()));
        } catch (ParseException ex) {
            LogUtil.error(ex);
            return new Date();
        }

    }
}
