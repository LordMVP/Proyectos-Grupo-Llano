package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bioagricola.aforos.entity.AdjuntoVisita;
import com.bioagricola.aforos.entity.DetalleMaestroVisita;
import com.bioagricola.aforos.entity.dto.VisitaAforoAdjuntoDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.repository.AdjuntoVisitaRepository;
import com.bioagricola.aforos.repository.DetalleMaestroVisitaRepository;
import com.bioagricola.common.constant.ParametrosAforos;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.exception.BusinessException;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.repository.HomologacionRepository;
import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.google.gson.Gson;

@Service
public class VisitasAforosAdjuntosServiceImpl {

	private static final Logger LOGGER = LoggerFactory.getLogger(VisitasAforosAdjuntosServiceImpl.class);
	@Autowired
	private AdjuntoVisitaRepository adjuntoVisitaRepository;
	@Autowired
	private DetalleMaestroVisitaRepository detalleMaestroVisitaRepository;
	@Autowired
	private AuthenticationFacade authenticationFacade;
	@Autowired
	private HomologacionRepository homoRepository;
	
	Logger log = LoggerFactory.getLogger(this.getClass());

	public static ConvertGeneral convert=new ConvertGeneral();
	
	@Value("${url.az}")
    private String URL_SERVICE_AZ;

	@Transactional
	public List<VisitaAforoAdjuntoDTO> cargarArchivos(List<MultipartFile> files, String token, VisitaAforoAdjuntoDTO vaaDTO)
	{
		Integer empresa=authenticationFacade.getCredentials().getAuditoria().getIdEmpresa();

		DetalleMaestroVisita d= detalleMaestroVisitaRepository.findById(vaaDTO.getIdDetalle()).get();
		List<VisitaAforoAdjuntoDTO> list = new ArrayList<>();

			VisitaAforoAdjuntoDTO response=new VisitaAforoAdjuntoDTO();
			//ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.VEPOS,token,ParametrosAforos.URL_SERVICIO_AZ);
			ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.HOMAFO,token,convert.extraerValorParametro(homoRepository.parametroValor(empresa),"url_service_az").replace("\"", ""));
			files.stream().forEach(archivo ->{
				AdjuntoVisita a = new AdjuntoVisita();
				try
				{
						com.gell.estandar.dto.RespuestaDTO<ArchivoDTO> rtaArchivo=cliArchivo.adjuntar(archivo);
						String resultado=rtaArchivo.getDatos().getId();
						String nombreArchivo=rtaArchivo.getDatos().getNombreOriginal();
						if(resultado.length()>0)
						{
							response.setNombre(nombreArchivo);
							response.setIdAz(resultado);
							response.setTipo(rtaArchivo.getDatos().getTipo());

							response.setIdDetalle(vaaDTO.getIdDetalle());
							response.setObservaciones(vaaDTO.getObservaciones());
							response.setUniTipoAdjunto(vaaDTO.getUniTipoAdjunto());

							a.setAdvaFecha(new Date());
							a.setAdvaIdfererenciaazdigital(rtaArchivo.getDatos().getId());
							a.setAdvaObservaciones(vaaDTO.getObservaciones());
							a.setDmafIderegistro(d.getDmafIderegistro().intValue());
							a.setEmpIderegistro(authenticationFacade.getCredentials().getEstempresa().intValue());
							a.setMafvIderegistro(d.getMaestroAforoVista().getMafvIderegistro().intValue());
							a.setTerAforador(d.getTerAforador().getTerIderegistro().intValue());
							a.setUniTipoadjunto(vaaDTO.getUniTipoAdjunto().intValue());
							a.setUsuIderegistro(authenticationFacade.getCredentials().getUsuprgunid().intValue());
							a.setAdvaNombre(archivo.getOriginalFilename());//Usar nombreArchivo
							a.setAdvaTamanio(String.valueOf(archivo.getSize()));
							a.setAdvaTipoarchivo(archivo.getOriginalFilename().split("\\.")[1]);


							adjuntoVisitaRepository.save(a);
						}
						list.add(response);
				}catch (Exception e) {
					e.printStackTrace();
					throw new BusinessException("No se ha podido completar la carga del archivo");
				}
			});

			LOGGER.info(String.format("Tamaño lista multipart %d", files.size()));

			return list;
	}

	//@SuppressWarnings("rawtypes")
	public List<RespuestaDTO> verArchivo(Long idDetalle, String token){
		List<AdjuntoVisita> adjuntos = adjuntoVisitaRepository.getAdjuntosByDetalle(idDetalle);

		List<RespuestaDTO> respuesta = new ArrayList<>();
		adjuntos.stream().forEach(a-> {
			com.gell.estandar.dto.RespuestaDTO<ArchivoDTO> rtaArchivo=new RespuestaDTO<ArchivoDTO>();
			try
			{
				ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.HOMAFO,token,ParametrosAforos.URL_SERVICIO_AZ);
				rtaArchivo=cliArchivo.consultar(a.getAdvaIdfererenciaazdigital());

			}catch (Exception e) {
				throw new BusinessException("Error al leer la imagen");
			}
			respuesta.add(rtaArchivo);
		});
		return respuesta;
	}

	public String buscarObservaciones(Long idDetalle, String token)
	{
		List<AdjuntoVisita> adjuntos = adjuntoVisitaRepository.getAdjuntosByDetalle(idDetalle);
		List<HashMap<String, String>> total=new ArrayList<>();
    	for(AdjuntoVisita tmp2: adjuntos)
    	{
    		HashMap<String, String> tmp1=new HashMap<>();
    		tmp1.put("id", tmp2.getAdvaIdfererenciaazdigital());
    		tmp1.put("observaciones", tmp2.getAdvaObservaciones());
    		total.add(tmp1);
    	}
    		return new Gson().toJson(total);

	}
}
