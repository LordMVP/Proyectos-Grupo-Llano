package com.bioagricola.aforos.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Data;

@Entity
@Data
@Table(name = "liafoco_liquidacionaforoconceptosadicional", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
public class LiafocoLiquidacionAforoConceptosAdicional implements Serializable{
	
	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
		 
	 @Column(name="hafo_ideregistro", nullable=false)	
	 private Long hafoIderegistro;
	 
	 @Id
	 @GeneratedValue(strategy=GenerationType.IDENTITY)
	 @Column(name="liafoco_ideregistro", nullable=false)	
	 private Long liafocoIderegistro;
	 
	 @Column(name="liafoco_valortotal")
	 private BigDecimal liafocoValortotal;           
	 
	 @Column(name="liafoco_individual")
	 private BigDecimal liafocoIndividual;
	 
	 @Column(name="liafoco_fecha_registro")
	 private LocalDateTime liafocoFechaRegistro;
	 
	 @Column(name="liafoco_cobro")
	 private Boolean liafocoCobro;
	 
	 @Column(name="liafoco_unidades_independientes")
	 private Integer liafocoUnidadesIndependientes;  
	 
	 @Column(name="liafoco_uni_clasesuscripcionaforo")
	 private Long liafocoUniClasesuscripcionaforo;
	 
	 @Column(name="usu_ideregistro")
	 private Long usuIderegistro;     
	 
	 @Column(name="emp_ideregistro")
	 private Long empIderegistro;            

}
