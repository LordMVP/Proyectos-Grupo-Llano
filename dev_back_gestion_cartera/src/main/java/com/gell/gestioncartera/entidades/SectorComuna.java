package com.gell.gestioncartera.entidades;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para el registro de Ejecutivos
 */
@ApiModel("Modelo de sectores o comunas")
@Data
@Entity
@Table(name="sec_sector", schema="aseo")
public class SectorComuna {

	@Id
	@Column(name="sec_ideregistro")
	private Long sec_ideregistro;
	@Column(name="sec_nombre")
	private String sec_nombre;
}
