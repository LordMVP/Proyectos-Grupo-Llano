package com.bioagricola.hya.service;

import com.bioagricola.hya.dto.DsusInfoAlternaDTO;
import com.bioagricola.hya.dto.DsusInfoDTO;
import com.bioagricola.hya.dto.FiltroDsusDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

/**
 * Clase interfaz que define los metodos del filtro de suscripciones
 * @author cperez@progracol.com
 */
public interface DsusFiltroService {

    Page<DsusInfoDTO> filtrar (FiltroDsusDTO filtroDsusDto, int page, int size);

    List<Map<Integer, String>> getBarrios(Integer idempresa);

    Map<String, Object> getUnidadesFiltro();

    DsusInfoAlternaDTO buscarInfoSuscripcion(String dsuspcodigo);
}
