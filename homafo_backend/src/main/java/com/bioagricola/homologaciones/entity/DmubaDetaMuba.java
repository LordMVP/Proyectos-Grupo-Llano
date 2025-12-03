package com.bioagricola.homologaciones.entity;



import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.MubaMunbarrio;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dmuba_detamuba", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class DmubaDetaMuba {

	@Id
	@Column(name="dmuba_ideregistro")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer dmubaIderegistro;
	
	@JoinColumn(name = "muba_ideregistro",columnDefinition = "muba_ideregistro",referencedColumnName = "muba_ideregistr")
	@ManyToOne
	@JsonBackReference
	private MubaMunbarrio mubaIderegistro;
	

	@JoinColumn(name = "barrio_homllanogas",columnDefinition = "barrio_homllanogas",referencedColumnName = "barrio_ideregistro")
	@ManyToOne	
	private Barrios barrioHomllanogas;
	
	@Column(name="dmuba_rutas")
	@JsonRawValue
	private String dmubaRutas;
	
	@Column(name="dmuba_frecuencias_barrido")
	@JsonRawValue
	private String dmubaFrecuenciasBarrido;
	
	@Column(name="dmuba_swtact")
	private String dmubaSwtact;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
}
