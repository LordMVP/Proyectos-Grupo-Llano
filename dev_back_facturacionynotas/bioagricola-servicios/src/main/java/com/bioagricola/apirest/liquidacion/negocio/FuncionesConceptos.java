package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConcepto;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

@Configurable
@Service
public class FuncionesConceptos {

	@Autowired
	ManejadorConConcepto manejadorConConcepto;
	@Autowired
	NegocioParParametro negocioParParametro;

	private Integer idacceso;
	private Long idsuscripcion;


	public FuncionesConceptos() {
		super();
	}

	public FuncionesConceptos(NegocioParParametro negocioParParametro, ManejadorConConcepto manejadorConConcepto, Integer idAcceso, Long idSuscripcion) {
		super();
		this.negocioParParametro = negocioParParametro;
		this.manejadorConConcepto = manejadorConConcepto;
		this.idacceso = idAcceso;
		idsuscripcion = idSuscripcion;
		
				
	}

	/**
	 * Método para inicializar la data
	 * 
	 * @param idacceso
	 * @param idsuscripcion
	 */
	public void inicializarData(Integer idacceso, Long idsuscripcion) {
		this.setIdAcceso(idacceso);
		this.setIdSuscripcion(idsuscripcion);
	
	}

	public Integer getIdAcceso() {
		return idacceso;
	}

	public void setIdAcceso(Integer idAcceso) {
		this.idacceso = idAcceso;
	}

	public Long getIdSuscripcion() {
		return idsuscripcion;
	}

	public void setIdSuscripcion(Long idSuscripcion) {
		idsuscripcion = idSuscripcion;
	}

	/**
	 * Método para obtener la información de concepto
	 * 
	 * @param concepto
	 * @return
	 */
	public List<Object> getConceptoInformacion(List<Object> concepto) {
		Object[] items = (Object[]) concepto.get(0);
		Integer idconcepto = (Integer) items[0];
		List<Object> valor = manejadorConConcepto.getConceptoInformacion(idconcepto);
		this.valorConceptoRelacionado(valor);
		return valor;

	}

	/**
	 * Método que valida el valor de un concepto
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal valorConceptoRelacionado(List<Object> concepto) {

		Object[] items2 = (Object[]) concepto.get(1);
		BigDecimal valortotal = (BigDecimal) items2[0];

		if (valortotal != null) {
			return valortotal;
		}

		return BigDecimal.ZERO;
	}

	/**
	 * Funcion obtener estrato
	 * 
	 * @param idSuscripcion
	 * @return BigDecimal
	 */
	public BigDecimal estrato(List<Object> concepto) throws NegocioException {

		BigDecimal valor = manejadorConConcepto.estrato(idsuscripcion);
		if (valor == null) {
			throw new NegocioException("No se encontró el estrato para la suscripción ", -1);
		}
		return valor;
	}

	/**
	 * Funcion obtener factor_correccion
	 * 
	 * @throws NegocioException
	 */

	public BigDecimal factor_correccion(List<Object> concepto) throws NegocioException {
		BigDecimal valor = manejadorConConcepto.factorCorreccion(this.idsuscripcion);
		if (valor == null) {
			throw new NegocioException("No se encontró el estrato para la suscripción ", -1);
		}
		return valor;
	}

	/**
	 * Funcion exento
	 */

	public BigDecimal exento(List<Object> concepto) {
		BigDecimal resultado = (BigDecimal) manejadorConConcepto.exento(idsuscripcion);

		if (resultado == null) {
			return BigDecimal.ZERO;
		}
		return resultado;
	}

	/**
	 * Funcion lectura_actualciclo
	 */

	public BigDecimal lectura_actualciclo(List<Object> concepto) {
		return BigDecimal.ONE;
	}

	/**
	 * Funcion lectura_anteriorciclo
	 * 
	 * @throws NegocioException
	 */

	public BigDecimal lectura_anteriorciclo(List<Object> concepto) throws NegocioException {
		BigDecimal valor = manejadorConConcepto.lecturaActualCiclo(this.idsuscripcion);
		if (valor == null) {
			List<Object> valor2 = manejadorConConcepto.consumoMtrsUltimoProcesado(idsuscripcion);
			if ((Integer) valor2.get(1) == -1) {
				throw new NegocioException("'No se encontró la lectura actual '", -1);
			} else {
				return (BigDecimal) valor2.get(1);
			}
		}
		return valor;

	}

	/**
	 * Funcion estratoDos
	 */
	public BigDecimal estratoDos(List<Object> concepto) {
		BigDecimal valor;
		valor = new BigDecimal(2);
		return valor;
	}

	/**
	 * Funcion valorCalculoConcepto
	 * 
	 * @return
	 */

