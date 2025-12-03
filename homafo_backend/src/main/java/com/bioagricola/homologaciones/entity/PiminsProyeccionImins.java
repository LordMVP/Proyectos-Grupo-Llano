package com.bioagricola.homologaciones.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pimins_proyeccion_imins", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class PiminsProyeccionImins {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="pimins_ideregistro")
	private Long piminsIderegistro;
	

	@ManyToOne
	@JoinColumn(name ="pimp_ideregistro",referencedColumnName = "pimp_ideregistro")
	private PimpProcesoImportacion pimpIderegistro;
	
	@Column(name="pimins_json")
	private String piminsJson;
	
	@Column(name="pimins_sql")
	private String piminsSql;
	
	@Column(name="pimins_estado")
	private String piminsEstado;
	
	@Column(name="pimins_ideresultante")
	private Long piminsIderesultante;
	
	@Column(name="pimins_fila")
	private Integer piminsFila;
	
	@Transient
	private List<String> mensaje;

}
