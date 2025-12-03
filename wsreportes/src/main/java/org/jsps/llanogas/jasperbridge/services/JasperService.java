/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.services;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import net.sf.jasperreports.engine.JRAbstractExporter;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JRRuntimeException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRRtfExporter;
import net.sf.jasperreports.engine.export.JRTextExporter;
import net.sf.jasperreports.engine.export.oasis.JROdsExporter;
import net.sf.jasperreports.engine.export.oasis.JROdtExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.fill.JRAbstractLRUVirtualizer;
import net.sf.jasperreports.engine.fill.JRSwapFileVirtualizer;
import net.sf.jasperreports.engine.util.JRSwapFile;
import net.sf.jasperreports.export.ExporterOutput;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import org.jsps.llanogas.jasperbridge.db.model.ParametrosReporte;
import org.jsps.llanogas.jasperbridge.model.JasperFormats;
import org.jsps.llanogas.jasperbridge.model.JsonReportRequest;
import org.jsps.llanogas.jasperbridge.model.JsonReportResponse;

/**
 *
 * @author jpsierra
 */
@Stateless
public class JasperService implements Serializable {

//    private DataSource ds;
    private Connection connection;
    private Context ctx;
    private boolean error;
    private String errorMessage;
    private String pathswap;
    private JRAbstractExporter exporter = null;

