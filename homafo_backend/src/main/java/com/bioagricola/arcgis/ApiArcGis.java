package com.bioagricola.arcgis;

import com.bioagricola.common.exception.TechnicalException;
import com.bioagricola.common.repository.ParParametroRepository;
import com.bioagricola.hya.dto.util.LocalizacionParam;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Clase que contiene la logica relacionada con el Api ArcGis
 *
 * @author cperez@progracol.com
 */
@Service
public class ApiArcGis {

    // urls para app hya (listado de mapas, info mapas)
    private String URLTOKEN;
    private String URLGROUPMAP;
    private String URLMAPINFO;
    private String URLBIOUSER;

    // credenciales app hya
    private String username;
    private String pass;
    private String client;

    //urls ArcGis
    private String URLAUTH;
    private String URLGEO;
    private String U_R_TERRENO;

    //credenciales oauth2 servicios del geocodificador
    private String clientID;
    private String clientSecret;
    private String grantType;
    
    //Id Portal Map Arcgis (HYA y AFOROS)
    private String ID_PORTAL_MAP_HYA;
    private String ID_PORTAL_MAP_AFOROS;

    private final ParParametroRepository parParametroRepository;
    
    public ApiArcGis(ParParametroRepository parParametroRepository) {
        this.parParametroRepository = parParametroRepository;
        this.loadUrlsFromDatabase();
    }
    
    /**
     * Metodo para carga de urls y credenciales desde la tabla par_parametros
     */
    public void loadUrlsFromDatabase() {
        try {
            String jsonParametros = this.parParametroRepository.findParametrosByCompany(317);
            Gson gson = new Gson();
            Map<String, Object> mapParams = gson.fromJson(jsonParametros, Map.class);
            Map<String, Object> mapArcgisSinc = (Map<String, Object>) mapParams.get("ARCGIS_SINCRONIZACION");
            loadUrls(mapArcgisSinc);
            loadCredentials(mapArcgisSinc);
            loadIdPortalMap(mapArcgisSinc);
        } catch (Exception e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al obtener parametros de urls del Api ArcGis.");
        }
    }

    /**
     * Carga urls de capas de Argis de tabla par_parametros
     *
     * @param mapArcgisSinc
     */
    private void loadUrls(Map<String, Object> mapArcgisSinc) {
        for (Object url : (ArrayList) mapArcgisSinc.get("URLS")) {
            Map<String, Object> urlMap = (Map<String, Object>) url;
            String name = (String) urlMap.get("name");
            String urlValue = (String) urlMap.get("url");

            switch (name) {
                case "URLAUTH":
                    this.URLAUTH = urlValue;
                    break;
                case "URLGEO":
                    this.URLGEO = urlValue;
                    break;
                case "U_R_TERRENO":
                    this.U_R_TERRENO = urlValue;
                    break;
                case "URLBIOUSER":
                    this.URLBIOUSER = urlValue;
                    break;
                case "URLAUTH_MAPS":
                    this.URLTOKEN = urlValue;
                    break;
                case "URLGROUPMAP":
                    this.URLGROUPMAP = urlValue;
                    break;
                case "URLMAPINFO":
                    this.URLMAPINFO = urlValue;
                    break;
            }
        }
    }

    /**
     * Carga de credenciales de tabla par_parametros
     *
     * @param mapArcgisSinc
     */
    private void loadCredentials(Map<String, Object> mapArcgisSinc) {
        for (Object credencial : (ArrayList) mapArcgisSinc.get("CREDENCIALES")) {
            Map<String, Object> credencialMap = (Map<String, Object>) credencial;
            String name = (String) credencialMap.get("name");

        	switch (name) {
	            case "OAUTH2_GEO":
	            	this.clientID = (String) credencialMap.get("client_id");
	                this.clientSecret = (String) credencialMap.get("client_secret");
	                this.grantType = (String) credencialMap.get("grant_type");
	                break;
	            case "OAUTH_MAPS":
	                this.username = (String) credencialMap.get("username");
	                this.pass = (String) credencialMap.get("password");
	                this.client = (String) credencialMap.get("client");
	                break;
	        }
        }
    }
    
