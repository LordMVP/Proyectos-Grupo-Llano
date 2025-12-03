package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "sec_sector", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class SecSector 
{
	@Id
	@Column(name = "sec_ideregistro")
    private Long secIderegistro;
	@Column(name = "sec_nombre")
    private String secNombre;
	@Column(name="emp_ideregistro")
	private Long empIderegistro;
	@Column(name="sec_estado")
	private String secEstado;

}
