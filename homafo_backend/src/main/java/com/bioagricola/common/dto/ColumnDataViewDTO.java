package com.bioagricola.common.dto;

import com.bioagricola.common.util.ENUM_COLUMN_TYPE_DATA;
import com.bioagricola.common.util.ENUM_IMCOL_TIPO_RESOLUCION;

import lombok.Data;

@Data
public class ColumnDataViewDTO {

	private String columnName;
	private String columnJson;
	private ENUM_COLUMN_TYPE_DATA columDataType;
	private String columnValidator;
	private ENUM_IMCOL_TIPO_RESOLUCION tipoResolucion;
	private String columnaDefault;
}
