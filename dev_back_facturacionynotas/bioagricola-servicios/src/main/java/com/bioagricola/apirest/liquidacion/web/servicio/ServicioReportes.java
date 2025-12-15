package com.bioagricola.apirest.liquidacion.web.servicio;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.interfaces.INegocioReportes;

@RestController
@RequestMapping("/webresources/servicios/reportes")

public class ServicioReportes {

	String disposition = "Content-Disposition";
	String attachment = "attachment; filename=reporte.pdf";
	@Autowired
	private INegocioReportes negocioReportes;

	@GetMapping(path = "/facturasLiquidadas")
	public ResponseEntity<Object> facturasLiquidadas(@RequestParam("typeFile") String typeFile,
			@RequestParam("listaSuscripciones") String listaSuscripciones, @RequestParam("tipoNota") String tipoNota) {
		ByteArrayOutputStream out = negocioReportes.facturasLiquidadas(typeFile, listaSuscripciones, tipoNota);
		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}

	@GetMapping(path = "/facturasLiquidadasFuturo")
	public ResponseEntity<Object> facturasLiquidadasFuturo(@RequestParam("typeFile") String typeFile,
			@RequestParam("listaSuscripciones") String listaSuscripciones) {
		ByteArrayOutputStream out = negocioReportes.facturasLiquidadasFuturo(typeFile, listaSuscripciones);
		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}

	@GetMapping(path = "/facturasLiquidadasEstrato")
	public ResponseEntity<Object> facturasLiquidadaEstrato(@RequestParam("typeFile") String typeFile,
			@RequestParam("listaSuscripciones") String listaSuscripciones) throws IOException {
		ByteArrayOutputStream out = null;

		out = negocioReportes.facturasLiquidadaEstrato(typeFile, listaSuscripciones);

		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}

	@GetMapping(path = "/facturasLiquidadasTipoUso")
	public ResponseEntity<Object> facturasLiquidadaTipoUso(@RequestParam("typeFile") String typeFile,
			@RequestParam("listaSuscripciones") String listaSuscripciones, @RequestParam("tipoNota") Integer tipoNota) {
		ByteArrayOutputStream out = negocioReportes.facturasLiquidadaTipoUso(typeFile, listaSuscripciones, tipoNota);
		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}

	@GetMapping(path = "/facturasLiquidadasAforo")
	public ResponseEntity<Object> facturasLiquidadasAforo(@RequestParam("typeFile") String typeFile,
			@RequestParam("listaSuscripciones") String listaSuscripciones, @RequestParam("tipoNota") Integer tipoNota) {
		ByteArrayOutputStream out = negocioReportes.facturasLiquidadasAforo(typeFile, listaSuscripciones, tipoNota);
		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}

	@GetMapping(path = "/notasInclusionEliminacionDeuda")
	public ResponseEntity<Object> notasInclusionDeuda(@RequestParam("typeFile") String typeFile,
			@RequestParam("listaSuscripciones") String listaSuscripciones, @RequestParam("tipoNota") Integer tipoNota,
			@RequestParam("accionRealizar") Integer accionRealizar,
			@RequestParam("eliminarSuscripcion") Boolean eliminarSuscripcion) {
		ByteArrayOutputStream out = negocioReportes.notasInclusionDeuda(typeFile, listaSuscripciones, tipoNota,
				accionRealizar, eliminarSuscripcion);
		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}

	@GetMapping(path = "/reporte")
	public ResponseEntity<Object> generarReporte( @RequestParam Map<String, String> params) {
		ByteArrayOutputStream out = negocioReportes.generarReporte(params);
		ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
		HttpHeaders headers = new HttpHeaders();
		headers.add(disposition, attachment);
		return ResponseEntity.ok().headers(headers).body(new InputStreamResource(in));
	}


}
