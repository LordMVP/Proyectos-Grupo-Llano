package com.bioagricola.common.entity;


import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Where;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.DmubaDetaMuba;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "muba_munbarrio", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MubaMunbarrio {
	
	@Id	
	@Column(name = "muba_ideregistr")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long mubaIderegistro;
	
	@ManyToOne
	@JoinColumn(columnDefinition = "uni_municipio",referencedColumnName = "proyecto_ideregistro",name = "uni_municipio")
	private Proyectos uniMunicipio;
	
	@ManyToOne
	@JoinColumn(columnDefinition = "uni_barrio",referencedColumnName = "barrio_ideregistro",name = "uni_barrio")
	private Barrios uniBarrio;
	
	@ManyToOne
	@JoinColumn(columnDefinition = "muba_sector",referencedColumnName = "sec_ideregistro",name = "muba_sector")
	private SecSector mubaSector;
	
	@Column(name = "muba_factor")
	private Float mubaFactor = 0F;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@OneToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REMOVE},mappedBy = "mubaIderegistro",orphanRemoval = true)	
	private Set<MbcdMunbardirec> complementos;
	
	
	@OneToMany(mappedBy = "mubaIderegistro",cascade = {CascadeType.PERSIST,CascadeType.REMOVE,CascadeType.MERGE},orphanRemoval = true)	
	@Where(clause = "dmuba_swtact = 'A'")
	private Set<DmubaDetaMuba> dmubaActivo;


	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "[Municipio:>]"+uniMunicipio.toString();
	}
	
	
	

}
