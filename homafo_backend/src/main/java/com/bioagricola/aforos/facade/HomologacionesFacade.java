package com.bioagricola.aforos.facade;

import com.bioagricola.aforos.entity.dto.HomologacionesResponseDTO;

public final class HomologacionesFacade {

	private HomologacionesFacade() {}
	
	public static HomologacionesResponseDTO getHomologaciones() {
		
		HomologacionesResponseDTO hr = new HomologacionesResponseDTO();
								  hr.setActividadComercial("-");
								  hr.setFrecuenciaRecoleccion("L-M-V");
								  hr.setJornada("A.M.");
								  hr.setNombreEstablecimiento("-");
								  hr.setReferenciaComercial("-");
		return hr;
	}
}
