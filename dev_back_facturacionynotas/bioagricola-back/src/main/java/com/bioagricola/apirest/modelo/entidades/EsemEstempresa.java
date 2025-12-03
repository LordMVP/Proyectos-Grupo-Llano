package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The persistent class for the esem_estempresa database table.
 * 
 */
@Entity
@Table(name = "esem_estempresa")
@NamedQuery(name = "EsemEstempresa.findAll", query = "SELECT e FROM EsemEstempresa e")
public class EsemEstempresa implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private EsemEstempresaPK id;

	@Column(name = "esem_ideregistr")
	private Integer esemIderegistr;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;


	// bi-directional many-to-one association to NotNota
	@OneToMany(mappedBy = "esemEstempresa")
	private List<NotNota> notNotas;

	// bi-directional many-to-one association to Empresas
	@ManyToOne
	@JoinColumn(name = "emp_ideregistro", referencedColumnName = "empresa_sevemp", insertable = false, updatable = false)
	private Empresas empresa;

	public EsemEstempresa() {
		//constructor por defecto
	}

	public EsemEstempresaPK getId() {
		return this.id;
	}

	public void setId(EsemEstempresaPK id) {
		this.id = id;
	}

	public Integer getEsemIderegistr() {
		return this.esemIderegistr;
	}

	public void setEsemIderegistr(Integer esemIderegistr) {
		this.esemIderegistr = esemIderegistr;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public Empresas getEmpresa() {
		return this.empresa;
	}

	public void setEmpresa(Empresas empresa) {
		this.empresa = empresa;
	}

	public List<NotNota> getNotNotas() {
		return notNotas;
	}

	public void setNotNotas(List<NotNota> notNotas) {
		this.notNotas = notNotas;
	}
	


}