package com.bioagricola.aforos.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dafo_detaforo", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class DetalleAforo implements BaseEntity{

	 @Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="dafo_ideregistro", nullable=false)
     private Long dafoIderegistro ;


     @Temporal(TemporalType.DATE)
     @Column(name="dafo_fecharegistro")
     private Date  dafoFecharegistro ;


     @Temporal(TemporalType.DATE)
     @Column(name="dafo_fechactualizacion")
     private Date  dafoFechactualizacion ;


     @Temporal(TemporalType.DATE)
     @Column(name="afo_fechafinvegencia")
     private Date  afoFechafinvegencia ;


     @Column(name="afo_numpqr", length=50)
     private String afoNumpqr ;


     @JoinColumn(name="dsus_ideregistr")
     @ManyToOne
     private DsusDetsuscrip dsusIderegistr ;


     @Column(name="dafo_multiusuporcentaje", length=50)
     private String dafoMultiusuporcentaje ;

     @NotNull
     @Column(name="usu_ideregistro", nullable=false)
     private Long usuIderegistro ;

	@ManyToOne
	@JoinColumn(name = "afo_ideregistro")
	@JsonBackReference
	private Aforo aforo;

	@Override
	public String getNombreTabla() {
		return "dafo_detaforo";
	}
	
    @NotNull
    @Column(name="uni_actsuscripc", nullable=false)
    private Integer uniActsuscripc ;

}
