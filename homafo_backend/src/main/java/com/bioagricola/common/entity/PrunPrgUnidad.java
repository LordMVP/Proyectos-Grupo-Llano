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
@Table(name = "prun_prgunidad", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate 
public class PrunPrgUnidad {
	
	@Id
	@Column(name="prun_ideregistr")
	private Long prunIderegistro;
	
	@Column(name="prg_ideregistro")
	private Long prgIderegistro;
	
	@ManyToOne
	@JoinColumn(name="uni_ideregistro",referencedColumnName = "uni_ideregistro")
	private UniUnidad uniIderegistro;
	
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
}
