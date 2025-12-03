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
@ApiModel("Modelo Tabla comisional Detalle")
@Data
@Entity
@Table(name = "tcomd_tablacomisionaldetalle", schema = "aseo")
public class TablaComisionalDetalle implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1657929859310596710L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tcomd_idregistro")
	private Long tcomd_idregistro;

	@Column(name = "tcom_idregistro")
	private Long tcomidregistro;

	@Column(name = "fun_funciontipo")
	private Long fun_funciontipo;

	@Column(name = "tcomd_valordesde")
	private Long tcomd_valordesde;

	@Column(name = "tcomd_valorhasta")
	private Long tcomd_valorhasta;

	@Column(name = "tcomd_valorporcentaje")
	private Long tcomd_valorporcentaje;

	@Column(name = "tcomd_valorunitario")
	private Long tcomd_valorunitario;

}
