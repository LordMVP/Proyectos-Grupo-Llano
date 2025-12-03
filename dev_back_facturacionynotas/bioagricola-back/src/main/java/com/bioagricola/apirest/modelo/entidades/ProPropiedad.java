package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import uk.co.jemos.podam.annotations.PodamExclude;


/**
 * The persistent class for the pro_propiedad database table.
 * 
 */
@Entity
@Table(name="pro_propiedad")
@NamedQuery(name="ProPropiedad.findAll", query="SELECT p FROM ProPropiedad p")
public class ProPropiedad implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="pro_ideregistro")
	private Long proIderegistro;

	@Column(name="est_tippropieda")
	private Integer estTippropieda;

	@Column(name="muba_sector")
	private Integer mubaSector;

	@Column(name="pro_altriesgo")
	private String proAltriesgo;

	@Column(name="pro_descripcion")
	private String proDescripcion;

	@Column(name="pro_digitos")
	private Integer proDigitos;

	@Column(name="pro_direccion")
	private String proDireccion;

	@Column(name="pro_estado")
	private String proEstado;

	@Column(name="pro_fecha")
	private Timestamp proFecha;

	@Column(name="pro_gpsaltitud")
	private String proGpsaltitud;

	@Column(name="pro_gpslatitud")
	private String proGpslatitud;

	@Column(name="pro_gpslongitud")
	private String proGpslongitud;

	@Column(name="pro_idepropieda")
	private String proIdepropieda;

	@Column(name="pro_manzana")
	private Integer proManzana;

	@Column(name="pro_numcatastral")
	private String proNumcatastral;

	@Column(name="pro_numcatastralnacional")
	private String proNumcatastralnacional;

	@Column(name="pro_nummatriculainmobiliaria")
	private String proNummatriculainmobiliaria;

	@Column(name="pro_resolcatastral")
	private String proResolcatastral;

	@Column(name="pro_seccion")
	private Integer proSeccion;

	@Column(name="pro_zona")
	private String proZona;

	@Column(name="ter_ideregistro")
	private Long terIderegistro;

	@Column(name="uni_barrio")
	private Integer uniBarrio;

