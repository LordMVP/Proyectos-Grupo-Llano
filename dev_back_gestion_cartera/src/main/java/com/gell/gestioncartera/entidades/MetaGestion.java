package com.gell.gestioncartera.entidades;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author TSI Clase tipo entidad JPA para el registro de metas de gestion
 */
@ApiModel("Modelo Meta Gestion")
@Data
@Entity
@Table(name = "mege_metasgestion", schema = "aseo")
public class MetaGestion implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2895452968877690709L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "mege_idregistro")
	private Long mege_idregistro;

	@Column(name = "mege_descripcion")
	private String mege_descripcion;

	@Column(name = "uni_unidadestado") 
	private Long uni_unidadestado;

	@Column(name = "uni_unidadutiempo")
	private Long uni_unidadutiempo;

	@Column(name = "uni_unidadccontrol") 
	private Long uni_unidadccontrol;

	@Column(name = "fun_funcionbmeta")
	private Long fun_funcionbmeta;

	@Column(name = "fun_funcionlmeta")
	private Long fun_funcionlmeta;

	@Column(name = "uni_unidadcmeta") 
	private Long uni_unidadcmeta;

	@Column(name = "mege_condicion")
	private String mege_condicion;
	
	@Column(name="mege_codigointerno")
	private Long mege_codigointerno;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadestado", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad estadoMetaGestion;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadutiempo", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad unidadTiempo;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadcmeta", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad metaControl;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadccontrol", updatable = false, insertable = false, referencedColumnName = "per_ideregistro")
	private Periodo periodo;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "fun_funcionbmeta", updatable = false, insertable = false, referencedColumnName = "fun_ideregistro")
	private Funcion funcionMetaB;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "fun_funcionlmeta", updatable = false, insertable = false, referencedColumnName = "fun_ideregistro")
	private Funcion funcionMetaL;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "fun_funcionbmeta", updatable = false, insertable = false, referencedColumnName = "fun_ideregistro")
	private Funcion funcionBase;

	@OneToMany(mappedBy = "metaGestion", fetch = FetchType.EAGER)
	@JsonIgnore
	private List<Ejecutivo> Ejecutivos;

	// Datos de auditoria del registro
	@Column(name = "usu_idregistrocreated_by")

	private Long usu_idregistrocreated_by;
	@Column(name = "created_at")
	@CreationTimestamp
	private LocalDateTime created_at;

	@Column(name = "usu_idregistroupdated_by")
	private Long usu_idregistroupdated_by;

	@Column(name = "updated_at")
	@UpdateTimestamp
	private LocalDateTime updated_at;

	@Column(name = "emp_ideregistro")
	private Long empresasevemp;

}
