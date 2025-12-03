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
 * @author TSI Clase tipo entidad JPA para el registro de metas de gestion
 */
@ApiModel("Modelo Meta Gestion Detalle")
@Data
@Entity
@Table(name = "megd_metasgestiodetalle", schema = "aseo")
public class MetaGestionDetalle implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2895452968877690709L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "megd_idregistro")
	private Long megd_idregistro;

	@Column(name = "mege_idregistro")
	private Long megeidregistro;

	@Column(name = "fun_funciontipo")
	private Long fun_funciontipo;

	@Column(name = "megd_valorunitario")
	private Double megd_valorunitario;



}
