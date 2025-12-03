package com.bioagricola.aforos.entity.base;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "auaf_auditoriaaforos", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class AuditoriaAforo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long auaf_ideregistro;
	private Date auaf_fecha;
	private String auaf_tabla;
	private String auaf_informacionanterior;
	private String auaf_informacionnueva;
	private Long usu_ideregistro;
}
