package com.bioagricola.common.entity;


import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.listener.EntityUserIdListener;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "empresas", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@EntityListeners(EntityUserIdListener.class)
@DynamicUpdate
public class Empresas implements Serializable
{
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "empresa_sevemp")
	private Long empresaSevemp;

	@Column(name = "empresa_cod")
	private String empresaCod;

	@Column(name = "empresa_nom")
	private String empresaNom;

}
