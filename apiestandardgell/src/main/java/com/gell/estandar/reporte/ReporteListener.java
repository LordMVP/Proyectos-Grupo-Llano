/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.reporte;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;

/**
 *
 * @author billionaire
 */
public interface ReporteListener
{

  public void reporte(JasperPrint reporteCompilado, Object exporter)
          throws JRException;

}
