package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DafoDetAforoDTO {
	
	
		//String afo_idregistro;
		//String dafo_fecharegistro;
		//String dafo_fechaactualizacion;
		//String afo_fechafinvegencia
		String afoNumpqr;
		Long dsusIderegistr;
		String dafoMultiusuporcentaje;
		
		String codigo;
		String nombre;
		String direccion;
		String nombreBarrio;
		String codigoBarrio;
		
		Long uniActsuscripc;
		String iasusNombreestablecimiento;
		String iasusReferenciacomercial;
		String cmpDireccion;
		Long estrato;
		
		String empresaSus;
		String tipoUsoSus;
		String estadoSus;
	
}
