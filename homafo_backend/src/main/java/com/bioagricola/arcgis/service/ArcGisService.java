package com.bioagricola.arcgis.service;


import com.bioagricola.arcgis.dto.BasicMapDto;

import java.util.List;
import java.util.Map;

public interface ArcGisService {

    Map<String,String> generarTokenArcgis();

    List<BasicMapDto> listarMapas();

    Map<String,Object> buscarDetalleMapa(String idmapa);

}
