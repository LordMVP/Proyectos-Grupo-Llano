package com.bioagricola.apirest.modelo.manejadores;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

@Repository
public class ManejadorSecuencias {
	
	@PersistenceContext
	EntityManager entityManager;
	
	public Object lastInsertId(String secuencia) {
		

		String sql="select * from "+ secuencia +"";
		return entityManager.createNativeQuery(sql).getResultList();
		
	}
	
	


}
