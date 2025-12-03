package com.gell.gestioncartera.dto;

import java.util.List;

import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.Periodo;
import com.gell.gestioncartera.entidades.ProgramaUnidad;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.entidades.Usuario;

import lombok.Data;
/**
 * 
 * @author Admin
 * Clase DTO para enviar los todos valores a varios formulario 
 */
@Data
public class DatoGeneralDto {
	private List<Unidad> listUnidadControlMetasGestion;
	private List<Unidad> listUnidadControlEstaCartera;
	private List<Unidad> listUnidadEstados;
	private List<Unidad> listUnidadTipoRecurso;
	private List<Unidad> listUnidadConceptoMetas;
	private List<Unidad> listUnidadCondicional;
	private List<Unidad> listUnidadTipos;
	private List<Funcion> listFuncionBaseMeta;
	private List<Funcion> listFuncionMeta;
	private List<Funcion> listFuncionBaseComision;
	private List<Funcion> listFuncionComision;
	private List<Usuario> listUsuarios;
	private List<ProgramaUnidad> listProgramasUnidad;
	private List<VariableGlobalDto> listVariableGlobal;
	private List<PeriodoDto> listPeriodo;
}
