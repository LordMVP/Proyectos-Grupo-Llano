package com.bioagricola.apirest.liquidacion.web.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioCprCtrproceso;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.ICprCtrproceso;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * DfacDetfactura
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/cprctrproceso")
public class ServicioCprCtrproceso implements ICprCtrproceso {

	@Autowired
	private NegocioCprCtrproceso negocioCprCtrproceso;

	@GetMapping("/prueba")
	public List<Object> getValorFactura(@RequestParam(value = "programa") Integer idPrograma,
			@RequestParam(value = "empresa") Integer empresa) {
			return negocioCprCtrproceso.getProcesoEjecucion(idPrograma, empresa);

	}

	@GetMapping("/delete")
	public int vaciarTablaProceso(@RequestParam(value = "empresa") String idEmpresa) {
		return negocioCprCtrproceso.vaciarTablaProceso(idEmpresa);
	}

	@GetMapping("/create")
	public int crearCargarTablaSuscripciones(@RequestParam(value = "ciclo") Integer idCiclo,
			@RequestParam(value = "empresa") Integer idEmpresa, @RequestParam(value = "idUsuario") Integer idUsuario,
			@RequestParam(value = "numeroProceso") Integer numeroProceso) {
		return negocioCprCtrproceso.crearCargarTablaSuscripciones(idCiclo, idEmpresa, idUsuario, numeroProceso);
	}

	@GetMapping("/liquidaciones")
	public List<Object> getLiquidaciones(@RequestParam(value = "empresa") String idEmpresa,
			@RequestParam(value = "proceso") Long proceso) {
		return negocioCprCtrproceso.getLiquidaciones(idEmpresa, proceso);
	}

	/**
	 * @GetMapping("/testHilo") public void hilos(@RequestParam(value="acceso")
	 * Integer idAcceso, @RequestParam(value="ciclo")Integer
	 * idCiclo,@RequestParam(value="empresa") Integer idEmpresa) {
	 * prel.lanzarHilos(idAcceso,idCiclo,idEmpresa); }
	 **/
}
