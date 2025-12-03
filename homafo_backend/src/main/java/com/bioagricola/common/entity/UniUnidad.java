package com.bioagricola.common.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.listener.EntityUserIdListener;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "uni_unidad", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@EntityListeners(EntityUserIdListener.class)
@DynamicUpdate 
public class UniUnidad {

	@Id
	@Column(name="uni_ideregistro")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long uniIderegistro;
	@JoinColumn(name="est_ideregistro")
	@ManyToOne
	@JsonBackReference
	private EstEstructura estIderegistro;
	@Column(name="uni_codigo1")	
	private String uniCodigo1;
	@Column(name="uni_codigo2")
	private String uniCodigo2;
	@Column(name="uni_codigo3")
	private String uniCodigo3;
	@Column(name="uni_codigo4")
	private String uniCodigo4;
	@Column(name="uni_codigo5")
	private String uniCodigo5;
	@Column(name="uni_nombre1")
	private String uniNombre1;
	@Column(name="uni_nombre2")
	private String uniNombre2;
	@Column(name="uni_nombre3")
	private String uniNombre3;
	@Column(name="uni_nombre4")
	private String uniNombre4;
	@Column(name="uni_nombre5")
	private String uniNombre5;
	@Column(name="uni_orden")
	private Long uniOrden=1L;
	@Column(name="uni_nivel")
	private Long uniNivel=1L;
	@Column(name="uni_codigo")
	private String uniCodigo;
	@Column(name="uni_fecha")
	private Date uniFecha = new Date();
	
	@Column(name = "uni_propiedad")
	@JsonRawValue
	private String uniPropiedad;
	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;
	
//	uni_orden numeric NOT NULL, -- Se mantiene recalculando según el orden que se defina en est_TipOrdena
//	uni_nivel int2 NOT NULL, -- nivel de la unidad
//	uni_codigo varchar(16) NOT NULL, -- campo unico de union de estructura y codigos
//	uni_idepadre int4 NULL, -- ide padre de la unidad
//	usu_ideregistro int4 NOT NULL,
//	uni_propiedad jsonb NULL,
//	uni_fecha timestamp NULL DEFAULT now()
	
	@PrePersist
	@PreUpdate
	public void updateCodigo1() {
		if(this.uniCodigo1==null) {
		this.uniCodigo1 = this.uniCodigo;
		}
	}
	
}
