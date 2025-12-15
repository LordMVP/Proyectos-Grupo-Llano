package com.bioagricola.apirest.modelo.utils;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Yoner Silva Clase para hacer peticiones personalizadas a servicios
 * externos.
 */
@Component
public class HttpRequest {

    public ResponseEntity<Map> sendRequest(String URL, String method, Boolean disable_ssl_verification, Map<String, Object> properties, String token, String content_type, Integer timeout) {
        ResponseEntity<Map> respuesta = null;

        Gson gson = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();

        		OkHttpClient client = null;

        if (disable_ssl_verification) {
            client = buildUnsafeClient(timeout);
        } else {
            client = new OkHttpClient.Builder()
                    .connectTimeout(timeout, TimeUnit.SECONDS) // Tiempo de espera para la conexión
                    .readTimeout(timeout, TimeUnit.SECONDS) // Tiempo de espera para la lectura
                    .writeTimeout(timeout, TimeUnit.SECONDS) // Tiempo de espera de escritura
                    .build();
        }

        Request request = null;

        switch (content_type) {
            case UtilConstantes.APPLICATION_JSON:
                // Convert the Map to a JSON string using Gson with custom settings
                String requestBody = gson.toJson(properties);
                MediaType mediaType = MediaType.parse(content_type);
                RequestBody body = RequestBody.create(mediaType, requestBody);

                Request.Builder requestBuilder_1 = new Request.Builder()
                        .url(URL)
                        .method(method, body)
                        .addHeader("Content-Type", content_type);
                if (token != null) {
                    requestBuilder_1.addHeader("Authorization", token);
                }
                request = requestBuilder_1.build();
                break;

            case UtilConstantes.APPLICATION_X_WWW_FORM_URLENCODED:
                FormBody.Builder formBuilder = new FormBody.Builder();
                for (Map.Entry<String, Object> entry : properties.entrySet()) {
                    formBuilder.add(entry.getKey(), entry.getValue().toString());
                }
                RequestBody formBody = formBuilder.build();

                Request.Builder requestBuilder_2 = new Request.Builder()
                        .url(URL)
                        .method(method, formBody)
                        .addHeader("Content-Type", content_type);

                if (token != null) {
                    requestBuilder_2.addHeader("Authorization", token);
                }
                request = requestBuilder_2.build();
                break;
            default:
                Request.Builder requestBuilder_3 = new Request.Builder()
                        .url(URL)
                        .method(method, null);
                if (token != null) {
                    requestBuilder_3.addHeader("Authorization", token);
                }
                request = requestBuilder_3.build();
                break;
        }

        int maxIntentos = 3;
        int intentoActual = 0;

        while (intentoActual < maxIntentos) {
            try (Response response = client.newCall(request).execute()) {
                // Check if the request was successful (status code 2xx)
                if (response.isSuccessful()) {
                    // Get the response body
                    Map<String, Object> content = gson.fromJson(response.body().string(), Map.class);
                    respuesta = new ResponseEntity<Map>(content, HttpStatus.OK);
                    // Si la solicitud es exitosa, salir del bucle
                    break;
                } else {
                    respuesta = new ResponseEntity<Map>(null, HttpStatus.BAD_REQUEST);
                }
            } catch (IOException e) {
                // Manejar el timeout, incrementar el contador de intentos si es necesario
                intentoActual++;
                // Manejo específico para SocketTimeoutException
                if (e instanceof SocketTimeoutException) {
                    System.err.println("La conexión al servidor ha excedido el tiempo de espera.");
                } else {
                    e.printStackTrace();
                }
            }
        }
        return respuesta;
    }

    private OkHttpClient buildUnsafeClient(int timeoutSec) {
        try {
            // Trust manager que no valida certificados
            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public void checkClientTrusted(X509Certificate[] chain, String authType) {
                    }

                    public void checkServerTrusted(X509Certificate[] chain, String authType) {
                    }

                    public X509Certificate[] getAcceptedIssuers() {
                        return new X509Certificate[0];
                    }
                }
            };

            // Instancia SSLContext con ese TrustManager inseguro
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, new SecureRandom());

            // Permite cualquier hostname
            HostnameVerifier allowAllHostnames = (hostname, session) -> true;

            // Construye el cliente OkHttp inseguro
            return new OkHttpClient.Builder()
                    .sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustAllCerts[0])
                    .hostnameVerifier(allowAllHostnames)
                    .connectTimeout(timeoutSec, TimeUnit.SECONDS)
                    .readTimeout(timeoutSec, TimeUnit.SECONDS)
                    .writeTimeout(timeoutSec, TimeUnit.SECONDS)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error al configurar SSL inseguro", e);
        }
    }

    public ResponseEntity<Map> sendHttpRequest(String URL, MultiValueMap<String, String> properties, String content_type, Class response_type) throws RestClientException {

        LinkedList<org.springframework.http.MediaType> mediaTypes = new LinkedList<>();
        mediaTypes.add(org.springframework.http.MediaType.APPLICATION_JSON);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(org.springframework.http.MediaType.parseMediaType(content_type));
        httpHeaders.setAccept(mediaTypes);

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(properties, httpHeaders);
        return restTemplate.postForEntity(URL, request, response_type);
    }
}
