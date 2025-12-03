package com.bioagricola.homologaciones.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gact_gestion_actualizacion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
//@DynamicUpdate 
public class GactGestionActualizacion
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="gact_ideregistro")
	private Long gactIderegistro;
	
	@Column(name="dsus_ideregistro")
	private Integer dsusIderegistro;
	
	@Column(name="uni_novedad_visita")
	private Integer uniNovedadVisita;
	
	@Column(name="uni_novedad_liquidacion")
	private Integer uniNovedadLiquidacion;
	
	@Column(name="gact_fecgestion")
	private Date gactFecgestion;
	
	@Column(name="gact_observaciones")
	private String gactObservaciones;
	
	@Column(name="gact_swtact")
	private String gactSwtact;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="date_created")
	private Date dateCreated;
	
	@Column(name="reclamo_numpqr")
	private String reclamoNumpqr;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "gactIderegistro")
    private List<DgactDetagestionActualizacion> DgactDetagestionActualizacionList;
}
