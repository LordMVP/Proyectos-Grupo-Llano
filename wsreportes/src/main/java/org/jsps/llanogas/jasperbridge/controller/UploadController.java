/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Named;
import javax.enterprise.context.RequestScoped;
import javax.servlet.http.Part;

/**
 *
 * @author jpsierra
 */
@Named(value = "uploadController")
@RequestScoped
public class UploadController {

    /**
     * Creates a new instance of UploadController
     */
    private Part reporte;
    private String rutaReporte;

    public UploadController() {
    }

    public void cargarReporte() {
        InputStream inputStream = null;
        try {
            inputStream = reporte.getInputStream();
            File path = new File(rutaReporte);
            File fileOut = null;
            if (!path.exists()) {
                System.out.println("El destino del reporte no existe se intentara crear.");
                if (!path.mkdirs()) {
                    System.err.println("El destino del reporte no existia se intento crear y no se logro.");
                    return;
                } else {
                    path.setWritable(true);
                    System.out.println("Se intentara guardar el reporte en:  " + path.getAbsolutePath());
                }
            }            
            fileOut = new File(path.getAbsolutePath() +File.separator+ getFilename(reporte));
            System.out.println("Nombre del archivo a guardar "+fileOut.getAbsolutePath());
            FileOutputStream outputStream = new FileOutputStream(fileOut);
            byte[] buffer = new byte[4096];
            int bytesRead = 0;
            while (true) {
                bytesRead = inputStream.read(buffer);
                if (bytesRead > 0) {
                    outputStream.write(buffer, 0, bytesRead);
                } else {
                    break;
                }
            }
            outputStream.close();
            inputStream.close();

        } catch (IOException ex) {
            Logger.getLogger(UploadController.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                inputStream.close();
            } catch (IOException ex) {
                Logger.getLogger(UploadController.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    private static String getFilename(Part part) {
        for (String cd : part.getHeader("content-disposition").split(";")) {
            if (cd.trim().startsWith("filename")) {
                String filename = cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
                return filename.substring(filename.lastIndexOf('/') + 1).substring(filename.lastIndexOf('\\') + 1); // MSIE fix.  
            }
        }
        return null;
    }

    public Part getReporte() {
        return reporte;
    }

    public void setReporte(Part reporte) {
        this.reporte = reporte;
    }

    public String getRutaReporte() {
        return rutaReporte;
    }

    public void setRutaReporte(String rutaReporte) {
        this.rutaReporte = rutaReporte;
    }

}
