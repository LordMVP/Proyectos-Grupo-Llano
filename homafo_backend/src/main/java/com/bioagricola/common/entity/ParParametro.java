package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "par_parametro", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate 
public class ParParametro {

	@Id
	@Column(name="par_ideregistro")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long parIderegistro;	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	@Column(name="par_parametro")
	private String parParametro;
	
}
