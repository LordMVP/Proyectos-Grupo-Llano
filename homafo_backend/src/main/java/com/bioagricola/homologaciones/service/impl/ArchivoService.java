package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.dto.ArchivoPdfRequest;
import com.bioagricola.homologaciones.dto.ArchivoResponse;
import com.bioagricola.homologaciones.repository.DgactDetagestionActualizacionRepository;
import com.bioagricola.homologaciones.repository.HomologacionRepository;
import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.RespuestaDTO;

@Service
public class ArchivoService
{
	Logger logger= LoggerFactory.getLogger(ArchivoService.class);
	@Autowired
	private DgactDetagestionActualizacionRepository dgactRepository;
	
	@Autowired
	private HomologacionRepository homoRepository;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	public static ConvertGeneral convert=new ConvertGeneral();
	//public static Integer EMPRESA=317;
	private List<Object[]> parametros=new ArrayList<Object[]>();
	
	//public static String URL_SERVICE_AZ="http://190.14.232.146:8081";
	
	public ArchivoService()
	{
	}
	
	public ArchivoResponse cargarArchivo(MultipartFile file, String token)
	{
		//com.gell.estandar.dto.RespuestaDTO<ArchivoDTO> rtaArchivo=new RespuestaDTO<ArchivoDTO>();
		ArchivoResponse response=new ArchivoResponse();
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		try
		{
			parametros=homoRepository.parametroValor(empresa);
			//ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.VEPOS,token,URL_SERVICE_AZ);
			ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.HOMAFO,token,convert.extraerValorParametro(homoRepository.parametroValor(empresa),"url_service_az").replace("\"", ""));
			com.gell.estandar.dto.RespuestaDTO<ArchivoDTO> rtaArchivo=cliArchivo.adjuntar(file);
			//int idDocAZ=Integer.parseInt(rtaArchivo.getDatos().getId());
			String resultado=rtaArchivo.getDatos().getId();
			String nombreArchivo=rtaArchivo.getDatos().getNombreOriginal();			
			if(resultado.length()>0)
			{
				System.err.println("bien "+ resultado + "Nombre "+nombreArchivo);
				response.setError(false);
				response.setStatusCode(200);
				response.setStatusText("cargado Exitosamente...");
				response.setNombre(nombreArchivo);
				response.setIdAz(resultado);
				response.setTipo(rtaArchivo.getDatos().getTipo());
			}
			else
			{
				response.setError(true);
				response.setStatusCode(500);
				response.setStatusText("Error, no se encontro nada...");
				response.setNombre(null);
				response.setIdAz(null);
				response.setTipo(null);
			}
			return response;
			
		}catch (Exception e) {
			System.err.println("Error al adjuntar service..." +e.getMessage());
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error, no se encontro nada...");
			response.setNombre(null);
			response.setIdAz(null);
			response.setTipo(null);
			return response;
		}
	}
	
	public RespuestaDTO verArchivo(String idArchivo, String token)
	{
		com.gell.estandar.dto.RespuestaDTO<ArchivoDTO> rtaArchivo=new RespuestaDTO<ArchivoDTO>();
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		parametros=homoRepository.parametroValor(empresa);
		try
		{
			ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.HOMAFO,token,convert.extraerValorParametro(homoRepository.parametroValor(empresa),"url_service_az").replace("\"", ""));
			//ClienteArchivo cliArchivo= new ClienteArchivo(EAplicacion.VEPOS,token,URL_SERVICE_AZ);
			rtaArchivo=cliArchivo.consultar(idArchivo);
			//logger.error(rtaArchivo.getDatos().getTipo()+" "+rtaArchivo.getDatos().getContenido());
			//System.err.println("que informacion trae "+rtaArchivo.getDatos().getContenido());
			
		}catch (Exception e) {
			System.err.println("error al leer la imagen "+e.getMessage());
			return null;
		}
		return rtaArchivo;
	}
	
	public String generarPdf(ArchivoPdfRequest request)
	{
		try
		{
			String resultado="";
			ConvertGeneral convertir=new ConvertGeneral();
			List<String> busqueda=dgactRepository.buscarArchivos(request.getGactIderegistro().longValue());
			List<String> base64=new ArrayList<String>();
			if(busqueda.size()>0)
			{
				for(String tmp:busqueda)
				{
					com.gell.estandar.dto.RespuestaDTO<ArchivoDTO> rta=new RespuestaDTO<ArchivoDTO>();
					rta=verArchivo(tmp,request.getToken());
					base64.add(rta.getDatos().getContenido());
				}
				resultado=convertir.convertImagesToPdf(base64);
				logger.error("RESULTADO: "+resultado);
			}
			else
			{
				resultado="-1";
			}
			return resultado;
		}catch (Exception e) {
			return "";
		}
		
	}

}
