package com.bioagricola.homologaciones.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;


@Entity
@Table(name = "sus_suscripcion", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor 
public class SusSuscripcion implements Serializable
{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sus_ideregistro")
    private Long susIderegistro;
    @NotNull
    @Column(name = "ter_ideregistro")
    private Integer terIderegistro;
    @NotNull
    @Column(name = "cnre_ideregistr")
    private Integer cnreIderegistr;
    @NotNull
    @Column(name = "sus_modconvenio")
    private String susModconvenio;
    @NotNull
    @Column(name = "sus_descripcion")
    private String susDescripcion;
    @NotNull
    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Transient
    private String cnreNombre;

}
