package com.bioagricola.hya.service;

import com.bioagricola.hya.entity.TmpActSuscripcion;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Clase interfaz que define los metodos relacionados con el registro de independencia
 * @author cperez@progracol.com
 */
public interface DsusIndependenciaService {

    TmpActSuscripcion guardar(TmpActSuscripcion data, List<MultipartFile> imagenes, String token);


}
