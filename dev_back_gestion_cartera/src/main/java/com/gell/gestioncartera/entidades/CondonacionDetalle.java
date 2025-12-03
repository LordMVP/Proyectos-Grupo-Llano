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
 * Clase tipo entidad JPA para la consulta de luspu_limitusuprgunidad
 */
@Data
@Entity
@Table(name="luspu_limitusuprgunidad", schema="public")
@ApiModel("Modelo Condonacion Detalle")
public class CondonacionDetalle {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="luspu_ideregistro")
	private Long luspu_ideregistro;
	
	@Column(name="luspu_tipo")
	private String luspu_tipo;
	
	@Column(name="luspu_limiteporcentaje")
	private Double luspu_limiteporcentaje;
	
	@Column(name="luspu_limitemonto")
	private Double luspu_limitemonto;
	
	@Column(name="emp_ideregistro")
	private Long emp_ideregistro;
	
	@Column(name="usu_ideregistro")
	private Long usu_ideregistro;
	
	@Column(name="uspu_ideregistr")
	private Long uspuideregistr;
	
	@Column(name="fecha")
	@CreationTimestamp
	private LocalDateTime fecha;

}
