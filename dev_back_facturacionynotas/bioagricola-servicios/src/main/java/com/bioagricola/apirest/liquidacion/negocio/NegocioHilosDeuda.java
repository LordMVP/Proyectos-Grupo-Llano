package com.bioagricola.apirest.liquidacion.negocio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Logica de negocio Liquidacion
 * 
 * @author PedroDuarte
 */
@Service

public class NegocioHilosDeuda {

	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	@Autowired
	private NegocioParParametro negocioParParametro;
	@Autowired
	private ManejadorHistoricos manejadorHistoricos;

	private char adiciona;
	private Boolean suselimina;
	private String factura;
	private Integer idempresa;
	private Integer idproceso;
	private Integer idacceso;
	private Integer idCiclo;
	private Integer idHilo;
	private Integer tipoNota;
	private String suscripcion;

	public void inicializarData(Integer idAcceso, Integer idCiclo, Integer idEmpresa, char adiciona, String factura,
			Integer idHilo, Integer tipoNnota, Boolean suselimina, String suscripcion) {

		this.setIdacceso(idAcceso);
		this.setIdCiclo(idCiclo);
		this.setIdempresa(idEmpresa);
		this.setAdiciona(adiciona);
		this.setFactura(factura);
		this.setIdhilo(idHilo);
		this.setTipoNota(tipoNnota);
		this.setSuselimina(suselimina);
		this.setSuscripcion(suscripcion);
		hilos();

	}
	
	public NegocioHilosDeuda(Integer idAcceso, Integer idciclo, Integer idempresa, Integer idproceso, char adiciona,
			String factura, Integer idHilo) {
		super();
		this.idCiclo = idciclo;
		this.idempresa = idempresa;
		this.idproceso = idproceso;
		this.idacceso = idAcceso;
		this.adiciona = adiciona;
		this.factura = factura;
		this.idHilo = idHilo;
	}

	public void hilos() {
       
    ExecutorService executor = Executors.newFixedThreadPool(30); // 10 hilos en paralelo

    Runnable hiloDeudaRUN = new NegocioEjecucionHiloDeuda(negocioParParametro, manejadorHistoricos,
				manejadorCprCtrprocesoRespository, adiciona, idempresa, this.idHilo, idacceso, idCiclo, factura,
				tipoNota, suselimina, suscripcion);

    executor.submit(hiloDeudaRUN);
    executor.shutdown(); // Opcional: si solo se ejecutará una vez
		/*Runnable hiloDeudaRUN = new NegocioEjecucionHiloDeuda(negocioParParametro, manejadorHistoricos,
				manejadorCprCtrprocesoRespository, adiciona, idempresa, this.idHilo, idacceso, idCiclo, factura,
				tipoNota, suselimina, suscripcion);

		Thread thread = new Thread(hiloDeudaRUN);
		thread.start();
                
             executor = Executors.newFixedThreadPool(10);
            Runnable hiloRunnable = new NegocioEjecucionHiloDeuda(negocioParParametro, manejadorHistoricos,
				manejadorCprCtrprocesoRespository, adiciona, idempresa, this.idHilo, idacceso, idCiclo, factura,
				tipoNota, suselimina, suscripcion);
            executor.submit(hiloRunnable);
            executor.shutdown();*/

	}

	public Integer getIdHilo() {
		return idHilo;
	}

	public String getSuscripcion() {
		return suscripcion;
	}

	public void setSuscripcion(String suscripcion) {
		this.suscripcion = suscripcion;
	}

	public Boolean getSuselimina() {
		return suselimina;
	}

	public String getFactura() {
		return factura;
	}

	public Integer getTipoNota() {
		return tipoNota;
	}

	public NegocioHilosDeuda() {
		super();
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

	public Integer getIdCiclo() {
		return idCiclo;
	}

	public void setIdCiclo(Integer idCiclo) {
		this.idCiclo = idCiclo;
	}

	public char getAdiciona() {
		return adiciona;
	}

	public void setAdiciona(char adiciona) {
		this.adiciona = adiciona;
	}

	public void setFactura(String factura) {
		this.factura = factura;
	}

	private void setIdhilo(Integer idHilo) {
		this.idHilo = idHilo;

	}

	private void setTipoNota(Integer tipoNota) {
		this.tipoNota = tipoNota;

	}

	private void setSuselimina(Boolean suselimina) {
		this.suselimina = suselimina;

	}

}