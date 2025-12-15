package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.DecaDesccalidadDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadRecolAprobDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadRecolAprobRespuestaDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadRecolDTO;
import com.bioagricola.apirest.modelo.dtos.SuscripPorMicroRutaDTO;
import com.bioagricola.apirest.modelo.dtos.TotalesDescCalidadDTO;
import com.bioagricola.apirest.modelo.dtos.TotalesDescCalidadMicroRutaDTO;
import com.bioagricola.apirest.modelo.entidades.ConConcepto;
import com.bioagricola.apirest.modelo.entidades.CosuConsuscrip;
import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.entidades.DecaDesccalidad;
import com.bioagricola.apirest.modelo.entidades.DperDetperiodo;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.entidades.PerPeriodo;
import com.bioagricola.apirest.modelo.entidades.VarprVarperreg;
import com.bioagricola.apirest.modelo.entidades.VrmrVarmicroruta;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConcepto;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCosuConsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrproceso;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDecaDesccalidad;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDperDetperiodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorFacFactura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPerPeriodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorVarprVarperreg;
import com.bioagricola.apirest.modelo.manejadores.ManejadorVrmrVarmicroruta;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.common.collect.HashBiMap;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;

@Service
public class NegocioDecaDesccalidad extends NegocioAbstracto<DecaDesccalidad, DecaDesccalidadDTO> {

	@Autowired
	private ManejadorDecaDesccalidad manejadorDecaDesccalidad;

	@Autowired
	private ManejadorPerPeriodo manejadorPerPeriodo;

	@Autowired
	private NegocioParParametro negocioParParametro;

	@Autowired
	private ManejadorVarprVarperreg manejadorVarprVarperreg;
        
        @Autowired
        private ManejadorVrmrVarmicroruta manejadorVrmrVarmicroruta;

	@Autowired
	private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;

	@Autowired
	private ManejadorFacFactura manejadorFacFactura;

	@Autowired
	private ManejadorCosuConsuscrip manejadorCosuConsuscrip;

	@Autowired
	private ManejadorConConcepto manejadorConConcepto;

	@Autowired
	private ManejadorDperDetperiodo manejadorDperDetperiodo;

	@Autowired
	private ManejadorCprCtrproceso manejadorCprCtrproceso;

	private Integer idCicloSemestral;
        private List<Integer> conceptoTarifaRecolAplicada;
	private List<Map<String, Object>> mesAplicacionIndicador;
	private List<Integer> conceptosToneladas;
	private List<Integer> concepTarifRecolecc;
	private List<Integer> concepTarifaCompact;
	private List<Integer> listaConceptosReclamacion;
	private List<Map<String, Object>> concepTarifaReclam;
	private List<Integer> docFactServicio;
	private Integer numPerInteresMorat;
	private Integer conInteresCorr;
	private Integer conInteresMor;
	private BigDecimal interesTotalCorr = null;
	private BigDecimal porcentajeInteresCorr = null;
	private Integer conceptoInteresCorr = null;
	private BigDecimal interesTotalMor = null;
	private BigDecimal porcentajeInteresMor = null;
	private Integer conceptoInteresMor = null;
	private Integer idPrgProcesoIndicadoresCalidad = null;
	private Integer uniConceptoSuscripcionReclamacion = null;
        private TotalesDescCalidadMicroRutaDTO totalesMicro= null;
        private List<TotalesDescCalidadMicroRutaDTO> listaTotalesMicro = null;
        private Map<Integer,List<TotalesDescCalidadMicroRutaDTO>> datosReporte = null;

	// Variables de sumatoria de totales de descuento por indicador de calidad
	private BigDecimal totalDescReclamacion;
	private BigDecimal totalDescReccYTransp;
	private BigDecimal totalDescCompactacion;

	// Variables de sumatoria de totales de interés corriente por indicador de
	// calidad
	private BigDecimal totalInteresCorrReclamacion;
	private BigDecimal totalInteresCorrReccYTransp;
	private BigDecimal totalInteresCorrCompactacion;

	// Variables de sumatoria de totales de interés Moratorio por indicador de
	// calidad
	private BigDecimal totalInteresMorReclamacion;
	private BigDecimal totalInteresMorReccYTransp;
	private BigDecimal totalInteresMorCompactacion;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioDecaDesccalidad.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected DecaDesccalidadDTO instanciarDAO() {
		return new DecaDesccalidadDTO();
	}
        
        public ResponseDescuentosCalidadRecolAprobRespuestaDTO aprobarDescCalidad(ResponseDescuentosCalidadRecolAprobDTO respuesta) throws IOException {
            Integer periodo = respuesta.getPeriodo();
            Integer concepto = Integer.parseInt(respuesta.getConcepto());  
            Integer Cantidad = 0;            
            boolean estado = false;
            String texto = "Resultado de aprobacion ";
            ResponseDescuentosCalidadRecolAprobRespuestaDTO resp = new ResponseDescuentosCalidadRecolAprobRespuestaDTO();
            List<Object []> resultado = manejadorDecaDesccalidad.aprobarEstadoDescuentoCalidad(periodo,concepto);
            if(resultado.size() > 0 ){
                Cantidad = resultado.size();
                estado = true;              
            }
            resp.setCantidad(Cantidad);
            resp.setRep(estado);
            resp.setRespuesta(texto + Cantidad + " registros " + (estado == true ? " Exitoso " : " "));           
            return resp;            
        }

	/**
	 * Método encargado de calcular el descuento y validar las suscripciones a las
	 * que se les aplicará el descuento por indicadores de calidad, con base en un
	 * reporte de tarifas y la empresa en sesión
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public ResponseDescuentosCalidadRecolDTO aplicarDescCalidad() throws IOException {
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		String idAcceso = JwtUtil.auditoriaDTO.getId();
		//ResponseDescuentosCalidadDTO response = new ResponseDescuentosCalidadDTO();
                ResponseDescuentosCalidadRecolDTO response = new ResponseDescuentosCalidadRecolDTO();
		List<Long> suscripConError = new ArrayList<>();

		crearRegistroProcesoCalidad(idEmpresa, idAcceso, idUsuario);

		inicializarValoresEnCero();

		consultarParametrosDescCalidad(idEmpresa);

		// Consulta de periodo Inicio

		PerPeriodo periodo = consultarPeriodoDescuento();

		Timestamp perFecInicio = new Timestamp(periodo.getPerFecinicial().getTime());
		Timestamp perFecFin = new Timestamp(periodo.getPerFecfinal().getTime());
                
                /* Actualizamos el periodo para obtener las fechas de facturacion */
                LocalDateTime dateTimeIni = perFecInicio.toLocalDateTime();
                LocalDateTime dateTimeFin = perFecFin.toLocalDateTime();
                
                Timestamp perFecInicioFacturacion = Timestamp.valueOf(dateTimeIni.plus(1,ChronoUnit.MONTHS));
                Timestamp perFecFinFacturacion = Timestamp.valueOf(dateTimeFin.plus(1,ChronoUnit.MONTHS));
                
		obtenerConceptosTarifaReclamaComerc();
		List<Integer> listaConceptosIndicadores = obtenerConceptosIndicadores(this.getListaConceptosReclamacion());
		// Consulta de periodo fin

		// Consulta a la tabla de reportes de tarifas Inicio
                List<VrmrVarmicroruta> reportesMicro = manejadorVrmrVarmicroruta.consultaReporteIndCalidadVrm(periodo.getPerIderegistro(), listaConceptosIndicadores, idEmpresa);
		/*List<VarprVarperreg> reportes = manejadorVarprVarperreg.consultaReporteIndCalidad(periodo.getPerIderegistro(),
				listaConceptosIndicadores, idEmpresa);*/
		// Consulta a la tabla de reportes de tarifas Fin

