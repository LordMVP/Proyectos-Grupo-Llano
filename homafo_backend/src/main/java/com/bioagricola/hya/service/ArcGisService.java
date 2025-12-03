package com.bioagricola.hya.service;

import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.hya.dto.GeoDirecDto;
import com.bioagricola.hya.dto.util.Localizacion;
import com.bioagricola.hya.dto.util.LocalizacionParam;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(value = "arcGisServiceTwo")
@Transactional
public class ArcGisService {

    private final ApiArcGis apiArcGis;
    private final UniUnidadRepository unidadRepository;

    /**
     * Constructor de la clase
     *
     * @param apiArcGis
     * @param unidadRepository
     */
    public ArcGisService(ApiArcGis apiArcGis, UniUnidadRepository unidadRepository) {
        this.apiArcGis = apiArcGis;
        this.unidadRepository = unidadRepository;
    }

    /**
     * Metodo que retorna el token autentcacion api ArcGis
     *
     * @return token
     */
    public String generateToken() {
        return apiArcGis.getAccessTokenTwo();
    }

    /**
     * Metodo para obtener localizacion mas aproximada segun parametros de consulta
     *
     * @param geoDirecDto formulario parametros de direccion
     * @return localizacion
     */
    public Localizacion getDirection(GeoDirecDto geoDirecDto) {
        String token = apiArcGis.getAccessTokenTwo();
        LocalizacionParam params = new LocalizacionParam(
                token,
                geoDirecDto.getDireccion(),
                geoDirecDto.getComplemento(),
                geoDirecDto.getBarrio(),
                geoDirecDto.getCiudad());

        Object responseObj = apiArcGis.getLocalizacionList(params);
        List<Object[]> responseList = (ArrayList<Object[]>) responseObj;
        List<Localizacion> localizaciones = new ArrayList<>();
        for (Object obj : responseList) {
            ModelMapper modelMapper = new ModelMapper();
            Localizacion localizacion = modelMapper.map(obj, Localizacion.class);
            localizaciones.add(localizacion);
        }
        Localizacion finalResponse = null;
        for (Localizacion localizacion : localizaciones) {
            if (finalResponse == null) {
                finalResponse = localizacion;
            } else {

                if (localizacion.getScore() > finalResponse.getScore()) {
                    finalResponse = localizacion;
                }
            }
        }
        return finalResponse;
    }

    /**
     * Metodo para consultar caracteristicas de localizacion segun parametros de busqueda
     *
     * @param x    valor localizacion x
     * @param y    valor localizacion y
     * @param type 1=urbano 2=rural
     * @return caracteristicas localizacion
     */
    public Object getCharacteristics(String x, String y, Integer type) {
        if (type == null || type < 1 || type > 2)
            throw new IllegalArgumentException("El valor tipo de consulta no es valido.");

        String token= this.apiArcGis.getAccessTokenTwo();

        List<Map> objAttributes= new ArrayList<>();
        List<HashMap> obj=(List<HashMap>) this.apiArcGis.getCodeRuralUrbanSector(x,y,type,token);
        if(!obj.isEmpty()){
        Map<String,Object> attributes=(Map<String,Object>) obj.get(0).get("attributes");
        String code = (String) attributes.get("CODIGO");
            if(code!=null){
                Map<String,String> attributesValues=new HashMap<>();
                attributesValues.put("SETU_CCDGO",code.substring(7,9));
                attributesValues.put("SECU_CCDGO",code.substring(9,11));
                attributesValues.put("MANZ_CCDGO",code.substring(13,17));

                Map<String,Object> attributesNew=new HashMap<>();
                attributesNew.put("attributes",attributesValues);
                objAttributes.add(attributesNew);
            }
        }
        return objAttributes;
    }

    /**
     * Metodo que retorna listado de capas del mapa
     *
     * @return listado de capas
     */
    public List<Map<String, Object>> getLayers(Integer idempresa) {
        String jsonParametros = this.unidadRepository.findParametrosById(idempresa);
        GsonBuilder builder = new GsonBuilder();

        builder.setPrettyPrinting();

        Gson gson = builder.create();
        Map<String, ?> mapParametros = gson.fromJson(jsonParametros, Map.class);

        return (List<Map<String, Object>>) mapParametros.get("ARCGIS");
    }
}