    /**
     * Carga de IdPortalMap de tabla par_parametros
     *
     * @param mapArcgisSinc
     */
    private void loadIdPortalMap(Map<String, Object> mapArcgisSinc) {
    	for (Object portalMap : (ArrayList) mapArcgisSinc.get("PORTAL_MAP_ID")) {
            Map<String, Object> idPortalMaps = (Map<String, Object>) portalMap;
            String name = (String) idPortalMaps.get("name");

        	switch (name) {
	            case "HYA":
	            	this.ID_PORTAL_MAP_HYA = (String) idPortalMaps.get("value");
	                break;
	            case "AFOROS":
	                this.ID_PORTAL_MAP_AFOROS = (String) idPortalMaps.get("value");
	                break;
	        }
        }
    }
    
    /**
     * Retorna el id de los mapas para poder usarlos en la app
     *
     * @return idPortalMaps
     */
    public Map<String,String> getIdPortalMaps() {
    	Map<String, String> idPortalMaps = new HashMap<>();
    	idPortalMaps.put("HYA", ID_PORTAL_MAP_HYA);
    	idPortalMaps.put("AFOROS", ID_PORTAL_MAP_AFOROS);
    	return idPortalMaps;
    }

    /**
     * Metodo para generar cabecera http
     *
     * @return http headers
     */
    public HttpHeaders buildBasicHttpEntity() {
        LinkedList<MediaType> mediaTypes = new LinkedList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        httpHeaders.setAccept(mediaTypes);
        return httpHeaders;
    }

    /**
     * Metodo para generar token autenticacion Api ArcGis
     *
     * @return token
     */
    public String getAccessTokenArcgisMaps() {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties = new LinkedMultiValueMap<>();
        properties.add("f", "json");
        properties.add("username", username);
        properties.add("password", pass);
        properties.add("client", client);
        properties.add("expiration", "1800");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties, buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(URLTOKEN, request, Map.class);
            if (response.getStatusCode().value() == 200) {
                return response.getBody().get("token").toString();
            } else {
                throw new TechnicalException("Ha ocurrido un error al obtener token del Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException(e.getMessage() + " \n" + e.getStackTrace());
        }
    }

    /**
     * Metodo para listar mapas ArcGis
     *
     * @param token token autenticacion
     * @return listado de mapas
     */
    public List<Map<String, Object>> consultaListaMapas(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String urlTemplate = UriComponentsBuilder.fromHttpUrl(URLGROUPMAP + "search")
                    .queryParam("q", "type:\"Web Map\"")
                    .queryParam("sortField", "title")
                    .queryParam("sortOrder", "asc")
                    .queryParam("f", "json")
                    .queryParam("token", token)
                    .toUriString();
            String url = URLDecoder.decode(urlTemplate, "UTF-8");
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            if (response.getStatusCode().value() == 200) {
                Map<String, Object> responseMap = (Map<String, Object>) response.getBody();
                return (List<Map<String, Object>>) responseMap.get("results");
            } else {
                throw new TechnicalException("No se pudieron obtener mapas del Api ArcGis");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Error cliente rest: " + e.getMessage());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new TechnicalException("Error de codificacion" + e.getMessage());
        }
    }

    /**
     * Metodo para consultar informacion de un mapa por id
     *
     * @param token  token autenticacion
     * @param idmapa id de mapa
     * @return info mapa
     */
    public Map<String, Object> consultaInfoMapa(String token, String idmapa) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String urlTemplate = UriComponentsBuilder.fromHttpUrl(URLMAPINFO + idmapa)
                    .queryParam("f", "json")
                    .queryParam("token", token)
                    .toUriString();
            ResponseEntity<Object> response = restTemplate.getForEntity(urlTemplate, Object.class);
            if (response.getStatusCode().value() == 200) {
                return (Map<String, Object>) response.getBody();
            } else {
                throw new TechnicalException("No se pudio obtener informacion del mapa (" + idmapa + ") del Api ArcGis");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Error cliente rest: " + e.getMessage());
        }
    }