		List<SuscripPorMicroRutaDTO> suscripcionesRecYTrans = manejadorDsusDetsuscrip
				.obtenerSuscripPorMicroRuta(this.concepTarifRecolecc.get(0), periodo.getPerIderegistro(), idEmpresa);
		/*List<CosuConsuscrip> suscripcionesRecComer = manejadorCosuConsuscrip.consultaSuscripReclamacionComercial(
				this.uniConceptoSuscripcionReclamacion, idEmpresa, new Timestamp(new Date().getTime()));
		List<Long> suscripcionesVigentesCompact = manejadorFacFactura.consultaSuscripVigentesCompactacion(perFecInicio,
				perFecFin, idEmpresa);*/

		// Consulta de suscripciones a aplicar el descuento según el indicador
		for (VrmrVarmicroruta reporte : reportesMicro) {
			// Recolección y transporte
			if (reporte.getConIderegistro() != null && concepTarifRecolecc.contains(reporte.getConIderegistro())) {

				calcularDescuentoRecYTransMod(suscripcionesRecYTrans, perFecInicioFacturacion, perFecFinFacturacion, periodo, reporte, response,
						suscripConError);
			}
			/*// Reclamos comerciales
			else if (reporte.getConIderegistro() != null
					&& listaConceptosReclamacion.contains(reporte.getConIderegistro())) {

				calcularDescuentoRecComer(suscripcionesRecComer, perFecInicio, perFecFin, periodo, reporte, response,
						suscripConError);
			}
			// Compactación
			else if (reporte.getConIderegistro() != null && concepTarifaCompact.contains(reporte.getConIderegistro())) {

				calcularDescuentoCompact(suscripcionesVigentesCompact, perFecInicio, perFecFin, periodo, reporte,
						response, suscripConError);

			}*/
		}

		//List<TotalesDescCalidadDTO> listaTotales = crearTotalesPorReporte(reportesMicro, periodo, listaConceptosReclamacion);
                
		logger.info("Generación de reportes totales: " + this.getDatosReporte().toString());
		response.setTotalesMicroRuta(this.getDatosReporte());               

