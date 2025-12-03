package com.bioagricola.common.entity;


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
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mbcd_munbardirec", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MbcdMunbardirec {

	@Id
	@Column(name = "mbcd_ideregistr")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long mbcdIderegistro;
	
	@JoinColumn(name = "muba_ideregistr")
	@ManyToOne
	@JsonBackReference
	private MubaMunbarrio mubaIderegistro;
	
	@JoinColumn(name = "uni_ideregistro")
	@ManyToOne
	@JsonBackReference
	private UniUnidad uniIderegistro;
	
	@Column(name = "usu_ideregistro")
	@JsonIgnore
	private Integer usuIderegistro;
}
