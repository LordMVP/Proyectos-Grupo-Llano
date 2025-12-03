/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.ws;

import com.google.gson.Gson;
import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Inject;
import javax.json.JsonObject;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.jsps.llanogas.jasperbridge.model.JsonReportRequest;
import org.jsps.llanogas.jasperbridge.model.JsonReportResponse;
import org.jsps.llanogas.jasperbridge.services.JasperMethods;
import org.jsps.llanogas.jasperbridge.services.JasperService;
import org.jsps.llanogas.jasperbridge.services.UsersService;

///importar jasper
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import org.json.*;
import org.jsps.llanogas.jasperbridge.model.JsonJasperRequest;
import org.jsps.llanogas.jasperbridge.model.JsonJasperResponse;
import net.sf.jasperreports.engine.JRChild;
import net.sf.jasperreports.engine.JRExpressionChunk;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.base.JRBaseBand;
import net.sf.jasperreports.engine.base.JRBaseSubreport;
import org.jsps.llanogas.jasperbridge.model.JasperFormato;

/**
 * REST Web Service
 *
 * @author jpsierra
 */
@Path("/jasper")
public class WSJasperReportsService {

    private static String MOTOR_SQL ="SQLSERVER";
    
    @Inject
    private JasperService jasperService;
    @Inject
    private UsersService usersService;

    /**
     * Creates a new instance of JasperReportsResource
     */
    public WSJasperReportsService() {
        System.out.println("Invocacion de web services");
    }

