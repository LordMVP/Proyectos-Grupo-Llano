package com.llanoGas.microservicio.Entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
@Entity
@Table(name="con_concepto")
public class Con_concepto  implements Serializable {
	
	    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
		@Id
	    @Column(name = "uni_concepto", unique = true, nullable = false)
        private	    Integer uni_concepto;
		private	    Integer est_concepto;
		private     String con_nombre;
		private	    String con_alias;
		private	    String con_abreviatura;
		private	    String con_tipcalculo;
		private	    Long con_valor;
		private	    String con_formula;
		private	    String con_operacion;
		private	    String con_naturaleza;
		private	    String con_preliquidar;
		private	    String con_anticipo;
	    
		private	    Integer con_pagpriori;
		private	    String con_financiable;
	    
	    @Temporal(TemporalType.TIMESTAMP)
	    private Calendar  con_inivigencia;
	   
	    //timestamp(6) without time zone,
	    @Temporal(TemporalType.TIMESTAMP)
	    private	    Calendar con_finvigencia;
	   // timestamp(6) without time zone,
	    private	    String con_estado;
	    private	    Integer prg_ideregistro;
	    private	    String con_tipregistro ;
	    private	    String con_condonable;
	    private	    String  con_valnulo;
	    @Column(name = "usu_ideregistro")
	    private	    Integer usu_ideregistro;
	    private	    Integer fun_ideregistro;
	    private	    String con_suspende;
	    private	    String con_intfinanciacion;
	    private	    String con_metajuste;
	    private	    Short con_precision;
	    private	    String con_contabiliza;
	    private	    boolean con_liquidaservicio;
		public Integer getUni_concepto() {
			return uni_concepto;
		}
		public void setUni_concepto(Integer uni_concepto) {
			this.uni_concepto = uni_concepto;
		}
		public Integer getEst_concepto() {
			return est_concepto;
		}
		public void setEst_concepto(Integer est_concepto) {
			this.est_concepto = est_concepto;
		}
		public String getCon_nombre() {
			return con_nombre;
		}
		public void setCon_nombre(String con_nombre) {
			this.con_nombre = con_nombre;
		}
		public String getCon_alias() {
			return con_alias;
		}
		public void setCon_alias(String con_alias) {
			this.con_alias = con_alias;
		}
		public String getCon_abreviatura() {
			return con_abreviatura;
		}
		public void setCon_abreviatura(String con_abreviatura) {
			this.con_abreviatura = con_abreviatura;
		}
		public String getCon_tipcalculo() {
			return con_tipcalculo;
		}
		public void setCon_tipcalculo(String con_tipcalculo) {
			this.con_tipcalculo = con_tipcalculo;
		}
		public Long getCon_valor() {
			return con_valor;
		}
		public void setCon_valor(Long con_valor) {
			this.con_valor = con_valor;
		}
		public String getCon_formula() {
			return con_formula;
		}
		public void setCon_formula(String con_formula) {
			this.con_formula = con_formula;
		}
		public String getCon_operacion() {
			return con_operacion;
		}
		public void setCon_operacion(String con_operacion) {
			this.con_operacion = con_operacion;
		}
		public String getCon_naturaleza() {
			return con_naturaleza;
		}
		public void setCon_naturaleza(String con_naturaleza) {
			this.con_naturaleza = con_naturaleza;
		}
		public String getCon_preliquidar() {
			return con_preliquidar;
		}
		public void setCon_preliquidar(String con_preliquidar) {
			this.con_preliquidar = con_preliquidar;
		}
		public String getCon_anticipo() {
			return con_anticipo;
		}
		public void setCon_anticipo(String con_anticipo) {
			this.con_anticipo = con_anticipo;
		}
		public Integer getCon_pagpriori() {
			return con_pagpriori;
		}
		public void setCon_pagpriori(Integer con_pagpriori) {
			this.con_pagpriori = con_pagpriori;
		}
		public String getCon_financiable() {
			return con_financiable;
		}
		public void setCon_financiable(String con_financiable) {
			this.con_financiable = con_financiable;
		}
		public Calendar getCon_inivigencia() {
			return con_inivigencia;
		}
		public void setCon_inivigencia(Calendar con_inivigencia) {
			this.con_inivigencia = con_inivigencia;
		}
		public Calendar getCon_finvigencia() {
			return con_finvigencia;
		}
		public void setCon_finvigencia(Calendar con_finvigencia) {
			this.con_finvigencia = con_finvigencia;
		}
		public String getCon_estado() {
			return con_estado;
		}
		public void setCon_estado(String con_estado) {
			this.con_estado = con_estado;
		}
		public Integer getPrg_ideregistro() {
			return prg_ideregistro;
		}
		public void setPrg_ideregistro(Integer prg_ideregistro) {
			this.prg_ideregistro = prg_ideregistro;
		}
		public String getCon_tipregistro() {
			return con_tipregistro;
		}
		public void setCon_tipregistro(String con_tipregistro) {
			this.con_tipregistro = con_tipregistro;
		}
		public String getCon_condonable() {
			return con_condonable;
		}
		public void setCon_condonable(String con_condonable) {
			this.con_condonable = con_condonable;
		}
		public String getCon_valnulo() {
			return con_valnulo;
		}
		public void setCon_valnulo(String con_valnulo) {
			this.con_valnulo = con_valnulo;
		}
		public Integer getUsu_ideregistro() {
			return usu_ideregistro;
		}
		public void setUsu_ideregistro(Integer usu_ideregistro) {
			this.usu_ideregistro = usu_ideregistro;
		}
		public Integer getFun_ideregistro() {
			return fun_ideregistro;
		}
		public void setFun_ideregistro(Integer fun_ideregistro) {
			this.fun_ideregistro = fun_ideregistro;
		}
		public String getCon_suspende() {
			return con_suspende;
		}
		public void setCon_suspende(String con_suspende) {
			this.con_suspende = con_suspende;
		}
		public String getCon_intfinanciacion() {
			return con_intfinanciacion;
		}
		public void setCon_intfinanciacion(String con_intfinanciacion) {
			this.con_intfinanciacion = con_intfinanciacion;
		}
		public String getCon_metajuste() {
			return con_metajuste;
		}
		public void setCon_metajuste(String con_metajuste) {
			this.con_metajuste = con_metajuste;
		}
		public Short getCon_precision() {
			return con_precision;
		}
		public void setCon_precision(Short con_precision) {
			this.con_precision = con_precision;
		}
		public String getCon_contabiliza() {
			return con_contabiliza;
		}
		public void setCon_contabiliza(String con_contabiliza) {
			this.con_contabiliza = con_contabiliza;
		}
		public boolean isCon_liquidaservicio() {
			return con_liquidaservicio;
		}
		public void setCon_liquidaservicio(boolean con_liquidaservicio) {
			this.con_liquidaservicio = con_liquidaservicio;
		}
		public static long getSerialversionuid() {
			return serialVersionUID;
		}
		
	    

}
