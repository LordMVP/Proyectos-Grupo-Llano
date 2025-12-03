package com.bioagricola.common.dto;

import com.bioagricola.common.util.ENUM_TIPO_VALIDACION;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InsertValidacionDTO {

	private String columnName;
	private ENUM_TIPO_VALIDACION tipoValidacion;
	private Object value;
	private String tableName;
	private Integer rowNumber;
	@Override
	public String toString() {
		return "InsertValidacionDTO [columnName=" + columnName + ", tipoValidacion=" + tipoValidacion + ", value="
				+ value + ", tableName=" + tableName + ", rowNumber=" + rowNumber + "]";
	}
	
	
}
