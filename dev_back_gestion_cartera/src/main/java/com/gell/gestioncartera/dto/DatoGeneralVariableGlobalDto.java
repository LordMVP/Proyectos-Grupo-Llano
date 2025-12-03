package com.gell.gestioncartera.dto;

import java.util.List;

import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.Unidad;

import lombok.Data;

/**
 * 
 * @author Admin
 * Clase DTO para enviar los todos valores al formulario de variable globales 
 */
@Data
public class DatoGeneralVariableGlobalDto {
	private List<Unidad> listUnidadTipoDato;
	private List<Unidad> listUnidadAtributoMaestro;
	private List<Unidad> listUnidadCalculoGestion;
	private List<Unidad> listUnidadMetodoBackend;
	private List<Unidad> listUnidadProcedimientoGestion;
	private List<Unidad> listUnidadMetodoCarga;
}
