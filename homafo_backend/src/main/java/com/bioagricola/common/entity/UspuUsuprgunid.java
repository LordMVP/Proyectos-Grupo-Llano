package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "uspu_usuprgunid", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate 
public class UspuUsuprgunid {

	@Id
	@Column(name="uspu_ideregistr")
	private Long uspuIderegistro;
	
	@ManyToOne
	@JoinColumn(name="prun_ideregistr",columnDefinition = "prun_ideregistr",referencedColumnName = "prun_ideregistr")
	private PrunPrgUnidad prunIderegistro;
	
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name="usu_auditoria")
	private Long usuAuditoria;
}
