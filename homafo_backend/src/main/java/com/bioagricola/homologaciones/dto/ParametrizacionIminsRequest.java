package com.bioagricola.homologaciones.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ParametrizacionIminsRequest
{
	private Integer idImins;
	private String tabla;
    private Integer orden;
    private String json;
    private List<ParametrizacionDiminsRequest> detalleDimins;
}
