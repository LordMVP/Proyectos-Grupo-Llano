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
 * Clase tipo entidad JPA para la consulta de uspu_usuprgunid
 */
@Data
@Entity
@Table(name="uspu_usuprgunid", schema="public")
@ApiModel("Modelo Condonacion Encabezado")
public class Condonacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="uspu_ideregistr")
	private Long uspu_ideregistr;
	
	@Column(name="prun_ideregistr")
	private Long prun_ideregistr;
	
	@Column(name="usu_ideregistro")
	private Long usu_ideregistro;
	
	@Column(name="usu_auditoria")
	private Long usu_auditoria;

}
