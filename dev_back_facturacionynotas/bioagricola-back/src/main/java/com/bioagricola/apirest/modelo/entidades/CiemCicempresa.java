package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;


/**
 * The persistent class for the ciem_cicempresa database table.
 * 
 */
@Entity
@Table(name="ciem_cicempresa")
@NamedQuery(name="CiemCicempresa.findAll", query="SELECT c FROM CiemCicempresa c")
public class CiemCicempresa implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="ciem_ideregistr")
	private Integer ciemIderegistr;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	//bi-directional many-to-one association to CicCiclo
	@ManyToOne
	@JoinColumn(name="cic_ideregistro")
	private CicCiclo cicCiclo;

	//bi-directional many-to-one association to Empresas
	@ManyToOne
	@JoinColumn(name="emp_ideregistro", referencedColumnName="empresa_sevemp")
	private Empresas empresa;

	//bi-directional many-to-one association to DsusDetsuscrip
	@OneToMany(mappedBy="ciemCicempresa")
	private List<DsusDetsuscrip> dsusDetsuscrips;

	public CiemCicempresa() {
		//constructor por defecto
	}

	public Integer getCiemIderegistr() {
		return this.ciemIderegistr;
	}

	public void setCiemIderegistr(Integer ciemIderegistr) {
		this.ciemIderegistr = ciemIderegistr;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public CicCiclo getCicCiclo() {
		return this.cicCiclo;
	}

	public void setCicCiclo(CicCiclo cicCiclo) {
		this.cicCiclo = cicCiclo;
	}

	public Empresas getEmpresa() {
		return this.empresa;
	}

	public void setEmpresa(Empresas empresa) {
		this.empresa = empresa;
	}

	public List<DsusDetsuscrip> getDsusDetsuscrips() {
		return this.dsusDetsuscrips;
	}

	public void setDsusDetsuscrips(List<DsusDetsuscrip> dsusDetsuscrips) {
		this.dsusDetsuscrips = dsusDetsuscrips;
	}

	public DsusDetsuscrip addDsusDetsuscrip(DsusDetsuscrip dsusDetsuscrip) {
		getDsusDetsuscrips().add(dsusDetsuscrip);
		dsusDetsuscrip.setCiemCicempresa(this);

		return dsusDetsuscrip;
	}

	public DsusDetsuscrip removeDsusDetsuscrip(DsusDetsuscrip dsusDetsuscrip) {
		getDsusDetsuscrips().remove(dsusDetsuscrip);
		dsusDetsuscrip.setCiemCicempresa(null);

		return dsusDetsuscrip;
	}

}