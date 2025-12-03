/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.reporte;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.constante.ETipoReporte;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.LogUtil;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleDocxExporterConfiguration;
import net.sf.jasperreports.export.SimpleCsvExporterConfiguration;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterConfiguration;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxExporterConfiguration;

/**
 *
 * @author God
 */
@SuppressWarnings("UseSpecificCatch")
public class ReporteInvocar
{

  private final static ReporteInvocar INSTANCIA = new ReporteInvocar();

  private ReporteInvocar()
  {

  }

  public static ReporteInvocar getInstancia()
  {
    return INSTANCIA;
  }

  /**
   * Permite realizar una petición al reporteador
   *
   * @param reporte Reporte a generar
   * @param parametros Parámetros
   * @param cnn Conexión a la base de datos
   * @param tipo (EXCEL,CSV,WORD)
   * @return Arreglo de bytes
   * @throws AplicacionExcepcion
   */
  public byte[] invocar(InputStream reporte,
          Map<String, Object> parametros,
          Connection cnn,
          ETipoReporte tipo)
          throws AplicacionExcepcion
  {
    return invocar(reporte, parametros, cnn, tipo, (reporteCompilado, exporter) -> {
    });
  }

  public byte[] invocar(InputStream reporteFile,
          Map<String, Object> parametros,
          Connection cnn,
          ETipoReporte tipo,
          ReporteListener listener)
          throws AplicacionExcepcion
  {
    try {
      JasperPrint reporte = JasperFillManager.fillReport(reporteFile, parametros, cnn);
      switch (tipo) {
        case CSV:
          return exportarCSV(reporte, listener);
        case WORD:
          return exportarWord(reporte, listener);
        case EXCEL:
          return exportarExcel(reporte, listener);
        case PDF:
          return exportarPDF(reporte, listener);
        case HTML:
          return exportarHtml(reporte, listener);
        default:
          throw new AssertionError();
      }
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_GENERAR_REPORTE);
    }
  }

  public byte[] invocarCompilar(InputStream reporteInfo,
          Map<String, Object> parametros,
          Connection cnn,
          ETipoReporte tipo,
          ReporteListener listener)
          throws AplicacionExcepcion
  {
    if (listener == null) {
      listener = (reporteCompilado, exporter) -> {
      };
    }
    try {
      JasperReport jasperReport = JasperCompileManager.compileReport(reporteInfo);
      JasperPrint reporte = JasperFillManager.fillReport(jasperReport, parametros, cnn);
      switch (tipo) {
        case CSV:
          return exportarCSV(reporte, listener);
        case WORD:
          return exportarWord(reporte, listener);
        case EXCEL:
          return exportarExcel(reporte, listener);
        case PDF:
          return exportarPDF(reporte, listener);
        case HTML:
          return exportarHtml(reporte, listener);
        default:
          throw new AssertionError();
      }
    } catch (Exception e) {
      LogUtil.error(e);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_GENERAR_REPORTE);
    }
  }

  /**
   * Genera un reporte en word
   *
   * @param reporte Reporte a generar
   * @param parametros Parámetros del reporte
   * @param cnn Conexión a la base de datos
   * @return Reporte en word
   * @throws JRException
   */
  private byte[] exportarWord(JasperPrint reporteCompilado, ReporteListener listener)
          throws JRException
  {

    JRDocxExporter exportar = new JRDocxExporter();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    exportar.setConfiguration(new SimpleDocxExporterConfiguration());
    exportar.setExporterInput(new SimpleExporterInput(reporteCompilado));
    exportar.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
    listener.reporte(reporteCompilado, exportar);
    exportar.exportReport();
    return baos.toByteArray();
  }

  /**
   * genera un archivo CSV con el reporte
   *
   * @param reporte Reporte a generar
   * @param parametros Parámetros del reporte
   * @param cnn Conexión a la base de datos
   * @return
   * @throws JRException
   */
  private byte[] exportarCSV(JasperPrint reporteCompilado, ReporteListener listener)
          throws JRException
  {
    JRCsvExporter exportar = new JRCsvExporter();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    SimpleCsvExporterConfiguration config = new SimpleCsvExporterConfiguration();
    config.setRecordDelimiter("\n");
    exportar.setConfiguration(config);
    exportar.setExporterInput(new SimpleExporterInput(reporteCompilado));
    exportar.setExporterOutput(new SimpleWriterExporterOutput(baos));
    listener.reporte(reporteCompilado, exportar);
    exportar.exportReport();
    return baos.toByteArray();
  }

  /**
   * Genera un archivo de EXCEL de acuerdo a un reporte
   *
   * @param reporte Reporte a generar
   * @param parametros Parámetros del reporte
   * @param cnn Conexión a la base de datos
   * @return
   * @throws JRException
   */
  private byte[] exportarExcel(JasperPrint reporteCompilado, ReporteListener listener)
          throws JRException
  {
    JRXlsxExporter exportar = new JRXlsxExporter();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    SimpleXlsxExporterConfiguration config = new SimpleXlsxExporterConfiguration();
    exportar.setConfiguration(config);
    exportar.setExporterInput(new SimpleExporterInput(reporteCompilado));
    exportar.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
    listener.reporte(reporteCompilado, exportar);
    exportar.exportReport();
    return baos.toByteArray();
  }

  /**
   * Genera un archivo de PDF de acuerdo a un reporte
   *
   * @param reporte Reporte a generar
   * @param parametros Parámetros del reporte
   * @param cnn Conexión a la base de datos
   * @return
   * @throws JRException
   */
  private byte[] exportarPDF(JasperPrint reporteCompilado, ReporteListener listener)
          throws JRException
  {
    JRPdfExporter exportar = new JRPdfExporter();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    SimplePdfExporterConfiguration config = new SimplePdfExporterConfiguration();
    exportar.setConfiguration(config);
    exportar.setExporterInput(new SimpleExporterInput(reporteCompilado));
    exportar.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
    listener.reporte(reporteCompilado, exportar);
    exportar.exportReport();
    return baos.toByteArray();
  }

  /**
   * Exporta la información del reporte en formato html
   *
   * @param reporte Canal de transmisión de dtos del .jasper
   * @param parametros Criterios de búsqueda del reporte
   * @param cnn Conexión a la base de datos
   * @param listener
   * @return Información del reporte en formato html
   * @throws JRException Error al exportar el reporte
   */
  private byte[] exportarHtml(JasperPrint reporteCompilado, ReporteListener listener)
          throws JRException
  {
    HtmlExporter exportar = new HtmlExporter();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    SimpleHtmlExporterConfiguration config = new SimpleHtmlExporterConfiguration();
    exportar.setConfiguration(config);
    exportar.setExporterInput(new SimpleExporterInput(reporteCompilado));
    exportar.setExporterOutput(new SimpleHtmlExporterOutput(baos));
    listener.reporte(reporteCompilado, exportar);
    exportar.exportReport();
    return baos.toByteArray();
  }

}
