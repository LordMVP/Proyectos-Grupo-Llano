/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.aplicacion.delegado;


import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.util.LogUtil;
import com.google.gson.Gson;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.sql.SQLException;
import javax.imageio.ImageIO;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Decoder;

/**
 *
 * @author jepoveda
 */

@Service
public class ArchivosDelegado {
    
    private Gson gson;
    private Type type;  
    
    
    public ArchivosDelegado(){
        
        gson = new Gson();
    }
    
    public File verArchivo(RespuestaDTO<ArchivoDTO> rtaArchivo){
        
        String nombreArchivo = null;
        File outputfile = null;
        ByteArrayInputStream bis;
        BASE64Decoder decoder = new BASE64Decoder();
            
        try{ 
            nombreArchivo = rtaArchivo.getDatos().getNombreOriginal();
            byte[] imageByte;
            
            imageByte = decoder.decodeBuffer(rtaArchivo.getDatos().getContenido());
            bis = new ByteArrayInputStream(imageByte);
            bis.close();
            
            outputfile = new File("/tmp/archivos/"+nombreArchivo);
            FileUtils.writeByteArrayToFile(outputfile, imageByte);
            
        }catch(Exception ex){
            LogUtil.infoError(ex.getMessage());
        }
        return outputfile;
    }
    
}
