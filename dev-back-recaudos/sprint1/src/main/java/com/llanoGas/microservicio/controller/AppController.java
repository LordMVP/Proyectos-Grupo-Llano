package com.llanoGas.microservicio.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.llanoGas.microservicio.services.ICon_conceptoService;
import com.llanoGas.microservicio.services.IDicn_disconvenService;
import com.llanoGas.microservicio.services.IDoc_documentoService;
import com.llanoGas.microservicio.services.ITido_tipodocumenService;
import com.llanoGas.microservicio.Entity.*;
import com.llanoGas.microservicio.clases.ValidarToken;
import com.llanoGas.microservicio.clases.respuesta.RespuestaServicio;

@RestController
@CrossOrigin
@RequestMapping
public class AppController {
	@Autowired
	private ICon_conceptoService ConconceptoService;
	@Autowired
	private IDoc_documentoService docDocumentoService;

	@Autowired
	private ITido_tipodocumenService tiipoDocumentoService;

	@Autowired
	private IDicn_disconvenService disconvService;

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

	@PostMapping("/priorizar/sesion")
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

}