    /**
     * Retrieves representation of an instance of
     * org.jsps.llanogas.jasperbridge.ws.WSJasperReportsService
     *
     * @param object
     * @return an instance of java.lang.String
     */
    @Path("/json")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public JsonReportResponse executeReport(JsonObject object) {
        Gson gson = new Gson();
        JsonReportRequest model = gson.fromJson(object.toString(), JsonReportRequest.class);
        if (model != null) {
            model.parseParameters();
            try {
                if (jasperService.isError()) {
                    System.out.println("Error Jasperservier Activado :" + jasperService.isError());
                    Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, "Error de inicializacion de servicio: " + jasperService.getErrorMessage());
                    return buildErrorResponse(model, jasperService.getErrorMessage());
                }
                if (!validarUsuario(model)) {
                    return buildErrorResponse(model, "Error en las credenciales de accesso");
                }
                System.out.println(" Paso Validación Exitosamente Llamando a metodo que arma reporte");
                JsonReportResponse response = jasperService.executeReportJasperResult(model);
                response.setMessage("SUCCESS");
                return response;
            } catch (Exception ex) {
                Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println(" Error en JsonReportResponse executeReport" + ex.getMessage());
                ex.getStackTrace();
                return buildErrorResponse(model, ex.getMessage());
            }
        }
        return buildErrorResponse(model, "Error de parametros requeridos");
    }

    private boolean validarUsuario(JsonReportRequest reportRequest) {
        try {
            
            System.out.println("Validando Usuario: " + reportRequest.getUser());
            
            if (reportRequest.getUser() != null && reportRequest.getPassword() != null) {
                
                if(reportRequest.getMotorBD() == null){
                    
                    return usersService.valideUser(reportRequest.getJndi(), 
                            Integer.parseInt(reportRequest.getUser()), reportRequest.getPassword());
                    
                }else if(reportRequest.getMotorBD().equals(MOTOR_SQL)){
                    
                    return true;
                
                }else{
                    
                    return false;
                    
                }
            }
            return false;
            
        } catch (NullPointerException nullx) {
            
            Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, nullx);
            System.out.println(" Variables con Valores nulos , posiblemente reportRequest: " + nullx.getMessage());
            nullx.getStackTrace();
            return false;
            
        } catch (NumberFormatException numex) {
            
            Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, numex);
            System.out.println(" Error en conversión Numerica: " + numex.getMessage());
            numex.getStackTrace();
            return false;
            
        } catch (Exception ex) {
            
            Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println(" Error General: " + ex.getMessage());
            ex.getStackTrace();
            return false;
            
        }

    }

    private JsonReportResponse buildErrorResponse(JsonReportRequest request, String errorMessage) {
        JsonReportResponse response = new JsonReportResponse();
        try {
            response.setError(true);
            response.setMessage(errorMessage);
            response.setFormat(request.getFormat());
            response.setContent(null);
            response.setReportName(request.getReportName());
            response.setTimeExecution(0);
            response.setNoContent(true);
            response.setStatusCode(500);
        } catch (Exception ex) {
            ex.getStackTrace();
            System.out.println(" Error construyendo respuesta: " + ex.getMessage());
        }
        return response;
    }

    @Path("/bytes")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public byte[] executeReportBytes(JsonObject object) {
        Gson gson = new Gson();
        JsonReportRequest model = gson.fromJson(object.toString(), JsonReportRequest.class);
        if (model != null) {
            model.parseParameters();
            try {
                if (jasperService.isError()) {
                    Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, "Error de inicializacion de servicio: " + jasperService.getErrorMessage());
                    return null;
                }
                if (!validarUsuario(model)) {
                    return null;
                }

                JsonReportResponse response = jasperService.executeReportJasperResult(model);
                return response.getContent();
            } catch (Exception ex) {
                Logger.getLogger(WSJasperReportsService.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println(" Error Procesando Respuesta executeReportBytes" + ex.getMessage());
                return null;
            }
        }
        return null;

    }
    
    ////Contenido de los reportes
    
    @Path("/jasperContenido")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public JsonJasperResponse datosJasper(JsonObject object)
    {
        Gson gson = new Gson();
        JsonJasperRequest modelo = gson.fromJson(object.toString(), JsonJasperRequest.class);
        JsonJasperResponse respuesta=new JsonJasperResponse();
        JasperMethods metodos=new JasperMethods();
        try
        {
            if(modelo!=null && modelo.getNombreReporte().length()>0)
            {
                //System.out.println("que trae el request "+modelo.getJndi()+ " " +modelo.getUser()+" "+modelo.getPassword());
                if (!usersService.valideUser(modelo.getJndi(), Integer.parseInt(modelo.getUser()), modelo.getPassword()))
                {
                    respuesta.setStatusCode(400);
                    respuesta.setMensaje("ERROR, CREDENCIALES INCORRECTAS");
                    return respuesta;
                    //return Response.status(200).entity(JsonJasperResponse.class).build();
                     
                }
                
                File theFile = new File(modelo.getNombreReporte());
                JasperDesign jasperDesign = JRXmlLoader.load(theFile);
                
                respuesta.setConsulta(jasperDesign.getQuery().getText().replace("\n", " ").replace("\t", " "));
                respuesta.setParametros(metodos.buscarParametros(jasperDesign.getQuery().getText().replace("\n", " ").replace("\t", " ")));
                
                JasperReport report = JasperCompileManager.compileReport(jasperDesign);
                JRBaseBand detailBand1 = (JRBaseBand) report.getAllBands()[3];
                JRBaseBand summaryBand1 = (JRBaseBand) report.getSummary();
                List<JRChild> elements = detailBand1.getChildren(); //Get all children
                List<JRChild> elements2 = summaryBand1.getChildren();
                //JSONArray subreportes=new JSONArray();
                //Map<String,String> subreportes=new HashMap<>();
                List<JasperFormato> subreportes=new ArrayList<>();
                for (JRChild child : elements)
                {
                    if (child instanceof JRBaseSubreport){ //This is a subreport
                        JRBaseSubreport subreport = (JRBaseSubreport)child;
                        String expression= ""; //Lets find out the expression used
                        JRExpressionChunk[] chunks = subreport.getExpression().getChunks();
                        for (JRExpressionChunk c : chunks) {
                            //expression +=c.getText();
                            //subreportes.put(metodos.convertirFormato(c.getText()));
                            if(metodos.convertirFormato(c.getText()).length()>0)
                            {
                                //subreportes.put(metodos.convertirFormato(c.getText()), metodos.convertirFormato(c.getText()));
                                subreportes.add(new JasperFormato("SUBREPORTE", metodos.convertirFormato(c.getText())));
                            }
                            
                        }
                    }
                }
                for (JRChild child : elements2)
                {
                    if (child instanceof JRBaseSubreport){ //This is a subreport
                        JRBaseSubreport subreport = (JRBaseSubreport)child;
                        String expression= ""; //Lets find out the expression used
                        JRExpressionChunk[] chunks = subreport.getExpression().getChunks();
                        for (JRExpressionChunk c : chunks) {
                            expression +=c.getText();
                            //subreportes.put(metodos.convertirFormato(c.getText()));
                           if(metodos.convertirFormato(c.getText()).length()>0)
                            {
                                //subreportes.put(metodos.convertirFormato(c.getText()), metodos.convertirFormato(c.getText()));
                                subreportes.add(new JasperFormato("SUBREPORTE", metodos.convertirFormato(c.getText())));
                            }
                        }
                    }
                }
               respuesta.setSubreportes(subreportes);
                respuesta.setStatusCode(200);
                respuesta.setMensaje("SUCCESS");
               
            }
            else
            {
                respuesta.setStatusCode(400);
                respuesta.setMensaje("ERROR, DATOS INCORRECTOS");
            }
          return respuesta;  
          //return Response.status(200).entity(new JSONObject(respuesta)).build();
           
        } catch (Exception ex) {
                String connectMsg = "error lectura reporte " + ex.getMessage() + " " + ex.getLocalizedMessage();
                System.out.println(connectMsg);
                respuesta.setStatusCode(500);
                respuesta.setMensaje("ERROR, LECTURA REPORTE"+ ex.getMessage());
                return respuesta;
                //return Response.status(200).entity(JsonJasperResponse.class).build();
                
        }
    }

}
