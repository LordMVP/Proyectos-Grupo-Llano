package com.bioagricola.hya.service;

import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;
import com.bioagricola.hya.dto.AforoVisitaDto;
import com.bioagricola.hya.dto.DetalleVisitaDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Clase interfaz que define los metodos relacionados con las visitas de aforos
 * @author cperez@progracol.com
 */
public interface AforoVisitaService {

    List<AforoVisitaDto> listarVisitasUsuario(Integer idUsu);

    List<AforoVisitaDto> listarVisitasRealizadasUsuario(Integer idUsu);

    List<AforoVisitaDto> listarVisitasCanceladasUsuario(Integer idUsu, String token);

    boolean cancelarAforoVisita(DetalleVisitaDTO detalleVisitaDTO, List<MultipartFile> images, String token, Integer idUsu,Integer idempresa);

    List<DetalleConceptoVisitaAforo>  realizarAforoVisita(DetalleVisitaDTO detalleVisitaDTO, List<MultipartFile> images, String token, Integer idUsu, Integer idempresa);

    Map<String,Object> listarUnidades();
    
    Map<String, Object> validarVisitaAforo(Integer id_aforo, Integer id_visita);
}