    /**
     * Metodo para generar token autenticacion Api ArcGis
     *
     * @return token
     */
    public String getAccessTokenTwo() {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties = new LinkedMultiValueMap<>();
        properties.add("client_id", clientID);
        properties.add("client_secret", clientSecret);
        properties.add("grant_type", grantType);
        properties.add("expiration", "21600");
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties, buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(URLAUTH, request, Map.class);
            if (response.getStatusCode().value() == 200) {
                return response.getBody().get("access_token").toString();
            } else {
                throw new TechnicalException("Ha ocurrido un error al obtener token del Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException(e.getMessage() + " \n" + e.getStackTrace());
        }
    }

    /**
     * Metodo implementacion cliente de servicio para obtener localizacion por parametros de direccion
     *
     * @param params parametros busqueda
     * @return localizacion
     */
    public Object getLocalizacionList(LocalizacionParam params) {
        RestTemplate restTemplate = new RestTemplate();
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(URLGEO + "findAddressCandidates")
                .queryParam("token", "{token}")
                .queryParam("f", "{f}")
                .queryParam("outFields", "{outFields}")
                .queryParam("forStorage", "{forStorage}")
                .queryParam("address", "{address}")
                .queryParam("address2", "{address2}")
                .queryParam("neighborhood", "{neighborhood}")
                .queryParam("city", "{city}")
                .queryParam("sourceCountry", "{sourceCountry}")
                .encode()
                .toUriString();

        Map<String, String> values = new HashMap<>();
        values.put("token", params.getToken());
        values.put("f", "pjson");
        values.put("outFields", "X, Y");
        values.put("forStorage", "false");
        values.put("address", params.getAddress());
        values.put("address2", params.getAddress2());
        values.put("neighborhood", params.getNeighborhood());
        values.put("city", params.getCity());
        values.put("sourceCountry", "COL");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(buildBasicHttpEntity());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    urlTemplate,
                    HttpMethod.GET,
                    request,
                    String.class,
                    values);

            if (response.getStatusCode().value() == 200) {
                String candidatos = response.getBody();
                GsonBuilder builder = new GsonBuilder();
                builder.setPrettyPrinting();
                Gson gson = builder.create();
                Map<String, Object> responseMap = gson.fromJson(candidatos, Map.class);
                return responseMap.get("candidates");
            } else {
                throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para Localizacion");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para Localizacion: " + e.getMessage());
        }
    }

    /**
     * Obtener codigo sector rural o urbano por coordenadas
     *
     * @param x coordenada x
     * @param y coordenada y
     * @param type 1= urbano, 2= rural
     * @param token token
     * @return {@link Object}
     */
    public Object getCodeRuralUrbanSector(String x, String y,Integer type,String token) {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties = new LinkedMultiValueMap<>();
        properties.add("geometry", x + "," + y);
        properties.add("geometryType", "esriGeometryPoint");
        properties.add("inSR", "4326");
        properties.add("returnGeometry", "false");
        properties.add("f", "json");
        properties.add("outFields", "CODIGO");
        properties.add("token", token);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties, buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response;
            if(type==1){
                response = restTemplate.postForEntity( U_R_TERRENO.replace("Object","U_TERRENO"), request, Map.class);
            }else{
                response = restTemplate.postForEntity( U_R_TERRENO.replace("Object","R_TERRENO"), request, Map.class);
            }

            if (response.getStatusCode().value() == 200) {
                return response.getBody().get("features");
            } else {
                throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para caracteristicas de localizacion");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para caracteristicas de localizacion: " + e.getMessage());
        }
    }

    /**
     * Metodo implementacion cliente de servicio para guardar puntos de terceros
     *
     * @param token token de autenticacion
     * @param feature json con parametros
     * @return puntos guardados
     */
    public Map<String,Object> guardarPuntoTercero(String token, String feature){
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties= new LinkedMultiValueMap<>();
        properties.add("token",token);
        properties.add("f","json");
        properties.add("features",feature);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties,buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response=restTemplate.postForEntity(URLBIOUSER + "addFeatures", request, Map.class);
            if(response.getStatusCode().value()==200){
                if(response.getBody().get("error")==null){
                    List<LinkedHashMap<String,Object>> resultList=(ArrayList<LinkedHashMap<String,Object>>) response.getBody().get("addResults");
                    Map<String,Object> resultMap=null;
                    for (LinkedHashMap<String,Object> mapa:resultList) {
                        resultMap=mapa;
                    }
                    return resultMap;
                }else{
                    Map<String,Object> mapError = (Map<String, Object>) response.getBody().get("error");
                    throw new TechnicalException("Error al agregar punto tercero en ArcGis. Codigo error: "+mapError.get("code")+". "+ mapError.get("details"));
                }
            } else {
                throw new TechnicalException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para guardar punto de tercero: "+e.getMessage());
        }
    }

    /**
     * Consulta coordenadas punto de suscripcion en ArcGis
     *
     * @param token token
     * @param dsusPcodigoBio pcodigo usuario a consultar
     * @return {@link Map<String,Object>}
     */
    public Map<String,Object> consultaPuntoSuscripcion(String token, String dsusPcodigoBio){
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties= new LinkedMultiValueMap<>();
        properties.add("token",token);
        properties.add("f","json");
        properties.add("outFields","GlobalID,OBJECTID");
        properties.add("where","COD_BIOAGRICOLA= '"+dsusPcodigoBio+"'");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties,buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response=restTemplate.postForEntity(URLBIOUSER + "query", request, Map.class);
            if(response.getStatusCode().value()==200){
                if(response.getBody().get("error")==null){
                    List<LinkedHashMap<String,Object>> resultList=(ArrayList<LinkedHashMap<String,Object>>) response.getBody().get("features");
                    if(resultList.isEmpty()) return null;
                    Map<String,Object> resultMap=null;
                    for (LinkedHashMap<String,Object> mapa:resultList) {
                        resultMap=mapa;
                    }
                    return (Map<String, Object>) resultMap.get("attributes");
                }else{
                    Map<String,Object> mapError = (Map<String, Object>) response.getBody().get("error");
                    throw new TechnicalException("Error al agregar punto tercero en ArcGis. Codigo error: "+mapError.get("code")+". "+ mapError.get("details"));
                }
            } else {
                throw new TechnicalException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para guardar punto de tercero: "+e.getMessage());
        }
    }

    /**
     * Metodo para actualizar punto de tercero en ArcGis
     *
     * @param token token
     * @param features atributos a actualizar
     * @return {@link Map<String,Object>}
     */
    public Map<String,Object> actualizarPuntoTercero(String token, String features){
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties= new LinkedMultiValueMap<>();
        properties.add("token",token);
        properties.add("f","json");
        properties.add("features",features);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties,buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response=restTemplate.postForEntity(URLBIOUSER + "updateFeatures", request, Map.class);
            if(response.getStatusCode().value()==200){
                if(response.getBody().get("error")==null){
                    List<LinkedHashMap<String,Object>> resultList=(ArrayList<LinkedHashMap<String,Object>>) response.getBody().get("updateResults");
                    Map<String,Object> resultMap=null;
                    for (LinkedHashMap<String,Object> mapa:resultList) {
                        resultMap=mapa;
                    }
                    return resultMap;
                }else{
                    Map<String,Object> mapError = (Map<String, Object>) response.getBody().get("error");
                    throw new TechnicalException("Error al agregar punto tercero en ArcGis. Codigo error: "+mapError.get("code")+". "+ mapError.get("details"));
                }
            } else {
                throw new TechnicalException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para guardar punto de tercero: "+e.getMessage());
        }
    }

    /**
     * Metodo para consulta coordenadas de suscripcion
     *
     * @param token token
     * @param suscripcionesBio Suscripciones a consultar
     * @return {@link List<HashMap<String,Object>>}
     */
    public List<LinkedHashMap<String,Object>> consultaCoordenadasSuscripcionBio(String token, String suscripcionesBio){
        RestTemplate restTemplate = new RestTemplate();
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(URLBIOUSER + "query")
                .queryParam("token", token)
                .queryParam("f", "json")
                .queryParam("outFields", "COD_BIOAGRICOLA,FACTURACION")
                .queryParam("where", suscripcionesBio);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<Object> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, request, Map.class);
            if(response.getStatusCode().value()==200){
                if(response.getBody().get("error")==null){
                    List<LinkedHashMap<String,Object>> resultList=(ArrayList<LinkedHashMap<String,Object>>) response.getBody().get("features");
                    if(resultList.isEmpty())
                        return null;
                    else
                        return resultList;

                }else{
                    Map<String,Object> mapError = (Map<String, Object>) response.getBody().get("error");
                    throw new TechnicalException("Error al consultar coordenadas puntos en ArcGis. Codigo error: "+mapError.get("code")+". "+ mapError.get("details"));
                }
            } else {
                throw new TechnicalException("Ha ocurrido un error al consultar coordenadas puntos en ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para consultar coordenadas puntos en ArcGis: "+e.getMessage());
        }
    }

    /**
     * Consulta lote de suscripciones en ArcGis
     *
     * @param token token
     * @param dsusPcodigosBio pcodigos a consultar
     * @return {@link List<HashMap<String,Object>>}
     */
    public List<HashMap<String,Object>> consultaPuntoSuscripcionIn(String token, String dsusPcodigosBio){
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties= new LinkedMultiValueMap<>();
        properties.add("token",token);
        properties.add("f","json");
        properties.add("outFields","*");
        properties.add("where","COD_BIOAGRICOLA in ("+dsusPcodigosBio+")");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties,buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response=restTemplate.postForEntity(URLBIOUSER + "query", request, Map.class);
            if(response.getStatusCode().value()==200){
                if(response.getBody().get("error")==null){
                    List<HashMap<String,Object>> resultList=(ArrayList<HashMap<String,Object>>) response.getBody().get("features");
                    if(resultList.isEmpty()) return null;

                    return resultList.stream()
                            .map(mapa -> mapa.get("attributes"))
                            .filter(HashMap.class::isInstance)
                            .map(attribute -> (HashMap<String,Object>) attribute)
                            .collect(Collectors.toList());
                }else{
                    Map<String,Object> mapError = (Map<String, Object>) response.getBody().get("error");
                    throw new TechnicalException("Error al agregar punto tercero en ArcGis. Codigo error: "+mapError.get("code")+". "+ mapError.get("details"));
                }
            } else {
                throw new TechnicalException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para guardar punto de tercero: "+e.getMessage());
        }
    }

    /**
     * Metodo para actualizar suscripciones en ArcGis por lotes
     *
     * @param token token
     * @param features objeto suscripciones actualizar
     * @return {@link List<HashMap<String,Object>>}
     */
    public List<HashMap<String,Object>> actualizarPuntoTerceroLote(String token, String features){
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> properties= new LinkedMultiValueMap<>();
        properties.add("token",token);
        properties.add("f","json");
        properties.add("features",features);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties,buildBasicHttpEntity());
        try {
            ResponseEntity<Map> response=restTemplate.postForEntity(URLBIOUSER + "updateFeatures", request, Map.class);
            if(response.getStatusCode().value()==200){
                if(response.getBody().get("error")==null){
                    return (ArrayList<HashMap<String,Object>>) response.getBody().get("updateResults");
                }else{
                    Map<String,Object> mapError = (Map<String, Object>) response.getBody().get("error");
                    throw new TechnicalException("Error al agregar punto tercero en ArcGis. Codigo error: "+mapError.get("code")+". "+ mapError.get("details"));
                }
            } else {
                throw new TechnicalException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");
            }
        } catch (RestClientException e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al consumir servicio ArcGis para guardar punto de tercero: "+e.getMessage());
        }
    }
}
