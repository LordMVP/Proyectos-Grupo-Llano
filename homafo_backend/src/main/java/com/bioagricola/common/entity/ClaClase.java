package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cla_clase", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
public class ClaClase {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="cla_ideregistro")
	private Long claIderegistro;
	@Column(name="cla_nombre")
	private String claNombre;
	@Column(name="cla_tipo")
	private String claTipo;
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
}
