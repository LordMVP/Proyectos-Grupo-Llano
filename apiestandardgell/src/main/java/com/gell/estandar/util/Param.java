/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import java.util.HashMap;

/**
 *
 * @author spiwer.com - Herman Leonardo Rey Baquero - leoreyb@gmail.com
 * @param <K> Clase que identifica la llave
 * @param <V> Clase que identifica el valor
 */
public class Param<K, V> extends HashMap<K, V>
{

  public Param<K, V> add(K key, V value)
  {
    put(key, value);
    return this;
  }
}
