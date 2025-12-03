package com.bioagricola.homologaciones.dto;

import java.util.List;

import com.bioagricola.common.dto.ImportacionInformacionDTO;
import com.bioagricola.common.dto.RegistroValidacionArchivoDTO;

import lombok.Data;

@Data
public class ImportacionProcesoResponse {

	public String mensaje;
	public Integer codigo;
	public List<RegistroValidacionArchivoDTO> validaciones;
	public ImportacionInformacionDTO informacionImportacion; 
	public List<String> mensajesError;
	
}
