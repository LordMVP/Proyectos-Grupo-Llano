package com.bioagricola.homologaciones.controller;

import java.sql.SQLException;
import java.util.Base64;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.dto.CartasRequest;
import com.bioagricola.homologaciones.dto.ReporteResponse;
import com.bioagricola.homologaciones.service.impl.ReporteService;

//import net.sf.jasperreports.engine.JRException;



@RestController
@RequestMapping(path = "homologacion/reportes")
public class ReportesController
{
	
	@Autowired
	private ReporteService service;
	
	@RequestMapping(value = "/generarCartas", method = RequestMethod.POST)
	public ReporteResponse generarPdf(@RequestBody CartasRequest request)
	{
		ReporteResponse respuesta=new ReporteResponse();
		try
		{
				ConvertGeneral general=new ConvertGeneral();
				byte[] resultado=null;
				String base64="";
				String condiciones=" ";
				String nombreReporte="";
				HashMap map = new HashMap();
				if(request.getPcodigo().length()>0)
				{
					condiciones=condiciones+" AND dsus.dsus_pcodigo='"+request.getPcodigo()+"'";
				}
				if(request.getCiclo()>0)
				{
					condiciones=condiciones+" AND cic.cic_ideregistro="+request.getCiclo();
				}
				switch (request.getTipo()) {
				  case 1:
				    nombreReporte="carta_facturacion.jasper";
				    break;
				  case 2:
					nombreReporte="carta_facturacion_conjunta.jasper";
				    break;
				  case 3:
					  nombreReporte="carta_facturacion_conjunta_otros.jasper";
				    break;
				  default:
					  nombreReporte="";
				}
				//map.put("PR_DATE_FECHA1", general.convertirStringFechas(request.getFecha1()));
				map.put("PR_STR_FECHA1", request.getFecha1());
				map.put("PR_STR_FECHA2", request.getFecha2());
				map.put("PR_STR_CONDICIONES",condiciones );
				map.put("PR_INT_EMPRESA",request.getEmpresa());
				resultado=service.exportPdfFile(map,nombreReporte);
				base64=Base64.getEncoder().encodeToString(resultado);
				if(base64.length()>0)
				{
					String corta=Base64.getEncoder().encodeToString(resultado);
					respuesta.setError(false);
					respuesta.setStatusCode(200);
					respuesta.setStatusText(corta);
				}
				else
				{
					respuesta.setError(true);
					respuesta.setStatusCode(500);
					respuesta.setStatusText("Error Registro, verificar con el area de tecnologia...");
				}
			return respuesta;	
		}catch (SQLException e) {
			System.err.println("error sql "+e.getMessage());
			return null;
		}catch (Exception e) {
			System.err.println("error JRE "+e.getMessage());
			return null;
		}
	}	
	
	@RequestMapping(value = "/generarCartasText", method = RequestMethod.POST)
	public ReporteResponse generartext(@RequestBody CartasRequest request)
	{
		ReporteResponse respuesta=new ReporteResponse();
		try
		{
				ConvertGeneral general=new ConvertGeneral();
				byte[] resultado=null;
				String base64="";
				String condiciones=" ";
				String nombreReporte="archivo_plano.jasper";
				HashMap map = new HashMap();
				if(request.getPcodigo().length()>0)
				{
					condiciones=condiciones+" AND dsus.dsus_pcodigo"+request.getPcodigo();
				}
				if(request.getCiclo()>0)
				{
					condiciones=condiciones+" AND cic.cic_ideregistro="+request.getCiclo();
				}
				map.put("PR_DATE_FECHA1", general.convertirStringFechas(request.getFecha1()));
				map.put("PR_DATE_FECHA2", general.convertirStringFechas(request.getFecha2()));
				map.put("PR_STR_CONDICIONES",condiciones );
				map.put("PR_INT_EMPRESA",request.getEmpresa());
				resultado=service.exportTextFile(map, nombreReporte);
				base64=Base64.getEncoder().encodeToString(resultado);
				if(base64.length()>0)
				{
					String corta=Base64.getEncoder().encodeToString(resultado);
					respuesta.setError(false);
					respuesta.setStatusCode(200);
					respuesta.setStatusText(corta);
				}
				else
				{
					respuesta.setError(true);
					respuesta.setStatusCode(500);
					respuesta.setStatusText("Error Registro, verificar con el area de tecnologia...");
				}
			return respuesta;	
		}catch (SQLException e) {
			System.err.println("error sql "+e.getMessage());
			return null;
		}catch (Exception e) {
			System.err.println("error JRE "+e.getMessage());
			return null;
		}
	}	
}
