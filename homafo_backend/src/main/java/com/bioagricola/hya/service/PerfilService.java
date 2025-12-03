package com.bioagricola.hya.service;

import com.gell.estandar.persistencia.entidades.OpcOpcion;

import java.util.List;
import java.util.Map;

/**
 * Clase interfaz que define los metodos del control de perfiles H&A
 * @author cperez@progracol.com
 */
public interface PerfilService {

    List<OpcOpcion> getOpcionesMenu(Integer idprograma, Integer idusuario,Integer idempresa);

    List<Map<String, Object>> getUnidadesUsuarioPrograma(Integer idprograma, Integer idusuario);
}
