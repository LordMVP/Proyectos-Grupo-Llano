package com.gell.gestioncartera.dto;

import java.util.List;

import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.Unidad;

import lombok.Data;
/**
 * 
 * @author Admin
 * Clase DTO para enviar los todos valores al formulario de ejecutivos 
 */
@Data
public class DatoGeneralEjecutivoDto {
	private List<Unidad> listUnidadEstados;
	private List<Unidad> listUnidadGestion;
	private List<Unidad> listUnidadTipos;
	private List<TablaComisional> listUnidadTablaComisional;
	private List<MetaGestion> listUnidadMetaGestion;
}
