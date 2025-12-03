package com.gell.gestioncartera.entidades;

import java.io.Serializable;
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
 * Clase tipo entidad JPA para la consulta de terceros
 */
@ApiModel("Modelo Tercero")
@Data
@Entity
@Table(name="ter_tercero", schema="public")
public class Tercero implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1953499883040568501L;
	@Id
	@Column(name="ter_ideregistro")
	private Long ter_ideregistro;
	@Column(name="ter_nomcompleto")
	private String nomcompleto;
	@Column(name="ter_documento")
	private String documento;
	
	 @OneToMany(mappedBy = "tercero", fetch=FetchType.EAGER)
	 @JsonIgnore
	 private List<Ejecutivo> Ejecutivos;
}
