package com.bioagricola.hya.service;

import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.TmpActSuscripcionDTO;
import com.bioagricola.hya.entity.TmpActSuscripcion;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Clase interfaz que define los metodos relacionados con la tabla intermedia de actualizacion de suscripciones
 * @author cperez@progracol.com
 */
public interface ActHomologacionService {

    List<Map<String, Object>> listarBarrios(Long dsusIderegistro, Integer idempresa);

    Page<TmpActSuscripcionDTO> listarTableOthers(BasicSearchDTO search,int page, int size);
    
    Page<TmpActSuscripcionDTO> listarTablePunto(int page, int size);
    
    Page<TmpActSuscripcionDTO> listarRegSyncSuscripcion(Long dsusIderegistro,int page, int size);

    TmpActSuscripcion guardar(TmpActSuscripcion data, List<MultipartFile> imagenes,String token);

    void eliminar(Long idTmpDsus,Integer idusuario);

    Map<String,Object> listarUnidadesFormulario();

    List<Map<String,Object>> consultaImagenes(Long actsusIderegistro,String token);

    TmpActSuscripcion aprobarActualizacion(Long idTmpDsus,Integer idusuario);
    
    TmpActSuscripcion actualizarActualizacion(TmpActSuscripcionDTO tmpActSuscripcion);
}
