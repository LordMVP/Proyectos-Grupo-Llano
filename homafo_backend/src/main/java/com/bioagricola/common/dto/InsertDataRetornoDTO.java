package com.bioagricola.common.dto;

import java.util.List;

import lombok.Data;

@Data
public class InsertDataRetornoDTO {
	Long iminsIderegistro;
	List<String> retornoInsert;
	List<String> retornoPreInsert;
	String preInsert;
	List<String> conditionsColumns;
	List<String> updateColumns;
	String preInsertReturn;
	String valideInsertReturn;
	String preUpdateReturn;
	String preValideInsertReturn;
}
