package com.bioagricola.homologaciones.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.repository.ImcdsusImpcontdsuscripcionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ImcdsusImpcontdsuscripcionService {
	
	@Autowired
	private ImcdsusImpcontdsuscripcionRepository repository;
	
	@Autowired
	private ObjectMapper objectMapper;	
	
	public List<Map<String, Object>> obtenerRegistrosBaseCentralByDsusPcodigo(Long usuario,Long imarc) {
        String json = repository.obtenerRegistrosBaseCentralByDsusPcodigo(usuario,imarc); 
        
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>(){});
        } catch (Exception e) {
            throw new RuntimeException("Error al parsear el JSON de la base de datos", e);
        }
    }
	
	public int limpiarImcdsusCompleto (Long usuario,Long imarc) {
		return repository.limpiarImcdsusCompleto(usuario,imarc);
	}
	

}