//	@Column(name="uni_clasificacionvivienda")
//	private Object uniClasificacionvivienda;

	@Column(name="uni_cmpdireccion")
	private Integer uniCmpdireccion;

	@Column(name="uni_municipio")
	private Integer uniMunicipio;

	@Column(name="uni_tipovivienda")
	private Integer uniTipovivienda;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	//bi-directional many-to-one association to UniUnidad
	@ManyToOne
	@JoinColumn(name="uni_tippropieda", referencedColumnName="uni_ideregistro")
	@PodamExclude
	private UniUnidad uniUnidad;

	public ProPropiedad() {
	}

	public Long getProIderegistro() {
		return this.proIderegistro;
	}

	public void setProIderegistro(Long proIderegistro) {
		this.proIderegistro = proIderegistro;
	}

	public Integer getEstTippropieda() {
		return this.estTippropieda;
	}

	public void setEstTippropieda(Integer estTippropieda) {
		this.estTippropieda = estTippropieda;
	}

	public Integer getMubaSector() {
		return this.mubaSector;
	}

	public void setMubaSector(Integer mubaSector) {
		this.mubaSector = mubaSector;
	}

	public String getProAltriesgo() {
		return this.proAltriesgo;
	}

	public void setProAltriesgo(String proAltriesgo) {
		this.proAltriesgo = proAltriesgo;
	}

	public String getProDescripcion() {
		return this.proDescripcion;
	}

	public void setProDescripcion(String proDescripcion) {
		this.proDescripcion = proDescripcion;
	}

	public Integer getProDigitos() {
		return this.proDigitos;
	}

	public void setProDigitos(Integer proDigitos) {
		this.proDigitos = proDigitos;
	}

	public String getProDireccion() {
		return this.proDireccion;
	}

	public void setProDireccion(String proDireccion) {
		this.proDireccion = proDireccion;
	}

	public String getProEstado() {
		return this.proEstado;
	}

	public void setProEstado(String proEstado) {
		this.proEstado = proEstado;
	}

	public Timestamp getProFecha() {
		return this.proFecha;
	}

	public void setProFecha(Timestamp proFecha) {
		this.proFecha = proFecha;
	}

	public String getProGpsaltitud() {
		return this.proGpsaltitud;
	}

	public void setProGpsaltitud(String proGpsaltitud) {
		this.proGpsaltitud = proGpsaltitud;
	}

	public String getProGpslatitud() {
		return this.proGpslatitud;
	}

	public void setProGpslatitud(String proGpslatitud) {
		this.proGpslatitud = proGpslatitud;
	}

	public String getProGpslongitud() {
		return this.proGpslongitud;
	}

	public void setProGpslongitud(String proGpslongitud) {
		this.proGpslongitud = proGpslongitud;
	}

	public String getProIdepropieda() {
		return this.proIdepropieda;
	}

	public void setProIdepropieda(String proIdepropieda) {
		this.proIdepropieda = proIdepropieda;
	}

	public Integer getProManzana() {
		return this.proManzana;
	}

	public void setProManzana(Integer proManzana) {
		this.proManzana = proManzana;
	}

	public String getProNumcatastral() {
		return this.proNumcatastral;
	}

	public void setProNumcatastral(String proNumcatastral) {
		this.proNumcatastral = proNumcatastral;
	}

	public String getProNumcatastralnacional() {
		return this.proNumcatastralnacional;
	}

	public void setProNumcatastralnacional(String proNumcatastralnacional) {
		this.proNumcatastralnacional = proNumcatastralnacional;
	}

	public String getProNummatriculainmobiliaria() {
		return this.proNummatriculainmobiliaria;
	}

	public void setProNummatriculainmobiliaria(String proNummatriculainmobiliaria) {
		this.proNummatriculainmobiliaria = proNummatriculainmobiliaria;
	}

	public String getProResolcatastral() {
		return this.proResolcatastral;
	}

	public void setProResolcatastral(String proResolcatastral) {
		this.proResolcatastral = proResolcatastral;
	}

	public Integer getProSeccion() {
		return this.proSeccion;
	}

	public void setProSeccion(Integer proSeccion) {
		this.proSeccion = proSeccion;
	}

	public String getProZona() {
		return this.proZona;
	}

	public void setProZona(String proZona) {
		this.proZona = proZona;
	}

	public Long getTerIderegistro() {
		return this.terIderegistro;
	}

	public void setTerIderegistro(Long terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public Integer getUniBarrio() {
		return this.uniBarrio;
	}

	public void setUniBarrio(Integer uniBarrio) {
		this.uniBarrio = uniBarrio;
	}

//	public Object getUniClasificacionvivienda() {
//		return this.uniClasificacionvivienda;
//	}
//
//	public void setUniClasificacionvivienda(Object uniClasificacionvivienda) {
//		this.uniClasificacionvivienda = uniClasificacionvivienda;
//	}

	public Integer getUniCmpdireccion() {
		return this.uniCmpdireccion;
	}

	public void setUniCmpdireccion(Integer uniCmpdireccion) {
		this.uniCmpdireccion = uniCmpdireccion;
	}

	public Integer getUniMunicipio() {
		return this.uniMunicipio;
	}

	public void setUniMunicipio(Integer uniMunicipio) {
		this.uniMunicipio = uniMunicipio;
	}

	public Integer getUniTipovivienda() {
		return this.uniTipovivienda;
	}

	public void setUniTipovivienda(Integer uniTipovivienda) {
		this.uniTipovivienda = uniTipovivienda;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public UniUnidad getUniUnidad() {
		return this.uniUnidad;
	}

	public void setUniUnidad(UniUnidad uniUnidad) {
		this.uniUnidad = uniUnidad;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((estTippropieda == null) ? 0 : estTippropieda.hashCode());
		result = prime * result + ((mubaSector == null) ? 0 : mubaSector.hashCode());
		result = prime * result + ((proAltriesgo == null) ? 0 : proAltriesgo.hashCode());
		result = prime * result + ((proDescripcion == null) ? 0 : proDescripcion.hashCode());
		result = prime * result + ((proDigitos == null) ? 0 : proDigitos.hashCode());
		result = prime * result + ((proDireccion == null) ? 0 : proDireccion.hashCode());
		result = prime * result + ((proEstado == null) ? 0 : proEstado.hashCode());
		result = prime * result + ((proFecha == null) ? 0 : proFecha.hashCode());
		result = prime * result + ((proGpsaltitud == null) ? 0 : proGpsaltitud.hashCode());
		result = prime * result + ((proGpslatitud == null) ? 0 : proGpslatitud.hashCode());
		result = prime * result + ((proGpslongitud == null) ? 0 : proGpslongitud.hashCode());
		result = prime * result + ((proIdepropieda == null) ? 0 : proIdepropieda.hashCode());
		result = prime * result + ((proIderegistro == null) ? 0 : proIderegistro.hashCode());
		result = prime * result + ((proManzana == null) ? 0 : proManzana.hashCode());
		result = prime * result + ((proNumcatastral == null) ? 0 : proNumcatastral.hashCode());
		result = prime * result + ((proNumcatastralnacional == null) ? 0 : proNumcatastralnacional.hashCode());
		result = prime * result + ((proNummatriculainmobiliaria == null) ? 0 : proNummatriculainmobiliaria.hashCode());
		result = prime * result + ((proResolcatastral == null) ? 0 : proResolcatastral.hashCode());
		result = prime * result + ((proSeccion == null) ? 0 : proSeccion.hashCode());
		result = prime * result + ((proZona == null) ? 0 : proZona.hashCode());
		result = prime * result + ((terIderegistro == null) ? 0 : terIderegistro.hashCode());
		result = prime * result + ((uniBarrio == null) ? 0 : uniBarrio.hashCode());
		result = prime * result + ((uniCmpdireccion == null) ? 0 : uniCmpdireccion.hashCode());
		result = prime * result + ((uniMunicipio == null) ? 0 : uniMunicipio.hashCode());
		result = prime * result + ((uniTipovivienda == null) ? 0 : uniTipovivienda.hashCode());
		result = prime * result + ((uniUnidad == null) ? 0 : uniUnidad.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ProPropiedad other = (ProPropiedad) obj;
		if (estTippropieda == null) {
			if (other.estTippropieda != null)
				return false;
		} else if (!estTippropieda.equals(other.estTippropieda))
			return false;
		if (mubaSector == null) {
			if (other.mubaSector != null)
				return false;
		} else if (!mubaSector.equals(other.mubaSector))
			return false;
		if (proAltriesgo == null) {
			if (other.proAltriesgo != null)
				return false;
		} else if (!proAltriesgo.equals(other.proAltriesgo))
			return false;
		if (proDescripcion == null) {
			if (other.proDescripcion != null)
				return false;
		} else if (!proDescripcion.equals(other.proDescripcion))
			return false;
		if (proDigitos == null) {
			if (other.proDigitos != null)
				return false;
		} else if (!proDigitos.equals(other.proDigitos))
			return false;
		if (proDireccion == null) {
			if (other.proDireccion != null)
				return false;
		} else if (!proDireccion.equals(other.proDireccion))
			return false;
		if (proEstado == null) {
			if (other.proEstado != null)
				return false;
		} else if (!proEstado.equals(other.proEstado))
			return false;
		if (proFecha == null) {
			if (other.proFecha != null)
				return false;
		} else if (!proFecha.equals(other.proFecha))
			return false;
		if (proGpsaltitud == null) {
			if (other.proGpsaltitud != null)
				return false;
		} else if (!proGpsaltitud.equals(other.proGpsaltitud))
			return false;
		if (proGpslatitud == null) {
			if (other.proGpslatitud != null)
				return false;
		} else if (!proGpslatitud.equals(other.proGpslatitud))
			return false;
		if (proGpslongitud == null) {
			if (other.proGpslongitud != null)
				return false;
		} else if (!proGpslongitud.equals(other.proGpslongitud))
			return false;
		if (proIdepropieda == null) {
			if (other.proIdepropieda != null)
				return false;
		} else if (!proIdepropieda.equals(other.proIdepropieda))
			return false;
		if (proIderegistro == null) {
			if (other.proIderegistro != null)
				return false;
		} else if (!proIderegistro.equals(other.proIderegistro))
			return false;
		if (proManzana == null) {
			if (other.proManzana != null)
				return false;
		} else if (!proManzana.equals(other.proManzana))
			return false;
		if (proNumcatastral == null) {
			if (other.proNumcatastral != null)
				return false;
		} else if (!proNumcatastral.equals(other.proNumcatastral))
			return false;
		if (proNumcatastralnacional == null) {
			if (other.proNumcatastralnacional != null)
				return false;
		} else if (!proNumcatastralnacional.equals(other.proNumcatastralnacional))
			return false;
		if (proNummatriculainmobiliaria == null) {
			if (other.proNummatriculainmobiliaria != null)
				return false;
		} else if (!proNummatriculainmobiliaria.equals(other.proNummatriculainmobiliaria))
			return false;
		if (proResolcatastral == null) {
			if (other.proResolcatastral != null)
				return false;
		} else if (!proResolcatastral.equals(other.proResolcatastral))
			return false;
		if (proSeccion == null) {
			if (other.proSeccion != null)
				return false;
		} else if (!proSeccion.equals(other.proSeccion))
			return false;
		if (proZona == null) {
			if (other.proZona != null)
				return false;
		} else if (!proZona.equals(other.proZona))
			return false;
		if (terIderegistro == null) {
			if (other.terIderegistro != null)
				return false;
		} else if (!terIderegistro.equals(other.terIderegistro))
			return false;
		if (uniBarrio == null) {
			if (other.uniBarrio != null)
				return false;
		} else if (!uniBarrio.equals(other.uniBarrio))
			return false;
		if (uniCmpdireccion == null) {
			if (other.uniCmpdireccion != null)
				return false;
		} else if (!uniCmpdireccion.equals(other.uniCmpdireccion))
			return false;
		if (uniMunicipio == null) {
			if (other.uniMunicipio != null)
				return false;
		} else if (!uniMunicipio.equals(other.uniMunicipio))
			return false;
		if (uniTipovivienda == null) {
			if (other.uniTipovivienda != null)
				return false;
		} else if (!uniTipovivienda.equals(other.uniTipovivienda))
			return false;
		if (uniUnidad == null) {
			if (other.uniUnidad != null)
				return false;
		} else if (!uniUnidad.equals(other.uniUnidad))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}
	
	

}