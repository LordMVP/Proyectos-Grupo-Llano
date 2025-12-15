package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.ColiConliquidaAproDTO;
import com.bioagricola.apirest.modelo.dtos.ConConceptoDTO;
import com.bioagricola.apirest.modelo.dtos.LiquidacionesConceptoDTO;
import com.bioagricola.apirest.modelo.entidades.ColiConliquidaApro;
import com.bioagricola.apirest.modelo.entidades.ConConcepto;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@Service
public class NegocioParametrizacionLiquidacion extends NegocioAbstracto<ColiConliquidaApro, ColiConliquidaAproDTO> {

    @Autowired
    private NegocioParParametro negocioParParametro;
	@Autowired
	private ManejadorLiqLiquidacion manejadorLiqLiquidacion;
	@Autowired
	private NegocioTerTercero negocioTerTercero;
	@Autowired
	private ManejadorProyectos manejadorProyectos;
	@Autowired
	private ManejadorColiConliquidaApro manejadorColiConliquidaAprovechamiento;
	@Autowired
	private ManejadorConConcepto manejadorConConcepto;
	@Autowired
	private ManejadorPrunPrgunidad manejadorPrunPrgunidad;

	private static final Logger logger = Logger.getLogger(NegocioParametrizacionLiquidacion.class.getName());

	/**
	 * Metodo para consultar liquidaciones
	 * @return List<LiquidacionesConceptoDTO>
	 * @throws IOException
	 * @throws InvalidParameterException
	 */
	public List<LiquidacionesConceptoDTO> consultaParametrosLiquidaciones()
			throws IOException {
        
    	List<String> clasificaciones = getClasificacionesLiquidacion();
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        
    	List<LiquidacionesConceptoDTO> liquidaciones = new ArrayList<>();
    	List<Object[]> result = manejadorLiqLiquidacion.getLiquidacionParamLiq(clasificaciones, idEmpresa );
    	
    	for (Object[] objeto : result ) {
    		LiquidacionesConceptoDTO liquidacionesDTO = new LiquidacionesConceptoDTO();
    		liquidacionesDTO.setUniLiquidacion((Integer)objeto[0]);
    		liquidacionesDTO.setLiqNombre((String) objeto[1]);
    		liquidacionesDTO.setUniDocumento((Integer)objeto[2]);
    		liquidacionesDTO.setDocNombre((String) objeto[3]);
    		liquidacionesDTO.setUniTipdocument((Integer)objeto[4]);
    		liquidacionesDTO.setTidoNombre((String)objeto[5]);
    		liquidacionesDTO.setUniConcepto((Integer) objeto[6]);
    		liquidacionesDTO.setConNombre((String) objeto[7]);

    		liquidaciones.add(liquidacionesDTO);
    	}

    	
        return liquidaciones;
 
    }
	
	/**
	 * Metodo para consultar terceros aprovechadores
	 * @return List<Object>
	 * @throws IOException
	 */
	public List<Object> consultaParametrosTercero(Long terIderegistro)
			throws IOException {
        
		List<Integer> municipios = getMunicipiosTA(terIderegistro);
    	Integer municipio = municipios.get(1);
    	return manejadorProyectos.getMunicipios(municipio);
 
    }
	
