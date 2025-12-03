package com.bioagricola.homologaciones.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dimpa_deta_importparam", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class DimpaDetaImportparam implements Serializable
{
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dimpa_ideregistro")
	private Integer dimpaIderegistro;
	
	@JoinColumn(name = "impar_ideregistro", referencedColumnName = "impar_ideregistro")
	@ManyToOne(optional = false)
	//@Column(name = "impar_ideregistro")
    private ImparParametrosImportacion imparIderegistro;
	
	@Column(name = "dimpa_valor_interno")
    private String dimpaValorInterno;
	
	@Column(name = "dimpa_valor_externo")
    private String dimpaValorExterno;
	
	@Column(name = "dimpa_valor_interno_nombre")
    private String dimpaValorInternoNombre;
}
