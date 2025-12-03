package com.bioagricola.hya.schedule;

import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.exception.TechnicalException;
import com.bioagricola.common.repository.ParParametroRepository;
import com.bioagricola.hya.entity.ArclogSincArcgisLog;
import com.bioagricola.hya.repository.ArclogSincArcgisLogRepository;
import com.bioagricola.hya.repository.TmpActSuscripcionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class UpdateSubsArcgisProcess {

    private final ApiArcGis apiArcGis;
    private final TmpActSuscripcionRepository tmpActSuscripcionRepository;
    private final ArclogSincArcgisLogRepository arclogSincArcgisLogRepository;
    private final ParParametroRepository parParametroRepository;

    private final Logger logger = Logger.getLogger(UpdateSubsArcgisProcess.class.getName());

    public UpdateSubsArcgisProcess(ApiArcGis apiArcGis, TmpActSuscripcionRepository tmpActSuscripcionRepository, ArclogSincArcgisLogRepository arclogSincArcgisLogRepository, ParParametroRepository parParametroRepository) {
        this.apiArcGis = apiArcGis;
        this.tmpActSuscripcionRepository = tmpActSuscripcionRepository;
        this.arclogSincArcgisLogRepository = arclogSincArcgisLogRepository;
        this.parParametroRepository = parParametroRepository;
    }

    /**
     * Inicia proceso de actualizacion de los datos de las suscripciones en arcgis en lotes de 80
     */
    //@Scheduled(fixedDelay = 60000)
    @Scheduled(cron = "#{@obtainCronValue}")
    private void startProcess() {
        logger.info("----- Update subscriptions bio process start ------");
        Map<String, Object> params = loadParParameters();
        int loteSize = ((Double) params.get("loteSize")).intValue();

        List<Map<String, Object>> subscriptions = tmpActSuscripcionRepository.getSubscriptionsUpdateArcgis(
                ((Double) params.get("idEmpresa")).intValue(), ((Double) params.get("idClaseEstratos")).intValue());

        for (int i = 0; i < subscriptions.size(); i += loteSize) {

            try {
                int finIndice = Math.min(i + loteSize, subscriptions.size());
                List<Map<String, Object>> lote = subscriptions.subList(i, finIndice);

                List<String> codsBio = lote.stream()
                        .map(mapa -> mapa.get("COD_BIOAGRICOLA"))
                        .filter(valorNombre -> valorNombre instanceof String)
                        .map(valorNombre -> (String) valorNombre)
                        .collect(Collectors.toList());

                String codsBioParam = codsBio.stream()
                        .map(nombre -> "'" + nombre + "'")
                        .collect(Collectors.joining(", "));

                String token = apiArcGis.getAccessTokenTwo();
                List<HashMap<String, Object>> results = apiArcGis.consultaPuntoSuscripcionIn(token, codsBioParam);

                List<HashMap<String, Object>> subsUpdated = this.updateValues(lote, results);

                List<HashMap<String, Object>> maps = new ArrayList<>();

                if (!subsUpdated.isEmpty()) {
                    String features = createJson(subsUpdated);
                    maps = this.apiArcGis.actualizarPuntoTerceroLote(token, features);
                }

                if (!maps.isEmpty()) {

                    for (HashMap<String, Object> result : maps) {
                        Optional<HashMap<String, Object>> subUpdated = subsUpdated.stream()
                                .filter(map -> result.get("objectId").equals(map.get("OBJECTID")))
                                .findFirst();

                        arclogSincArcgisLogRepository.save(new ArclogSincArcgisLog(
                                (Integer) subUpdated.get().get("OBJECTID"),
                                (String) subUpdated.get().get("COD_BIOAGRICOLA"),
                                (Boolean) result.get("success"),
                                arclogSincArcgisLogRepository.getCurrentDateTime()
                        ));
                    }

                }
            } catch (Exception e) {
                continue;
            }
        }
        logger.info("----- Update subscriptions bio process end ------");
    }

    private Map<String, Object> loadParParameters() {
        try {
            String jsonParametros = this.parParametroRepository.findParametrosByCompany(317);
            Gson gson = new Gson();
            Map<String, Object> mapParams = gson.fromJson(jsonParametros, Map.class);
            return (Map<String, Object>) ((Map<String, Object>) mapParams.get("ARCGIS_SINCRONIZACION")).get("CRON_ARCGIS");
        } catch (Exception e) {
            e.printStackTrace();
            throw new TechnicalException("Ha ocurrido un error al obtener parametros de urls del Api ArcGis.");
        }
    }

    @Bean
    private String obtainCronValue() {
        Map<String, Object> params = loadParParameters();
        return (String) params.get("cron");
    }


    /**
     * Metodo para crear json que se envia al servicio de arcgis
     *
     * @param subsUpdated
     * @return {@link String}
     * @throws JsonProcessingException
     */
    private String createJson(List<HashMap<String, Object>> subsUpdated) throws JsonProcessingException {
        List<Map<String, Object>> newListMap = new ArrayList<>();
        for (HashMap<String, Object> map : subsUpdated) {
            Map<String, Object> newMap = new HashMap<>();
            newMap.put("attributes", map);
            newListMap.add(newMap);
        }
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(newListMap);
    }

    /**
     * Actualiza los atributos del objeto de la suscripcion en Arcgis
     *
     * @param originSubs
     * @param destinationSubs
     * @return {@link List<HashMap<String,Object>>}
     */
    private List<HashMap<String, Object>> updateValues(List<Map<String, Object>> originSubs, List<HashMap<String, Object>> destinationSubs) {

        List<HashMap<String, Object>> subsForUpdate = new ArrayList<>();

        for (HashMap<String, Object> destSub : destinationSubs) {
            int count = 0;
            Optional<Map<String, Object>> originSub = originSubs.stream()
                    .filter(map -> destSub.get("COD_BIOAGRICOLA").equals(map.get("COD_BIOAGRICOLA")))
                    .findFirst();
            if (originSub.isPresent()) {

                if (originSub.get().get("FECHA_ENCUESTA") != null) {
                    long tiempoUnix = ((Date) originSub.get().get("FECHA_ENCUESTA")).getTime();
                    if (destSub.get("FECHA_ENCUESTA") == null || !destSub.get("FECHA_ENCUESTA").equals(tiempoUnix)) {
                        destSub.put("FECHA_ENCUESTA", tiempoUnix);
                        count += 1;
                    }
                }
                if ((destSub.get("NOMBRE_SUSCRIPTOR") == null && originSub.get().get("NOMBRE_SUSCRIPTOR") != null) ||
                        (destSub.get("NOMBRE_SUSCRIPTOR") != null && originSub.get().get("NOMBRE_SUSCRIPTOR") != null && !destSub.get("NOMBRE_SUSCRIPTOR").equals(originSub.get().get("NOMBRE_SUSCRIPTOR")))) {
                    destSub.put("NOMBRE_SUSCRIPTOR", originSub.get().get("NOMBRE_SUSCRIPTOR"));
                    count += 1;
                }
                if ((destSub.get("NUMERO_DOCUMENTO") == null && originSub.get().get("NUMERO_DOCUMENTO") != null) ||
                        (destSub.get("NUMERO_DOCUMENTO") != null && originSub.get().get("NUMERO_DOCUMENTO") != null && !destSub.get("NUMERO_DOCUMENTO").equals(originSub.get().get("NUMERO_DOCUMENTO")))) {
                    destSub.put("NUMERO_DOCUMENTO", originSub.get().get("NUMERO_DOCUMENTO"));
                    count += 1;
                }
                if ((destSub.get("TELEFONO") == null && originSub.get().get("TELEFONO") != null) ||
                        (destSub.get("TELEFONO") != null && originSub.get().get("TELEFONO") != null && !destSub.get("TELEFONO").equals(originSub.get().get("TELEFONO")))) {
                    destSub.put("TELEFONO", originSub.get().get("TELEFONO"));
                    count += 1;
                }
                if ((destSub.get("CORREO_ELECTRONICO") == null && originSub.get().get("CORREO_ELECTRONICO") != null) ||
                        (destSub.get("CORREO_ELECTRONICO") != null && originSub.get().get("CORREO_ELECTRONICO") != null && !destSub.get("CORREO_ELECTRONICO").equals(originSub.get().get("CORREO_ELECTRONICO")))) {
                    destSub.put("CORREO_ELECTRONICO", originSub.get().get("CORREO_ELECTRONICO"));
                    count += 1;
                }
                if ((destSub.get("DIRECCION") == null && originSub.get().get("DIRECCION") != null) ||
                        (destSub.get("DIRECCION") != null && originSub.get().get("DIRECCION") != null && !destSub.get("DIRECCION").equals(originSub.get().get("DIRECCION")))) {
                    destSub.put("DIRECCION", originSub.get().get("DIRECCION"));
                    count += 1;
                }
                if ((destSub.get("BARRIO") == null && originSub.get().get("BARRIO") != null) ||
                        (destSub.get("BARRIO") != null && originSub.get().get("BARRIO") != null && !destSub.get("BARRIO").equals(originSub.get().get("BARRIO")))) {
                    destSub.put("BARRIO", originSub.get().get("BARRIO"));
                    count += 1;
                }
                if ((destSub.get("NOMBRE_ESTABLECIMIENTO") == null && originSub.get().get("NOMBRE_ESTABLECIMIENTO") != null) ||
                        (destSub.get("NOMBRE_ESTABLECIMIENTO") != null && originSub.get().get("NOMBRE_ESTABLECIMIENTO") != null && !destSub.get("NOMBRE_ESTABLECIMIENTO").equals(originSub.get().get("NOMBRE_ESTABLECIMIENTO")))) {
                    destSub.put("NOMBRE_ESTABLECIMIENTO", originSub.get().get("NOMBRE_ESTABLECIMIENTO"));
                    count += 1;
                }
                if ((destSub.get("ESTRATO") == null && originSub.get().get("ESTRATO") != null) ||
                        (destSub.get("ESTRATO") != null && originSub.get().get("ESTRATO") != null && !destSub.get("ESTRATO").equals(originSub.get().get("ESTRATO")))) {
                    destSub.put("ESTRATO", originSub.get().get("ESTRATO"));
                    count += 1;
                }
                if ((destSub.get("USO_PREDIO") == null && originSub.get().get("USO_PREDIO") != null) ||
                        (destSub.get("USO_PREDIO") != null && originSub.get().get("USO_PREDIO") != null && !destSub.get("USO_PREDIO").equals(originSub.get().get("USO_PREDIO")))) {
                    destSub.put("USO_PREDIO", originSub.get().get("USO_PREDIO"));
                    count += 1;
                }
                if ((destSub.get("CATASTRAL") == null && originSub.get().get("CATASTRAL") != null) ||
                        (destSub.get("CATASTRAL") != null && originSub.get().get("CATASTRAL") != null && !destSub.get("CATASTRAL").equals(originSub.get().get("CATASTRAL")))) {
                    destSub.put("CATASTRAL", originSub.get().get("CATASTRAL"));
                    count += 1;
                }
                if ((destSub.get("CATASTRAL_ANTERIOR") == null && originSub.get().get("CATASTRAL_ANTERIOR") != null) ||
                        (destSub.get("CATASTRAL_ANTERIOR") != null && originSub.get().get("CATASTRAL_ANTERIOR") != null && !destSub.get("CATASTRAL_ANTERIOR").equals(originSub.get().get("CATASTRAL_ANTERIOR")))) {
                    destSub.put("CATASTRAL_ANTERIOR", originSub.get().get("CATASTRAL_ANTERIOR"));
                    count += 1;
                }
                if ((destSub.get("DESOCUPADO") == null && originSub.get().get("DESOCUPADO") != null) ||
                        (destSub.get("DESOCUPADO") != null && originSub.get().get("DESOCUPADO") != null && !destSub.get("DESOCUPADO").equals(originSub.get().get("DESOCUPADO")))) {
                    destSub.put("DESOCUPADO", originSub.get().get("DESOCUPADO"));
                    count += 1;
                }
                if ((destSub.get("AFORADO") == null && originSub.get().get("AFORADO") != null) ||
                        (destSub.get("AFORADO") != null && originSub.get().get("AFORADO") != null && !destSub.get("AFORADO").equals(originSub.get().get("AFORADO")))) {
                    destSub.put("AFORADO", originSub.get().get("AFORADO"));
                    count += 1;
                }
                if ((destSub.get("CODIGO_EMSA") == null && originSub.get().get("CODIGO_EMSA") != null) ||
                        (destSub.get("CODIGO_EMSA") != null && originSub.get().get("CODIGO_EMSA") != null && !destSub.get("CODIGO_EMSA").equals(originSub.get().get("CODIGO_EMSA")))) {
                    destSub.put("CODIGO_EMSA", originSub.get().get("CODIGO_EMSA"));
                    count += 1;
                }
                if ((destSub.get("SERVICIO_GAS") == null && originSub.get().get("SERVICIO_GAS") != null) ||
                        (destSub.get("SERVICIO_GAS") != null && originSub.get().get("SERVICIO_GAS") != null && !destSub.get("SERVICIO_GAS").equals(originSub.get().get("SERVICIO_GAS")))) {
                    destSub.put("SERVICIO_GAS", originSub.get().get("SERVICIO_GAS"));
                    count += 1;
                }
                if ((destSub.get("CODIGO_LLANOGAS") == null && originSub.get().get("CODIGO_LLANOGAS") != null) ||
                        (destSub.get("CODIGO_LLANOGAS") != null && originSub.get().get("CODIGO_LLANOGAS") != null && !destSub.get("CODIGO_LLANOGAS").equals(originSub.get().get("CODIGO_LLANOGAS")))) {
                    destSub.put("CODIGO_LLANOGAS", originSub.get().get("CODIGO_LLANOGAS"));
                    count += 1;
                }
                if ((destSub.get("MED_GAS") == null && originSub.get().get("MED_GAS") != null) ||
                        (destSub.get("MED_GAS") != null && originSub.get().get("MED_GAS") != null && !destSub.get("MED_GAS").equals(originSub.get().get("MED_GAS")))) {
                    destSub.put("MED_GAS", originSub.get().get("MED_GAS"));
                    count += 1;
                }
                if ((destSub.get("OBSERVACION") == null && originSub.get().get("OBSERVACION") != null) ||
                        (destSub.get("OBSERVACION") != null && originSub.get().get("OBSERVACION") != null && !destSub.get("OBSERVACION").equals(originSub.get().get("OBSERVACION")))) {
                    destSub.put("OBSERVACION", originSub.get().get("OBSERVACION"));
                    count += 1;
                }
                if ((destSub.get("TIPO_MEDIDA") == null && originSub.get().get("TIPO_MEDIDA") != null) ||
                        (destSub.get("TIPO_MEDIDA") != null && originSub.get().get("TIPO_MEDIDA") != null && !destSub.get("TIPO_MEDIDA").equals(originSub.get().get("TIPO_MEDIDA")))) {
                    destSub.put("TIPO_MEDIDA", originSub.get().get("TIPO_MEDIDA"));
                    count += 1;
                }
                if ((destSub.get("PQRS_RADICADO") == null && originSub.get().get("PQRS_RADICADO") != null) ||
                        (destSub.get("PQRS_RADICADO") != null && originSub.get().get("PQRS_RADICADO") != null && !destSub.get("PQRS_RADICADO").equals(originSub.get().get("PQRS_RADICADO")))) {
                    destSub.put("PQRS_RADICADO", originSub.get().get("PQRS_RADICADO"));
                    count += 1;
                }
            }
            if (count > 0) {
                subsForUpdate.add(destSub);
            }
        }
        return subsForUpdate;
    }
}