	/**
	 * Metodo para guardar y actualizar conceptos parametrizados de liquidacion de aprovechamiento
	 * @param coliConliquidaAprovechamientoDTO
	 * @return Boolean
	 */
    public Boolean insertarConceptosParam(ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO) {
    		ColiConliquidaApro coliConliquidaAprovechamiento = new ColiConliquidaApro();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
    			
		if (Objects.isNull(coliConliquidaAprovechamientoDTO.getColiAprovIderegistro())) {
			if (Objects.isNull(existeConfiguracion(coliConliquidaAprovechamientoDTO))) {
    			Integer terIdRegistro = coliConliquidaAprovechamientoDTO.getTerIderegistro();
    	        copiarPropiedades(coliConliquidaAprovechamiento, coliConliquidaAprovechamientoDTO);
    	        coliConliquidaAprovechamiento.setUsuIderegistro(idUsuario);
    	        coliConliquidaAprovechamiento.setFechaCreacion(new Date());
    	        coliConliquidaAprovechamiento.setTerIderegistro(terIdRegistro);
			} else {
				return false;
			}

		} else {
			Optional<ColiConliquidaApro> result = manejadorColiConliquidaAprovechamiento
					.findById(coliConliquidaAprovechamientoDTO.getColiAprovIderegistro());
			coliConliquidaAprovechamiento = result.isPresent() ? result.get() : new ColiConliquidaApro();
			if (coliConliquidaAprovechamientoDTO.getColiEstado().equalsIgnoreCase("I")) {
				coliConliquidaAprovechamiento.setColiEstado(coliConliquidaAprovechamientoDTO.getColiEstado());

			} else {
				if (!coliConliquidaAprovechamientoDTO.getUniLiquidacion().equals(coliConliquidaAprovechamiento
						.getUniLiquidacion())
						|| !coliConliquidaAprovechamientoDTO.getUniConcepto().equals(coliConliquidaAprovechamiento
								.getUniConcepto())) {
					if (Objects.isNull(existeConfiguracion(coliConliquidaAprovechamientoDTO))) {
						updateConfig(coliConliquidaAprovechamientoDTO, coliConliquidaAprovechamiento, idUsuario);

					} else {
						return false;
					}
				} else {
					updateConfig(coliConliquidaAprovechamientoDTO, coliConliquidaAprovechamiento, idUsuario);
				}
    		}
		}
		try {
    		manejadorColiConliquidaAprovechamiento.save(coliConliquidaAprovechamiento);
		} catch (Exception e) {
    	return false;
		}
		return true;

	}

	private void updateConfig(ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO,
			ColiConliquidaApro coliConliquidaAprovechamiento, int idUsuario) {
		coliConliquidaAprovechamiento.setUniLiquidacion(coliConliquidaAprovechamientoDTO.getUniLiquidacion());
		coliConliquidaAprovechamiento.setUniDocumento(coliConliquidaAprovechamientoDTO.getUniDocumento());
		coliConliquidaAprovechamiento.setUniTipdocument(coliConliquidaAprovechamientoDTO.getUniTipdocument());
		coliConliquidaAprovechamiento.setUniConcepto(coliConliquidaAprovechamientoDTO.getUniConcepto());
		coliConliquidaAprovechamiento.setUsuIderegistro(idUsuario);
		coliConliquidaAprovechamiento.setTerIderegistro(coliConliquidaAprovechamientoDTO.getTerIderegistro());
		coliConliquidaAprovechamiento.setUniPorcentaje(coliConliquidaAprovechamientoDTO.getUniPorcentaje());
		coliConliquidaAprovechamiento.setColiEstado(coliConliquidaAprovechamientoDTO.getColiEstado());
		coliConliquidaAprovechamiento.setProyectoLlacom(coliConliquidaAprovechamientoDTO.getProyectoLlacom());
	}

	private ColiConliquidaApro existeConfiguracion(ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO) {
		ColiConliquidaApro existParam = manejadorColiConliquidaAprovechamiento.getParamConcepLiqui(
    			coliConliquidaAprovechamientoDTO.getUniLiquidacion(),
    			coliConliquidaAprovechamientoDTO.getUniConcepto(), coliConliquidaAprovechamientoDTO.getColiEstado());
		return existParam;
    }
	
	/**
	 * Metodo para consultar clasificaciones de liquidacion
	 * @return List<String>
	 * @throws IOException
	 */
	private List<String> getClasificacionesLiquidacion() throws IOException {
        Map<String, Object> parametros = negocioParParametro.consultaParametrosAprovechamiento();
        List<String> clasificaciones = (List<String>) parametros.get(ConstantesServicios.CLASIFICACION_LIQUIDACION);
        return clasificaciones;
    }
	