    public JasperService() {
        try {
            ctx = new InitialContext();
            pathswap = "/var/www/html/swapjasper/";
            //pathswap = "C:\\Users\\pc\\Downloads\\reportesGrandes";
            System.out.println("JasperService.Constructor: Create Service Jasper Inicia Contexto Error:" + error + " Mensajeerror:" + errorMessage);
            //resporteUnidades
        } catch (NamingException ex) {
            Logger.getLogger(JasperService.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println("JasperService.Constructor: Error Iniciando Instancia Base de datos " + ex.getMessage());
            ex.getStackTrace();
            error = true;
            errorMessage = ex.getMessage();
        }
    }

    private void loadConnection(String jndiJdbc) throws NamingException, SQLException {
        if (this.connection == null || this.connection.isClosed()) {
            System.out.println("JasperService.loadConnection: Cargando Conexión ");
            this.connection = ((DataSource) ctx.lookup(jndiJdbc)).getConnection();
        }
    }

    private JsonReportResponse buildErrorResponse(JsonReportRequest request, String errorMessage) {
        System.out.println("JasperService.buildErrorResponse: Construye Respuesta JsonReportRequest : Mensajeerror" + errorMessage);
        JsonReportResponse response = new JsonReportResponse();
        response.setError(true);
        response.setMessage(errorMessage);
        response.setFormat(request.getFormat());
        response.setContent(null);
        response.setReportName(request.getReportName());
        response.setTimeExecution(0);
        response.setNoContent(true);
        response.setStatusCode(500);
        return response;
    }

    public JsonReportResponse executeReportJasperResult(JsonReportRequest reportRequest) throws SQLException, JRException, FileNotFoundException, NamingException, JRRuntimeException, Exception {
        System.out.println("JasperService.executeReportJasperResult: Inicia Generación de Reporte: " + reportRequest.getReportName());
        System.out.println("JasperService.executeReportJasperResult: ==>Parámetros Recibidos de Reingeniería inicio: " + reportRequest.getParameters());
        ///clase metodos
        JasperMethods metodos=new JasperMethods();
        
        try {
            loadConnection(reportRequest.getJndi());
        } catch (NamingException ex) {
            Logger.getLogger(JasperService.class.getName()).log(Level.SEVERE, null, ex);
            ex.getStackTrace();
            System.out.println("JasperService.executeReportJasperResult: Error Cargando  la conexion..." + ex.getMessage());
            throw ex;
        }

        JsonReportResponse result = new JsonReportResponse();
        JsonReportResponse resultVacio = new JsonReportResponse();
        resultVacio = respuestaVacia(resultVacio, reportRequest);
        File file = new File(reportRequest.getReportName());

        if (!file.exists() || !file.canRead()) {
            Logger.getLogger(JasperService.class.getName()).log(Level.SEVERE, null, "El archivo solicitado " + reportRequest.getReportName() + " no existe no puede ser leido");
            throw new FileNotFoundException("JasperService.executeReportJasperResult El archivo " + reportRequest.getReportName() + " no existe o no puede ser leido");
        }
        JRAbstractLRUVirtualizer virtualizer = null;
        try {
            JasperPrint jasperPrint;
            long inicio = System.currentTimeMillis();
            JasperReport report = JasperCompileManager.compileReport(reportRequest.getReportName());
            reportRequest.getParameters().put(JRParameter.REPORT_LOCALE, new Locale("es", "CO"));
            reportRequest.getParameters().put(JRParameter.REPORT_TIME_ZONE, TimeZone.getTimeZone("America/Bogota"));
            System.out.println("SWAP : " + reportRequest.getParameters().containsKey("USE_SWAP"));
            ///parametro de la base de datos
            ///////////////////////////////////////INICIO REPORTES DEFECTO////////////////////////////////
            
            List<ParametrosReporte> paramNuevos=new ArrayList<>();
            List<String> adicionales=new ArrayList<>();
            int idEmpresa=reportRequest.getParameters().get("PR_INT_EMPRESA")==null ? 0 : (int)reportRequest.getParameters().get("PR_INT_EMPRESA");
            paramNuevos= metodos.BuscarParametros(reportRequest.getJndi(),metodos.buscarNombre(reportRequest.getReportName()),idEmpresa);///reportRequest.getReportName()
            //adicionales=metodos.parametrosAdicionales(reportRequest.getJndi(),metodos.buscarNombre(reportRequest.getReportName()),(int)reportRequest.getParameters().get("PR_INT_EMPRESA"));
            adicionales=metodos.parametrosAdicionales(reportRequest.getJndi(),metodos.buscarNombre(reportRequest.getReportName()),idEmpresa);
            //System.out.println("voy a entrar "+paramNuevos.isEmpty());
            if(!paramNuevos.isEmpty())
            {
              String logo="";  
              for(ParametrosReporte param: paramNuevos)
              {
                  if(param.getTipo().equalsIgnoreCase("UNIDAD"))
                  {
                    reportRequest.getParameters().put(param.getParametro(), metodos.convertir(param.getUnidades()));
                  }
                  if(param.getTipo().equalsIgnoreCase("SENTENCIA"))
                  {
                      reportRequest.getParameters().put(param.getParametro(), param.getSentencia());
                  }
                  logo=param.getLogo();
              }
              reportRequest.getParameters().put("PR_STR_LOGO", logo);
            }
            if(!adicionales.isEmpty())
            {
                reportRequest.getParameters().put("PR_STR_LOGO", adicionales.get(0));
                reportRequest.getParameters().put("PR_STR_TITULO_EMPRESA", adicionales.get(1));
            }
            
            ///////////////////////////////////////FIN REPORTES DEFECTO////////////////////////////////
            
            if (reportRequest.getParameters().containsKey("USE_SWAP")) {
                System.out.println("JasperService.executeReportJasperResult: Usando SWAP");
                JRSwapFile swapFile = new JRSwapFile((String) pathswap, 1024, 100);
                virtualizer = new JRSwapFileVirtualizer(1, swapFile);
                reportRequest.getParameters().put(JRParameter.REPORT_VIRTUALIZER, virtualizer);
            }
            System.out.println("JasperService.executeReportJasperResult: ==>Parámetros Recibidos de Reingeniería: " + reportRequest.getParameters());
            jasperPrint = JasperFillManager.fillReport(report, reportRequest.getParameters(), connection);

            if (jasperPrint.getPages().isEmpty()) {
                result.setNoContent(true);
                result.setStatusCode(204);
            }
            byte k[] = exportReport(reportRequest.getFormat(), jasperPrint);
            long fin = System.currentTimeMillis();
            result.setStatusCode(200);
            result.setContent(k);
            result.setFormat(reportRequest.getFormat());
            result.setTimeExecution(fin - inicio);
            result.setReportName(reportRequest.getReportName());

        } catch (JRRuntimeException e1) {
            errorMessage ="JasperService.executeReportJasperResult: Error JRRuntimeException E1: " + e1.getMessage();
            result= null;
            result= resultVacio;
            resultVacio.setMessage(errorMessage);
            Logger.getLogger(JasperService.class.getName()).log(Level.SEVERE, null, " Error en tiempo Ejecucion JRE " + reportRequest.getReportName() + e1.getMessage());
            e1.printStackTrace();
        } catch (JRException e2) {
            errorMessage = "JasperService.executeReportJasperResult: Error constryendo Reporte (JRExeception) : " + e2.getMessage();
            result= null;
            result= resultVacio;
            resultVacio.setMessage(errorMessage);
            Logger.getLogger(JasperService.class.getName()).log(Level.SEVERE, null, " Error general Jasper " + reportRequest.getReportName() + e2.getMessage());
            e2.printStackTrace();
        } catch (Exception e3) {
            errorMessage = "JasperService.executeReportJasperResult: Error general: " + e3.getMessage();
            resultVacio.setMessage(errorMessage);
            result= null;
            result= resultVacio;
            Logger.getLogger(JasperService.class.getName()).log(Level.SEVERE, null, " Error general Webservice " + reportRequest.getReportName() + e3.getMessage());
            e3.printStackTrace();
        } finally {
            System.out.println("JasperService.executeReportJasperResult.Finally Mensaje" + errorMessage);
            if (virtualizer != null) {
                System.out.println("JasperService.executeReportJasperResult.Finally: Limpiando SWAP ");
                virtualizer.cleanup();
            }
            this.connection.close();
            System.out.println("JasperService.executeReportJasperResult.Finally: Cerrando Conexión Jasperservice JNI :" + reportRequest.getJndi());
            
        }
        return result;
    }

    private byte[] exportReport(String format, JasperPrint report) throws JRException {
        ExporterOutput output = null;
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        switch (format) {
            case JasperFormats.PDF:
                exporter = new JRPdfExporter();
                output = new SimpleOutputStreamExporterOutput(result);
                break;
            case JasperFormats.XLSX:
                exporter = new JRXlsxExporter();
                output = new SimpleOutputStreamExporterOutput(result);
                break;
            case JasperFormats.HTML:
                exporter = new HtmlExporter();
                output = new SimpleHtmlExporterOutput(result);
                break;
            case JasperFormats.DOCX:
                exporter = new JRDocxExporter();
                output = new SimpleOutputStreamExporterOutput(result);
                break;
            case JasperFormats.ODS:
                output = new SimpleOutputStreamExporterOutput(result);
                exporter = new JROdsExporter();
                break;
            case JasperFormats.ODT:
                exporter = new JROdtExporter();
                output = new SimpleOutputStreamExporterOutput(result);
                break;
            case JasperFormats.RTF:
                output = new SimpleWriterExporterOutput(result);
                exporter = new JRRtfExporter();
                break;
            case JasperFormats.TXT:
                exporter = new JRTextExporter();
                output = new SimpleWriterExporterOutput(result);
                break;
            case JasperFormats.CSV:
                output = new SimpleWriterExporterOutput(result);
                exporter = new JRCsvExporter();
                break;
            default:
                exporter = new JRPdfExporter();
                output = new SimpleOutputStreamExporterOutput(result);
        }

        exporter.setExporterInput(new SimpleExporterInput(report));
        exporter.setExporterOutput(output);
        exporter.exportReport();

        return result.toByteArray();

    }

    public boolean isError() {
        System.out.println("Validando si es un error");
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    private JsonReportResponse respuestaVacia(JsonReportResponse objRespuesta, JsonReportRequest objRequest) {

        objRespuesta.setError(true);
        objRespuesta.setContent(null);
        objRespuesta.setMessage(errorMessage);
        objRespuesta.setStatusCode(204);
        objRespuesta.setContent(null);
        objRespuesta.setFormat(objRequest.getFormat());
        objRespuesta.setTimeExecution(0);
        objRespuesta.setReportName(objRequest.getReportName());
        return objRespuesta;
    }

}
