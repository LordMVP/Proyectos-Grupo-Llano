package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.listener.EntityUserIdListener;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rut_ruta", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@EntityListeners(EntityUserIdListener.class)
@DynamicUpdate 
public class RutRuta 
{
	@Id
	@Column(name = "rut_ideregistro")
    private Long rutIderegistro;
	
	@Column(name = "rut_nombre")
	private String rutNombre;
	
	@Column(name = "rut_tipo")
	private String rutTipo;
	
	@Column(name = "cic_ideregistro")
	private Integer cicIderegistro;
	
	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;
	
	@JoinColumn(name = "uni_tiporuta",referencedColumnName = "uni_ideregistro")
	@ManyToOne
	private UniUnidad uniTiporuta;
	
	@Column(name="rut_codigo")
	private String rutCodigo;
}
