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
@Table(name="per_periodo", schema="public")
@ApiModel("Modelo Función")
public class Periodo {
	@Id
	@Column(name="per_ideregistro")
	private Long per_ideregistro;
	
	@Column(name="per_nombre")
	private String per_nombre;
	
	@Column(name="cic_ideregistro")
	private Long cic_ideregistro;
	
	@Column(name="per_estado")
	private String per_estado;
	
	 @OneToMany(mappedBy = "periodo", fetch=FetchType.LAZY)
	 @JsonIgnore
	 private List<MetaGestion> periodo;
}