	/**
	 * Metodo para consultar municipios asociados a proyectos
	 * @return List<Integer>
	 * @throws IOException
	 */
	private List<Integer> getMunicipiosTA(Long terIderegistro) throws IOException {
		Map<Integer, Object> parametros = negocioTerTercero.consultaParametrosTerceroAprovechador(terIderegistro);
		List<Integer> municipios = (List<Integer>) parametros.get(ConstantesServicios.INFO_TERCEROAPROVECHADOR);
		
		return municipios;
		
	}
	
    /**
     * Metodo para consultar conceptos aprovechamiento e incentivo aprovechamiento
     * @param concepto
     * @return Map<String, Object>
     * @throws IOException
     */
    private Map<String, Object> consultaParametrosConcepto(ConConcepto concepto)
    		throws IOException {
    	Map<String, Object> consulta = this.consultaParametrosConcepto(ConstantesServicios.CON_CONPROPIEDAD,concepto );
    	return consulta;
    }
    

	/**
	 * Metodo para consultar valor del parametro con_propiedad
	 * @param parametroAConsultar
	 * @param concepto
	 * @return Map<String, Object>
	 * @throws IOException
	 */
    private Map<String, Object> consultaParametrosConcepto(String parametroAConsultar,ConConcepto concepto )
    		throws IOException {
		
		Map<String, Object> parametros = new HashMap<>();
				parametros = new ObjectMapper().readValue(concepto.getConPropiedad() , HashMap.class);
				parametros.get(parametroAConsultar);

		
		
		return parametros;
	}
	
	/**
	 * Metodo para consultar los conceptos de aprovechamiento
	 * @return List<ConConceptoDTO>
     * @throws IOException
	 */
	public List<ConConceptoDTO> consultarConceptosAprov(Integer uniLiquidacion) throws IOException {
		List<ConConcepto> result = manejadorConConcepto.consultaConceptosAprov(uniLiquidacion);
		List<ConConceptoDTO> conceptosAprov = new ArrayList<>();
		
		if(result != null && !result.isEmpty()) {
			for(ConConcepto concepto: result) {
				ConConceptoDTO conceptoDTO = new ConConceptoDTO();
				Map<String, Object> parametros = new HashMap<>();

				parametros= this.consultaParametrosConcepto(concepto);
				boolean aprovechamiento = parametros.get("aprovechamiento") != null ? (boolean) parametros.get("aprovechamiento") : false;
				boolean incentivoAprovechamiento = parametros.get("incentivo_aprovechamiento") != null ? (boolean) parametros.get("incentivo_aprovechamiento") : false;

				copiarPropiedades(conceptoDTO, concepto);
				conceptoDTO.setAprovechamiento(aprovechamiento);
				conceptoDTO.setIncentivoAprovechamiento(incentivoAprovechamiento);
				conceptosAprov.add(conceptoDTO);
			}
		}
		
		return conceptosAprov;
		
	}
	

