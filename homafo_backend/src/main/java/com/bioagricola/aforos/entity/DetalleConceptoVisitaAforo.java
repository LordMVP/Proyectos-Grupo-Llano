package com.bioagricola.aforos.entity;



import java.util.Date;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.ConConcepto;
import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dcva_detalleconceptovisitasaforo", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class DetalleConceptoVisitaAforo {

	@Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="dcva_ideregistro", nullable=false)
    private Long dcvaIderegistro ;

    @Transient
    private Long uniConceptoId;

    @NotNull
    @JoinColumn(name="uni_concepto", nullable=false)
    @ManyToOne
    private ConConcepto uniConcepto ;

    @NotNull
    @Column(name="dcva_cantidadconcepto", nullable=false)
    private Long dcvaCantidadconcepto ;

    @NotNull
    @Column(name="dcva_volumenaforo", nullable=false)
    private Double dcvaVolumenaforo ;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull
    @Column(name="dcva_fecharegistro", nullable=false)
    private Date dcvaFecharegistro ;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull
    @Column(name="dcva_fechaactualiza", nullable=false)
    private Date dcvaFechaactualiza ;


    @Column(name="dcva_observaciones", length=2147483647)
    private String dcvaObservaciones ;

    @NotNull
    @Column(name="usu_ideregistro", nullable=false)
    private Long usuIderegistro ;

    @NotNull
    @Column(name="dcva_pesoaforo", nullable=false)
    private Double dcvaPesoaforo ;

	@JoinColumn(name = "dmaf_ideregistro", referencedColumnName = "dmaf_ideregistro")
	@ManyToOne(optional = false)
	@JsonBackReference
	//@Column(name = "imarc_ideregistro")
    private DetalleMaestroVisita dmafIderegistro;


}