		if ((response.getCodResp() != null) && !suscripConError.isEmpty()) {
			response.setError(ConstantesServicios.RESULTADO_FALLIDO_DESC_CALIDAD + suscripConError.size());
			logger.error("Lista de suscripciones con errores: " + suscripConError);
		} else if (reportesMicro.isEmpty()) {
			response.setCodResp(-1);
			response.setError(ConstantesServicios.RESULTADO_SIN_REPORTES);
		} else {
			response.setCodResp(Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_EXITOSA));
			response.setError(ConstantesServicios.RESULTADO_EXITOSO_OPERACION);
			actualizarActividadesPeriodo(periodo.getPerIderegistro());
                        response.setPeriodo(periodo.getPerIderegistro());
                        response.setRespuesta(true);
		}
		logger.info("Respuesta del servicio");
		eliminarRegistroProcesoCalidad(idEmpresa);

		return response;

	}

	/**
	 * Método encargado de realizar los cálculos de los descuentos para las
	 * suscripciones reportadas por el indicador de claidad de Compactación
	 * 
	 * @param suscripcionesVigentesCompact
	 * @param perFecInicio
	 * @param perFecFin
	 * @param periodo
	 * @param reporte
	 * @param response
	 * @param suscripConError
	 */
	private void calcularDescuentoCompact(List<Long> suscripcionesVigentesCompact, Timestamp perFecInicio,
			Timestamp perFecFin, PerPeriodo periodo, VarprVarperreg reporte, ResponseDescuentosCalidadDTO response,
			List<Long> suscripConError) {
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		for (Long suscripcion : suscripcionesVigentesCompact) {
			DecaDesccalidad existeDesc = manejadorDecaDesccalidad.validarDesceuntoPorSuscrip(suscripcion,
					reporte.getConIderegistro(), periodo.getPerIderegistro(), null);
			if (existeDesc == null) {
				try {
					PerPeriodo periodoActivo = manejadorPerPeriodo.consultaPeriodoActivoPorSuscrip(suscripcion);
					BigDecimal valorTotalToneladas = manejadorFacFactura.consultaSumatoriaToneladasPorSuscrip(
							this.conceptosToneladas, this.docFactServicio, suscripcion, perFecInicio, perFecFin);
					if (valorTotalToneladas == null) {
						logger.info("La suscripción: " + suscripcion + " no tiene toneladas");
						continue;
					}

					BigDecimal toneladasConDesc = valorTotalToneladas.multiply(reporte.getVarprValor());

					Integer mesAplicacion = validarMesAplicacionDesc(this.mesAplicacionIndicador, periodo);
					Integer mesActivo = periodoActivo.getPerIdeorden().intValue();

					calcularIntereses(mesAplicacion, mesActivo, toneladasConDesc);

					DecaDesccalidad descSuscripcion = nuevoDescCalidad(periodo.getPerIderegistro(),
							periodoActivo.getPerIderegistro(), mesAplicacion, suscripcion, valorTotalToneladas,
							reporte.getVarprValor(), toneladasConDesc, null, reporte.getConIderegistro(),0,
							this.interesTotalCorr, this.porcentajeInteresCorr, this.conceptoInteresCorr,
							this.interesTotalMor, this.porcentajeInteresMor, this.conceptoInteresMor, idUsuario);

					manejadorDecaDesccalidad.save(descSuscripcion);
					calcularValoresTotales(toneladasConDesc, reporte.getConIderegistro(), listaConceptosReclamacion);

					logger.info("se procesó correctamente la suscripción: " + suscripcion);
					
				} catch (Exception e) {
					logger.error(
							"Ocurrió un error en el método de calcular descuento para reporte de compactación con la suscripción: "
									+ suscripcion,
							e);
					response.setCodResp(-1);
					suscripConError.add(suscripcion);
				}
			} else {
				logger.info("La suscripción: " + suscripcion
						+ " ya cuenta con un cálculo de descuento creado para el periodo: "
						+ periodo.getPerIderegistro() + " y el reporte: " + reporte.getConIderegistro());
			}
		}

	}

	/**
	 * Método encargado de realizar los cálculos de los descuentos para las
	 * suscripciones reportadas por el indicador de claidad de reclamación comercial
	 * 
	 * @param suscripcionesRecComer
	 * @param perFecInicio
	 * @param perFecFin
	 * @param periodo
	 * @param reporte
	 * @param response
	 * @param suscripConError
	 */
	private void calcularDescuentoRecComer(List<CosuConsuscrip> suscripcionesRecComer, Timestamp perFecInicio,
			Timestamp perFecFin, PerPeriodo periodo, VarprVarperreg reporte, ResponseDescuentosCalidadDTO response,
			List<Long> suscripConError) {
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		
		// Se obtiene el valor de cuánto se cobra por el descuento según la homologación
		// del cliente y se multiplica por 6, siempre
		// Luego se obtienen las suscripciones a las que se les va a aplicar ese
		// descuento y se validan
		
		for (CosuConsuscrip suscripcion : suscripcionesRecComer) {
			boolean vigente = validarSucripVigentes(suscripcion.getDsusIderegistr(), idEmpresa, perFecInicio,
					perFecFin);
			if (vigente) {
				Integer empresaHomologada = manejadorDsusDetsuscrip
						.obtenerEmpresaHomolgadaXSuscrip(suscripcion.getDsusIderegistr(), idEmpresa);
				double valorDescuento = calcularDecuentoReclamacionComercial(empresaHomologada, reporte);
				if (valorDescuento == 0) {
					continue;
				}
				DecaDesccalidad existeDesc = manejadorDecaDesccalidad.validarDesceuntoPorSuscrip(
						suscripcion.getDsusIderegistr(), reporte.getConIderegistro(), periodo.getPerIderegistro(),
						null);
				if (existeDesc == null) {
					try {
						PerPeriodo periodoActivo = manejadorPerPeriodo
								.consultaPeriodoActivoPorSuscrip(suscripcion.getDsusIderegistr());
						Integer mesAplicacion = validarMesAplicacionDesc(this.mesAplicacionIndicador, periodo);
						Integer mesActivo = periodoActivo.getPerIdeorden().intValue();

						calcularIntereses(mesAplicacion, mesActivo, BigDecimal.valueOf(valorDescuento));

						DecaDesccalidad descSuscripcion = nuevoDescCalidad(periodo.getPerIderegistro(),
								periodoActivo.getPerIderegistro(), mesAplicacion, suscripcion.getDsusIderegistr(), null,
								reporte.getVarprValor(), BigDecimal.valueOf(valorDescuento), null,
								reporte.getConIderegistro(), 0,this.interesTotalCorr, this.porcentajeInteresCorr,
								this.conceptoInteresCorr, this.interesTotalMor, this.porcentajeInteresMor,
								this.conceptoInteresMor, idUsuario);

						manejadorDecaDesccalidad.save(descSuscripcion);
						calcularValoresTotales(BigDecimal.valueOf(valorDescuento), reporte.getConIderegistro(),
								listaConceptosReclamacion);
						logger.info("se procesó correctamente la suscripción: " + suscripcion.getDsusIderegistr());
						
					} catch (Exception e) {
						logger.error(
								"Ocurrió un error en el método de calcular descuento para reporte de reclamos comerciales con la suscripción: "
										+ suscripcion.getDsusIderegistr(),
								e);
						response.setCodResp(-1);
						suscripConError.add(suscripcion.getDsusIderegistr());
					}
				} else {
					logger.info("La" + " suscripción: " + suscripcion.getDsusIderegistr()
							+ " ya cuenta con un cálculo de descuento creado para el periodo: "
							+ periodo.getPerIderegistro() + " y el reporte: " + reporte.getConIderegistro());
				}
			}
		}

	}

	/**
	 * Método encargado de realizar los cálculos de los descuentos para las
	 * suscripciones reportadas por el indicador de claidad de recolección y
	 * transporte
	 * 
	 * @param suscripcionesRecYTrans
	 * @param perFecInicio
	 * @param perFecFin
	 * @param periodo
	 * @param reporte
	 * @param response
	 * @param suscripConError
	 */
	private void calcularDescuentoRecYTrans(List<SuscripPorMicroRutaDTO> suscripcionesRecYTrans, Timestamp perFecInicio,
			Timestamp perFecFin, PerPeriodo periodo, VrmrVarmicroruta reporte, ResponseDescuentosCalidadRecolDTO response,
			List<Long> suscripConError) {

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();  
                Map<Integer,List<TotalesDescCalidadMicroRutaDTO>> datosReporteTMP = new HashMap<>();
                /*Integer cantidad = 0;
                BigDecimal totalToneladas = BigDecimal.ZERO;
                BigDecimal totalToneladasLiq = BigDecimal.ZERO;
                BigDecimal totalDescuento = BigDecimal.ZERO;
                BigDecimal totalInteresCorriente = BigDecimal.ZERO;
                BigDecimal totalInteresMoratorio = BigDecimal.ZERO;*/
                        

		for (SuscripPorMicroRutaDTO suscripcion : suscripcionesRecYTrans) {
			boolean vigente = validarSucripVigentesServicio(suscripcion.getDsusIderegistr(), idEmpresa, perFecInicio,
					perFecFin,this.docFactServicio);
			if (vigente) {
				DecaDesccalidad existeDesc = manejadorDecaDesccalidad.validarDesceuntoPorSuscrip(
						suscripcion.getDsusIderegistr(), suscripcion.getConIderegistro(), periodo.getPerIderegistro(),
						suscripcion.getRutIdemicroruta());
				if (existeDesc == null) {
					try {                                                
                                                Integer cantidad = 0;
                                                BigDecimal totalToneladas = BigDecimal.ZERO;
                                                BigDecimal totalToneladasLiq = BigDecimal.ZERO;
                                                BigDecimal totalDescuento = BigDecimal.ZERO;
                                                BigDecimal totalInteresCorriente = BigDecimal.ZERO;
                                                BigDecimal totalInteresMoratorio = BigDecimal.ZERO;
                                                
						PerPeriodo periodoActivo = manejadorPerPeriodo
								.consultaPeriodoActivoPorSuscrip(suscripcion.getDsusIderegistr());
						BigDecimal valorTotalToneladas = manejadorFacFactura.consultaSumatoriaToneladasPorSuscrip(
								this.conceptosToneladas, this.docFactServicio, suscripcion.getDsusIderegistr(),
								perFecInicio, perFecFin);
						if (valorTotalToneladas == null) {
							logger.info("La Suscripción: " + suscripcion.getDsusIderegistr() + " no tiene toneladas");
							continue;
						}

						BigDecimal toneladasConDesc = valorTotalToneladas.multiply(suscripcion.getVrmrValor());

						Integer mesAplicacion = validarMesAplicacionDesc(this.mesAplicacionIndicador, periodo);
						Integer mesActivo = periodoActivo.getPerIdeorden().intValue();

						calcularIntereses(mesAplicacion, mesActivo, toneladasConDesc);

						DecaDesccalidad descSuscripcion = nuevoDescCalidad(periodo.getPerIderegistro(),
								periodoActivo.getPerIderegistro(), mesAplicacion, suscripcion.getDsusIderegistr(),
								valorTotalToneladas, suscripcion.getVrmrValor(), toneladasConDesc,
								suscripcion.getRutIdemicroruta(), suscripcion.getConIderegistro(),this.conceptoTarifaRecolAplicada.get(0),
								this.interesTotalCorr, this.porcentajeInteresCorr, this.conceptoInteresCorr,
								this.interesTotalMor, this.porcentajeInteresMor, this.conceptoInteresMor, idUsuario);

						manejadorDecaDesccalidad.save(descSuscripcion);
						calcularValoresTotales(toneladasConDesc, reporte.getConIderegistro(),
								listaConceptosReclamacion);
						logger.info("Se procesó correctamente la suscripción: " + suscripcion.getDsusIderegistr());                                                

                                                if ( datosReporteTMP != null && datosReporteTMP.containsKey(suscripcion.getRutIdemicroruta())){
                                                    
                                                    datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setCantidad(datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).getCantidad() + 1);
                                                    datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalDescuento(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                                            .get(0).getTotalDescuento().add(toneladasConDesc == null ?  BigDecimal.ZERO : toneladasConDesc));
                                                    datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalInteresCorriente(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                                            .get(0).getTotalInteresCorriente().add(this.interesTotalCorr == null ? BigDecimal.ZERO : this.interesTotalCorr));
                                                    datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalInteresMoratorio(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                                            .get(0).getTotalInteresMoratorio().add(this.interesTotalMor == null ? BigDecimal.ZERO : this.interesTotalMor));
                                                    datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalToneladas(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                                            .get(0).getTotalToneladas().add(valorTotalToneladas == null ? BigDecimal.ZERO : valorTotalToneladas));
                                                    datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalToneladasLiq(suscripcion.getVrmrValor()
                                                            .compareTo(BigDecimal.ZERO) > 0 ? suscripcion.getVrmrValor() : BigDecimal.ZERO);                                      

                                                }else {
                                                    
                                                cantidad+=1;
                                                totalToneladas = valorTotalToneladas == null ? BigDecimal.ZERO : valorTotalToneladas;
                                                totalToneladasLiq = suscripcion.getVrmrValor().compareTo(BigDecimal.ZERO) > 0 ? suscripcion.getVrmrValor() : BigDecimal.ZERO ;
                                                totalDescuento = toneladasConDesc == null ?  BigDecimal.ZERO : toneladasConDesc;
                                                totalInteresCorriente = this.interesTotalCorr == null ? BigDecimal.ZERO : this.interesTotalCorr;
						totalInteresMoratorio = this.interesTotalMor == null ? BigDecimal.ZERO : this.interesTotalMor;
                                                
                                                TotalesDescCalidadMicroRutaDTO totalMicro = new TotalesDescCalidadMicroRutaDTO(suscripcion.getRutIdemicroruta(),
                                                            periodo.getPerNombre(),cantidad,totalToneladas,totalToneladasLiq,totalDescuento,totalInteresCorriente,totalInteresMoratorio,suscripcion.getConIderegistro());
                                                
                                                List<TotalesDescCalidadMicroRutaDTO> listaTotalMicro = new ArrayList<>();
                                                listaTotalMicro.add(totalMicro);                                                
                                                //this.setListaTotalesMicro(listaTotalMicro);                                                 
                                                datosReporteTMP.put(suscripcion.getRutIdemicroruta(),listaTotalMicro);
                                                }
                                                
					} catch (Exception e) {
						logger.error(
								"Ocurrió un error en el método de calcular descuento para reporte de recolección y transporte con la suscripción: "
										+ suscripcion.getDsusIderegistr(),
								e);
						response.setCodResp(-1);
						suscripConError.add(suscripcion.getDsusIderegistr());
					}
				} else {
					logger.info("La" + " suscripción: " + suscripcion.getDsusIderegistr()
							+ " ya cuenta con un cálculo de descuento creado" + " para el periodo: "
							+ periodo.getPerIderegistro() + " y" + " el reporte: " + reporte.getConIderegistro());
				}
			}
		}
                if( datosReporteTMP != null && datosReporteTMP.size()>0) this.setDatosReporte(datosReporteTMP);
	}
        
        	/**
	 * Método encargado de realizar los cálculos de los descuentos para las
	 * suscripciones reportadas por el indicador de claidad de recolección y
	 * transporte
	 * 
	 * @param suscripcionesRecYTrans
	 * @param perFecInicio
	 * @param perFecFin
	 * @param periodo
	 * @param reporte
	 * @param response
	 * @param suscripConError
	 */
	private void calcularDescuentoRecYTransMod(List<SuscripPorMicroRutaDTO> suscripcionesRecYTrans, Timestamp perFecInicio,
			Timestamp perFecFin, PerPeriodo periodo, VrmrVarmicroruta reporte, ResponseDescuentosCalidadRecolDTO response,
			List<Long> suscripConError) {

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();  
                Map<Integer,List<TotalesDescCalidadMicroRutaDTO>> datosReporteTMP = new HashMap<>();    
                
                suscripcionesRecYTrans.stream()
                .filter(s -> manejadorDecaDesccalidad.validarDesceuntoPorSuscrip(s.getDsusIderegistr(), s.getConIderegistro(), periodo.getPerIderegistro(),
			s.getRutIdemicroruta()) == null)
                .forEach(suscripcion -> {
                    try {                                                
                        Integer cantidad = 0;
                        BigDecimal totalToneladas = BigDecimal.ZERO;
                        BigDecimal totalToneladasLiq = BigDecimal.ZERO;
                        BigDecimal totalDescuento = BigDecimal.ZERO;
                        BigDecimal totalInteresCorriente = BigDecimal.ZERO;
                        BigDecimal totalInteresMoratorio = BigDecimal.ZERO;
                        Optional<BigDecimal> valorTon = Optional.empty();
                        BigDecimal valorTotalToneladas = BigDecimal.ZERO;

                        PerPeriodo periodoActivo = manejadorPerPeriodo
                                        .consultaPeriodoActivoPorSuscrip(suscripcion.getDsusIderegistr());
                        
                        valorTon = manejadorFacFactura.consultaSumatoriaToneladasPorSuscrip(
                                        suscripcion.getDsusIderegistr()); 
                        
                        if (valorTon.isPresent()) {
                            valorTotalToneladas = valorTon.get();
                        }

                        BigDecimal toneladasConDesc = valorTotalToneladas.multiply(suscripcion.getVrmrValor());

                        Integer mesAplicacion = validarMesAplicacionDesc(this.mesAplicacionIndicador, periodo);
                        Integer mesActivo = periodoActivo.getPerIdeorden().intValue();

                        DecaDesccalidad descSuscripcion = nuevoDescCalidad(periodo.getPerIderegistro(),
                                        periodoActivo.getPerIderegistro(), mesAplicacion, suscripcion.getDsusIderegistr(),
                                        valorTotalToneladas, suscripcion.getVrmrValor(), toneladasConDesc,
                                        suscripcion.getRutIdemicroruta(), suscripcion.getConIderegistro(),this.conceptoTarifaRecolAplicada.get(0),
                                        this.interesTotalCorr, this.porcentajeInteresCorr, this.conceptoInteresCorr,
                                        this.interesTotalMor, this.porcentajeInteresMor, this.conceptoInteresMor, idUsuario);

                        manejadorDecaDesccalidad.save(descSuscripcion);
                        
                        if (concepTarifRecolecc.contains(reporte.getConIderegistro())) {
                            this.setTotalDescReccYTransp(this.totalDescReccYTransp.add(toneladasConDesc));
                        }    
                        
                        logger.info("Se procesó correctamente la suscripción: " + suscripcion.getDsusIderegistr());                                                

                        if ( datosReporteTMP != null && datosReporteTMP.containsKey(suscripcion.getRutIdemicroruta())){

                            datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setCantidad(datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).getCantidad() + 1);
                            datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalDescuento(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                    .get(0).getTotalDescuento().add(toneladasConDesc == null ?  BigDecimal.ZERO : toneladasConDesc));
                            datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalInteresCorriente(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                    .get(0).getTotalInteresCorriente().add(this.interesTotalCorr == null ? BigDecimal.ZERO : this.interesTotalCorr));
                            datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalInteresMoratorio(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                    .get(0).getTotalInteresMoratorio().add(this.interesTotalMor == null ? BigDecimal.ZERO : this.interesTotalMor));
                            datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalToneladas(datosReporteTMP.get(suscripcion.getRutIdemicroruta())
                                    .get(0).getTotalToneladas().add(valorTotalToneladas == null ? BigDecimal.ZERO : valorTotalToneladas));
                            datosReporteTMP.get(suscripcion.getRutIdemicroruta()).get(0).setTotalToneladasLiq(suscripcion.getVrmrValor()
                                    .compareTo(BigDecimal.ZERO) > 0 ? suscripcion.getVrmrValor() : BigDecimal.ZERO);                                      

                        }else {

                        cantidad+=1;
                        totalToneladas = valorTotalToneladas == null ? BigDecimal.ZERO : valorTotalToneladas;
                        totalToneladasLiq = suscripcion.getVrmrValor().compareTo(BigDecimal.ZERO) > 0 ? suscripcion.getVrmrValor() : BigDecimal.ZERO ;
                        totalDescuento = toneladasConDesc == null ?  BigDecimal.ZERO : toneladasConDesc;
                        totalInteresCorriente = this.interesTotalCorr == null ? BigDecimal.ZERO : this.interesTotalCorr;
                        totalInteresMoratorio = this.interesTotalMor == null ? BigDecimal.ZERO : this.interesTotalMor;

                        TotalesDescCalidadMicroRutaDTO totalMicro = new TotalesDescCalidadMicroRutaDTO(suscripcion.getRutIdemicroruta(),
                                    periodo.getPerNombre(),cantidad,totalToneladas,totalToneladasLiq,totalDescuento,totalInteresCorriente,totalInteresMoratorio,suscripcion.getConIderegistro());

                        List<TotalesDescCalidadMicroRutaDTO> listaTotalMicro = new ArrayList<>();
                        listaTotalMicro.add(totalMicro);                                                
                        //this.setListaTotalesMicro(listaTotalMicro);                                                 
                        datosReporteTMP.put(suscripcion.getRutIdemicroruta(),listaTotalMicro);
                        }

                    } catch (Exception e) {
                        logger.error(
                                        "Ocurrió un error en el método de calcular descuento para reporte de recolección y transporte con la suscripción: "
                                                        + suscripcion.getDsusIderegistr(),
                                        e);
                        response.setCodResp(-1);
                        suscripConError.add(suscripcion.getDsusIderegistr());
                    }
                });

                if( datosReporteTMP != null && datosReporteTMP.size()>0) this.setDatosReporte(datosReporteTMP);
	}

	/**
	 * Método de consulta del periodo sobre el que se realizará el descuento por
	 * indicadores de calidad
	 * 
	 * @return
	 */
	private PerPeriodo consultarPeriodoDescuento() {
		Pageable limit = PageRequest.of(BigDecimal.ZERO.intValue(), BigDecimal.ONE.intValue());
		List<PerPeriodo> periodos = manejadorPerPeriodo.consultarPeriodoDescCalidad(this.idCicloSemestral, limit);
		return periodos.get(0);
	}

	/**
	 * Método encargado de eliminar el registro de proceso en ejecución para el
	 * cálculo de descuento de indicadores de calidad
	 * 
	 * @param idEmpresa
	 */
	private void eliminarRegistroProcesoCalidad(int idEmpresa) {

		CprCtrProceso proceso = manejadorCprCtrproceso.consultarProcesoCalidad(idEmpresa,
				ConstantesServicios.ID_PROGRAMA_CALIDAD);

		if (proceso != null) {
			manejadorCprCtrproceso.deleteById(proceso.getCprIderegistro());
		}

	}

	/**
	 * Método encargado de crear el registro correspondiente al proceso en ejecución
	 * para descuento de calidad
	 * 
	 * @param idEmpresa
	 * @param idAcceso
	 * @param idUsuario
	 */
	private void crearRegistroProcesoCalidad(int idEmpresa, String idAcceso, int idUsuario) {

		CprCtrProceso proceso = new CprCtrProceso();

		proceso.setCprEstado("A");
		proceso.setCprFecinicio(new Date());
		proceso.setPrgIderegistro(ConstantesServicios.ID_PROGRAMA_CALIDAD);
		proceso.setAccIderegistro(Long.valueOf(idAcceso));
		proceso.setEmpIderegistro(idEmpresa);
		proceso.setCprIdehilo(Long.valueOf(ConstantesServicios.ID_PROGRAMA_CALIDAD));
		proceso.setCprCanregistro(Long.valueOf(0));
		proceso.setUsuIderegistro(Long.valueOf(idUsuario));

		manejadorCprCtrproceso.save(proceso);
	}

	/**
	 * Método encargado de crear el reporte de totales descontados e intereses para
	 * cada tipo de indicador de calidad
	 * 
	 * @param reportes
	 * @param periodo
	 * @param listaConceptosReclamacion
	 * @return
	 */
	private List<TotalesDescCalidadDTO> crearTotalesPorReporte(List<VrmrVarmicroruta> reportes, PerPeriodo periodo,
			List<Integer> listaConceptosReclamacion) {

		List<TotalesDescCalidadDTO> lista = new ArrayList<>();
		Calendar calendar = Calendar.getInstance();
		ConConcepto concepto = null;
                TotalesDescCalidadDTO total = new TotalesDescCalidadDTO();
		for (VrmrVarmicroruta reporte : reportes) {			
			Optional<ConConcepto> concepto1 = manejadorConConcepto.findById(reporte.getConIderegistro());
			if (concepto1.isPresent()) {
				concepto = concepto1.get();
				if (this.concepTarifRecolecc.contains(concepto.getUniConcepto())) {
					calendar.setTime(periodo.getPerFecinicial());
					total = new TotalesDescCalidadDTO(concepto.getConNombre(),
							periodo.getPerNombre() + " - " + calendar.get(Calendar.YEAR), this.totalDescReccYTransp,
							this.totalInteresCorrReccYTransp, this.totalInteresMorReccYTransp);
					
				} /*else if (this.concepTarifaCompact.contains(concepto.getUniConcepto())) {
					calendar.setTime(periodo.getPerFecinicial());
					total = new TotalesDescCalidadDTO(concepto.getConNombre(),
							periodo.getPerNombre() + " - " + calendar.get(Calendar.YEAR), this.totalDescCompactacion,
							this.totalInteresCorrCompactacion, this.totalInteresMorCompactacion);
					lista.add(total);
				} else if (listaConceptosReclamacion.contains(concepto.getUniConcepto())) {
					calendar.setTime(periodo.getPerFecinicial());
					total = new TotalesDescCalidadDTO(concepto.getConNombre(),
							periodo.getPerNombre() + " - " + calendar.get(Calendar.YEAR), this.totalDescReclamacion,
							this.totalInteresCorrReclamacion, this.totalInteresMorReclamacion);
					lista.add(total);
				}*/
			}
		}
                lista.add(total);

		return lista;
	}

	/**
	 * Método encargado de llevar la sumatoria de los valores totales de descuento e
	 * interés que se aplican según cada indicador para enviarlo como respuesta al
	 * frontend
	 * 
	 * @param toneladasConDesc
	 * @param uniConceptoIndicador
	 * @param listaConceptosReclamacion
	 */
	private void calcularValoresTotales(BigDecimal toneladasConDesc, Integer uniConceptoIndicador,
			List<Integer> listaConceptosReclamacion) {
		// Recolección y transporte
		if (concepTarifRecolecc.contains(uniConceptoIndicador)) {
			this.setTotalDescReccYTransp(this.totalDescReccYTransp.add(toneladasConDesc));
			calcularTotalesInteres(this.totalInteresCorrReccYTransp, this.totalInteresMorReccYTransp);
			// Reclamación
		} else if (listaConceptosReclamacion.contains(uniConceptoIndicador)) {
			this.setTotalDescReclamacion(this.totalDescReclamacion.add(toneladasConDesc));
			calcularTotalesInteres(this.totalInteresCorrReclamacion, this.totalInteresMorReclamacion);
			// Compactación
		} else if (concepTarifaCompact.contains(uniConceptoIndicador)) {
			this.setTotalDescCompactacion(this.totalDescCompactacion.add(toneladasConDesc));
			calcularTotalesInteres(this.totalInteresCorrCompactacion, this.totalInteresMorCompactacion);
		}

	}

	public BigDecimal calcularTotalesInteres(BigDecimal variableInteresCorr, BigDecimal variableInteresMor) {
		if (this.conceptoInteresCorr != null) {
			variableInteresCorr = variableInteresCorr.add(this.interesTotalCorr);
			return variableInteresCorr;

		} else if (this.conceptoInteresMor != null) {
			variableInteresMor = variableInteresMor.add(this.interesTotalMor);
			return variableInteresMor;
	
		}
		return BigDecimal.ZERO;

	}

	/**
	 * Método de incializar las variables en 0 para cada vez que se llame el proceso
	 * no se conserve data de procesos anteriores
	 * 
	 */
	private void inicializarValoresEnCero() {
		// Valores en 0 para los descuentos
		this.setTotalDescCompactacion(BigDecimal.ZERO);
		this.setTotalDescReccYTransp(BigDecimal.ZERO);
		this.setTotalDescReclamacion(BigDecimal.ZERO);
		// Valores en 0 para los intereses corrientes
		this.setTotalInteresCorrCompactacion(BigDecimal.ZERO);
		this.setTotalInteresCorrReccYTransp(BigDecimal.ZERO);
		this.setTotalInteresCorrReclamacion(BigDecimal.ZERO);
		// Valores en 0 para los intereses moratorios
		this.setTotalInteresMorCompactacion(BigDecimal.ZERO);
		this.setTotalInteresMorReccYTransp(BigDecimal.ZERO);
		this.setTotalInteresMorReclamacion(BigDecimal.ZERO);
	}

	/**
	 * Método encargado de calcular el descuento para una suscripción reportada por
	 * reclamación comercial según el concepto asociado a la empresa homologada
	 * 
	 * @param empresaHomologada
	 * @param reporte
	 * @return
	 */
	private double calcularDecuentoReclamacionComercial(Integer empresaHomologada, VarprVarperreg reporte) {

		double descuento = 0;
		for (Map<String, Object> empresaConcepto : this.getConcepTarifaReclam()) {
			Integer idEmpresa = (Integer) empresaConcepto.get(ConstantesServicios.ID_EMPRESA);
			if (empresaHomologada.equals(idEmpresa)) {
				Integer uniConcepto = (Integer) empresaConcepto.get(ConstantesServicios.CONCEPTO);
				if (uniConcepto.equals(reporte.getConIderegistro())) {
					descuento = reporte.getVarprValor().doubleValue()
							* ConstantesServicios.FACTOR_PERIODICO_DESCUENTO_RECLAMACION_COMERCIAL;
				}
			}
		}
		return descuento;
	}

	/**
	 * Método encargado de retornar la lista de conceptos de reclamación para ser
	 * utilizada en búsquedas o comparaciones
	 * 
	 * @return
	 */
	private void obtenerConceptosTarifaReclamaComerc() {

		List<Integer> listaConceptosReclamacionTmp = new ArrayList<>();
		for (Map<String, Object> empresaConcepto : this.getConcepTarifaReclam()) {
			Integer concepto = (Integer) empresaConcepto.get(ConstantesServicios.CONCEPTO);
			if (!(listaConceptosReclamacionTmp.contains(concepto))) {
				listaConceptosReclamacionTmp.add(concepto);
			}
		}

		this.setListaConceptosReclamacion(listaConceptosReclamacionTmp);
	}

	/**
	 * Método encargado de retornar la lista completa de conceptos de indicadores de
	 * calidad
	 * 
	 * @return
	 */
	private List<Integer> obtenerConceptosIndicadores(List<Integer> listaConceptosReclamacion) {

		List<Integer> listaIndicadores = new ArrayList<>();
		listaIndicadores.addAll(this.concepTarifRecolecc); // Recolección y transporte
		listaIndicadores.addAll(this.concepTarifaCompact); // Compactación
		listaIndicadores.addAll(listaConceptosReclamacion); // Reclamos comerciales

		return listaIndicadores;
	}

	/**
	 * Método encargado de actualizar el estado a "C" de las actividades asociadas
	 * al descuento por indicadores de calidad del periodo en que se aplicó.
	 * 
	 * @param integer
	 */
	private void actualizarActividadesPeriodo(Integer perIdregistro) {

		List<DperDetperiodo> actividades = manejadorPerPeriodo
				.consultarEstadoPeriodo(this.idPrgProcesoIndicadoresCalidad, perIdregistro);

		for (DperDetperiodo dperDetperiodo : actividades) {
			dperDetperiodo.setDperEstado("C");
			manejadorDperDetperiodo.save(dperDetperiodo);
		}
	}

	/**
	 * Método encargado de calcular intereses en caso de que sea necesario
	 * 
	 * @param mesAplicacion
	 * @param mesActivo
	 * @param toneladasConDesc
	 */

	private void calcularIntereses(Integer mesAplicacion, Integer mesActivo, BigDecimal toneladasConDesc) {
		ConConcepto interesCorr;
		ConConcepto interesMor;
		Integer diferencia = calcularDiferenciaAplicActivo(mesActivo, mesAplicacion);

		if (diferencia > 0) {
			interesCorr = manejadorConConcepto.findById(this.conInteresCorr).orElse(new ConConcepto());
			interesMor = manejadorConConcepto.findById(this.conInteresMor).orElse(new ConConcepto());
			if (interesCorr.getUniConcepto() != null && interesMor.getUniConcepto() != null) {
				this.setConceptoInteresCorr(interesCorr.getUniConcepto());
				this.setPorcentajeInteresCorr(interesCorr.getConValor());
				this.setConceptoInteresMor(interesMor.getUniConcepto());
				this.setPorcentajeInteresMor(interesMor.getConValor());
				double valorDescuentoConIntereses = toneladasConDesc.doubleValue();
				double valorDescuentoConInteresesMor = 0;
				for (int i = 0; i < diferencia; i++) {
					if (i >= this.numPerInteresMorat) {
						valorDescuentoConInteresesMor += valorDescuentoConInteresesMor
								* (this.porcentajeInteresMor.doubleValue() / 100);
					} else {
						valorDescuentoConIntereses += valorDescuentoConIntereses
								* (this.porcentajeInteresCorr.doubleValue() / 100);
						valorDescuentoConInteresesMor = valorDescuentoConIntereses;
					}
				}
				this.setInteresTotalCorr(
						BigDecimal.valueOf(valorDescuentoConIntereses - toneladasConDesc.doubleValue()));
				validarInteresMoratorio(diferencia, valorDescuentoConInteresesMor, valorDescuentoConIntereses);
			}

		} else {
			this.setConceptoInteresCorr(null);
			this.setPorcentajeInteresCorr(null);
			this.setInteresTotalCorr(null);
			this.setConceptoInteresMor(null);
			this.setPorcentajeInteresMor(null);
			this.setInteresTotalMor(null);
		}

	}

	/**
	 * Método encargado de validar si se aplicó interés moratorio para agregarlo en
	 * las variables globales
	 * 
	 * @param diferencia
	 * @param valorDescuentoConInteresesMor
	 * @param valorDescuentoConIntereses
	 */
	private void validarInteresMoratorio(Integer diferencia, double valorDescuentoConInteresesMor,
			double valorDescuentoConIntereses) {

		if (diferencia > this.numPerInteresMorat) {
			this.setInteresTotalMor(BigDecimal.valueOf(valorDescuentoConInteresesMor - valorDescuentoConIntereses));
		} else {
			this.setInteresTotalMor(null);
		}

	}

	/**
	 * Método encargado de consultar los parámetros que se requieren para el cálculo
	 * de descuento por indicadores de calidad
	 * 
	 * @param idEmpresa
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	 @SuppressWarnings("unchecked")
	private void consultarParametrosDescCalidad(int idEmpresa) throws IOException {
		Map<String, Object> parametros = negocioParParametro.consultaParametros(idEmpresa,
				ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		this.setIdCicloSemestral((Integer) parametros.get(ConstantesServicios.CICLO_SEMESTRAL_INDICADOR_CALIDAD));
		this.setMesAplicacionIndicador(
				(List<Map<String, Object>>) parametros.get(ConstantesServicios.MES_APLICACION_INDICADOR));
		this.setConceptosToneladas((List<Integer>) parametros.get(ConstantesServicios.UNI_CONCEPTOS_BASE_TONELADAS));
		this.setConcepTarifRecolecc((List<Integer>) parametros
				.get(ConstantesServicios.UNI_CONCEPTO_VARIABLE_INDICADOR_CALIDAD_RECOLECCION));
		this.setConcepTarifaCompact(
				(List<Integer>) parametros.get(ConstantesServicios.UNI_CONCEPTO_VARIABLE_INDICADOR_COMPACTACION));
		this.setConcepTarifaReclam((List<Map<String, Object>>) parametros
				.get(ConstantesServicios.UNI_CONCEPTO_VARIABLE_INDICADOR_RECLAMACION));
		this.setDocFactServicio((List<Integer>) parametros.get(ConstantesServicios.UNI_DOCUMENTO_FACTURA_SERVICIO));
		this.setNumPerInteresMorat((Integer) parametros.get(ConstantesServicios.NUMERO_PERIODO_INTERES_MORATORIO));
		this.setConInteresCorr((Integer) parametros.get(ConstantesServicios.UNI_CONCEPTO_INTERES_CORRIENTE));
		this.setConInteresMor((Integer) parametros.get(ConstantesServicios.UNI_CONCEPTO_INTERES_MORATORIO));
		this.setIdPrgProcesoIndicadoresCalidad(
				(Integer) parametros.get(ConstantesServicios.ID_PROGRAMA_PROCESA_INDICADORES_CALIDAD));
		this.setUniConceptoSuscripcionReclamacion(
				(Integer) parametros.get(ConstantesServicios.UNI_CONCEPTO_SUSCRIPCION_RECLAMACION));
                this.setConcepTarifRecoleccAplicada((List<Integer>) parametros.get(ConstantesServicios.UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECOLECCION));
	}

	/**
	 * Método para calcular la diferencia entre el mes de aplicación y el mes activo
	 * en el que se va a plicar el descuento y saber si se debe aplicar interés o no
	 * 
	 * @param mesActivo     Mes en el que se va a plicar el descuento
	 * @param mesAplicacion Mes en el que se debe aplicar el descuento
	 * @return
	 */
	private Integer calcularDiferenciaAplicActivo(Integer mesActivo, Integer mesAplicacion) {
		int diferencia = 0;
		int totalMesesAnio = ConstantesServicios.MESES_POR_ANIO;
		if (mesActivo > mesAplicacion) {
			diferencia = mesActivo - mesAplicacion;
		} else if (mesActivo < mesAplicacion) {
			diferencia = (totalMesesAnio - mesAplicacion) + mesActivo;
		}
		return diferencia;
	}

	/**
	 * Método encargado de validar el mes en el que se debe aplicar el descuento
	 * 
	 * @param mesAplicacionIndicador
	 * @param periodo
	 * @return
	 */
	private Integer validarMesAplicacionDesc(List<Map<String, Object>> mesAplicacionIndicador,
			PerPeriodo periodoDescuento) {

		Integer mesAplicacion = null;
		for (Map<String, Object> semestre : mesAplicacionIndicador) {
			Integer valorSemestre = (Integer) semestre.get(ConstantesServicios.SEMESTRE);
			if (periodoDescuento.getPerIdeorden().intValue() == valorSemestre.intValue()) {
				mesAplicacion = (Integer) semestre.get(ConstantesServicios.MES);
			}
		}

		return mesAplicacion;
	}

	/**
	 * Método encargado de crear un objeto y retornarlo para luego ser persistido
	 * 
	 * NOTA: Queda pendiente pasarlo a mapper
	 * 
	 * @param perIderegistro
	 * @param perIderegistro2
	 * @param mesAplicacion
	 * @param dsusIderegistr
	 * @param valorToneladas
	 * @param vrmrValor
	 * @param toneladasConDesc
	 * @param rutIdemicroruta
	 * @param conIderegistro
	 * @param conceptoInteresCorr
	 * @param interesTotalCorr
	 * @param porcentajeInteresCorr
	 * @param interesTotalMor
	 * @param porcentajeInteresMor
	 * @param conceptoInteresMor
	 * @param idUsuario2
	 * @return
	 */
	private DecaDesccalidad nuevoDescCalidad(Integer perIderegistroTaras, Integer perIderegistroActivo,
			Integer mesAplicacion, Long dsusIderegistr, BigDecimal valorToneladas, BigDecimal factorDescuento,
			BigDecimal toneladasConDesc, Integer rutIdemicroruta, Integer conIderegistro, Integer conIderegistroAplicada, BigDecimal interesTotalCorr,
			BigDecimal porcentajeInteresCorr, Integer conceptoInteresCorr, BigDecimal interesTotalMor,
			BigDecimal porcentajeInteresMor, Integer conceptoInteresMor, int idUsuario) {

                /* Sumatoria de los valores Capital e Interes */        
                List<BigDecimal> saldoValores = Arrays.asList(interesTotalCorr == null ? BigDecimal.ZERO : interesTotalCorr,
                        interesTotalMor == null ? BigDecimal.ZERO : interesTotalMor,toneladasConDesc == null ? BigDecimal.ZERO : toneladasConDesc);
                BigDecimal saldoTotal = BigDecimal.ZERO;
                for(BigDecimal s : saldoValores){
                    saldoTotal = saldoTotal.add(s);
                }
		Timestamp fechaActual = new Timestamp(new Date().getTime());
		DecaDesccalidad suscripcionDescuento = new DecaDesccalidad();
		suscripcionDescuento.setPerIderegistroTarifas(perIderegistroTaras);
		suscripcionDescuento.setPerIderegistroActivo(perIderegistroActivo);
		suscripcionDescuento.setPerIdeordenAplic(mesAplicacion);
		suscripcionDescuento.setDsusIderegistr(dsusIderegistr);
		suscripcionDescuento.setValorToneladas(valorToneladas);
		suscripcionDescuento.setFactorDesc(factorDescuento);
		suscripcionDescuento.setValorTotalDesc(toneladasConDesc);
                suscripcionDescuento.setSaldoTotalDesc(saldoTotal.setScale(0, RoundingMode.HALF_UP));
		suscripcionDescuento.setRutIderegistro(rutIdemicroruta != null ? rutIdemicroruta : null);
		suscripcionDescuento.setUniConceptoTarifas(conIderegistro);
		suscripcionDescuento.setUniConceptoFacturacion(conIderegistroAplicada);
		suscripcionDescuento.setInteresCorrAplicado(interesTotalCorr);
		suscripcionDescuento.setPorcentajeInteresCorr(porcentajeInteresCorr);
		suscripcionDescuento.setUniConceptoInteresCorr(conceptoInteresCorr);
		suscripcionDescuento.setInteresMorAplicado(interesTotalMor);
		suscripcionDescuento.setPorcentajeInteresMor(porcentajeInteresMor);
		suscripcionDescuento.setUniConceptoInteresMor(conceptoInteresMor);
		suscripcionDescuento.setUsuIderegistro(idUsuario);
		suscripcionDescuento.setDescAplicado(false);
		suscripcionDescuento.setFechaRegistro(fechaActual);

		return suscripcionDescuento;
	}

	/**
	 * Método encargado de validar la vigencia las suscripciones, teniendo como una
	 * suscripcion vigente aquella que cuente con al menos una factura dentro de la
	 * fecha especificada en el periodo que el método recibe como parámetro
	 * 
	 * @param suscripciones
	 * @param idEmpresa
	 * @param periodo
	 * @return
	 */
	private boolean validarSucripVigentes(Long suscripcion, int idEmpresa, Timestamp perFecInicio,
			Timestamp perFecFin) {
		List<FacFactura> facturas = manejadorFacFactura.consultaFacturasPorSucripcion(suscripcion, idEmpresa,
				perFecInicio, perFecFin);

		return !facturas.isEmpty();
	}
        
        private boolean validarSucripVigentesServicio(Long suscripcion, int idEmpresa, Timestamp perFecInicio,
			Timestamp perFecFin, List<Integer> doc) {
		List<FacFactura> facturas = manejadorFacFactura.consultaFacturasPorSucripcionServicio(suscripcion, idEmpresa,
				perFecInicio, perFecFin ,doc);

		return !facturas.isEmpty();
	}

        public Map<Integer, List<TotalesDescCalidadMicroRutaDTO>> getDatosReporte() {
            return datosReporte;
        }

        public void setDatosReporte(Map<Integer, List<TotalesDescCalidadMicroRutaDTO>> datosReporte) {
            this.datosReporte = datosReporte;
        }       

        public List<TotalesDescCalidadMicroRutaDTO> getListaTotalesMicro() {
                return listaTotalesMicro;
        }

        public void setListaTotalesMicro(List<TotalesDescCalidadMicroRutaDTO> listaTotalesMicro) {
                this.listaTotalesMicro = listaTotalesMicro;
        }       
        
        public TotalesDescCalidadMicroRutaDTO getTotalesMicro() {
                return totalesMicro;
        }

        public void setTotalesMicro(TotalesDescCalidadMicroRutaDTO totalesMicro) {
                this.totalesMicro = totalesMicro;
        }        

	public Integer getIdCicloSemestral() {
		return idCicloSemestral;
	}

	public void setIdCicloSemestral(Integer idCicloSemestral) {
		this.idCicloSemestral = idCicloSemestral;
	}

	public List<Map<String, Object>> getMesAplicacionIndicador() {
		return mesAplicacionIndicador;
	}

	public void setMesAplicacionIndicador(List<Map<String, Object>> mesAplicacionIndicador) {
		this.mesAplicacionIndicador = mesAplicacionIndicador;
	}

	public List<Integer> getConceptosToneladas() {
		return conceptosToneladas;
	}

	public void setConceptosToneladas(List<Integer> conceptosToneladas) {
		this.conceptosToneladas = conceptosToneladas;
	}

	public List<Integer> getConcepTarifRecolecc() {
		return concepTarifRecolecc;
	}

	public void setConcepTarifRecolecc(List<Integer> concepTarifRecolecc) {
		this.concepTarifRecolecc = concepTarifRecolecc;
	}
        
        public void setConcepTarifRecoleccAplicada(List<Integer> concepTarifRecoleccAplicada) {
		this.conceptoTarifaRecolAplicada = concepTarifRecoleccAplicada;
	}
        
        public List<Integer> getConcepTarifRecolAplicada() {
		return conceptoTarifaRecolAplicada;
	}

	public List<Integer> getConcepTarifaCompact() {
		return concepTarifaCompact;
	}

	public void setConcepTarifaCompact(List<Integer> concepTarifaCompact) {
		this.concepTarifaCompact = concepTarifaCompact;
	}

	public List<Map<String, Object>> getConcepTarifaReclam() {
		return concepTarifaReclam;
	}

	public void setConcepTarifaReclam(List<Map<String, Object>> concepTarifaReclam) {
		this.concepTarifaReclam = concepTarifaReclam;
	}

	public List<Integer> getDocFactServicio() {
		return docFactServicio;
	}

	public void setDocFactServicio(List<Integer> docFactServicio) {
		this.docFactServicio = docFactServicio;
	}

	public Integer getNumPerInteresMorat() {
		return numPerInteresMorat;
	}

	public void setNumPerInteresMorat(Integer numPerInteresMorat) {
		this.numPerInteresMorat = numPerInteresMorat;
	}

	public Integer getConInteresCorr() {
		return conInteresCorr;
	}

	public void setConInteresCorr(Integer conInteresCorr) {
		this.conInteresCorr = conInteresCorr;
	}

	public Integer getConInteresMor() {
		return conInteresMor;
	}

	public void setConInteresMor(Integer conInteresMor) {
		this.conInteresMor = conInteresMor;
	}

	public BigDecimal getInteresTotalCorr() {
		return interesTotalCorr;
	}

	public void setInteresTotalCorr(BigDecimal interesTotalCorr) {
		this.interesTotalCorr = interesTotalCorr;
	}

	public BigDecimal getPorcentajeInteresCorr() {
		return porcentajeInteresCorr;
	}

	public void setPorcentajeInteresCorr(BigDecimal porcentajeInteresCorr) {
		this.porcentajeInteresCorr = porcentajeInteresCorr;
	}

	public Integer getConceptoInteresCorr() {
		return conceptoInteresCorr;
	}

	public void setConceptoInteresCorr(Integer conceptoInteresCorr) {
		this.conceptoInteresCorr = conceptoInteresCorr;
	}

	public BigDecimal getInteresTotalMor() {
		return interesTotalMor;
	}

	public void setInteresTotalMor(BigDecimal interesTotalMor) {
		this.interesTotalMor = interesTotalMor;
	}

	public BigDecimal getPorcentajeInteresMor() {
		return porcentajeInteresMor;
	}

	public void setPorcentajeInteresMor(BigDecimal porcentajeInteresMor) {
		this.porcentajeInteresMor = porcentajeInteresMor;
	}

	public Integer getConceptoInteresMor() {
		return conceptoInteresMor;
	}

	public void setConceptoInteresMor(Integer conceptoInteresMor) {
		this.conceptoInteresMor = conceptoInteresMor;
	}

	public Integer getIdPrgProcesoIndicadoresCalidad() {
		return idPrgProcesoIndicadoresCalidad;
	}

	public void setIdPrgProcesoIndicadoresCalidad(Integer idPrgProcesoIndicadoresCalidad) {
		this.idPrgProcesoIndicadoresCalidad = idPrgProcesoIndicadoresCalidad;
	}

	public BigDecimal getTotalDescReclamacion() {
		return totalDescReclamacion;
	}

	public void setTotalDescReclamacion(BigDecimal totalDescReclamacion) {
		this.totalDescReclamacion = totalDescReclamacion;
	}

	public BigDecimal getTotalDescReccYTransp() {
		return totalDescReccYTransp;
	}

	public void setTotalDescReccYTransp(BigDecimal totalDescReccYTransp) {
		this.totalDescReccYTransp = totalDescReccYTransp;
	}

	public BigDecimal getTotalDescCompactacion() {
		return totalDescCompactacion;
	}

	public void setTotalDescCompactacion(BigDecimal totalDescCompactacion) {
		this.totalDescCompactacion = totalDescCompactacion;
	}

	public BigDecimal getTotalInteresCorrReclamacion() {
		return totalInteresCorrReclamacion;
	}

	public void setTotalInteresCorrReclamacion(BigDecimal totalInteresCorrReclamacion) {
		this.totalInteresCorrReclamacion = totalInteresCorrReclamacion;
	}

	public BigDecimal getTotalInteresCorrReccYTransp() {
		return totalInteresCorrReccYTransp;
	}

	public void setTotalInteresCorrReccYTransp(BigDecimal totalInteresCorrReccYTransp) {
		this.totalInteresCorrReccYTransp = totalInteresCorrReccYTransp;
	}

	public BigDecimal getTotalInteresCorrCompactacion() {
		return totalInteresCorrCompactacion;
	}

	public void setTotalInteresCorrCompactacion(BigDecimal totalInteresCorrCompactacion) {
		this.totalInteresCorrCompactacion = totalInteresCorrCompactacion;
	}

	public BigDecimal getTotalInteresMorReclamacion() {
		return totalInteresMorReclamacion;
	}

	public void setTotalInteresMorReclamacion(BigDecimal totalInteresMorReclamacion) {
		this.totalInteresMorReclamacion = totalInteresMorReclamacion;
	}

	public BigDecimal getTotalInteresMorReccYTransp() {
		return totalInteresMorReccYTransp;
	}

	public void setTotalInteresMorReccYTransp(BigDecimal totalInteresMorReccYTransp) {
		this.totalInteresMorReccYTransp = totalInteresMorReccYTransp;
	}

	public BigDecimal getTotalInteresMorCompactacion() {
		return totalInteresMorCompactacion;
	}

	public void setTotalInteresMorCompactacion(BigDecimal totalInteresMorCompactacion) {
		this.totalInteresMorCompactacion = totalInteresMorCompactacion;
	}

	public Integer getUniConceptoSuscripcionReclamacion() {
		return uniConceptoSuscripcionReclamacion;
	}

	public void setUniConceptoSuscripcionReclamacion(Integer uniConceptoSuscripcionReclamacion) {
		this.uniConceptoSuscripcionReclamacion = uniConceptoSuscripcionReclamacion;
	}

	public List<Integer> getListaConceptosReclamacion() {
		return listaConceptosReclamacion;
	}

	public void setListaConceptosReclamacion(List<Integer> listaConceptosReclamacion) {
		this.listaConceptosReclamacion = listaConceptosReclamacion;
	}

}
