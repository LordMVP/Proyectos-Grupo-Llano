package com.bioagricola.apirest.aprovechamiento.negocio;


import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IVersion;
import com.bioagricola.apirest.modelo.dtos.CicCicloDTO;
import com.bioagricola.apirest.modelo.entidades.CicCiclo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCicCiclo;

@Service
public class NegocioVersion  extends NegocioAbstracto<CicCiclo,CicCicloDTO> implements IVersion {
	
	@Autowired
    private ManejadorCicCiclo manejadorCicCiclo;
	
	 /**
     * Variable estatica para imprimir logs...
     */
    private static final Logger logger = Logger.getLogger(NegocioVersion.class.getName());
   
	
	public String version() {
		int idEmpresa = 322; //Llanogas;
		List<CicCiclo> listaCiclos = manejadorCicCiclo.consultarCiclos(idEmpresa);
		
		String buffer = new String();
		
		for(CicCiclo cicloItem: listaCiclos){
			buffer = buffer.concat(cicloItem.getCicNombre() );
		}
		
		return "ok .................".concat(buffer);
	}

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	protected Logger getLogger() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected CicCicloDTO instanciarDAO() {
		// TODO Auto-generated method stub
		return null;
	}
}
