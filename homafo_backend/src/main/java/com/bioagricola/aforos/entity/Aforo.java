package com.bioagricola.aforos.entity;

import java.util.Date;
import java.util.List;
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
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.OrderBy;
import org.hibernate.annotations.Where;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;

import lombok.Data;

@Entity
@Table(name = "afo_aforos", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Data
public class Aforo implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "afo_ideregistro")
	private Long afoIderegistro;
	@JoinColumn(name = "uni_tipoaforo")
	@ManyToOne
	private TafoTipoAforo uniTipoaforo;
	@Column(name = "afo_fecha")
	private Date afoFecha;
	@Column(name="afo_fechainicio")
	private Date afoFechainicio;
	@Column(name="afo_fechafinvegencia")
	private Date afoFechafinvegencia;
	@Column(name="afo_fechafinaforo")
	private Date afoFechafinaforo;
	@Column(name="afo_numpqr")
	private String afoNumpqr;
	@JoinColumn(name = "uni_clasesuscripcionaforo")
	@ManyToOne
	private UniUnidad uniClasesuscripcionaforo;
	@Column(name="afo_frecuenciarecoleccion")
	private String afo_frecuenciarecoleccion;
	@Column(name = "afo_estado")
	private String afoEstado;
	@ManyToOne
	@JoinColumn(name = "ter_aforador")
	private TerTercero terAforador;
	@Column(name = "uni_tipogenerador")
	private Long uniTipogenerador;
	@Column(name = "mafv_factor")
	private Double mafvFactor;
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	@Column(name = "afo_observaciones")
	private String afoObservaciones;
	@Column(name = "tfd_ideregistro")
	private Long tfd_ideregistro;
	//tfd_idregistro? esta en bd
	@Column(name = "barrio_ideregistro")
	private Long barrioIderegistro;
	@JoinColumn(name = "uni_complemento")
	@ManyToOne
	private UniUnidad uniComplemento;
	@Column(name = "afo_ideafopadre")
	private Long afoIdeAfoPadre;
	@Column(name = "afo_fechaActualizacion")
	private Date afoFechaActualizacion;

	@Column(name = "afo_frecuencia_recoleccion")
	private Integer afoFrecuenciaRecoleccion;

	@OneToMany(mappedBy = "aforo")
	private List<MaestroAforoVisita> maestrosAforosVisitas;

	@OneToMany(mappedBy = "aforo")
	@Where(clause = "mafv_estado = 'A'")
	@OrderBy(clause = "mafvIderegistro DESC")
	private Set<MaestroAforoVisita> maestrosAforosVisitasActivo;

	@OneToMany(mappedBy = "aforo", cascade = CascadeType.ALL, orphanRemoval=true)
	private List<DetalleAforo> detallesAforo;
	@OneToOne(mappedBy = "aforo", cascade = CascadeType.ALL)
	private AforoMultiusuario aforoMultiusuario;
	@Column(name = "rure_ideregistro")
	private Long rureIderegistro;

	@Column(name = "afo_distribucion_uniforme")
	private Boolean afoDistribucionUniforme;

	@Override
	public String getNombreTabla() {
		return "afo_aforos";
	}

}
