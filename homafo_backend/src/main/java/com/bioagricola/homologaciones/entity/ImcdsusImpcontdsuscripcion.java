package com.bioagricola.homologaciones.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "imcdsus_impcontdsuscripcion", schema = "aseo")
public class ImcdsusImpcontdsuscripcion {
	
	@Id
	@Column(name = "imcd_ideregistro")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "imcd_seq")
    @SequenceGenerator(name = "imcd_seq", sequenceName = "aseo.seq_imcdsus_ideregistro", allocationSize = 1)
    private Long imcdIderegistro;

	@Column(name = "dsus_pcodigo")
    private String dsusPcodigo;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name = "imarc_ideregistro")
	private Long imarcIderegistro;
	
	@Column(name = "imcd_estado")
	private String imcdEstado;
	
	@Column(name = "imcd_fila")
	private Integer imcdFila;
	
}
