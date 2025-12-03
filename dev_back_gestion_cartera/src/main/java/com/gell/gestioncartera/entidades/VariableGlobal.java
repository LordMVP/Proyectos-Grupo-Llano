package com.gell.gestioncartera.entidades;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.Getter;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para el registro de variables globales
 */
@ApiModel("Modelo Variable global")
@Data
@Entity
@Table(name="vglo_variablesglobales", schema="aseo")
public class VariableGlobal {
	//TODO Revisar relacion con empresas o usuarios para ver solos los registros por usuario y empresa
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="vglo_idregistro")
	private Long vglo_idregistro;
	
	@Column(name="vglo_descripcion")
	private String vglo_descripcion;
	
	@Column(name="uni_atrmaestrocartera") //Atributo grilla
	private Long uni_atrmaestrocartera;
	
	//@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	//@JoinColumn(name = "uni_atrmaestrocartera", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	//private Unidad unimaestrocartera;
	
	@Column(name="vglo_esatrmaestrocartera")
	private boolean vglo_esatrmaestrocartera;
	
	@Column(name="vglo_valorconstante")
	private double vglo_valorconstante;
	
	@Column(name="vglo_esvalorconstante")
	private boolean vglo_esvalorconstante;
	
	@Column(name="vglo_esvcalculado")
	private boolean vglo_esvcalculado;
	
	@Column(name="uni_tipometodo")
	private Long uni_tipometodo;
	
	//@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	//@JoinColumn(name = "uni_tipometodo", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	//private Unidad unitipometodo;
	
	@Column(name="uni_origenmetodo")
	private Long uni_origenmetodo;
	
	//@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	//@JoinColumn(name = "uni_origenmetodo", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	//private Unidad uniorigenmetodo;
	
	@Column(name="uni_tipodato")
	private Long uni_tipodato;
	
	//@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	//@JoinColumn(name = "uni_tipodato", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	//private Unidad unitipodato;
	
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
