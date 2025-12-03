package com.gell.gestioncartera.entidades;

import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para la consulta de Unidad de clases
 */
@ApiModel("Modelo Unidad")
@Data
@Entity
@Table(name="uni_unidad", schema="public")
public class Unidad {

	@Id
	@Column(name="uni_ideregistro")
	private Long uni_ideregistro;

	 @OneToMany(mappedBy = "estadoEjecutivo", fetch=FetchType.EAGER)
	 @JsonIgnore
	 private List<Ejecutivo> ejecutivos;
	 
	 @OneToMany(mappedBy = "estadoTipoEjecutivo", fetch=FetchType.EAGER)
	 @JsonIgnore
	 private List<Ejecutivo> ejecutivosTipos;
	 
	 @OneToMany(mappedBy = "estadoEtapaGestion", fetch=FetchType.EAGER)
	 @JsonIgnore
	 private List<Ejecutivo> ejecutivosEtapasGestiones;
	 
	 @OneToMany(mappedBy = "estadoOrientacion", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<Orientacion> orientaciones;
	 
	 @OneToMany(mappedBy = "unidadTiempoEdadCartera", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<EdadCartera> unidadTiempoedadCarteras;
	 
	 @OneToMany(mappedBy = "estadoEdadCartera", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<EdadCartera> edadCartera;
	 
	 @OneToMany(mappedBy = "estadoMetaGestion", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<MetaGestion> metaGestion;
	 
	 @OneToMany(mappedBy = "estadoTablaComisional", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<TablaComisional> tablaComisional;
	 
	 @OneToMany(mappedBy = "unidadComision", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<TablaComisional> unidadComision;
	 
	 @OneToMany(mappedBy = "unidadTiempo", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<MetaGestion> unidadTiempo;
	 
	 @OneToMany(mappedBy = "metaControl", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<MetaGestion> metaControl;

	 @OneToMany(mappedBy = "estadoClasificacion", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<Clasificacion> clasificaciones;
	 
	 @OneToMany(mappedBy = "estadoEstrategia", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<Estrategia> estrategias;
	 
	 @OneToMany(mappedBy = "estadoNovedadVisita", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<NovedadVisita> novedadesvisitas;
	 
	 @OneToMany(mappedBy = "estadoTipoRecurso", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<NovedadVisitaRecurso> novedadesvisitastiporecurso;

	@Column(name="est_ideregistro")
	private Long estideregistro;
	@Column(name="uni_codigo1")
	private String unicodigo1;
	@Column(name="uni_nombre1")
	private String uninombre;
	@Column(name="uni_propiedad")
	private String unipropiedad;
}
