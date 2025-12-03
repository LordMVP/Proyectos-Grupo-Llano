package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConcepto;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;

/**
 * Logica de negocio Liquidacion
 * 
 * @author PedroDuarte
 */
@Service

public class NegocioLiquidacion {


	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	@Autowired
	private ManejadorConConcepto manejadorConConcepto;
	@Autowired
	private NegocioParParametro negocioParParametro;
	@Autowired
	FuncionesConceptos funcionesConceptos;

	private Object cicloPeriodo;
	private char preliquidar;
	private Integer idempresa;
	private Integer idproceso;
	private Integer idacceso;
	private Integer idCiclo;

	private Integer numeroHilosFacturacion;

	public void inicializarData(Integer idAcceso, Integer idCiclo, Integer idEmpresa, char preLiquidar)
			throws IOException {
		Map<String, Object> parametros;
		 parametros = negocioParParametro.consultaParametros(idEmpresa,
				ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		numeroHilosFacturacion = (Integer) parametros.get(ConstantesServicios.NUMERO_HILOS_FACTURACION);
		this.setIdacceso(idAcceso);
		this.setIdCiclo(idCiclo);
		this.setIdempresa(idEmpresa);
		this.setPreliquidar(preLiquidar);
		testHilos();

	}

	public NegocioLiquidacion() {
		super();
	}

	public NegocioLiquidacion(Integer idAcceso, Integer idciclo, Integer idempresa, Integer idproceso,
			char preliquidar) {
		super();
		this.idCiclo = idciclo;
		this.idempresa = idempresa;
		this.idproceso = idproceso;
		this.idacceso = idAcceso;
		this.preliquidar = preliquidar;
	}

	public void testHilos() {

		for (Integer hilo = 1; hilo <= numeroHilosFacturacion; hilo++) {
			//interfaz Runnable
            Runnable hiloLiquidacionRUN = new NegocioEjecucionHiloLiquidacion(negocioParParametro,
                    manejadorCprCtrprocesoRespository, manejadorConConcepto, funcionesConceptos, this.preliquidar,
                    this.idempresa, hilo, this.idacceso, this.idCiclo);
           
            Thread thread = new Thread(hiloLiquidacionRUN);
            thread.start();
		}

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

}