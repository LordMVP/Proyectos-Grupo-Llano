/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.util.interpretador;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gell.autenticador.negocio.util.anotacion.JsonArgumento;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.IOUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 *
 * @author god
 */
public class JsonInterpretador implements HandlerMethodArgumentResolver {

  private static final String JSONBODYATTRIBUTE = "JSON_REQUEST_BODY";

  @Override
  public boolean supportsParameter(MethodParameter methodParameter)
  {
    return methodParameter.hasParameterAnnotation(JsonArgumento.class);
  }

  @Override
  public Object resolveArgument(MethodParameter mp, ModelAndViewContainer mavc, NativeWebRequest nwr, WebDataBinderFactory wdbf)
          throws Exception
  {
    JsonArgumento anotacion = mp.getParameterAnnotation(JsonArgumento.class);
    String json = getJson(nwr);
    if (anotacion == null || json == null) {
      return null;
    }
    String nombreParametro = anotacion.value();
    ObjectMapper objJson = new ObjectMapper();
    JsonNode nodo = objJson.readTree(json);
    JsonNode infoParametro = nodo.get(nombreParametro);
    if (infoParametro == null) {
      return null;
    }
    Object valorParametro = infoParametro.asText();
    Class tipo = mp.getParameterType();
    if (valorParametro == null) {
      return null;
    }
    if ((valorParametro instanceof String) && tipo == String.class) {
      return valorParametro;
    }
    Object objValor = tipo.getMethod("valueOf", String.class).invoke(null, valorParametro);
    return tipo.cast(objValor);
  }

  public String getJson(NativeWebRequest request)
          throws IOException
  {
    HttpServletRequest servletRequest = request.getNativeRequest(HttpServletRequest.class);
    if (servletRequest == null) {
      return null;
    }
    Object json = servletRequest.getAttribute(JSONBODYATTRIBUTE);
    if (json == null) {
      json = IOUtils.toString(servletRequest.getInputStream());
      servletRequest.setAttribute(JSONBODYATTRIBUTE, json);
    }
    return (json == null || "".equals(json)) ? null : json.toString();
  }

}
