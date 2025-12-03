package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

public interface ICprCtrproceso {
	public List<Object> getValorFactura(Integer idPrograma, Integer empresa);

	public int vaciarTablaProceso(String idEmpresa);

	public int crearCargarTablaSuscripciones(Integer idCiclo, Integer idEmpresa, Integer idUsuario,
			Integer numeroProceso);

	public List<Object> getLiquidaciones(String idEmpresa, Long proceso);

}
