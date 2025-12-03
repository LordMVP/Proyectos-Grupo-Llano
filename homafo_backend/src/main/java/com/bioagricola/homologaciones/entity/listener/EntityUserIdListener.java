package com.bioagricola.homologaciones.entity.listener;

import java.lang.reflect.Field;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bioagricola.aforos.facade.AuthenticationFacade;

public class EntityUserIdListener {
	private static Log log = LogFactory.getLog(EntityUserIdListener.class);
	

	@Autowired
	private AuthenticationFacade autoFacade;
    
	@PrePersist
	@PreUpdate
	public void setUserId(Object entity) {
		Field field;
		try {
			field = entity.getClass().getDeclaredField("usuIderegistro");
			field.setAccessible(true);
			if(field.getType().getSimpleName().equals("Long")) {
			field.set(entity, autoFacade.getIdUsuarioLong());
			}
			log.info("Set user to entity");
		} catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e) {
			// TODO Auto-generated catch block
			log.error("No se logro ajustar el usuario a la entidad "+entity.getClass().getName());
		}
		
	}
}
