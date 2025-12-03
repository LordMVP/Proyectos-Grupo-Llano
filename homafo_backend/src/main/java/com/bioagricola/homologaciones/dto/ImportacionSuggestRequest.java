package com.bioagricola.homologaciones.dto;


import lombok.Data;

@Data
public class ImportacionSuggestRequest {

	private Long diminsId;
	private String searchValue;	
	private Integer limit;
}
