package com.bioagricola.aforos.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "adva_adjuntovisitas", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class AdjuntoVisita implements BaseEntity{
	@Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="adva_ideregistro", nullable=false)	
    private Integer advaIderegistro ;  
    @NotNull
    @Column(name="uni_tipoadjunto", nullable=false)
    private Integer uniTipoadjunto ;


    @Column(name="adva_idfererenciaazdigital", length=100)
    private String advaIdfererenciaazdigital ;

    @NotNull
    @Column(name="emp_ideregistro", nullable=false)
    private Integer empIderegistro ;


    @Temporal(TemporalType.DATE)
    @Column(name="adva_fecha")
    private Date  advaFecha ;

    @NotNull
    @Column(name="ter_aforador", nullable=false)
    private Integer terAforador ;


    @Column(name="adva_observaciones", length=150)
    private String advaObservaciones ;

    @NotNull
    @Column(name="usu_ideregistro", nullable=false)
    private Integer usuIderegistro ;

    @NotNull
    @Column(name="dmaf_ideregistro", nullable=false)
    private Integer dmafIderegistro ;

    @NotNull
    @Column(name="mafv_ideregistro", nullable=false)
    private Integer mafvIderegistro ;


    @Column(name="adva_nombre", length=100)
    private String advaNombre ;


    @Column(name="adva_tamanio", length=50)
    private String advaTamanio ;


    @Column(name="adva_tipoarchivo", length=50)
    private String advaTipoarchivo ;
	
	@Override
	public String getNombreTabla() {
		return "adva_adjuntovisitas";
	}
	
}
