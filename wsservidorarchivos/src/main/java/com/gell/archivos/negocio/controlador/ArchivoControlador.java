/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.negocio.controlador;

import com.gell.archivos.aplicacion.delegado.ArchivosDelegado;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.archivos.negocio.servicio.ArchivoServicio;
import com.gell.estandar.constante.EMensajeEstandar;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sun.net.www.URLConnection;

/**
 * Clase que expone todos los servicios para adjuntar los archivos
 *
 * @author God
 */
@RestController
public class ArchivoControlador extends GenericoControlador {

    @Autowired
    private ArchivoServicio servicio;
  
  
    @Autowired 
    private ArchivosDelegado archivoDel;
  

    /**
     * Lista de archivos que se van a guardar en la aplicación de AZDigital
     *
     * @param listaArchivos
     * @return Información de los archivos con los identificadores generados
     * @throws AplicacionExcepcion Error al adjuntar el archivo
     */
    @PostMapping(value = "/api/archivos/subir")
    public RespuestaDTO adjuntar(@RequestBody List<ArchivoDTO> listaArchivos)
            throws AplicacionExcepcion{
        List<ArchivoDTO> lista = servicio.guardar(listaArchivos);
        return new RespuestaDTO().setDatos(lista);
    }

    /**
     * Método encargado de consultar el archivo
     *
     * @param id Identificador del archivo que se quiere consultar
     * @param request Información de la petición
     * @return Respuesta con la información de la petición
     * @throws AplicacionExcepcion Error al consultar el archivo
     */
    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE,
            value = "/api/archivos/consultar")
    public RespuestaDTO consultar(@RequestParam("id") String id, HttpServletRequest request)
            throws AplicacionExcepcion {

        id = (id == null) ? "" : id.trim();
        ArchivoDTO archivo = servicio.consultar(id);
        return new RespuestaDTO().setDatos(archivo);
    }
  
    /**
     * Método encargado de consultar el archivo
     *
     * @param id Identificador del archivo que se quiere consultar
     * @param request Información de la petición
     * @return Respuesta con la información de la petición
     * @throws AplicacionExcepcion Error al consultar el archivo
     */
    @RequestMapping("/api/archivos/id/{idArchivo}")
    public void consultarById(HttpServletRequest req, HttpServletResponse res, 
            @PathVariable("idArchivo") String id) throws AplicacionExcepcion, IOException {
      
        id = (id == null) ? "" : id.trim();
        ArchivoDTO archivo = servicio.consultar(id);
        RespuestaDTO respuestaDTO = new RespuestaDTO().setDatos(archivo);
        File file = archivoDel.verArchivo(respuestaDTO);

        try{
            if(file.exists()){
                String mimeType = URLConnection.guessContentTypeFromName(file.getName());

                if(mimeType == null){
                    mimeType = "application/octet-stream";
                }

                res.setContentType(mimeType);
                res.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\"", file.getName()));
                res.setContentLength((int) file.length());

                InputStream inputStream = new BufferedInputStream(new FileInputStream(file));
                FileCopyUtils.copy(inputStream, res.getOutputStream());
            }

        }catch(Exception ex){   
            res.sendError(401, EMensajeEstandar.ERROR_ARCHIVO_NO_EXISTE.getMensaje());
            return;
        }
    }
}
