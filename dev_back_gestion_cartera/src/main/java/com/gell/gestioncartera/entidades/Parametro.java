package com.gell.gestioncartera.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import io.swagger.annotations.ApiModel;
import lombok.Data;
import springfox.documentation.spring.web.json.Json;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para la consulta de parametros json
 */
@ApiModel("Modelo Parametros Json")
@Data
@Entity
@Table(name="par_parametro", schema="public")
public class Parametro implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1953499883040568501L;
	@Id
	@Column(name="par_ideregistro")
	private Long par_ideregistro;
	
	@Column(name="emp_ideregistro")
	private Long empideregistro;

	private String par_parametro;
}
