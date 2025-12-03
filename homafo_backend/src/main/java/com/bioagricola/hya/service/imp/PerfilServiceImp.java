package com.bioagricola.hya.service.imp;

import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.hya.repository.OpcOpcionRepository;
import com.bioagricola.hya.service.PerfilService;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *Clase que contiene la logica relacionada con el control de perfiles H&A
 * @author cperez@progracol.com
 */
@Service
public class PerfilServiceImp implements PerfilService {

    private final OpcOpcionRepository opcionRepository;

    private final UniUnidadRepository unidadRepository;

    public PerfilServiceImp(OpcOpcionRepository opcionRepository, UniUnidadRepository unidadRepository) {
        this.opcionRepository = opcionRepository;
        this.unidadRepository = unidadRepository;
    }

    /**
     * Metodo para obtener opciones del menu dependiendo del usuario logueado y el programa
     * @param idprograma id programa H&A
     * @param idusuario id de usuario logueado
     * @param idempresa id empresa del usuario
     * @return lista de opciones menu
     */
    @Override
    public List<OpcOpcion> getOpcionesMenu(Integer idprograma, Integer idusuario, Integer idempresa) {
        List<Map<String, Object>> opciones= this.opcionRepository.findMenuByUsuAndPrg(idusuario,idprograma,idempresa);
        List<OpcOpcion> menuResponse=new ArrayList<>();
        ModelMapper modelMapper= new ModelMapper();
        for (Map opc:opciones) {
            OpcOpcion opcion= modelMapper.map(opc, OpcOpcion.class);
            menuResponse.add(opcion);
        }
        return menuResponse;
    }

    @Override
    public List<Map<String, Object>> getUnidadesUsuarioPrograma(Integer idprograma, Integer idusuario) {
        List<Map<String, Object>> unidades= new ArrayList<>();
        List<Object[]> unidadesList = unidadRepository.findUnidadesUsuarioPrograma(idprograma, idusuario);
        for (Object[] obj:unidadesList) {
            Map<String,Object> uni = new HashMap<>();
            uni.put("uniIderegistro",obj[0]);
            uni.put("uniNombre",obj[1]);
            unidades.add(uni);
        }
        return unidades;
    }
}
