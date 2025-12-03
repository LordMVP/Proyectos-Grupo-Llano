package com.bioagricola.aforos.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clva_consolidado_liq_visitas_aforos", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class ConsolidadoLiquidacionVisitaAforo implements BaseEntity{

	@EmbeddedId
    private ClaveConsolidadoLVA claveConsolidadoLVA;
	
	@Column(name = "clva_fecharegistro")
	private Date clvaFecharegistro;
	
	@Column(name = "clva_volumen_aforado")
	private Double clvaVolumenAforado;
	
	@Column(name = "clva_visitas_realizadas")
	private Long clvaVisitasRealizadas;
	
	@Column(name = "clva_frecuencia")
	private Long clvaFrecuencia;
	
	@Column(name = "clva_ejecutadas")
	private Double clvaEjecutadas;
	
	@Column(name = "clva_produccion")
	private Double clvaProduccion;
	
	@Column(name = "clva_volumenAforado_liq")
	private Double clvaVolumenAforadoLiq;
	
	@Column(name = "clva_volumen_visita")
	private Double clvaVolumenVisita;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@Override
	public String getNombreTabla() {
		return "clva_consolidado_liq_visitas_aforos";
	}
}
