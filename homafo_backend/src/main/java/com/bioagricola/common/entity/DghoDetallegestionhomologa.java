package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "dgho_detallegestionhomologa", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class DghoDetallegestionhomologa
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="dgho_ideregistr")
	private Long dghoIderegistr;
	
	@JoinColumn(name = "ghom_ideregistr", referencedColumnName = "ghom_ideregistr")
	@ManyToOne(optional = false)
	private GhomGestionhomologa ghomGestionhomologa;
	
	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;
	
	@Column(name="emp_ideregistro")
	private Long empIderegistro;
	
	@Column(name="dsus_pcodigo")
	private String dsusPcodigo;
	
	@Column(name="dgho_estado")
	private String dghoEstado;

	@Type(type = "jsonb")
	@Column(name="dgho_consumo",columnDefinition = "json")
	private List<Integer> dghoConsumo;
	
	@Column(name="dgho_observaciones")
	private String dghoObservaciones;
	
	@Column(name="dgho_numeromedidor")
	private String dghoNumeromedidor;
	
	@Column(name="dgho_fecharegistro")
	private Date dghoFecharegistro;
	
	@Column(name="dgho_fechaactualiza")
	private Date dghoFechaactualiza;
	
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name="sus_ideregistro_homologa")
	private Long susIderegistroHomologa;
	
	@Column(name="sus_ideregistro_homologados")
	private Long susIderegistroHomologados;

}
