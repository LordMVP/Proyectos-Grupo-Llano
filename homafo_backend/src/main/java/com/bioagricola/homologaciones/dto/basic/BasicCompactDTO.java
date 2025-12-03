package com.bioagricola.homologaciones.dto.basic;

import java.util.HashMap;

import org.json.JSONObject;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;



@Data
@Getter@Setter
public class BasicCompactDTO {

	protected Integer id;
	protected String nombre;
	protected String codigo;
	protected JSONObject json;
	protected HashMap<String,Object> properties;
	//private T entityAssoc;
	
}
