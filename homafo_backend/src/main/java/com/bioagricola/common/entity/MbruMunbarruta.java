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

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "mbru_munbarruta", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
public class MbruMunbarruta {
	
	@Id
	@Column(name = "mbru_ideregistr")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long mbruIderegistro;
	
	@JoinColumn(name = "muba_ideregistr")
	@ManyToOne
	@JsonBackReference
	private MubaMunbarrio mubaIderegistro;
	
	@JoinColumn(name = "rut_ideregistro")
	@ManyToOne
	@JsonBackReference
	private RutRuta rutIderegistro;
	
	@Column(name = "usu_ideregistro")
	@JsonIgnore
	private Long usuIderegistro;

}
