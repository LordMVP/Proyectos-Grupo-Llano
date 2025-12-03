package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.CredentialsDTO;
import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.aforos.entity.dto.TipoAforosFrecuenciasDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;
import com.bioagricola.homologaciones.repository.TafoTipoAforoRepository;

@Service
public class UniUnidadAforosServiceImpl {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UniUnidadAforosServiceImpl.class);
	 
	
	@Autowired
	private com.bioagricola.common.repository.UniUnidadRepository uniUnidadRepository;
	
	@Autowired
	private TafoTipoAforoRepository tafoRepository;
	
	@Autowired
	private AuthenticationFacade authenticationFacade;
	@Autowired
    private ParParametroService _parParametroService;
	
	public UniUnidad getById(Long id) {
		if(id==null) 
			return null;
		return uniUnidadRepository.findById(id).orElse(null);
	}
	
	public List<StaticContentResponseDTO<String>> getTiposAforos(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		 return this.getFromUnidades(hya_parametros.getLong("clase_tipoaforo"));
	}
	
	public List<TipoAforosFrecuenciasDTO> getTiposAforosAndFrecuencias(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		List<Object []> resultado = this.getFromUnidadesObjects(hya_parametros.getLong("clase_tipoaforo"));
		return this.getListaTiposAforosAndFrecuencias(resultado);
	}
	
	public List<StaticContentResponseDTO<String>> getTiposGeneradores(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		return this.getFromUnidades(hya_parametros.getLong("clase_tipo_generador"));
	}
	
	public List<StaticContentResponseDTO<String>> getTiposAdjuntos(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		return this.getFromUnidades(hya_parametros.getLong("clase_tipo_adjunto"));
	}
	
	public List<StaticContentResponseDTO<String>> getConceptosAforos(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		return this.getFromUnidades(hya_parametros.getLong("clase_concepto_aforo"));
	}
	
	public List<StaticContentResponseDTO<String>> getTipoDistribucion(){
		LOGGER.warn("generando StaticContentResponseDTO artificial para  tipo de distribución, se debe generar desde la base de datos");		
		List<StaticContentResponseDTO<String>> rtaTemporal = new ArrayList<>();
		
		rtaTemporal.add(new StaticContentResponseDTO<String>(99L,"hardCode Eliminar"));
		rtaTemporal.add(new StaticContentResponseDTO<String>(2L,"simple"));
		rtaTemporal.add(new StaticContentResponseDTO<String>(4L,"distribuido"));
		return rtaTemporal;
		//return this.converToFinalDTO(uniUnidadRepository.findUbicaciones(ParametrosAforos.EST_TIPO_UBICACION_VIVIENDA_BIO));
	}
	
	public List<StaticContentResponseDTO<String>> getTiposUsos(){
		List<UniUnidad> unidades = uniUnidadRepository.findTiposUsos();
		return this.converToFinalDTO(unidades);		
	}
	
	public List<StaticContentResponseDTO<String>> getUbicaciones(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		return this.converToFinalDTO(uniUnidadRepository.findUbicaciones(hya_parametros.getLong("est_tipo_ubi_viv_bio")));
	}
	
	public List<StaticContentResponseDTO<String>> getAllActividades(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		return this.converToFinalDTO(uniUnidadRepository.findActividades(hya_parametros.getLong("est_actividad")));
	}
	
	
	
	private List<StaticContentResponseDTO<String>> getFromUnidades(Long clase){
		CredentialsDTO c = authenticationFacade.getCredentials();
		List<UniUnidad> unidades = uniUnidadRepository.findByEmpresaAndClase(c.getEstempresa(), clase);
		return converToFinalDTO(unidades).stream().distinct().collect(Collectors.toList());
	}
	
	private List<StaticContentResponseDTO<String>> converToFinalDTO(List<UniUnidad> unidades){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		unidades.stream().forEach(u->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(u.getUniNombre1());
											 item.setId(u.getUniIderegistro());
			response.add(item);
		});
		return response.stream().distinct().collect(Collectors.toList());
	}
	
	public List<StaticContentResponseDTO<String>> getClaseSusAforos(){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		 return this.getFromUnidades(hya_parametros.getLong("clase_suscripcion"));
	}
	
	public List<Object []> getFromUnidadesObjects (Long clase) {
		CredentialsDTO c = authenticationFacade.getCredentials();
		List<Object []> listaTipo =  uniUnidadRepository.findTipoAforosAndFrecuenciasByClase(c.getEstempresa(), clase);
		return listaTipo;
	}
	
	
	public List<TipoAforosFrecuenciasDTO> getListaTiposAforosAndFrecuencias(List<Object []> lista){
		List<TipoAforosFrecuenciasDTO> resultado = lista.stream()
				.map(l -> {
					TipoAforosFrecuenciasDTO tipo = TipoAforosFrecuenciasDTO.builder().build();
					Optional<TafoTipoAforo> tipoAforo = tafoRepository.findById(Long.parseLong(((Integer) l[0]).toString()));
					if(tipoAforo.isPresent()) {
						tipo.setObject("ORDINARIO-C");
						tipo.setId(tipoAforo.get().getTafoIderegistro());
						tipo.setTipoAforos(tipoAforo.get());
						tipo.setFrecuencia((Integer) l[9]);
						tipo.setCantidad((Integer) l[10]);
						tipo.setTfdIderegistro((Integer) l[11]);
						tipo.setTfdDescripcion((String) l[12]);
						tipo.setTfvIderegistro((Integer) l[13]);
						tipo.setDiasSemana((String) l[14]);	
						return tipo;
					}else {
						return null;
					}
				})
				.filter(Objects::nonNull)
				.collect(Collectors.toList());
		return resultado;
	}
}
