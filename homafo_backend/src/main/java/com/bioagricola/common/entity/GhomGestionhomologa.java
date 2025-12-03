package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ghom_gestionhomologa", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class GhomGestionhomologa
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ghom_ideregistr")
	private Long ghomIderegistr;
	@Column(name="sus_ideregistro")
	private Integer susIderegistro;
	@Column(name="ghom_fecharegistro")
	private Date ghomFecharegistro;
	@Column(name="ghom_fechaactualiza")
	private Date ghomFechaactualiza;
	@Column(name="per_ideregistro")
	private Long perIderegistro;
	@Column(name="ghom_estado")
	private String ghomEstado;
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	@Column(name="emp_ideregistro")
	private Long empIderegistro;
	@Column(name="observaciones")
	private String observaciones;
	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "ghomGestionhomologa")
    private List<DghoDetallegestionhomologa> DghoDetallegestionhomologaList;
	
	

}
