package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestReLiquidarDTO;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;
import java.util.ArrayList;

@Service
public class NegocioRePreliquidacion extends NegocioAbstracto<FacFactura, FacFacturaDTO> {

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioRePreliquidacion.class);
	private String dsusdetsuscrip = "";
	private String fechaDsusdetsuscrip = "";

	@Autowired
	private ManejadorHistoricos manejadorHistoricos;

	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;

	@Autowired
	private NegocioReLiquidacion negocioReLiquidacion;
	@Autowired
	private NegocioParParametro negocioParParametro;

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected FacFacturaDTO instanciarDAO() {
		return null;
	}

	private Integer programaFacturarPeriodo;
	@SuppressWarnings("deprecation")
	public void preLiquidacion(RequestReLiquidarDTO reLiquidar)
			throws IOException, NegocioException {
		Map<String, Object> parametros;
		Integer numeroHilosFacturacion;
		// datos obtenidos desde el token
		int idEmpresa;
		int idUsuario;
		int idAcceso;
		char preLiquidar;
		Date fechadesde;
		Date fechahasta;
		Integer tipoNota;
		Integer idHilo;
		String identificadorEmpresa;
		Integer idsuscripcion;
		Integer idCiclo;
                List<Integer> idCiclos;
		Integer existeTabla;
		Object[] factura;
                String pqr;
		
		idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		idAcceso = Integer.parseInt(JwtUtil.auditoriaDTO.getId());
		preLiquidar = reLiquidar.getLiquidar();
		fechadesde = Timestamp.valueOf(reLiquidar.getDesde());
		fechahasta = Timestamp.valueOf(reLiquidar.getHasta());
		tipoNota = reLiquidar.getTipnota();
		idHilo = 1;
		identificadorEmpresa = "proceso_refacturacion_" + idEmpresa;
		fechahasta.setHours(23);
		fechahasta.setMinutes(59);
                idCiclos=new ArrayList<Integer>();
                pqr = reLiquidar.getPqr();

		parametros = negocioParParametro.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		numeroHilosFacturacion = (Integer) parametros.get(ConstantesServicios.NUMERO_HILOS_FACTURACION);
		programaFacturarPeriodo = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);

		existeTabla = manejadorHistoricos.validarTablaExistente(identificadorEmpresa);

		if (existeTabla != 0) {
			validarProcesoEjecucion(identificadorEmpresa, idEmpresa, tipoNota, idUsuario);
			manejadorHistoricos.vaciarTablaProceso(identificadorEmpresa, idUsuario, tipoNota);
		}

		try {
			for (String suscripcion : reLiquidar.getSuscripciones()) {
	
				if (idHilo > numeroHilosFacturacion) {
					idHilo = 1;
				}
			
				if (tipoNota!=755 && tipoNota!=756 && tipoNota!=754) {
					idsuscripcion = Integer.parseInt(suscripcion);
					validarhistoricosuscrip(fechadesde, fechahasta, suscripcion);
					//idCiclo = buscarCiclo(idsuscripcion, dsusdetsuscrip, fechaDsusdetsuscrip);
                                        idCiclos = buscarCiclo(idsuscripcion, fechadesde, fechahasta);
				}
				else 
				{
					factura = manejadorHistoricos.getInfoFactura(suscripcion).get(0);
					idsuscripcion = Integer.parseInt (factura[0].toString()); 
					idCiclo = Integer.parseInt (factura[1].toString());                                        
                                        idCiclos.add(idCiclo);                                        
					dsusdetsuscrip = "dsus_detsuscrip_hist";
					fechaDsusdetsuscrip = " and per_ideregistro = "+ factura[2].toString() +" and dsus.fecha_modificacion <= '"+fechahasta+"'"; 
					
				}
                                for (Integer idCiclox : idCiclos) {
				iniciarProceso( idEmpresa, idCiclox, idUsuario,idsuscripcion.toString(), fechadesde, fechahasta, idHilo, tipoNota,suscripcion);
				LOGGER.error("Termino el proceso-> "+idAcceso);                                
				lanzarHilos(idAcceso, idCiclox, idEmpresa, preLiquidar, idsuscripcion.toString(), idHilo, tipoNota, pqr);
				idHilo += 1;                                
                                }
                                idCiclos.clear();
			}
			LOGGER.info("Se incio el proceso correctamente");
		} catch (NegocioException e) {
			LOGGER.info(e.getMessage());
		} catch (Exception e) {
			LOGGER.info("Error no controlado {}", e.getMessage());
		}
	}

	private Integer buscarCiclo(Integer suscripcion, String dsusdetsuscrip, String fechaDsusdetsuscrip)
			throws NegocioException {
		Integer idCiclo;
		try {
			idCiclo = manejadorHistoricos.buscarIdCiclo(suscripcion, dsusdetsuscrip, fechaDsusdetsuscrip);
			return idCiclo;
		} catch (Exception e) {
			throw new NegocioException("Error al  buscar el ciclo de la suscripcion " + suscripcion);
		}
	}
        
        
        	private List<Integer> buscarCiclo(Integer suscripcion,Date fechaDesde ,Date fechaHasta )
			throws NegocioException {
		List<Integer> idCiclos;
		try {
			idCiclos = manejadorHistoricos.buscarIdCiclo(suscripcion, fechaDesde ,fechaHasta);
			return idCiclos;
		} catch (Exception e) {
			throw new NegocioException("Error al  buscar el ciclo de la suscripcion " + suscripcion);
		}
	}

	public void iniciarProceso( Integer idEmpresa, Integer idCiclo, Integer idUsuario,
			 String suscripcion, Date fechadesde, Date fechahasta, Integer idHilo,
			Integer tipoNota, String idFactura)  {
		String identificadorEmpresa;
		Integer existeTabla;

		identificadorEmpresa = "proceso_refacturacion_" + idEmpresa;

		manejadorCprCtrprocesoRespository.vaciarDetalleNovedadTMP(idEmpresa, idUsuario, tipoNota);
		manejadorCprCtrprocesoRespository.vaciarNovedadTMP(idEmpresa, idUsuario, tipoNota);

		existeTabla = manejadorHistoricos.validarTablaExistente(identificadorEmpresa);
		if (existeTabla == 0) { // si no existe la tabla se crea la tabla temporal
                        
                        manejadorHistoricos.cargarSuscripciones(idCiclo, idEmpresa, idUsuario, idHilo, identificadorEmpresa,
                            suscripcion, fechadesde, fechahasta, dsusdetsuscrip, fechaDsusdetsuscrip, tipoNota);                        
			
		} else {
			try {
                            if (suscripcion.equalsIgnoreCase(idFactura)){
                                manejadorHistoricos.insertarSuscripciones(idCiclo, idEmpresa, idUsuario, idHilo, identificadorEmpresa,
					suscripcion, fechadesde, fechahasta, dsusdetsuscrip, fechaDsusdetsuscrip, tipoNota);
                            }else{
                                manejadorHistoricos.insertarSuscripcionesFactura(idEmpresa, idUsuario, idHilo, identificadorEmpresa,
					suscripcion,tipoNota, idFactura);
                            }			
			}catch(Exception e) {
				LOGGER.error("TIPO-ERROR-> "+e);
			}
		}

	}

	private void validarhistoricosuscrip(Date fechadesde, Date fechahasta, String suscripcion) {
		List<Object[]> respuesta = null;

		respuesta = manejadorHistoricos.historicoDsusDetsuscrip(fechadesde, fechahasta, suscripcion);

		if (respuesta.isEmpty()) {
                        
                    respuesta = manejadorHistoricos.historicoDsusDetsuscrip(fechahasta, suscripcion);
                        
                        if (respuesta.isEmpty()) {
                            fechaDsusdetsuscrip = "";
                            dsusdetsuscrip = "dsus_detsuscrip";
                        } else {

			fechaDsusdetsuscrip = "and dsus_hist_idregistr = " + respuesta.get(0)[0] + "";
			dsusdetsuscrip = respuesta.get(0)[1].toString();
		}
                        
			
		} else {

			fechaDsusdetsuscrip = "and dsus_hist_idregistr = " + respuesta.get(0)[0] + "";
			dsusdetsuscrip = respuesta.get(0)[1].toString();
		}

	}

	public void lanzarHilos(Integer idAcceso, Integer idCiclo, Integer idEmpresa, char preLiquidar, String suscripcion,
			Integer idHilo, Integer tipoNnota, String pqr)  {
		negocioReLiquidacion.inicializarData(idAcceso, idCiclo, idEmpresa, preLiquidar, suscripcion, idHilo, tipoNnota, pqr );

	}

	public void validarProcesoEjecucion(String identificadorEmpresa, Integer idEmpresa, Integer tipoNnota,
			int idUsuario) throws NegocioException {
		Object[] procesos = null;
		BigInteger cantidad;

		procesos = manejadorHistoricos.getProcesoEjecucion(identificadorEmpresa, tipoNnota, idEmpresa, //programaFacturarPeriodo
				tipoNnota, idUsuario);

		if (procesos != null) {
			cantidad = new BigInteger(procesos[3].toString());

			if (cantidad != BigInteger.ZERO) {
				throw new NegocioException("Hay un proceso en ejecución para el mismo tipo de nota, usuario y empresa",
						4);
			}

		}

	}

}
