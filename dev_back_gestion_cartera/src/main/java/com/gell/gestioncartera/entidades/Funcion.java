package com.gell.gestioncartera.entidades;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para la consulta de Funciones
 */
@Data
@Entity
@Table(name="fun_funcion", schema="public")
@ApiModel("Modelo Función")
public class Funcion {
	@Id
	@Column(name="fun_ideregistro")
	private Long fun_idregistro;
	
	@Column(name="fun_nombre")
	private String fun_nombre;
	
	@Column(name="fun_descripcion")
	private String fun_descripcion;
	
	@Column(name="fun_tipo")
	private String funtipo;
	
	 @OneToMany(mappedBy = "fun_funcionlmeta", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<MetaGestion> fun_funcionlmeta;
	 
	 @OneToMany(mappedBy = "fun_funcionlmeta", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<MetaGestion> funcionMetaL;
	 
	 @OneToMany(mappedBy = "funcionBase", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<TablaComisional> fun_funcionBase;
	 
	 @OneToMany(mappedBy = "funcionComision", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<TablaComisional> funcionComision;
}
