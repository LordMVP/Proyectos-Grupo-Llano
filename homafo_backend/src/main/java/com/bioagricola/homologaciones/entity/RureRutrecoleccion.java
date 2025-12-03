package com.bioagricola.homologaciones.entity;



import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Where;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.RutRuta;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rure_rutrecoleccion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate 
public class RureRutrecoleccion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rure_ideregistro")
	private Long rureIderegistro;
	
	@ManyToOne
	@JoinColumn(name = "arpr_ideregistro",referencedColumnName = "arpr_ideregistro")
	@JsonBackReference
	private ArprAreaprestacion arprIderegistro;
	
	@Column(name = "usu_ideregistro_gb")
	private Integer usuIderegistroGb;
	
	@Column(name = "rure_fecgrabacion")
	private Date rureFecgrabacion;
	
	@Column(name = "usu_ideregistro_ac")
	private Integer usuIderegistroAc;
	
	@ManyToOne
	@JoinColumn(name = "rut_idemacruta",referencedColumnName = "rut_ideregistro")
	@JsonBackReference
	private RutRuta rutIdemacruta;
	
	@Column(name = "rut_microruta")
	@JsonRawValue
	private String rutMicroruta;
	
	@Column(name = "rure_fecact")
	private Date rureFecact;
	
	@OneToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REMOVE},mappedBy = "rureIderegistro",orphanRemoval = true)
	@Where(clause = "hrr_swtact = 'A'")
	private Set<HrrHorrecoleccionEntity> horariosActivos;
	
	@Column(name="rure_swtact")
	private String rureSwtact="A";
	
}

