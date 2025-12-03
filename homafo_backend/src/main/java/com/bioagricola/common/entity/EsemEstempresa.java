package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "esem_estempresa", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
public class EsemEstempresa {
	
	@Column(name = "emp_ideregistro")
	private Long empIderegistro;
	
	@JoinColumn(name = "est_ideregistro")
	@ManyToOne
	private EstEstructura estIderegistro;
	
	@Id
	@Column(name = "esem_ideregistr")
	private Long esemIderegistr;
	
	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

}
