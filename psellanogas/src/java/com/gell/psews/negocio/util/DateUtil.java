/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import java.sql.Timestamp;

/**
 *
 * @author lrey
 */
public class DateUtil {

    public static Timestamp parseTimeStamp(java.util.Date date) {
        if (date == null) {
            return null;
        }
        return new Timestamp(date.getTime());
    }
}
