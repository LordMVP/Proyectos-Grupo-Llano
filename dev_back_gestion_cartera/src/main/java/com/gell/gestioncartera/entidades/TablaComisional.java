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
 * @author TSI Clase tipo entidad JPA para el registro de las tablas
 *         comisionales
 */
@ApiModel("Modelo Tabla comisional")
@Data
@Entity
@Table(name = "tcom_tablacomisional", schema = "aseo")
public class TablaComisional implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1657929859310596710L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tcom_idregistro")
	private Long tcom_idregistro;

	@Column(name = "tcom_descripcion")
	private String tcom_descripcion;

	@Column(name = "uni_unidadestado") 
	private Long uni_unidadestado;

	@Column(name = "uni_unidadgcomision") 
	private Long uni_unidadgcomision;

	@Column(name = "fun_funcionbcomision")
	private Long fun_funcionbcomision;

	@Column(name = "fun_funcionmcomision")
	private Long fun_funcionmcomision;

	@Column(name = "tcom_condicion")
	private String tcom_condicion;
	
	@Column(name="tcom_codigointerno")
	private Long tcom_codigointerno;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadestado", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad estadoTablaComisional;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadgcomision", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad unidadComision;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "fun_funcionbcomision", updatable = false, insertable = false, referencedColumnName = "fun_ideregistro")
	private Funcion funcionBase;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "fun_funcionmcomision", updatable = false, insertable = false, referencedColumnName = "fun_ideregistro")
	private Funcion funcionComision;


	@OneToMany(mappedBy = "tablaComisional", fetch = FetchType.LAZY)
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
