package com.bioagricola.apirest.liquidacion.negocio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.manejadores.ManejadorConConcepto;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;

/**
 * Logica de negocio Liquidacion
 * 
 * @author PedroDuarte
 */
@Service

public class NegocioReLiquidacion {

	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	@Autowired
	private ManejadorConConcepto manejadorConConcepto;
	@Autowired
	private NegocioParParametro negocioParParametro;
	@Autowired
	private ManejadorHistoricos manejadorHistoricos;
	@Autowired
	FuncionesConceptos funcionesConceptos;

	private Object cicloPeriodo;
	private char preliquidar;
	private String suscripcion;
	private Integer idempresa;
	private Integer idproceso;
	private Integer idacceso;
	private Integer idCiclo;
	private Integer idHilo;
	private Integer tipoNota;

	public void inicializarData(Integer idAcceso, Integer idCiclo, Integer idEmpresa, char preLiquidar,
			String suscripcion, Integer idHilo, Integer tipoNnota) {

		this.setIdacceso(idAcceso);
		this.setIdCiclo(idCiclo);
		this.setIdempresa(idEmpresa);
		this.setPreliquidar(preLiquidar);
		this.setSuscripcion(suscripcion);
		this.setIdhilo(idHilo);
		this.setTipoNota(tipoNnota);
		hilos();

	}

	public NegocioReLiquidacion() {
		super();
	}

	public NegocioReLiquidacion(Integer idAcceso, Integer idciclo, Integer idempresa, Integer idproceso,
			char preliquidar, String suscripcion, Integer idHilo) {
		super();
		this.idCiclo = idciclo;
		this.idempresa = idempresa;
		this.idproceso = idproceso;
		this.idacceso = idAcceso;
		this.preliquidar = preliquidar;
		this.suscripcion = suscripcion;
		this.idHilo = idHilo;
	}

	public void hilos() {

		Runnable hiloLiquidacionRUN = new NegocioReEjecucionHiloLiquidacion(negocioParParametro, manejadorHistoricos,
				manejadorCprCtrprocesoRespository, manejadorConConcepto, funcionesConceptos, this.preliquidar,
				this.idempresa, this.idHilo, this.idacceso, this.idCiclo, this.suscripcion, tipoNota);

		Thread thread = new Thread(hiloLiquidacionRUN);
		thread.start();

	}

	public Integer getIdacceso() {
		return idacceso;
	}

	public void setIdacceso(Integer idacceso) {
		this.idacceso = idacceso;
	}

	public Integer getIdempresa() {
		return idempresa;
	}

	public void setIdempresa(Integer idempresa) {
		this.idempresa = idempresa;
	}

	public Integer getIdproceso() {
		return idproceso;
	}

	public void setIdproceso(Integer idproceso) {
		this.idproceso = idproceso;
	}

	public Object getCicloPeriodo() {
		return cicloPeriodo;
	}

	public void setCicloPeriodo(Object cicloPeriodo) {
		this.cicloPeriodo = cicloPeriodo;
	}

	public Integer getIdCiclo() {
		return idCiclo;
	}

	public void setIdCiclo(Integer idCiclo) {
		this.idCiclo = idCiclo;
	}

	public char getPreliquidar() {
		return preliquidar;
	}

	public void setPreliquidar(char preliquidar) {
		this.preliquidar = preliquidar;
	}

	public void setSuscripcion(String suscripcion) {
		this.suscripcion = suscripcion;
	}

	private void setIdhilo(Integer idHilo) {
		this.idHilo = idHilo;

	}

	private void setTipoNota(Integer tipoNota) {
		this.tipoNota = tipoNota;

	}

}