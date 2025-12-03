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
 * Clase tipo entidad JPA para el registro de Clasificación
 */
@Data
@Entity
@Table(name="est_estrategiasclasificacion", schema="aseo")
@ApiModel("Modelo Estrtategias clasfificacion")
public class EstrategiaClasificacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="estc_idregistro")
	private Long estc_idregistro;
	
	@Column(name="est_idregistro")
	private Long estidregistro;
	
	@Column(name="uni_unidadclasificacion")
	private Long uni_unidadclasificacion;
}
