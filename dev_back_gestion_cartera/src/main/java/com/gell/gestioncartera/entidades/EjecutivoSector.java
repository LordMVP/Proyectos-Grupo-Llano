package com.gell.gestioncartera.entidades;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para el registro de Ejecutivos con sus sectores
 */
@ApiModel("Modelo Ejecutivo con sus sectores")
@Data
@Entity
@Table(name="sec_ejecutivosector", schema="aseo")
public class EjecutivoSector implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1417066950297449859L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="sece_idregistro")
	private Long sece_idregistro;
	
	@Column(name="eje_idregistro")
	private Long ejeidregistro;

	@Column(name="sec_idregistro")
	private Long secidregistro;
}
