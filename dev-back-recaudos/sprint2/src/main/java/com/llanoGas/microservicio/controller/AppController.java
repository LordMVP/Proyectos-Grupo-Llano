package com.llanoGas.microservicio.controller;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.llanoGas.microservicio.services.*;

import com.llanoGas.microservicio.Entity.*;
import com.llanoGas.microservicio.clases.ValidarToken;
import com.llanoGas.microservicio.clases.respuesta.RespuestaComision;
import com.llanoGas.microservicio.clases.respuesta.RespuestaServicio;

@RestController
@CrossOrigin
@RequestMapping
public class AppController {
	
	@Autowired
	private IRed_rangedacartService red_rangedacartService ;
	
	@Autowired
	private IIcc_impcarteracomisionService icc_impcarteracomisionService;
	@Autowired
	private IPcrc_parcomrecartService pcrc_parcomrecarService;
	@Autowired
	private IBcu_bcocuentaService bcocuentaService;
	@Autowired
	private IUni_unidadService unidadservice;
	@Autowired
	private ICon_conceptoService ConconceptoService;
	@Autowired
	private IDoc_documentoService docDocumentoService;

	@Autowired
	private ITer_terceroService ter_terceroService;

	@Autowired
	private ITido_tipodocumenService tiipoDocumentoService;

	@Autowired
	private IDicn_disconvenService disconvService;

	@Autowired
	private Irc_imprecaudocomisionService impuestoservice;

	@Autowired
	private IPrc_parecaudocomisionService parecaudocomisionService;

	private ValidarToken validar = new ValidarToken();
	private AuditoriaDTO ValidarTokenObj = null;
	private String tokenRenovado = "";
	@Autowired
	private HttpServletRequest request;
	private String autorizacion = "";

