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
@Table(name = "dict_tablas", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class DictTablasEntity {

	@Id
	@Column(name="dict_ideregistro")
	private Long dictIderegistro;
	
	@Column(name="dict_tabla")
	private String dictTabla;
	
	@Column(name="dict_etiqueta")
	private String dictEtiqueta;
	
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name="emp_ideregistro")
	private Long empIderegistro;
}
