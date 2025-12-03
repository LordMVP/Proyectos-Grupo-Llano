package com.bioagricola.common.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.listener.EntityUserIdListener;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "proyectos", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(EntityUserIdListener.class)
@DynamicUpdate
public class Proyectos implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "proyecto_ideregistro", nullable = false)
	private Long proyectoIderegistro;
	
	@NotNull
	@Column(name = "proyecto_llacom", nullable = false)
	private String proyectoLlacom;
	
	@NotNull
	@Column(name = "proyecto_cod", nullable = false, length = 5)
	private String proyectoCod;

	@NotNull
	@Column(name = "proyecto_nom", nullable = false, length = 30)
	private String proyectoNom;

	@NotNull
	@Column(name = "proyecto_codciu", nullable = false, length = 5)
	private String proyectoCodciu;


	/*@NotNull
	@Column(name = "proyecto_ideregistro", nullable = false)
	private Long proyectoIderegistro;*/

	@NotNull
	@Column(name = "departamento_ideregistro", nullable = false)
	private Long departamentoIderegistro;

	@NotNull
	@Column(name = "cue_ideregistro", nullable = false)
	private Long cueIderegistro;

	@Column(name = "proyecto_formato", length = 35)
	private String proyectoFormato;
	
	public Proyectos(Long id) {
		// TODO Auto-generated constructor stub
		this.proyectoIderegistro = id;
	}
	
	@JoinColumn(name = "proyecto_codemp",referencedColumnName = "empresa_cod",columnDefinition = "proyecto_codemp")
	@ManyToOne
	private Empresas proyectoCodemp;

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "[proyectos: ] "+proyectoLlacom+" - "+proyectoCod+" - "+proyectoNom+" - "+
		proyectoCodciu+" - "+proyectoIderegistro+" - "+cueIderegistro+" - "+proyectoFormato;
	}
	

	
}
