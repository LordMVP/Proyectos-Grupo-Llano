package com.bioagricola.homologaciones.entity;



import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hrr_horrecoleccion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate
public class HrrHorrecoleccionEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hrr_ideregistro")
	private Long hrrIderegistro;
	
	@Column(name = "hrr_dia")
	private String hrrDia;
	
	
	@JoinColumn(name = "rure_ideregistro")
	@ManyToOne
	@JsonBackReference
	private RureRutrecoleccion rureIderegistro;
	
	@Column(name = "hrr_horinicio")
	private String hrrHorinicio;
	
	@Column(name = "hrr_horfin")
	private String hrrHorfin;
	
	@Column(name = "hrr_swtact")
	private char hrrSwtact = 'A';
	
	@Column(name = "hrr_dia_valor")
	private Integer hrrDiaValor;

	@Column(name = "microruta")
	private String microruta;
	

}
