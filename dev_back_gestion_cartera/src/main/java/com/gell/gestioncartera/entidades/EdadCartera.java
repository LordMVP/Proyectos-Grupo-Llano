package com.gell.gestioncartera.entidades;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
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
 * Clase tipo entidad JPA para el registro de Edad Cartera
 */
@Data
@Entity
@Table(name="edcar_edadcartera", schema="aseo")
@ApiModel("Modelo Edad cartera")
public class EdadCartera {
	//TODO Revisar relacion con terceros, empresas o usuarios para ver solos los registros por usuario y empresa
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="edcar_idregistro")
	private Long edcar_idregistro;

	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadestado", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad estadoEdadCartera;
	
	@Column(name="uni_unidadestado")
	private Long uni_unidadestado;
		
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadutiempo", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad unidadTiempoEdadCartera;
	
	@Column(name="uni_unidadutiempo")
	private Long uni_unidadutiempo;
	
	@Column(name="edcar_descripcion")
	private String edcar_descripcion;
	
	@Column(name="edcar_rangodesde")
	private double edcar_rangodesde;
	
	@Column(name="edcar_rangohasta")
	private double edcar_rangohasta;
	
	//Datos de auditoria del registro
	@Column(name="usu_idregistrocreated_by")
	
	private Long usu_idregistrocreated_by;
	@Column(name="created_at")
	@CreationTimestamp
	private LocalDateTime created_at;

	@Column(name="usu_idregistroupdated_by")
	private Long usu_idregistroupdated_by;
	
	@Column(name="updated_at")
	@UpdateTimestamp
	private LocalDateTime updated_at;
	
	@Column(name="emp_ideregistro")
	private Long empresasevemp;
	
}