	@GetMapping("/priorizar/disconven/{idPrograma}")
	public ResponseEntity<?> listardisconven(@PathVariable int idPrograma) throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Dicn_disconven>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Dicn_disconven> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			lista = disconvService.listaDinsConven(ValidarTokenObj.getIdEmpresa());

			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@GetMapping("/priorizar/tipoDocumento/{idPrograma}")
	public ResponseEntity<?> listarTipoDocumento(@PathVariable int idPrograma) throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Tido_tipdocumen>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Tido_tipdocumen> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			lista = tiipoDocumentoService.listaTipoDocument(ValidarTokenObj.getIdUsuario(),
					ValidarTokenObj.getIdEmpresa(), idPrograma);
			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@GetMapping("/priorizar/concepto/{idPrograma}")
	public ResponseEntity<?> listarConcepto(@PathVariable int idPrograma) throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Con_concepto>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Con_concepto> lista = null;
		List<Con_concepto> lconceptoNuevo = new ArrayList<Con_concepto>();

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {

			lista = ConconceptoService.listaConcepto(ValidarTokenObj.getIdUsuario(), ValidarTokenObj.getIdEmpresa(),
					idPrograma);
			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@GetMapping("/priorizar/documento/{idPrograma}")
	public ResponseEntity<?> listarDocumento(@PathVariable int idPrograma) throws AplicacionExcepcion {

		HashMap<String, String> respuesta = new HashMap<String, String>();

		RespuestaServicio respuestaServicio = new RespuestaServicio<Doc_documento>();

		List<Doc_documento> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			lista = docDocumentoService.listaDocumento(ValidarTokenObj.getIdUsuario(), ValidarTokenObj.getIdEmpresa(),
					idPrograma);
			// return new ResponseEntity<List<Con_concepto>>(lista,HttpStatus.OK);

			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@PostMapping("/sesion")
	public ResponseEntity<?> sesion(@RequestBody AutenticacionDTO auth) {
		HashMap<String, String> respuesta = new HashMap<String, String>();
		EAplicacion aplicacion = null;
		ClienteToken tokenCliente = new ClienteToken(aplicacion.PRISMA);

		// AutenticacionDTO auth= new AutenticacionDTO();

		String token;
		try {
			token = tokenCliente.autenticar(auth);

			respuesta.put("mensaje", token);

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

		} catch (AplicacionExcepcion e) {

			respuesta.put("mensaje", e.getMensaje());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/priorizar/sesion")
	public ResponseEntity<?> sesionpriorizar(@RequestBody AutenticacionDTO auth) {
		HashMap<String, String> respuesta = new HashMap<String, String>();
		EAplicacion aplicacion = null;
		ClienteToken tokenCliente = new ClienteToken(aplicacion.PRISMA);

		// AutenticacionDTO auth= new AutenticacionDTO();

		String token;
		try {
			token = tokenCliente.autenticar(auth);

			respuesta.put("mensaje", token);

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

		} catch (AplicacionExcepcion e) {

			respuesta.put("mensaje", e.getMensaje());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);
		}
	}

	@PutMapping("/priorizar/concepto/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> update(@RequestBody Con_concepto concepto, @PathVariable int id)
			throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Con_concepto>();

			Con_concepto conceptoActual = null;

			conceptoActual = ConconceptoService.findById(id);
			// validacion personalizada

			if (conceptoActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			Con_concepto conceptoNuevo = null;
			List<Con_concepto> lconceptoNuevo = new ArrayList<Con_concepto>();

			conceptoActual.setCon_pagpriori(concepto.getCon_pagpriori());
			conceptoActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			conceptoNuevo = ConconceptoService.priorizarConcepto2(conceptoActual);

			respuestaServicio.setDatos(lconceptoNuevo);
			respuestaServicio.setCodigo(1);
			respuestaServicio.setMensaje("La prioridad ha sido actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	@PutMapping("/priorizar/documento/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> updateDocumento(@RequestBody Doc_documento documento, @PathVariable int id)
			throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Doc_documento>();

			Doc_documento documentoActual = null;

			documentoActual = docDocumentoService.findById(id);
			// validacion personalizada

			if (documentoActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			Doc_documento documentoNuevo = null;
			List<Doc_documento> ldocumentoNuevo = new ArrayList<Doc_documento>();

			documentoActual.setDoc_pagpriori(documento.getDoc_pagpriori());
			documentoActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			documentoNuevo = docDocumentoService.priorizarDocumento(documentoActual);

			respuestaServicio.setDatos(ldocumentoNuevo);
			respuestaServicio.setCodigo(1);
			respuestaServicio.setMensaje("La prioridad ha sido actualizada");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	@PutMapping("/priorizar/tipoDocumento/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> updateDocumento(@RequestBody Tido_tipdocumen Tipodocumento, @PathVariable int id)
			throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Tido_tipdocumen>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			Tido_tipdocumen documentoActual = null;

			documentoActual = tiipoDocumentoService.findById(id);
			// validacion personalizada

			if (documentoActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			Tido_tipdocumen documentoNuevo = null;
			List<Tido_tipdocumen> ldocumentoNuevo = new ArrayList<Tido_tipdocumen>();

			documentoActual.setTido_pagpriori(Tipodocumento.getTido_pagpriori());
			documentoActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			documentoNuevo = tiipoDocumentoService.priorizarTipoDocumento(documentoActual);

			respuestaServicio.setDatos(ldocumentoNuevo);
			respuestaServicio.setCodigo(1);
			respuestaServicio.setMensaje("La prioridad ha sido actualizada");
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	@PutMapping("/priorizar/disconven/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> UpdateDisconven(@RequestBody Dicn_disconven disconven, @PathVariable int id)
			throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Dicn_disconven>();
		HashMap<String, String> respuesta = new HashMap<String, String>();
		int empresa = 0;
		try {
			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}
			Dicn_disconven disconvenActual = null;

			empresa = ValidarTokenObj.getIdEmpresa();
			disconvenActual = disconvService.FilaDinsConven(empresa, id);
			// validacion personalizada-----------------------------------

			if (disconvenActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// fin libreria estandar gellSS

			Dicn_disconven disconvenNuevo = null;

			List<Dicn_disconven> ldisconvenNuevo = new ArrayList<Dicn_disconven>();

			disconvenActual.setDicn_pagprioridad(disconven.getDicn_pagprioridad());
			disconvenActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			disconvenNuevo = disconvService.priorizarDinsConven(disconvenActual);

			respuestaServicio.setDatos(ldisconvenNuevo);
			respuestaServicio.setCodigo(1);
			respuestaServicio.setMensaje("La prioridad ha sido actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	// 2 spring

	@GetMapping("comision/recaudos")
	public ResponseEntity<?> listarimpuiesto() throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Irc_imprecaudocomision>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Prc_parecaudocomision> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			lista = parecaudocomisionService.lista();

			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@GetMapping("comision/terceros/{idPrograma}")
	public ResponseEntity<?> EntidadBancaria(@PathVariable int idPrograma) throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Ter_tercero>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		Par_parametro parametro = null;
		List<Ter_tercero> listaTercero = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			parametro = ter_terceroService.parametro(ValidarTokenObj.getIdEmpresa());
			JSONObject jsonObj = new JSONObject(parametro.getPar_parametro());
			int unidadBancaria = jsonObj.getJSONObject("COMISION_RECAUDO").getInt("unidad_bancaria");
			System.out.println(unidadBancaria);

			listaTercero = ter_terceroService.TerceroEntidad(unidadBancaria, idPrograma,
					ValidarTokenObj.getIdUsuario());
			respuestaServicio.setDatos(listaTercero);
			respuestaServicio.setCodigo(1);
			respuestaServicio.setMensaje("Los datos han sido cargados");
			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@GetMapping("/comision/convenios/{documento}")
	public ResponseEntity<?> convenios(@PathVariable String documento) throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Uni_unidad>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Uni_unidad> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {

			lista = unidadservice.convenios(documento);

			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@GetMapping("/comision/impuestos")
	public ResponseEntity<?> obtenerComisionRecaudo() throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Con_concepto>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Con_concepto> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			Par_parametro parametro = null;
			parametro = ter_terceroService.parametro(ValidarTokenObj.getIdEmpresa());

			JSONObject json = new JSONObject(parametro.getPar_parametro());

			JSONObject goat = json.getJSONObject("COMISION_RECAUDO");

			int id = goat.getInt("unidad_bancaria");
			int claseImpuesto = goat.getInt("clase_impuesto");

			System.out.print(claseImpuesto);
			lista = ConconceptoService.impuesto(claseImpuesto, ValidarTokenObj.getIdEmpresa());// 317 EMPRESA
																	// QUEMADOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	@PostMapping("/comision/recaudos")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> saveComisionRecaudo(@RequestBody Prc_parecaudocomision prc_parecaudocomision)
			throws AplicacionExcepcion {
		RespuestaComision respuestaServicio = new RespuestaComision<Prc_parecaudocomision>();
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			// validacion personalizada

			if (prc_parecaudocomision == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			int validar = parecaudocomisionService.validar(prc_parecaudocomision.getTer_ideregistro(),
					prc_parecaudocomision.getUni_medpago());
			System.out.print(validar);

			if (validar != 0) {

				respuestaServicio.setCodigo(0);
				respuestaServicio.setMensaje("El convenio ya existe");
				return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

			}

		

		

			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			Prc_parecaudocomision prc_parecaudocomisionNuevo = null;
			List<Prc_parecaudocomision> lPrc_parecaudocomision = new ArrayList<Prc_parecaudocomision>();
			prc_parecaudocomision.setPrc_estado("1");
			prc_parecaudocomision.setPrc_fecha(time);
			
			prc_parecaudocomision.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			prc_parecaudocomisionNuevo = parecaudocomisionService.save(prc_parecaudocomision);

			respuestaServicio.setDatos(lPrc_parecaudocomision);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("exito");
			respuestaServicio.setId(prc_parecaudocomisionNuevo.getPrc_ideregistro());
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	@PostMapping("/comision/recaudos/impuestos")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> saveComisionRecaudo(@RequestBody List<Irc_imprecaudocomision>  rc_imprecaudocomision)
			throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Irc_imprecaudocomision>();
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			// validacion personalizada

			if (rc_imprecaudocomision == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			List<Irc_imprecaudocomision> impuestoNuevo = null;
			List<Irc_imprecaudocomision> listavacia = new ArrayList<Irc_imprecaudocomision>();
for (Irc_imprecaudocomision irc_imprecaudocomision : rc_imprecaudocomision) {
	
	irc_imprecaudocomision.setIrc_fecha(time);
	irc_imprecaudocomision.setUsu_idregistro(ValidarTokenObj.getIdUsuario());
}
			//rc_imprecaudocomision.setIrc_fecha(time);

		//	rc_imprecaudocomision.setUsu_idregistro(ValidarTokenObj.getIdUsuario());
			impuestoNuevo = impuestoservice.save(rc_imprecaudocomision);

			respuestaServicio.setDatos(listavacia);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("exito");
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	@PutMapping("/comision/cartera/accion/{id}/{accion}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> inhabilitarCarteraComision(@PathVariable int id,@PathVariable String accion,@RequestBody Pcrc_parcomrecart Pcrc_parcomrecart) throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Pcrc_parcomrecartImpl>();

			Pcrc_parcomrecart pcrc_parcomrecartActual = null;

			pcrc_parcomrecartActual = pcrc_parcomrecarService.findById(id);
			// validacion personalizada

			if (pcrc_parcomrecartActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			Pcrc_parcomrecart pcrc_parcomrecartNuevo = null;
			List<Pcrc_parcomrecart> Pcrc_parcomrecartResp = new ArrayList<Pcrc_parcomrecart>();
			pcrc_parcomrecartActual.setPcrc_estado(accion);
			if(accion.equals("2")) {
			pcrc_parcomrecartActual.setPcrc_vigencia_hasta(Pcrc_parcomrecart.getPcrc_vigencia_hasta());
			}
			pcrc_parcomrecartActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			pcrc_parcomrecartNuevo = pcrc_parcomrecarService.save(pcrc_parcomrecartActual);
			Pcrc_parcomrecartResp.add(pcrc_parcomrecartNuevo);
			respuestaServicio.setDatos(Pcrc_parcomrecartResp);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("La prioridad ha sido actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}
/**
	@PutMapping("/comision/cartera/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> updateRedacaudoComision(@RequestBody Pcrc_parcomrecart pcrc_parcomrecart,
			@PathVariable int id) throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Pcrc_parcomrecart>();

			Pcrc_parcomrecart pcrc_parcomrecartActual = null;

			pcrc_parcomrecartActual = pcrc_parcomrecarService.findById(id);
			
			// validacion personalizada

			if (pcrc_parcomrecartActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin
			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			Pcrc_parcomrecart pcrc_parcomrecartNuevo = null;
			List<Con_concepto> lconceptoNuevo = new ArrayList<Con_concepto>();
			pcrc_parcomrecartActual.setPcrc_estado("1");


		

		
			pcrc_parcomrecartActual.setTer_ideregistro(pcrc_parcomrecart.getTer_ideregistro());
			

			pcrc_parcomrecartActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			pcrc_parcomrecartActual.setBcu_ideregistro(pcrc_parcomrecart.getBcu_ideregistro());
			pcrc_parcomrecartActual.setUni_medpago(pcrc_parcomrecart.getUni_medpago());

			pcrc_parcomrecartNuevo = pcrc_parcomrecarService.save(pcrc_parcomrecartActual);

			respuestaServicio.setDatos(lconceptoNuevo);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("La prioridad ha sido Actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}*/

	@PostMapping("/comision/cartera")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> saveComisionCartera(@RequestBody Pcrc_parcomrecart pcrc_parcomrecart)
			throws AplicacionExcepcion {
		RespuestaComision respuestaServicio = new RespuestaComision<Pcrc_parcomrecart>();
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			// validacion personalizada

			if (pcrc_parcomrecart == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			int validar = pcrc_parcomrecarService.validar(pcrc_parcomrecart.getTer_ideregistro(),
					pcrc_parcomrecart.getUni_medpago());
			System.out.print(+validar);

			if (validar != 0) {

				respuestaServicio.setCodigo(0);
				respuestaServicio.setMensaje("El convenio ya existe");
				return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

			}

		


			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			Pcrc_parcomrecart pcrc_parcomrecartNuevo = null;
			List<Prc_parecaudocomision> lPrc_parecaudocomision = new ArrayList<Prc_parecaudocomision>();
			pcrc_parcomrecart.setPcrc_estado("1");
			pcrc_parcomrecart.setPcrc_fecha(time);

			pcrc_parcomrecart.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			pcrc_parcomrecartNuevo = pcrc_parcomrecarService.save(pcrc_parcomrecart);

			respuestaServicio.setDatos(lPrc_parecaudocomision);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("exito");
			respuestaServicio.setId(pcrc_parcomrecartNuevo.getPcrc_ideregistro());
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}
	
	
	
	
	
	
	
	
	
	@PutMapping("/comision/recaudos/accion/{id}/{accion}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> inhabilitarRedacaudoComision(@PathVariable int id,@PathVariable String accion,@RequestBody Prc_parecaudocomision Prc_parecaudocomision) throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Prc_parecaudocomision>();

			Prc_parecaudocomision Prc_parecaudocomisionActual = null;

			Prc_parecaudocomisionActual = parecaudocomisionService.findById(id);
			// validacion personalizada

			if (Prc_parecaudocomisionActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			Prc_parecaudocomision prc_parecaudocomisionNuevo = null;
			List<Prc_parecaudocomision> prc_parecaudocomisionRespuesta = new ArrayList<Prc_parecaudocomision>();
			Prc_parecaudocomisionActual.setPrc_estado(accion);
			if(accion.equals("2")) {
			Prc_parecaudocomisionActual.setPrc_vigencia_hasta(Prc_parecaudocomision.getPrc_vigencia_hasta());
			}
			Prc_parecaudocomisionActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
			prc_parecaudocomisionNuevo = parecaudocomisionService.save(Prc_parecaudocomisionActual);
			prc_parecaudocomisionRespuesta.add(prc_parecaudocomisionNuevo);
			respuestaServicio.setDatos(prc_parecaudocomisionRespuesta);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("La prioridad ha sido actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}
	/**

	@PutMapping("/comision/recaudos/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> updateRedacaudoComision(@RequestBody Prc_parecaudocomision prc_parecaudocomision,
			@PathVariable int id) throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Prc_parecaudocomision>();

			Prc_parecaudocomision Prc_parecaudocomisionActual = null;

			Prc_parecaudocomisionActual = parecaudocomisionService.findById(id);
			// validacion personalizada

			if (Prc_parecaudocomisionActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin
			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			Prc_parecaudocomision prc_parecaudocomisionNuevo = null;
			List<Con_concepto> lconceptoNuevo = new ArrayList<Con_concepto>();
			Prc_parecaudocomisionActual.setPrc_estado("1");

			
			Prc_parecaudocomisionActual.setPrc_estado(prc_parecaudocomision.getPrc_estado());
			Prc_parecaudocomisionActual.setBcu_ideregistro(prc_parecaudocomision.getBcu_ideregistro());
			Prc_parecaudocomisionActual.setUni_medpago(prc_parecaudocomision.getUni_medpago());
			Prc_parecaudocomisionActual.setPrc_valor(prc_parecaudocomision.getPrc_valor());
			Prc_parecaudocomisionActual.setPrc_vigencia_desde(prc_parecaudocomision.getPrc_vigencia_desde());
			Prc_parecaudocomisionActual.setPrc_vigencia_hasta(prc_parecaudocomision.getPrc_vigencia_hasta());
			Prc_parecaudocomisionActual.setTer_ideregistro(prc_parecaudocomision.getTer_ideregistro());
			Prc_parecaudocomisionActual.setUni_tipocosto(prc_parecaudocomision.getUni_tipocosto());
			Prc_parecaudocomisionActual.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());

			prc_parecaudocomisionNuevo = parecaudocomisionService.save(Prc_parecaudocomisionActual);

			respuestaServicio.setDatos(lconceptoNuevo);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("La prioridad ha sido Actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}
	
	
	
	
	
	
	**/
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	@GetMapping("/comision/cuentas/{idTercero}/{idConvenio}")
	public ResponseEntity<?> cuentas(@PathVariable int idTercero,@PathVariable int idConvenio) throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Uni_unidad>();

		HashMap<String, String> respuesta = new HashMap<String, String>();


		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {

			List<Bcu_bcocuenta> cuenta;

			cuenta = bcocuentaService.convenios(idTercero,idConvenio);

			respuestaServicio.setDatos(cuenta);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}

	
	
	
	
	/*
	
	
	
	@PutMapping("/comision/impuestos/cartera/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> updateCarteraImp(@RequestBody Icc_impcarteracomision irc_imprecaudocomision,
			@PathVariable int id) throws AplicacionExcepcion {
		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {
			RespuestaServicio respuestaServicio = new RespuestaServicio<Icc_impcarteracomision>();

			Icc_impcarteracomision Irc_imprecaudocomisionActual = null;

			Irc_imprecaudocomisionActual = icc_impcarteracomisionService.findById(id);
			// validacion personalizada

			if (Irc_imprecaudocomisionActual == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin
			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			Icc_impcarteracomision imprecaudocomisionNuevo = null;
			List<Icc_impcarteracomision> lconceptoNuevo = new ArrayList<Icc_impcarteracomision>();



		

			Irc_imprecaudocomisionActual.setIcc_fecha(time);
			Irc_imprecaudocomisionActual.setIcc_porcentaje(irc_imprecaudocomision.getIcc_porcentaje());
			Irc_imprecaudocomisionActual.setIcc_valor(irc_imprecaudocomision.getIcc_valor());
			
			Irc_imprecaudocomisionActual.setUsu_idregistro(ValidarTokenObj.getIdUsuario());

			imprecaudocomisionNuevo = icc_impcarteracomisionService.save(Irc_imprecaudocomisionActual);

			respuestaServicio.setDatos(lconceptoNuevo);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("La prioridad ha sido Actualizada");

			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}*/

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	@PostMapping("/comision/cartera/impuestos")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> saveComisionCartera(@RequestBody List<Icc_impcarteracomision> Icc_impcarteracomision)
			throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Icc_impcarteracomision>();
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			// validacion personalizada

			if (Icc_impcarteracomision == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			List<Icc_impcarteracomision> impuestoNuevo = null;
			List<Icc_impcarteracomision> listavacia = new ArrayList<Icc_impcarteracomision>();

			
			for (Icc_impcarteracomision icc_impcarteracomision2 : Icc_impcarteracomision) {
				icc_impcarteracomision2.setIcc_fecha(time);

				icc_impcarteracomision2.setUsu_idregistro(ValidarTokenObj.getIdUsuario());
			}
			;
			impuestoNuevo = icc_impcarteracomisionService.save(Icc_impcarteracomision);

			respuestaServicio.setDatos(listavacia);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("exito");
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	@GetMapping("/comision/cartera")
	public ResponseEntity<?> listarcartera() throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Pcrc_parcomrecart>();

		HashMap<String, String> respuesta = new HashMap<String, String>();

		List<Pcrc_parcomrecart> lista = null;

		autorizacion = request.getHeader("authorization");

		ValidarTokenObj = validar.validarToken(autorizacion);
		if (ValidarTokenObj == null) {
			respuesta.put("mensaje", "Error validar token");

			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

		tokenRenovado = validar.renovarToken(ValidarTokenObj);

		// fin
		try {
			lista = pcrc_parcomrecarService.lista();

			respuestaServicio.setDatos(lista);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("Los datos han sido cargados");

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		} catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);

		}

	}
	
	
	
	
	

	@DeleteMapping("/comision/cartera/impuestos")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<?>  deleteImpuestoCartera( @RequestBody List<Icc_impcarteracomision> Icc_impcarteracomision) throws AplicacionExcepcion{
		HashMap<String, String> respuesta = new HashMap<String, String>();
		RespuestaServicio respuestaServicio = new RespuestaServicio<Icc_impcarteracomision>();

		try {
	
			List<Pcrc_parcomrecart> lista = null;
						// libreria estandargell
						autorizacion = request.getHeader("authorization");

						ValidarTokenObj = validar.validarToken(autorizacion);
						if (ValidarTokenObj == null) {
							respuesta.put("mensaje", "Error validar token");

							return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

						}

						tokenRenovado = validar.renovarToken(ValidarTokenObj);

						// respuesta.put("authorization", tokenRenovado);

			 icc_impcarteracomisionService.delete(Icc_impcarteracomision);
			 
			 
			 respuestaServicio.setDatos(lista);
				respuestaServicio.setCodigo(0);
				respuestaServicio.setMensaje("Actualizado");

				return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);
		} catch (DataAccessException e) {
		respuesta.put("mensaje", "Error del sistema");
			
			return new ResponseEntity<HashMap<String, String> >(respuesta,HttpStatus.FOUND);
		}
		
	
		
		
	}
	
	
	
	
	
	
	
	
	
	@DeleteMapping("/comision/cartera/rangos")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> deleteComisionRangos(@RequestBody List<Red_rangedacart> Red_rangedacart) throws AplicacionExcepcion{
		HashMap<String, String> respuesta = new HashMap<String, String>();
		RespuestaServicio respuestaServicio = new RespuestaServicio<Icc_impcarteracomision>();

		try {
	
			List<Red_rangedacart> lista = null;
						// libreria estandargell
						autorizacion = request.getHeader("authorization");

						ValidarTokenObj = validar.validarToken(autorizacion);
						if (ValidarTokenObj == null) {
							respuesta.put("mensaje", "Error validar token");

							return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

						}

						tokenRenovado = validar.renovarToken(ValidarTokenObj);

						// respuesta.put("authorization", tokenRenovado);

						red_rangedacartService.delete(Red_rangedacart);
			 
			 
			 respuestaServicio.setDatos(lista);
				respuestaServicio.setCodigo(0);
				respuestaServicio.setMensaje("Actualizado");

				return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);
		} catch (DataAccessException e) {
		respuesta.put("mensaje", "Error del sistema");
			
			return new ResponseEntity<HashMap<String, String> >(respuesta,HttpStatus.FOUND);
		}
		
	
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	@DeleteMapping("/comision/impuestos")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<?> deleteImpuestoRecaudo(@RequestBody List<Irc_imprecaudocomision> Irc_imprecaudocomision) throws AplicacionExcepcion{
		HashMap<String, String> respuesta = new HashMap<String, String>();
		RespuestaServicio respuestaServicio = new RespuestaServicio<Icc_impcarteracomision>();

		try {
	
			List<Red_rangedacart> lista = null;
						// libreria estandargell
						autorizacion = request.getHeader("authorization");

						ValidarTokenObj = validar.validarToken(autorizacion);
						if (ValidarTokenObj == null) {
							respuesta.put("mensaje", "Error validar token");

							return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

						}

						tokenRenovado = validar.renovarToken(ValidarTokenObj);

						// respuesta.put("authorization", tokenRenovado);

						impuestoservice.delete(Irc_imprecaudocomision);
			 
			 
			 respuestaServicio.setDatos(lista);
				respuestaServicio.setCodigo(0);
				respuestaServicio.setMensaje("Actualizado");

				return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);
		} catch (DataAccessException e) {
		respuesta.put("mensaje", "Error del sistema");
			
			return new ResponseEntity<HashMap<String, String> >(respuesta,HttpStatus.FOUND);
		}
	
	}
	
	
	
	
	@PostMapping("/comision/cartera/rangos")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> saveComisionRangos(@RequestBody List<Red_rangedacart> Red_rangedacart)
			throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Red_rangedacart>();
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			// validacion personalizada

			if (Red_rangedacart == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			List<Red_rangedacart> RangoNuevo = null;
			List<Irc_imprecaudocomision> listavacia = new ArrayList<Irc_imprecaudocomision>();
for (Red_rangedacart red_rangedacart : Red_rangedacart) {
	red_rangedacart.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
	red_rangedacart.setRed_fecha(time);
	
}
	
			RangoNuevo = red_rangedacartService.save(Red_rangedacart);

			respuestaServicio.setDatos(RangoNuevo);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("exito");
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}
	
	
	
	
	/**
	
	
	@PutMapping("/comision/cartera/rangos")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> updateComisionRangos(@RequestBody List<Red_rangedacart> Red_rangedacart)
			throws AplicacionExcepcion {
		RespuestaServicio respuestaServicio = new RespuestaServicio<Red_rangedacart>();
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());

		HashMap<String, String> respuesta = new HashMap<String, String>();

		try {

			// validacion personalizada

			if (Red_rangedacart == null) {
				respuesta.put("mensaje", "Error: no existe id para parametrizar: ");
				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.NOT_FOUND);
			}

			// libreria estandargell
			autorizacion = request.getHeader("authorization");

			ValidarTokenObj = validar.validarToken(autorizacion);
			if (ValidarTokenObj == null) {
				respuesta.put("mensaje", "Error validar token");

				return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

			}

			tokenRenovado = validar.renovarToken(ValidarTokenObj);

			// respuesta.put("authorization", tokenRenovado);

			// fin

			DateFormat df = DateFormat.getTimeInstance();
			Calendar cal = Calendar.getInstance();
			Timestamp time = new Timestamp(cal.getTimeInMillis());

			List<Red_rangedacart> RangoNuevo = null;
			List<Irc_imprecaudocomision> listavacia = new ArrayList<Irc_imprecaudocomision>();
for (Red_rangedacart red_rangedacart : Red_rangedacart) {
	red_rangedacart.setUsu_ideregistro(ValidarTokenObj.getIdUsuario());
	
}
	
			RangoNuevo = red_rangedacartService.save(Red_rangedacart);

			respuestaServicio.setDatos(RangoNuevo);
			respuestaServicio.setCodigo(0);
			respuestaServicio.setMensaje("actualizado");
			// return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.OK);

			return ResponseEntity.ok().header("authorization", tokenRenovado).body(respuestaServicio);

		}

		catch (DataAccessException e) {
			respuesta.put("mensaje", "Error del sistema al parametrizar ".concat(e.getMessage()));
			System.out.println(e.getMessage());
			return new ResponseEntity<HashMap<String, String>>(respuesta, HttpStatus.BAD_REQUEST);

		}

	}*/

}
