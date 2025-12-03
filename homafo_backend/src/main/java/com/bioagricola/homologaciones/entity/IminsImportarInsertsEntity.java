package com.bioagricola.homologaciones.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "imins_importar_inserts", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class IminsImportarInsertsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="imins_ideregistro")
	private Long iminsIderegistro;
	
	@ManyToOne
	@JoinColumn(name="imarc_ideregistro",referencedColumnName = "imarc_ideregistro")
	private ImarcArchivosImportacion imarcIderegistro;
	
	@Column(name="imins_tabla")
	private String iminsTabla;
	
	@Column(name="imins_orden")
	private Integer iminsOrden;
	
	@Column(name="imins_json")
	private String iminsJson;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "iminsIderegistro")
	private List<DiminsDimportarInsertsEntity> diminsList;


}
