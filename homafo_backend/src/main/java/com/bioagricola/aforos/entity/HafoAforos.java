package com.bioagricola.aforos.entity;

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

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;

import lombok.Data;

@Entity
@Table(name = "hafo_aforos", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Data
public class HafoAforos implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hafo_ideregistro")
	private Long hafoIderegistro;
	
	@Column(name = "uni_tipoaforo")
	private Long uniTipoaforo;
	
	@Column(name = "hafo_fecha")
	private Date hafoFecha;
	
	@Column(name = "hafo_fechainicio")
	private Date hafoFechainicio;
	
	@Column(name = "hafo_fechafinvegencia")
	private Date hafoFechafinvegencia;
	
	@Column(name = "hafo_fechafinaforo")
	private Date hafoFechafinaforo;
	
	@Column(name = "hafo_numpqr")
	private String hafoNumpqr;
	
	@Column(name = "uni_clasesuscripcionaforo")
	private Long uniClasesuscripcionaforo;
	
	@Column(name = "hafo_frecuenciarecoleccion")
	private String hafoFrecuenciarecoleccion;
	
	@Column(name = "hafo_estado")
	private String hafoEstado;
	
	@Column(name = "ter_aforador")
	private Long terAforador;
	
	@Column(name = "uni_tipogenerador")
	private Long uniTipogenerador;
	
	@Column(name = "hmafv_factor")
	private Double hmafvFactor;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name = "hafo_observaciones")
	private String hafoObservaciones;
	
	@Column(name = "hafo_cantidadfrecuenciarecoleccion")
	private Long hafoCantidadfrecuenciarecoleccion;
	
	@Column(name = "barrio_ideregistro")
	private Long barrioIderegistro;
	
	@Column(name = "uni_complemento")
	private Long uniComplemento;
	
	@Column(name = "hafo_ideAfoPadre")
	private Long hafoIdeafopadre;
	
	@Column(name = "hafo_fechaActualizacion")
	private Date hafoFechaactualizacion;
	
	@Column(name = "rure_ideregistro")
	private Long rureIderegistro;
		
	@OneToMany(mappedBy = "haforo", cascade = CascadeType.ALL)	
	private List<HdafoDetaforo> hDetallesAforo;
	
	@Override
	public String getNombreTabla() {
		return "hafo_aforos";
	}
	
}
