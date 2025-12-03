package com.bioagricola.homologaciones.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "arpr_areaprestacion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate 
public class ArprAreaprestacion {
	
	@Id
	@Column(name = "arpr_ideregistro")
	private Long arprIderegistro;
	
	@Column(name = "dcta_ideregistro")
	private Integer dctaIderegistro;
	
	@Column(name = "arpr_nombre")
	private String arprNombre;
	
	@Column(name = "arpr_descripcion")
	private String arprDescripcion;
	
	@Column(name = "arpr_nuap")
	private String arprNuap;
	
	@Column(name = "arpr_nusd")
	private String arprNusd;
	
	@Column(name = "arpr_nomdisfinal")
	private String arprNomdisfinal;
	
	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name = "rgta_ideregistro")
	private Integer rgtaIderegistro;
	
	@Column(name = "liq_ideregistro")
	private Integer liqIderegistro;

}
