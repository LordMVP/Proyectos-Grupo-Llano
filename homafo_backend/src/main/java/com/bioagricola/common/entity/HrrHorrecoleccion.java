package com.bioagricola.common.entity;

import java.util.Date;

import javax.persistence.*;

import com.bioagricola.common.constant.SchemaConstants;

import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hrr_horrecoleccion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class HrrHorrecoleccion {

	@Id
	@Column(name = "hrr_ideregistro")
	private Long hrrIderegistro;
	
	@Column(name = "hrr_dia")
	private String hrrDia;
	
	@Column(name = "rure_ideregistro")
	private Long rureIderegistro;
	
	@Column(name = "hrr_horinicio")
	private Date hrrHorinicio;
	
	@Column(name = "hrr_horfin")
	private Date hrrHorfin;
	
	@Column(name = "hrr_swtact")
	private String hrrSwtact;

	@Column(name = "microruta")
	private String microruta;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@ManyToOne
	@JoinColumn(name = "rure_ideregistro", referencedColumnName = "rure_ideregistro", insertable = false, updatable = false)
	private RureRutrecoleccion rureRutrecoleccion;
	
}
