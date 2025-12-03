/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.sql.Time;

/**
 *
 * @author God
 */
public class HoraDeserializadorJson extends JsonDeserializer<Time> {

  @Override
  public Time deserialize(JsonParser jp, DeserializationContext dc)
          throws IOException, JsonProcessingException
  {
    String hora = jp.getValueAsString();
    if (hora == null) {
      return null;
    }
    return Time.valueOf(hora + ":00");
  }

}
