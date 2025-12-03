package com.bioagricola.aforos.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;

@Entity
@Table(name = "afom_afomultiusuario", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Data
public class AforoMultiusuario {

	 @Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="afom_ideregistro", nullable=false)	
     private Long afomIderegistro ;  

     @Column(name="afom_direccion", length=100)
     private String afomDireccion ;
 

     @Column(name="afom_descripcion", length=100)
     private String afomDescripcion ;
 

     @Column(name="afom_distribucion", length=100)
     private String afomDistribucion ;
     
     @Column(name="afom_complemento", nullable=false)
     private Long afomComplemento;
     
	@OneToOne
	@JoinColumn(name = "afo_ideregistro", updatable = false)
	@JsonBackReference
	private Aforo aforo;
	
	@Column(name="codigo_base",length = 12)
	private String codigoBase;
	
	@Column(name="afom_distribucion_nombre")
	private String afomDistribucionNombre;
	
	@Column(name="afom_nombre_multiusuario", length = 100)
	private String afomNombreMultiusuario;
}
