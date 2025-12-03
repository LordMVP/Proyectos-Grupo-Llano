package com.bioagricola.hya.service;

import com.bioagricola.hya.entity.TmpActSuscripcion;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Clase interfaz que define los metodos relacionados con el registro de punto
 * @author Yoner Silva
 */
public interface DsusPointService {
    TmpActSuscripcion guardar(TmpActSuscripcion data, List<MultipartFile> imagenes, String token);
}
