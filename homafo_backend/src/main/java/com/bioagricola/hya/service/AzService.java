package com.bioagricola.hya.service;

import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AzService {

    @Value("${url.az}")
    private String URL_SERVICE_AZ;


    public List<ArchivoDTO> cargarImagenesAz(List<MultipartFile> files, String token){
        if(files.isEmpty()) throw new FailuresServiceException("No se ha adjuntado ninguna imagen, son requeridas.");
        for (MultipartFile file:files) {
            if(!file.getContentType().contains("jpg") && !file.getContentType().contains("png") && !file.getContentType().contains("jpeg")){
                throw new FailuresServiceException("Debe subir un archivo de imagen valido (JPG, PNG)");
            }
        }
        token = token.replace("Bearer Bearer", "Bearer");
        try {
            MultipartFile[] filesToUpload= new MultipartFile[files.size()];
            filesToUpload= files.toArray(filesToUpload);
            ClienteArchivo clientFile = new ClienteArchivo(EAplicacion.PRISMA, token, URL_SERVICE_AZ);
            RespuestaDTO<List<ArchivoDTO>> response = clientFile.adjuntar(filesToUpload);
            List<ArchivoDTO> archivosCargados = response.getDatos();
            return archivosCargados;
        } catch (AplicacionExcepcion ex) {
            ex.printStackTrace();
            throw new RuntimeException("No se han podido subir los archivos al servidor :" + ex.getMensaje() );
        } catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("No se han podido subir los archivos al servidor" + e.getMessage());
        }
    }

    public ClienteArchivo getClienteArchivo(String token){
        ClienteArchivo clientFile = new ClienteArchivo(EAplicacion.PRISMA, token, URL_SERVICE_AZ);
        return clientFile;
    }

}
