package com.bioagricola.apirest.liquidacion.negocio;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.negocio.interfaces.INegocioReportes;
import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.ParParametroDTO;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleCsvExporterConfiguration;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;

@Service
public class NegocioReportes implements INegocioReportes {

	@Autowired
	private NegocioParParametro negocioParParametro;

	@Autowired
	DataSource dataSource;

	// @Value("${​​jasperTemplatePath}​​")
	private String pathTemplate = "/templates/jrxml/";

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioReportes.class.getName());

	/**
	 * Metodos de compilación reportes.
	 */
	private String parametrosIdSuscripcion = "IDSUSCRIPTION";
	private String parametrosEmpresaId = "EMPRESAID";
	private String parametrosTipoNota = "TIPONOTA";
	private String parametrosIdUsuario  ="IDUSUARIO";
	private String parametrosIdSuscripciones = "IDSUSCRIPCIONES";
	private String parametrosIdEmpresa = "IDEMPRESA";
	private String parametrosEliminaSuscrip = "ELIMINASUSCRIP";
		
	
	private JasperReport loadTemplates(String plantilla) throws JRException {
		final InputStream reportInputStream = getClass().getResourceAsStream(plantilla);
		return JasperCompileManager.compileReport(reportInputStream);
	}

	private JasperPrint jasperCompilerOneFormat(JasperReport jasperjrxml, Map<String, Object> parameters)
			throws NegocioException {
		try {
			return JasperFillManager.fillReport(jasperjrxml, parameters, dataSource.getConnection());
		} catch (Exception e) {
			logger.error("Ocurrio un error compilando reporte: ", e);
			throw new NegocioException("Ocurrio un error compilando reporte: " + e.getMessage());
		}
	}

	private ByteArrayOutputStream exportReportPDF(List<JasperPrint> listJasperPrint) {
		ByteArrayOutputStream outputPdf = new ByteArrayOutputStream();
		try {
			JRPdfExporter exporterPDF = new JRPdfExporter();
			exporterPDF.setExporterInput(SimpleExporterInput.getInstance(listJasperPrint));
			exporterPDF.setExporterOutput(new SimpleOutputStreamExporterOutput(outputPdf));
			exporterPDF.exportReport();
			logger.info("Reporte transformado a PDF de forma correcta.");

		} catch (Exception e) {
			logger.error("No se pudo exportar reporte a PDF: ", e);
		}
		return outputPdf;
	}

	private ByteArrayOutputStream exportReportEXCEL(List<JasperPrint> listJasperPrint) {
		ByteArrayOutputStream outputExcel = new ByteArrayOutputStream();
		try {

			SimpleXlsxReportConfiguration configurationExcel = new SimpleXlsxReportConfiguration();
			configurationExcel.setWhitePageBackground(true);
			configurationExcel.setDetectCellType(true);
			configurationExcel.setIgnoreGraphics(false);
			configurationExcel.setFreezeRow(3);
			configurationExcel.setFontSizeFixEnabled(false);
			configurationExcel.setWhitePageBackground(true);
			configurationExcel.setOnePagePerSheet(false);

			JRXlsxExporter exporterXLSX = new JRXlsxExporter();
			exporterXLSX.setConfiguration(configurationExcel);
			exporterXLSX.setExporterInput(SimpleExporterInput.getInstance(listJasperPrint));
			exporterXLSX.setExporterOutput(new SimpleOutputStreamExporterOutput(outputExcel));
			exporterXLSX.exportReport();
			logger.info("Reporte transformado a EXCEL de forma correcta.");
		} catch (Exception e) {
			logger.error("No se pudo exportar reporte a EXCEL: ", e);
		}
		return outputExcel;
	}

	private ByteArrayOutputStream exportReportCSV(List<JasperPrint> listJasperPrint) {
		ByteArrayOutputStream outputCSV = new ByteArrayOutputStream();
		try {
			SimpleCsvExporterConfiguration configurationCSV = new SimpleCsvExporterConfiguration();
			JRCsvExporter exporterCSV = new JRCsvExporter();
			exporterCSV.setConfiguration(configurationCSV);
			exporterCSV.setExporterInput(SimpleExporterInput.getInstance(listJasperPrint));
			exporterCSV.setExporterOutput(new SimpleWriterExporterOutput(outputCSV));
			exporterCSV.exportReport();
			logger.info("Reporte transformado a CSV de forma correcta.");
		} catch (Exception e) {
			logger.error("No se pudo exportar reporte a CSV: ", e);
		}
		return outputCSV;
	}

	// Metodo para capturar la consulta e implementarla en los compiladores de
	// jasper
	// Dependiendo el tipo de archivo que se desee devolver

	private ByteArrayOutputStream compiladorReportes(Map<String, Object> parametros, String typeFile,
			String pathReport) {
		ByteArrayOutputStream result = new ByteArrayOutputStream();
		List<JasperPrint> jasperList = new ArrayList<>();
		try {
			JasperReport reporteJRXML = this.loadTemplates(pathReport);
			JasperPrint jasperPrint = this.jasperCompilerOneFormat(reporteJRXML, parametros);
			jasperList.add(jasperPrint);
			switch (typeFile) {
			case "pdf":
				result = this.exportReportPDF(jasperList);
				break;
			case "xls":
				result = this.exportReportEXCEL(jasperList);
				break;
			case "csv":
				result = this.exportReportCSV(jasperList);
				break;
			default:
				break;
			}
		} catch (Exception e) {
			logger.error("Error no controlado en compiladorReportes: ", e);
		}
		return result;
	}

	public ByteArrayOutputStream facturasLiquidadas(String typeFile, String listaSuscripciones, String tipoNota) {
		ByteArrayOutputStream result;

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		List<Long> idSuscripciones = Arrays.asList(listaSuscripciones.split(",")).stream()
				.map(s -> Long.parseLong(s.trim())).collect(Collectors.toList());

		Map<String, Object> parametros = new HashMap<>();
		parametros.put(parametrosIdSuscripcion, idSuscripciones);
		parametros.put(parametrosEmpresaId, idEmpresa);
		parametros.put(parametrosTipoNota, tipoNota);

		result = this.compiladorReportes(parametros, typeFile,
				this.pathTemplate.concat("reporteSimulacionLiquidacion.jrxml"));

		return result;
	}

	public ByteArrayOutputStream facturasLiquidadasFuturo(String typeFile, String listaSuscripciones) {
		ByteArrayOutputStream result;

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		List<Long> idSuscripciones = Arrays.asList(listaSuscripciones.split(",")).stream()
				.map(s -> Long.parseLong(s.trim())).collect(Collectors.toList());

		Map<String, Object> parametros = new HashMap<>();
		parametros.put(parametrosIdSuscripcion, idSuscripciones);
		parametros.put(parametrosEmpresaId, idEmpresa);

		result = this.compiladorReportes(parametros, typeFile,
				this.pathTemplate.concat("reportesSimulacionFuturo.jrxml"));

		return result;
	}

	public ByteArrayOutputStream facturasLiquidadaEstrato(String typeFile, String listaSuscripciones)
			throws  IOException {
		ByteArrayOutputStream result ;

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();

		Map<String, Object> consulta = null;

		consulta = negocioParParametro.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);

		ParParametroDTO parametroEstado = new ParParametroDTO(
				(Integer) (consulta.get(ConstantesServicios.UNI_CONCEPTO_ESTRATO)),
				ConstantesServicios.UNI_CONCEPTO_ESTRATO);

		List<Long> idSuscripciones = Arrays.asList(listaSuscripciones.split(",")).stream()
				.map(s -> Long.parseLong(s.trim())).collect(Collectors.toList());

		Map<String, Object> parametros = new HashMap<>();
		parametros.put(parametrosIdSuscripcion, idSuscripciones);
		parametros.put(parametrosEmpresaId, idEmpresa);
		parametros.put(parametrosIdUsuario, idUsuario);
		parametros.put("CONCEPTOESTRATO", parametroEstado.getIdParametro());

		result = this.compiladorReportes(parametros, typeFile,
				this.pathTemplate.concat("reporteSimulacionEstratos.jrxml"));

		return result;
	}

	public ByteArrayOutputStream facturasLiquidadaTipoUso(String typeFile, String listaSuscripciones,
			Integer tipoNota) {
		ByteArrayOutputStream result;

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		List<Long> idSuscripciones = Arrays.asList(listaSuscripciones.split(",")).stream()
				.map(s -> Long.parseLong(s.trim())).collect(Collectors.toList());

		Map<String, Object> parametros = new HashMap<>();
		parametros.put(parametrosIdSuscripciones, idSuscripciones);
		parametros.put(parametrosIdEmpresa, idEmpresa);
		parametros.put(parametrosIdUsuario, idUsuario);
		parametros.put(parametrosTipoNota, tipoNota);

		result = this.compiladorReportes(parametros, typeFile,
				this.pathTemplate.concat("reporteSimulacionTipoUso.jrxml"));

		return result;
	}

	public ByteArrayOutputStream facturasLiquidadasAforo(String typeFile, String listaSuscripciones, Integer tipoNota) {
		ByteArrayOutputStream result;

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		List<Long> idSuscripciones = Arrays.asList(listaSuscripciones.split(",")).stream()
				.map(s -> Long.parseLong(s.trim())).collect(Collectors.toList());

		Map<String, Object> parametros = new HashMap<>();
		parametros.put(parametrosIdSuscripciones, idSuscripciones);
		parametros.put(parametrosIdEmpresa, idEmpresa);
		parametros.put(parametrosIdUsuario, idUsuario);
		parametros.put(parametrosTipoNota, tipoNota);

		result = this.compiladorReportes(parametros, typeFile,
				this.pathTemplate.concat("reporteSimulacionAforoExtraordinario.jrxml"));

		return result;
	}


	public ByteArrayOutputStream notasInclusionDeuda(String typeFile, String listaSuscripciones, Integer tipoNota,
			Integer accionRealizar, Boolean eliminarSuscripcion) {
		ByteArrayOutputStream result;

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		List<Long> idSuscripciones = Arrays.asList(listaSuscripciones.split(",")).stream()
				.map(s -> Long.parseLong(s.trim())).collect(Collectors.toList());

		Map<String, Object> parametros = new HashMap<>();
		parametros.put(parametrosIdSuscripciones, idSuscripciones);
		parametros.put(parametrosIdEmpresa, idEmpresa);
		parametros.put(parametrosTipoNota, tipoNota);
		parametros.put(parametrosIdUsuario, idUsuario);
		
		if (accionRealizar.equals(1)) {			
			result = this.compiladorReportes(parametros, typeFile,
					this.pathTemplate.concat("reporteSimulacionNotaInclusionDeuda.jrxml"));
		}else {
			String eliminaSuscrip = Boolean.TRUE.equals(eliminarSuscripcion) ? "Si" : "No";
			parametros.put(parametrosEliminaSuscrip, eliminaSuscrip);
			result = this.compiladorReportes(parametros, typeFile,
					this.pathTemplate.concat("reporteSimulacionNotaEliminacionDeuda.jrxml"));
		}


		return result;
	}

}
