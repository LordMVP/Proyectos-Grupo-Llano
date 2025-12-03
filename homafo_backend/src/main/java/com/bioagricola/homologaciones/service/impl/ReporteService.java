package com.bioagricola.homologaciones.service.impl;

import java.io.ByteArrayOutputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/*
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperRunManager;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRTextExporter;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import net.sf.jasperreports.export.WriterExporterOutput;
*/
@Transactional
@Repository
public class ReporteService
{
	 @Autowired
	 @Qualifier("jdbcTemplate")
	 private JdbcTemplate jdbcTemplate;
	
	 /*
	 @Autowired
	 @Qualifier("jdniReportes")
	 private JdbcTemplate jdbcTemplate2;
	 */
	 @Autowired
	 private ResourceLoader resourceLoader;
	
	public byte[] exportPdfFile(HashMap parameters,String nombreReporte) throws SQLException//, JRException, IOException
	 {
		  byte[] bytes = null;
		  
		  Connection conn = jdbcTemplate.getDataSource().getConnection();
		 
		 // String path2 = resourceLoader.getResource("classpath:/reportes/"+nombreReporte).getURI().getPath();
		  
		  //bytes = JasperRunManager.runReportToPdf(path2, parameters,conn);

		  //conn.close();
		  //conn=null;
		  return bytes;
	 }
	
	public byte[] exportTextFile(HashMap parameters,String nombreReporte) throws SQLException//, JRException, IOException
	 {
		  byte[] bytes = null;
		  Connection conn = jdbcTemplate.getDataSource().getConnection();

		  //String path2 = resourceLoader.getResource("classpath:/reportes/"+nombreReporte).getURI().getPath();
		  
		  ByteArrayOutputStream  salida = new ByteArrayOutputStream();
		  //JasperPrint print = JasperFillManager.fillReport(path2, parameters, conn);
		  //JRTextExporter exporter = new JRTextExporter();
		  //JRCsvExporter exporter=new JRCsvExporter(); 
		  
          //exporter.setExporterInput(new SimpleExporterInput(print));
          //exporter.setExporterOutput(new SimpleWriterExporterOutput(salida));
          //exporter.exportReport();
          
          //bytes = salida.toByteArray(); 
         
          //conn.close();
		  //conn=null;
         
		  return bytes;
	 }

}
