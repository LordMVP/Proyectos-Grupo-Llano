package com.bioagricola.arcgis.service;

import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.arcgis.dto.BasicMapDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Clase que contiene la logica relacionada con los mapas de ArcGis
 *
 * @author cperez@progracol.com
 */
@Service(value = "arcGisServiceImp")
public class ArcGisServiceImp implements ArcGisService {

    private final ApiArcGis apiArcGis;

    public ArcGisServiceImp(ApiArcGis apiArcGis) {
        this.apiArcGis = apiArcGis;
    }

    /**
     * Metodo para generar token arcgis
     * @return token
     */
    @Override
    public Map<String,String> generarTokenArcgis() {
        Map<String,String> mapToken= new HashMap<>();
        mapToken.put("token",this.apiArcGis.getAccessTokenTwo());
        return  mapToken;
    }

    /**
     * Metodo para listar los mapas
     *
     * @return lista de mapas
     */
    @Override
    public List<BasicMapDto> listarMapas() {
        String token = this.apiArcGis.getAccessTokenArcgisMaps();
        Map<String, String> idPortalMap = this.apiArcGis.getIdPortalMaps();
        List<Map<String, Object>> mapasInfoBasica = this.apiArcGis.consultaListaMapas(token);
        
        List<BasicMapDto> responseMapas = new ArrayList<>();
        for (Map<String, Object> obj : mapasInfoBasica) {
        	if(idPortalMap.get("HYA").toString().equals(obj.get("id").toString())) {
        		BasicMapDto mapa = new BasicMapDto(obj.get("id").toString(),"HYA");
                responseMapas.add(mapa);
        	}
        	if(idPortalMap.get("AFOROS").toString().equals(obj.get("id").toString())) {
        		BasicMapDto mapa = new BasicMapDto(obj.get("id").toString(),"AFOROS");
                responseMapas.add(mapa);
        	}
        }
        return responseMapas;
    }

    /**
     * Metodo para obtener informacion de un mapa por id
     *
     * @param idmapa id mapa
     * @return info mapa
     */
    @Override
    public Map<String, Object> buscarDetalleMapa(String idmapa) {
        String token = this.apiArcGis.getAccessTokenArcgisMaps();
        Map<String, Object> infoMapa = this.apiArcGis.consultaInfoMapa(token, idmapa);
        return infoMapa;
    }
}
