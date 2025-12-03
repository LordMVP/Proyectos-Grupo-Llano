package com.bioagricola.hya.service;

import com.bioagricola.homologaciones.entity.GactGestionActualizacion;
import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.DsnovDsusNovedadDTO;
import com.bioagricola.hya.entity.TmpDsusNovedad;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Clase interfaz que define los metodos relacionados con novedades de suscripcion
 * @author cperez@progracol.com
 */
public interface DsusNovedadService {

    Map<String,Object> listarUnidadesFormulario();

    TmpDsusNovedad guardar(TmpDsusNovedad dsusNovedad, List<MultipartFile> files, String token);

    Page<DsnovDsusNovedadDTO> listar(BasicSearchDTO search,int page, int size);

    List<DsnovDsusNovedadDTO> buscar(Long dsusIderegistro);

    void eliminar(Long idnovedad,Integer idusuario);

    List<Map<String,Object>> consultaImagenes(Long idnovedad,String token);

    GactGestionActualizacion aprobarnovedad(Long idnovedad, Integer idUsu);
}
