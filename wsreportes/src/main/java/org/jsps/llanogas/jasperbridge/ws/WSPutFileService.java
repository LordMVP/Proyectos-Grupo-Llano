/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.ws;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.enterprise.context.RequestScoped;
import javax.json.JsonObject;
import javax.ws.rs.POST;
import javax.ws.rs.core.MediaType;
import org.jsps.llanogas.jasperbridge.model.ByteArrayToBase64TypeAdapter;
import org.jsps.llanogas.jasperbridge.model.JsonFileRequest;
import org.jsps.llanogas.jasperbridge.model.JsonFileResponse;

/**
 * REST Web Service
 *
 * @author jpsierra
 */
@Path("gateway")
@RequestScoped
public class WSPutFileService {

    @Context
    private UriInfo context;
    private final Gson gson;

    /**
     * Creates a new instance of GatewayReport
     */
    public WSPutFileService() {
        gson = new GsonBuilder().registerTypeHierarchyAdapter(byte[].class, new ByteArrayToBase64TypeAdapter()).create();
    }

    /**
     * Retrieves representation of an instance of
     * org.jsps.llanogas.jasperbridge.ws.WSPutFileService
     *
     * @param jsonRequest
     * @return an instance of java.lang.String
     */
    @POST
    @Path("/save")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public JsonFileResponse saveFile(JsonObject jsonRequest) {
        try {
            JsonFileRequest request = gson.fromJson(jsonRequest.toString(), JsonFileRequest.class);
            if (request != null) {
                File tmp = new File(request.getPathFile());
                if (!tmp.exists() && !tmp.mkdirs() && !tmp.canWrite()) {
                    return buildError(request, "El destino [" + request.getPathFile() + "] no existe, no puede ser creado o no tiene permisos de escritura");
                }
                File newFile = new File(request.getPathFile() + File.separator + request.getFileName());
                FileOutputStream fos = new FileOutputStream(newFile);
                fos.write(request.getFileContent());
                fos.close();
                JsonFileResponse response = new JsonFileResponse();
                response.setError(false);
                response.setMessage("El archivo " + newFile.getAbsolutePath() + " se creo correctamente");
                response.setStatusCode(200);
                return response;
            } else {
                return buildError(null, "Error en la peticion");
            }
        } catch (JsonSyntaxException | IOException ex) {
            Logger.getLogger(WSPutFileService.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println("Error creando archvo :"+ ex.getMessage());
            return buildError(null, ex.getMessage());
        }
    }

    private JsonFileResponse buildError(JsonFileRequest request, String message) {
        JsonFileResponse errorResponse = new JsonFileResponse();
        errorResponse.setError(true);
        errorResponse.setMessage(message);
        errorResponse.setNoContent(true);
        errorResponse.setTimeExecution(0);
        errorResponse.setStatusCode(500);
        return errorResponse;
    }

}
