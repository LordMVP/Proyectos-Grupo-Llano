package com.bioagricola.apirest.liquidacion.negocio;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.CprCtrprocesoDTO;
import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;

@Service
public class NegocioCprCtrproceso extends NegocioAbstracto<CprCtrProceso, CprCtrprocesoDTO> {
	 
	 @Autowired
	 private ManejadorCprCtrprocesoRespository repo;

	 
	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected CprCtrprocesoDTO instanciarDAO() {
		return null;
	}
	
	public List<Object> getProcesoEjecucion(Integer idprograma, Integer idempresa) {
		String identificadorEmpresa = "proceso_facturacion_"+idempresa;
		return repo.getProcesoEjecucion(identificadorEmpresa, idprograma, idempresa);
	}
	
	public int vaciarTablaProceso(String idEmpresa){
		return  repo.vaciarTablaProceso(idEmpresa);
	}

	public int crearCargarTablaSuscripciones(Integer idCiclo, Integer idEmpresa, Integer idUsuario,
			Integer numeroProceso) {
		String tableid=String.valueOf(idEmpresa);
		return repo.cargarSuscripciones(idCiclo,idEmpresa,idUsuario,numeroProceso,tableid);
	}
	
	public List<Object> getLiquidaciones(String idEmpresa,Long proceso){
		return repo.getLiquidaciones(idEmpresa, proceso);
	}

}