	/**
	 * Metodo para obtener la lista de conceptos de liquidacion parametrizados en el sistema
	 * @param search
	 * @param pageable
	 * @return Page<ColiConliquidaAproDTO>
	 */
	public Page<ColiConliquidaAproDTO> listarConceptosParametrizados(String search,String apro, Pageable page) {
		List<ColiConliquidaAproDTO> conceptosLiquidacion = new ArrayList<>();
		if(Objects.equals(apro, "1")){
			Optional<Page<Object>> result = manejadorColiConliquidaAprovechamiento.getConceptosLiquidacionAprov(search, ConstantesServicios.COLI_APROV_ESTADO, page);
			if(result.isPresent() && !result.get().getContent().isEmpty()) {

				for(Object it: result.get()) {
					Object[] out = (Object[]) it;
					ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO = new ColiConliquidaAproDTO();
					coliConliquidaAprovechamientoDTO.setColiAprovIderegistro((Integer) out[0]);
					coliConliquidaAprovechamientoDTO.setUniConcepto((Integer) out[3]);
					coliConliquidaAprovechamientoDTO.setConNombre((String) out[4]);
					coliConliquidaAprovechamientoDTO.setUniLiquidacion((Integer) out[5]);
					coliConliquidaAprovechamientoDTO.setLiqNombre((String) out[6]);
					coliConliquidaAprovechamientoDTO.setUniDocumento((Integer) out[7]);
					coliConliquidaAprovechamientoDTO.setDocNombre((String) out[8]);
					coliConliquidaAprovechamientoDTO.setUniTipdocument((Integer) out[9]);
					coliConliquidaAprovechamientoDTO.setTidoNombre((String) out[10]);
					coliConliquidaAprovechamientoDTO.setUniPorcentaje((BigDecimal) out[11]);
					coliConliquidaAprovechamientoDTO.setFechaCreacion((Date) out[12]);

					conceptosLiquidacion.add(coliConliquidaAprovechamientoDTO);
				}

			}
			return new PageImpl<>(conceptosLiquidacion, page, result.get().getTotalElements() );

		} else{
			Optional<Page<Object>> result = manejadorColiConliquidaAprovechamiento.getConceptosLiquidacionIAprov(search, ConstantesServicios.COLI_APROV_ESTADO, page);
			if(result.isPresent() && !result.get().getContent().isEmpty()) {

				for(Object it: result.get()) {
				Object[] out = (Object[]) it;
				ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO = new ColiConliquidaAproDTO();
				coliConliquidaAprovechamientoDTO.setColiAprovIderegistro((Integer) out[0]);
				coliConliquidaAprovechamientoDTO.setTerIderegistro((Integer) out[1]);
				coliConliquidaAprovechamientoDTO.setTerNomcompleto((String) out[2]);
				coliConliquidaAprovechamientoDTO.setUniConcepto((Integer) out[3]);
				coliConliquidaAprovechamientoDTO.setConNombre((String) out[4]);
				coliConliquidaAprovechamientoDTO.setUniLiquidacion((Integer) out[5]);
				coliConliquidaAprovechamientoDTO.setLiqNombre((String) out[6]);
				coliConliquidaAprovechamientoDTO.setUniDocumento((Integer) out[7]);
				coliConliquidaAprovechamientoDTO.setDocNombre((String) out[8]);
				coliConliquidaAprovechamientoDTO.setUniTipdocument((Integer) out[9]);
				coliConliquidaAprovechamientoDTO.setTidoNombre((String) out[10]);
				coliConliquidaAprovechamientoDTO.setUniPorcentaje((BigDecimal) out[11]);
				coliConliquidaAprovechamientoDTO.setFechaCreacion((Date) out[12]);
				coliConliquidaAprovechamientoDTO.setMunicipio((String) out[13]);
				coliConliquidaAprovechamientoDTO.setProyectoLlacom((String) out[14]);

				conceptosLiquidacion.add(coliConliquidaAprovechamientoDTO);
			}
			
		}
			return new PageImpl<>(conceptosLiquidacion, page, result.get().getTotalElements() );

		}


		
	}
	
	/**
	 * Metodo para consultar permisos
	 * @param idPrograma
	 * @return boolean
	 * @throws IOException
	 */
	public boolean consultaPrivilegios(Integer idPrograma) throws IOException {
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		
		Map<String, Object> consultaParametro = negocioParParametro.consultaParametros(idEmpresa,
				ConstantesServicios.UNIDAD_APROVECHAMIENTO);
		Integer idUnidadPc = (Integer)(consultaParametro.get(ConstantesServicios.PERMISOS_PARAMETRIZACION));
		
		Integer permisos = manejadorPrunPrgunidad.consultaPermisos(idEmpresa, idPrograma, idUsuario, idUnidadPc);
		if (permisos > 0) {
			return true;
		}		
		return false;
		
	}



	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		// TODO Auto-generated method stub
		return ColiConliquidaApro.contieneAtributo(nombreAtributo);
	}

	@Override
	protected Logger getLogger() {
		// TODO Auto-generated method stub
		return logger;
	}

	@Override
	protected ColiConliquidaAproDTO instanciarDAO() {
		// TODO Auto-generated method stub
		return new ColiConliquidaAproDTO();
	}
}
