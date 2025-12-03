package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AforoResponseGeneral
{
	private String statusText;
    private Integer statusCode;
    private boolean error;
    

}
