package com.bioagricola.common.util;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Reflection
{
	private static final Logger LOGGER = LoggerFactory.getLogger(Reflection.class);
	
	public Map<String, Object> refelxionGeneneral(Object claseTmp)
	{
		Class<?> c = claseTmp.getClass();
	    Field[] fields = c.getDeclaredFields();
	    Map<String, Object> temp = new HashMap<>();
	    
	    for( Field field : fields )
	    {
	        field.setAccessible(true);
	      try {
	           //System.out.println("campo: "+field.getName().toString()+ " valor "+field.get(tmp));
	           temp.put(field.getName(), field.get(claseTmp));
	      } catch (IllegalArgumentException | IllegalAccessException e1) {
	    	  LOGGER.info("Error en proceso de reflexión mapeando objeto");
	      }
	    }
	    return temp;
	}    

}
