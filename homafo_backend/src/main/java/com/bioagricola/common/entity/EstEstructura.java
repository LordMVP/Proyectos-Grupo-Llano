package com.bioagricola.common.entity;



import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "est_estructura", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
public class EstEstructura {
	
	@Id
	@Column(name="est_ideregistro")
	private Long estIderegistro; 
	
	@Column(name="est_nombre")
	private String estNombre; 
	
	@Column(name="est_nivel")
	private Integer estNivel; 
	
	@Column(name="est_estado")
	private String estEstado; 
	
	@Column(name="est_tipordena")
	private String estTipordena; 
	
	@ManyToOne
	@JoinColumn(name="cla_ideregistro")
	private ClaClase claIderegistro;
	
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name="est_valida")
	private String estValida;

	@OneToMany(mappedBy = "estIderegistro")	
	private List<EsemEstempresa> empresas;
}