	public BigDecimal valorCalculoConcepto(List<Object> concepto) {
		BigDecimal valortotal;
		try {
			Object[] items = (Object[]) concepto.get(1);
			valortotal = (BigDecimal) items[0];
			return valortotal;
		} catch (Exception e) {

			return BigDecimal.ZERO;
		}

	}

	/**
	 * Funcion lecturaActual
	 */

	public BigDecimal lecturaActual(List<Object> concepto) {
		return BigDecimal.ONE;
	}

	/**
	 * Funcion horas_novedadDES
	 */

	public BigDecimal horas_novedadDES(List<Object> concepto) {
		return BigDecimal.ONE;
	}

	/**
	 * Función consumoMtrs
	 * @param concepto
	 * @return
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 */
   
	public BigDecimal consumoMtrs(List<Object> concepto)  {
		BigDecimal value = null;
		
		value = (BigDecimal) (manejadorConConcepto.consumoMtrs(idsuscripcion));
		return value;
	
	}

	/**
	 * Función suspension_cicloactual
	 * @param concepto
	 * @return
	 */
	public BigDecimal suspension_cicloactual(List<Object> concepto) {

		BigDecimal valor;
		try {
			valor = manejadorConConcepto.suspencionCicloActual(idsuscripcion);
			return valor;
		} catch (Exception e) {
			return BigDecimal.ZERO;
		}
	}

	/**
	 * Función corte_acometida
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal corte_acometida(List<Object> concepto) {
		BigDecimal value = manejadorConConcepto.corteAcometida(this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;

	}

	/**
	 * Función reconexion_cicloactual
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal reconexion_cicloactual(List<Object> concepto) {
		BigDecimal value = manejadorConConcepto.reconexionCicloActual(this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;
	}

	/**
	 * Función ICBF
	 * 
	 * @param concepto
	 * @return
	 */
	public Long ICBF(List<Object> concepto) {
		return manejadorConConcepto.iCBF(idsuscripcion);
	}

	/**
	 * Función VIP
	 * 
	 * @param concepto
	 * @return
	 */
	public Long VIP(List<Object> concepto) {
		return manejadorConConcepto.vip(idsuscripcion);
	}

	/**
	 * Función valorNovedadConceptoSuscripcion
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal valorNovedadConceptoSuscripcion(List<Object> concepto) {
		Object[] conceptos = (Object[]) concepto.get(0);
		Integer idConcepto = (Integer) conceptos[0];
		BigDecimal valor;
		try {
			valor = manejadorConConcepto.valorNovedadConceptoSuscripcion(idConcepto, idsuscripcion);
			if (valor != null) {
				manejadorConConcepto.updateValorNovedadConceptoSuscripcion(idConcepto, idsuscripcion);
			}
			return valor;
		} catch (Exception e) {
			return BigDecimal.ZERO;
		}

	}

	/**
	 * Función consumo_promedio
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal consumo_promedio(List<Object> concepto) {
		BigDecimal value = manejadorConConcepto.consumoPromedio(this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;
	}

	/**
	 * Función indicador_consumo_promedio
	 * 
	 * @param concepto
	 * @return
	 */
	public Long indicador_consumo_promedio(List<Object> concepto) {
		Long valor = Long.parseLong("0");
		try {
			valor = manejadorConConcepto.indicadorConsumoPromedio(getIdSuscripcion());
			return valor;
		} catch (Exception e) {
			e.getMessage();
			return valor;
		}

	}

	/**
	 * Función adicional por emergencia COVID 19
	 * @param concepto
	 * @return
	 */
	public String fn_porcentajesubsidioalcaldia(List<Object> concepto) {
		String value = manejadorConConcepto.porcentajesubsidioalcaldia(this.idsuscripcion);
		if (value == null) {
			return "0";
		}
		return value;
	}

	/**
	 * Función calculoCompartoMiEnergia
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal calculoCompartoMiEnergia(List<Object> concepto) {
		BigDecimal value = manejadorConConcepto.calculoCompartoMiEnergia(this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;
	}

	/**
	 * Función fn_calculaVlrAporteVoluntario
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal fn_calculaVlrAporteVoluntario(List<Object> concepto) {
		BigDecimal value = manejadorConConcepto.calculaVlrAporteVoluntario(this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;
	}

	
	public BigDecimal descuentoCalidad(List<Object> concepto) {
		Object[] items = (Object[]) concepto.get(0);
		Integer idconcepto = Integer.parseInt(items[0].toString());
		BigDecimal value = manejadorConConcepto.descuentoCalidad(idconcepto,this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;
	}

	/**
	 * Función fn_VinculoOpcionTarifaria
	 * 
	 * @param concepto
	 * @return
	 */
	public BigDecimal fn_VinculoOpcionTarifaria(List<Object> concepto) {
		BigDecimal value = manejadorConConcepto.vinculoOpcionTarifafaria(this.idsuscripcion);
		if (value == null) {
			return BigDecimal.ZERO;
		}
		return value;
	}

}
