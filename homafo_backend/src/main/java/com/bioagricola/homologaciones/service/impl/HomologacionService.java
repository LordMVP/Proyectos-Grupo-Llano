package com.bioagricola.homologaciones.service.impl;


import com.bioagricola.common.entity.DghoDetallegestionhomologa;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.Empresas;
import com.bioagricola.common.entity.FacFactura;
import com.bioagricola.common.entity.FacturaMarcadaG;
import com.bioagricola.common.entity.GhomGestionhomologa;
import com.bioagricola.common.repository.FacturaMarcadaGRepository;
import com.bioagricola.common.repository.ReclamosRepository;
import com.bioagricola.common.repository.RutRutaRepository;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.common.util.Reflection;
import com.bioagricola.homologaciones.dto.*;
import com.bioagricola.homologaciones.entity.DgactDetagestionActualizacion;
import com.bioagricola.homologaciones.entity.GactGestionActualizacion;
import com.bioagricola.homologaciones.entity.HomologacionEntity;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j2;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import javax.transaction.Transactional;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
public class HomologacionService extends AbstractService<HomologacionEntity, Long>
{
	@Autowired
	private HomologacionRepository repository;
	
	@Autowired
	private UniUnidadService uniService;
	
	@Autowired
	private ClteClaterceroRepository repositoryClte;
	
	@Autowired
	private ConConceptoRepository conRepository;
	
	@Autowired
	private ContContactoterceroService contactoService;
	
	@Autowired
	private ConConceptoService conceptoService;
	
	@Autowired
	private RutRutaService rutaService;
	
	@Autowired
	private RutRutaRepository rutaRepository;
	
	@Autowired
	private ContContactoterceroRepository contactoRepository;
	
	@Autowired
	private LecLecturaRepository lecturaRepository;
	
	@Autowired
	private SuscripcionRepository suscripcionRepository;
	
	@Autowired
	private GhomGestionhomologaRepository ghomRepository;
	
	@Autowired
	private GactGestionActualizacionRepository gactRepository;
	
	@Autowired
	private DgactDetagestionActualizacionRepository dgactRepository;
	
	@Autowired
	private EmpresasRepository empRepository;
	
	@Autowired
	private RureRutrecoleccionRepository rureRepository;
	
	@Autowired
	private EmpresasService empresaService;
	
	@Autowired
	private ReclamosRepository reclamosRepository;
	
	@Autowired
	private SuscripcionService suscripcionService;
	
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	DghoDetallegestionhomologaRepository dghomRepository;
	
	@Autowired
	FacFacturaRepository facRepository;
	
	@Autowired
	FacturaMarcadaGRepository facmarcRepository;
	
	//public static Integer EMPRESA=317;
	
	public HomologacionService() {
		// TODO Auto-generated constructor stub
		super(HomologacionEntity.class);
	}
	
	public List<HashMap<String, Object>> datosHomologacion(Integer dsus)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.datosHomologacion(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("Codigo", tmp2[0]);
    		tmp1.put("Identificacion",tmp2[1]);
    		tmp1.put("Nombres",tmp2[2]);
    		tmp1.put("Direccion",tmp2[3]);
    		tmp1.put("Catastral",tmp2[4]);
    		tmp1.put("Estrato",tmp2[5]);
    		tmp1.put("Ciclo",tmp2[6]);
    		tmp1.put("Clase",tmp2[7]);
    		tmp1.put("Fecha",tmp2[8]);
    		tmp1.put("Suscripcion",tmp2[9]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> informacionBasica(Integer dsus)
	{
		ConvertGeneral convert=new ConvertGeneral();
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.informacionBasica(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("suscripcion", tmp2[0]);
    		tmp1.put("terDocumento",tmp2[1]);
    		tmp1.put("terNomcompleto",tmp2[2]);
    		tmp1.put("naturaleza",tmp2[3]);
    		tmp1.put("direccion",tmp2[4]);
    		tmp1.put("barrio",tmp2[5]);
    		tmp1.put("sector",tmp2[6]);
    		tmp1.put("departamento",tmp2[7]);
    		tmp1.put("proyecto",tmp2[8]);
    		tmp1.put("catastralAntes",tmp2[9]);
    		tmp1.put("complementoPropiedad",tmp2[10]);
    		tmp1.put("castastralNuevo",tmp2[11]);
    		tmp1.put("independencia",tmp2[12]==null ? 0 : tmp2[12]);
    		tmp1.put("matriculaInmobiliaria",tmp2[13]);
    		tmp1.put("ubicacion",tmp2[14]);
    		tmp1.put("actividadComercial",tmp2[15]);
    		tmp1.put("latitud",tmp2[16]);
    		tmp1.put("longitud",tmp2[17]);
    		tmp1.put("proyectoCod",tmp2[18]);
    		tmp1.put("dsusIderegistr",tmp2[19]);
    		tmp1.put("terIderegistro",tmp2[20]);
    		tmp1.put("clasificacionVivienda",convert.convertStringToArray(tmp2[21]));
    		tmp1.put("clasiTerceroLista",uniService.informcionUnidadTercero(22, ((Integer) tmp2[23]).intValue() ,((BigInteger) tmp2[20]).intValue()));
    		tmp1.put("contactoTerceroLista",contactoService.contactoTercero(((BigInteger) tmp2[20]).intValue()));
    		tmp1.put("terDigverificacion",tmp2[24]);
    		tmp1.put("proIdepropieda",tmp2[25]);
    		tmp1.put("tipoDocumento",tmp2[26]);
    		tmp1.put("resolCatastral", tmp2[27]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> resultadoBusqueda(BusquedaHomologacionRequest request,Pageable pageable)
	{
		String condiciones="";
		String condicionEmpresa=" and dsus.emp_ideregistro = "+request.getEmpresaSession().toString();
		String tmpFechaDesde = null;
		String tmpParametro =  null;
		Map<String, Object> datosClase=new HashMap<String, Object>();
		Reflection refle=new Reflection();
		datosClase=refle.refelxionGeneneral(request);  ///convierte la clase en un map
		for (Map.Entry<String, Object> entry : datosClase.entrySet())
		{
			if(entry.getValue()!=null)
			{
				if(entry.getValue().toString().length()>0 && !entry.getValue().toString().equals("0") && entry.getKey().indexOf("9")>=0)
				{
					if(entry.getKey().indexOf("ñ")>=0)
					{
						condiciones=condiciones.length()==0 ? "WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+" ILIKE "+"'%"+entry.getValue()+"%'" : condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+" ILIKE "+"'%"+entry.getValue()+"%'";
					}
					else
					{
						if(entry.getValue() instanceof String)
						{
							//System.err.println("entre a string "+ entry.getKey().indexOf("ñ"));
							condiciones=condiciones.length()==0 ? "WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+"='"+entry.getValue()+"'" : condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+"='"+entry.getValue()+"'";
						}
						else
						{
							//System.err.println("entre al else");
							condiciones=condiciones.length()==0 ? "WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+"="+entry.getValue() : condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+"="+entry.getValue();
						}
					}					
					
					/*if(condiciones.length()==0)
					{
						condiciones="WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+"="+entry.getValue();
					}
					else
					{
						condiciones=condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+"="+entry.getValue();
					}*/
					
				}
				if(entry.getValue() instanceof Date) {
					String patron = "yyyy-MM-dd";
					SimpleDateFormat simpleFormato=new SimpleDateFormat(patron);
					
					if( entry.getKey().indexOf("8")>=0) {
						
						
						condiciones=condiciones.length()==0 ? "WHERE " + tmpParametro + " between '"+ simpleFormato.format(entry.getValue()) + "' and '"+tmpFechaDesde+"'" : condiciones+" AND "+ tmpParametro + " between '"+ simpleFormato.format(entry.getValue()) + "' and '"+tmpFechaDesde+"'";
					}
					else {
							tmpFechaDesde = simpleFormato.format(entry.getValue());
							tmpParametro =  entry.getKey().replace("9", ".").toString();
							//condiciones= condiciones.length()==0 ? "WHERE " + tmpParametro + " ='"+tmpFechaDesde+"'" : condiciones+" AND "+ tmpParametro + " ='"+tmpFechaDesde+"'";
					}
				}
		   }

		}
		if(request.getEmpresa()>0)
		{
			condiciones=condiciones.length()==0 ? empresaAlterna(request.getEmpresa(), request.getProidepropieda(), request.getDsusIderegistr(), 
					request.getDsus9dsus_pcodigo(),request.getEmpresaSession())+ " WHERE dsus.sus_ideregistro = sus2.s " : empresaAlterna(request.getEmpresa(), request.getProidepropieda(),
							request.getDsusIderegistr(), request.getDsus9dsus_pcodigo(),request.getEmpresaSession()) +" WHERE dsus.sus_ideregistro = sus2.s ";//+ condiciones;
			//condiciones= condiciones.length()==0? condiciones+" where dsus.emp_ideregistro="+request.getEmpresaSession(): condiciones+" and dsus.emp_ideregistro="+request.getEmpresaSession();
		}
		if(condiciones.length()==0)
		{
			condiciones="WHERE 10=1";
		}
		
		String pagination = "LIMIT "+pageable.getPageSize() + "OFFSET "+pageable.getOffset();
		
		List<HashMap<String, Object>> total=new ArrayList<>();	

    	for(Object[] tmp2: consultaBase(condiciones,pagination,condicionEmpresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("Codigo", tmp2[0]);
    		tmp1.put("Identificacion",tmp2[1]);
    		tmp1.put("Nombres",tmp2[2]);
    		tmp1.put("Direccion",tmp2[3]);
    		tmp1.put("Catastral",tmp2[4]);
    		tmp1.put("Estrato",tmp2[5]);
    		tmp1.put("Ciclo",tmp2[6]);
    		tmp1.put("Clase",tmp2[16]);
    		tmp1.put("Fecha",tmp2[8]);
    		tmp1.put("Dsuscripcion",tmp2[9]);
    		tmp1.put("Convenio",tmp2[10]);
    		tmp1.put("Barrio",tmp2[11]);
    		tmp1.put("Estado",tmp2[12]);
    		tmp1.put("FechaExpira",tmp2[13]);
    		tmp1.put("Suscripcion",tmp2[14]);
    		tmp1.put("Medidor", tmp2[15]);
    		tmp1.put("Alterna",empRepository.empresaAlternaDsus(((BigInteger) tmp2[14]).intValue(),request.getEmpresaSession()));
    		tmp1.put("TipoDocumento", tmp2[17]);
    		tmp1.put("EmpIderegistro",request.getEmpresaSession());
    		try {
    			ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree((String)tmp2[18]);
                tmp1.put("codigoAltEmpresa",jsonNode.get("pcodigo").asText());
        		tmp1.put("fechaAltEmpresa",jsonNode.get("dsus_fecinicio").asText());
        		tmp1.put("medidorAltEmpresa",jsonNode.get("pro_idepropieda").asText());
                
			} catch (Exception e) {
				e.printStackTrace();
			}
    		tmp1.put("EmpNombre",empRepository.findById(request.getEmpresaSession().longValue()).orElse(new Empresas()).getEmpresaNom());
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<Object[]> consultaBase(String condiciones,String pagination, String empresaCondicion)
	{
		String consulta=/*"SELECT DISTINCT \n" +  
				"			dsus.dsus_pcodigo as pcodigo,  \n" + 
				"			ter.ter_documento as documento,   \n" + 
				"			ter.ter_nomcompleto as nombreCompleto, \n" + 
				"			pro.pro_direccion as direccion, \n" + 
				"			pro.pro_numcatastral, \n" + 
				"			dsus.pro_catestrato as estrato, \n" + 
				"			cic.cic_nombre as ciclo,  \n" + 
				"			CASE WHEN dsus.uni_tipusosuscr=6 THEN 'Residencial'  \n" + 
				"					 WHEN dsus.uni_tipusosuscr=5 THEN 'C'  \n" + 
				"					 WHEN dsus.uni_tipusosuscr=7 THEN 'I'  \n" + 
				"					 WHEN dsus.uni_tipusosuscr=197 THEN 'GNV'  \n" + 
				"					 END as tiposuo,   \n" + 
				"			CAST(to_char(dsus.dsus_fecinicio, 'YYYY-MM-DD') as varchar) as inicio,  \n" + 
				"			dsus.dsus_ideregistr as idesuscripcion,  \n" +
				"			cnre.cnre_nombre as convenio,  \n" +
				"			barrio_nom as barrio,  \n" +
				"			dsus.dsus_estado,  \n" +
				"			CAST(to_char(dsus.dsus_fecact, 'YYYY-MM-DD') as varchar) as fechaexpira,  \n" +
				"			sus.sus_ideregistro,  \n" +
				"           pro.pro_idepropieda, \n"+
				"			uni.uni_nombre1 as clase,   \n"+
				"			uniTipo.uni_nombre1 , \n"+
				"			coalesce(dd.dsus_pcodigo,'') codigoAltEmpresa, "+ 
				"			coalesce (cast(dd.dsus_fecinicio as text),'') fechaAltEmpresa, "+ 
				"			coalesce (pp.pro_idepropieda,'') medidorAltEmpresa	"+
				"			--dd.dsus_ideregistr, \n"+
				"           --cics.cic_nombre \n"+
				"			FROM dsus_detsuscrip dsus  \n" + 
				"			INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro  \n" + 
				"			INNER JOIN proyectos proyecto ON dsus.uni_municipio=proyecto.proyecto_ideregistro  \n" + 
				"			INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio  \n" + 
				"			INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro  \n" + 
				"			INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro  \n" + 
				"			INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro  \n" + 
				"			INNER JOIN cnre_cnvrecaudo cnre on cnre.cnre_ideregistr=sus.cnre_ideregistr  \n" +
				"           inner join dicn_disconven dc on dc.cnre_ideregistr = cnre.cnre_ideregistr \n"  +				
				"			INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr  \n"+
				"			--left join dsus_detsuscrip dd on dd.sus_ideregistro = sus.sus_ideregistro and \n"+
				"			--dd.dsus_ideregistr <> dsus.dsus_ideregistr \n"+
				"			--left JOIN cic_ciclo cics ON cics.cic_ideregistro=dd.cic_ideregistro \n"+				
				"			LEFT JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr  \n" + 
				"			LEFT JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro  \n" + 
				"			LEFT JOIN uni_unidad uniTipo ON uniTipo.uni_ideregistro=ter.uni_tipidentifica \n"+
				"			left join dsus_detsuscrip dd on dd.sus_ideregistro = dsus.sus_ideregistro "	+ 
				"			and dd.emp_ideregistro != dsus.emp_ideregistro "+ 
				"			left join pro_propiedad pp on pp.pro_ideregistro = dd.pro_ideregistro " +
				"			";*/
				" SELECT DISTINCT    \r\n"
				+ "							dsus.dsus_pcodigo as pcodigo,    \r\n"
				+ "							ter.ter_documento as documento,     \r\n"
				+ "							ter.ter_nomcompleto as nombreCompleto,   \r\n"
				+ "							pro.pro_direccion as direccion,   \r\n"
				+ "							pro.pro_numcatastral,   \r\n"
				+ "							dsus.pro_catestrato as estrato,   \r\n"
				+ "							cic.cic_nombre as ciclo,    \r\n"
				+ "							CASE WHEN dsus.uni_tipusosuscr=6 THEN 'Residencial'    \r\n"
				+ "									 WHEN dsus.uni_tipusosuscr=5 THEN 'C'    \r\n"
				+ "									 WHEN dsus.uni_tipusosuscr=7 THEN 'I'    \r\n"
				+ "									 WHEN dsus.uni_tipusosuscr=197 THEN 'GNV'    \r\n"
				+ "									 END as tiposuo,     \r\n"
				+ "							CAST(to_char(dsus.dsus_fecinicio, 'YYYY-MM-DD') as varchar) as inicio,    \r\n"
				+ "							dsus.dsus_ideregistr as idesuscripcion,   \r\n"
				+ "							cnre.cnre_nombre as convenio,   \r\n"
				+ "							barrio_nom as barrio,   \r\n"
				+ "							dsus.dsus_estado,   \r\n"
				+ "							CAST(to_char(dsus.dsus_fecact, 'YYYY-MM-DD') as varchar) as fechaexpira,   \r\n"
				+ "							sus.sus_ideregistro,   \r\n"
				+ "				            pro.pro_idepropieda, \r\n"
				+ "							uni.uni_nombre1 as clase,   \r\n"
				+ "							uniTipo.uni_nombre1 , \r\n"
				+ "							cast(cast((select row_to_json(dd) from (select coalesce(dd.dsus_pcodigo,'') pcodigo,cast(dd.dsus_fecinicio as text),pp.pro_idepropieda\r\n"
				+ "							from public.dsus_detsuscrip dd \r\n"
				+ "							inner join public.pro_propiedad pp on pp.pro_ideregistro = dd.pro_ideregistro\r\n"
				+ "							where dd.sus_ideregistro = dsus.sus_ideregistro 	 \r\n"
				+ "							and dd.emp_ideregistro in (322,299)) dd  limit 1) as jsonb) as text) datos \r\n"
				+ "							--coalesce(dd.dsus_pcodigo,'') codigoAltEmpresa,  \r\n"
				+ "							--coalesce (cast(dd.dsus_fecinicio as text),'') fechaAltEmpresa,  \r\n"
				+ "							--coalesce (pp.pro_idepropieda,'') medidorAltEmpresa	\r\n"
				+ "							--dd.dsus_ideregistr, \r\n"
				+ "				            --cics.cic_nombre \r\n"
				+ "							FROM dsus_detsuscrip dsus    \r\n"
				+ "							INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro    \r\n"
				+ "							INNER JOIN proyectos proyecto ON dsus.uni_municipio=proyecto.proyecto_ideregistro    \r\n"
				+ "							INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio    \r\n"
				+ "							INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro    \r\n"
				+ "							INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro    \r\n"
				+ "							INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro    \r\n"
				+ "							INNER JOIN cnre_cnvrecaudo cnre on cnre.cnre_ideregistr=sus.cnre_ideregistr   \r\n"
				+ "				            inner join dicn_disconven dc on dc.cnre_ideregistr = cnre.cnre_ideregistr   				\r\n"
				+ "							INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr  \r\n"
				+ "							--left join dsus_detsuscrip dd on dd.sus_ideregistro = sus.sus_ideregistro and \r\n"
				+ "							--dd.dsus_ideregistr <> dsus.dsus_ideregistr \r\n"
				+ "							--left JOIN cic_ciclo cics ON cics.cic_ideregistro=dd.cic_ideregistro 				\r\n"
				+ "							LEFT JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr    \r\n"
				+ "							LEFT JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro    \r\n"
				+ "							LEFT JOIN uni_unidad uniTipo ON uniTipo.uni_ideregistro=ter.uni_tipidentifica ";
		
		//Query q=em.createNativeQuery(consulta+condiciones+" AND dsus.emp_ideregistro="+empresaSession);
				Query q=em.createNativeQuery(consulta+condiciones + empresaCondicion +" limit 100");

		
		return q.getResultList();
		
	}
	
	public String empresaAlterna(Integer empresa, String medidor, Integer dsusIderegsitro, String pcodigo, Integer empSesion)
	{
		String consultaBase="SELECT\n" + 
				//"										dsus2.dsus_ideregistr\n" +
				"										dsus2.sus_ideregistro s\n" +
				"										FROM dsus_detsuscrip dsus2\n" + 
				"										INNER JOIN pro_propiedad pro2 ON pro2.pro_ideregistro=dsus2.pro_ideregistro\n" + 
				"										WHERE dsus2.emp_ideregistro="+empresa;										
				//"										WHERE dsus2.sus_ideregistro=dsus.sus_ideregistro\n" + 
				//"										AND dsus2.emp_ideregistro="+empresa;
				//"										WHERE dsus2.emp_ideregistro="+empresa;
		if(medidor.length()>0)
		{
			consultaBase=consultaBase+" AND pro2.pro_idepropieda='"+medidor+"'";
		}
		if(dsusIderegsitro!=null)
		{
			consultaBase=consultaBase+" AND dsus2.dsus_ideregistr="+dsusIderegsitro;
		}
		if(pcodigo.length()>0)
		{
			consultaBase=consultaBase+" AND dsus2.dsus_pcodigo='"+pcodigo+"'";
		}
		
		//return "dsus.sus_ideregistro in ("+consultaBase+")" ;
		return "inner join lateral ("+consultaBase+") sus2 on true ";
		
	}
	public String empresaAlternaCruce(Integer empresa, String medidor, Integer dsusIderegsitro, String pcodigo, Integer empSesion)
	{
		String consultaBase="SELECT\n" + 
				"										dsus2.dsus_ideregistr\n" +
				"										FROM dsus_detsuscrip dsus2\n" + 
				"										INNER JOIN pro_propiedad pro2 ON pro2.pro_ideregistro=dsus2.pro_ideregistro\n" +
				" left join public.dsus_detsuscrip ddx on ddx.sus_ideregistro = dsus2.sus_ideregistro and ddx.emp_ideregistro = " + empSesion +
				"										WHERE dsus2.emp_ideregistro="+empresa + " and dsus2.dsus_estado = 'A'	and ddx.dsus_ideregistr is null  ";
														
		if(medidor.length()>0)
		{
			consultaBase=consultaBase+" AND pro2.pro_idepropieda='"+medidor+"'";
		}
		if(dsusIderegsitro!=null)
		{
			consultaBase=consultaBase+" AND dsus2.dsus_ideregistr="+dsusIderegsitro;
		}
		if(pcodigo.length()>0)
		{
			consultaBase=consultaBase+" AND dsus2.dsus_pcodigo='"+pcodigo+"'";
		}
		
		
		
		return "dsus.dsus_ideregistr in ("+consultaBase+")" ;		
		
	}
	
	public Integer actualizarInfoBasica(HomologacionInfoBasicaRequest basica)
	{
		//System.err.println("que llego de ubicacion "+basica.getUbicacion());
		ConvertGeneral conv=new ConvertGeneral();
		int resultado1=repository.updateTerTercero(basica.getTerDocumento(), basica.getTerNomcompleto(), basica.getNaturaleza(), basica.getDsusIderegistr());
		int resultado2=repository.updateProPropiedad(basica.getDireccion(), basica.getCatastralAntes(), basica.getCastastralNuevo(), basica.getLatitud(), basica.getLongitud(), basica.getDsusIderegistr(), basica.getProyecto(), basica.getBarrio(),basica.getUbicacion(), basica.getMatriculaInmobiliaria(), conv.convertListToJson(basica.getClasificacionVivienda()), basica.getComplementoPropiedad()==null ? Types.NULL : basica.getComplementoPropiedad(),basica.getSector()==null ? Types.NULL : basica.getSector());
		int resultado3=repository.updateDsusDetsuscrip(basica.getBarrio(), basica.getProyecto(), basica.getDsusIderegistr(), basica.getActividadComercial() == 0 ? Types.NULL : basica.getActividadComercial());
		
		for(UniUnidadTerceroRequest tmp:basica.getClasiTerceroLista())
		{
			if(tmp.getClte_ideregistr()<0)
			{
				int resultado4=repositoryClte.deleteClteClaTercero(Math.abs(tmp.getClte_ideregistr()));
			}
			if(tmp.getClte_ideregistr()==0)
			{
				int resultado5=repositoryClte.insertClteClaTercero(tmp.getUni_ideregistro(), tmp.getTer_ideregistro(), basica.getIdUsuario());////usuarioQuemado
			}
		}
		for(ContContactoterceroRequest tmp: basica.getContactoTerceroLista())
		{
			if(tmp.getCont_ideregistro()==0)
			{
				int resultado6=contactoRepository.insertContactotercero(tmp.getTer_ideregistro(), tmp.getUni_ideregistro(), tmp.getCont_valor());
			}
			if(tmp.getCont_ideregistro()<0)
			{
				int resultdo7=contactoRepository.deleteContactotercero(Math.abs(tmp.getCont_ideregistro()));
			}
		}
		///actualizar fecha dsus
		int resulFec=repository.actualizarFechaSuscripcion(new Date(), basica.getDsusIderegistr());
		return 0;
	}
	
	//////informacion suscripcion
	
	public List<HashMap<String, Object>> informacionSuscripcion(Integer dsus)
	{
		Integer empresaDsus=repository.buscarEmpresaDsus(dsus);
		List<Object[]> parametros=repository.parametroValor(empresaDsus);
		ConvertGeneral convertir=new ConvertGeneral();
		//Integer barrido=rutaRepository.rusuExistencia(dsus, Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_barrido")));
		//Integer recoleccion=rutaRepository.rusuExistencia(dsus, Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_microRuta")));
		Integer barrido=rutaRepository.buscarRutrecbar(dsus, Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_barrido").equals("") ? "0" : convertir.extraerValorParametro(parametros, "estructura_barrido")));
		Integer recoleccion=rutaRepository.buscarRutrecbar(dsus, Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_microRuta").equals("") ? "0" : convertir.extraerValorParametro(parametros, "estructura_microRuta")));
		Integer macroRuta=rutaRepository.buscarRutrecbarMacroRuta(dsus, Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_microRuta").equals("") ? "0" : convertir.extraerValorParametro(parametros, "estructura_microRuta")));
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.informacionSuscripcion(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dsus_estado", tmp2[0]);
    		tmp1.put("dsus_fecinicio",tmp2[1]);
    		tmp1.put("dsus_fecexpira",tmp2[2]);
    		tmp1.put("uni_municipio",tmp2[3]);
    		tmp1.put("uni_tipusosuscr",tmp2[4]);
    		tmp1.put("pro_catestrato",tmp2[5]);
    		tmp1.put("cic_ideregistro",tmp2[6]);
    		tmp1.put("iasus_cobrojuridico",tmp2[7]);
    		tmp1.put("uni_liquidacion",tmp2[8]);
    		tmp1.put("iasus_pagapeaje",tmp2[9]);
    		tmp1.put("iasus_referenciacomercial",tmp2[10]);
    		tmp1.put("sus_ideregistro",tmp2[11]);
    		tmp1.put("dsus_ideregistr",tmp2[12]);
    		tmp1.put("emp_ideregistro",0);
    		tmp1.put("usu_ideregistro",0);
    		tmp1.put("rut_macroRuta", macroRuta==null ? 0 : macroRuta);
    		tmp1.put("rut_ideregistro_bar", barrido==null ? 0 : barrido);
    		tmp1.put("rut_ideregistro_rec",recoleccion==null ? 0 :recoleccion);
    		tmp1.put("conceptosRelacionados",conceptoService.conceptosSuscripcion(dsus));
    		tmp1.put("aprovechamiento",rutaService.rutasAprovechamiento(dsus));
    		tmp1.put("uni_barrio", tmp2[13]);
    		tmp1.put("resolCatastral", tmp2[14]);
    		tmp1.put("dsusAlt", tmp2[15]);
    		tmp1.put("cicloAlt", tmp2[16]);
    		tmp1.put("empAlt", tmp2[17]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> busquedaInformacionHomologcion(Integer dsus, String medidor , String pcodigo, Integer empresa, Integer empresaSesion,Boolean desHomo)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();	

    	for(Object[] tmp2: busquedaConsultaHomo(dsus,medidor,pcodigo,empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dsus_ideregistr", tmp2[0]);
    		tmp1.put("uni_tipusosuscr",tmp2[1]);
    		tmp1.put("pro_catestrato",tmp2[2]);
    		tmp1.put("dsus_pcodigo",tmp2[3]);
    		tmp1.put("cic_ideregistro",tmp2[4]);
    		tmp1.put("cnre_ideregistr",tmp2[5]);
    		tmp1.put("cnre_nombre",tmp2[6]);
    		tmp1.put("pro_idepropieda",tmp2[7]);
    		tmp1.put("ter_ideregistro",tmp2[8]);
    		tmp1.put("sus_ideregistro",tmp2[9]);
    		tmp1.put("cic_nombre", tmp2[10]);
    		tmp1.put("uni_nombre1", tmp2[11]);
    		tmp1.put("consumos",lecturaRepository.ultimosConsumos(((BigInteger) tmp2[0]).intValue()));
    		tmp1.put("convenios", desHomo==true ? empresaService.listaConveniosDesHomologables(empresaSesion) : empresaService.listaConveniosHomologablesDsus(empresaSesion,((BigInteger) tmp2[9]).intValue()) );
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public Integer actualizarInfoSuscripcionHomologacion(HomologacionInfoSuscripcionRequest request)
	{
		ConvertGeneral convertir=new ConvertGeneral();
		List<Object[]> parametros=repository.parametroValor(request.getEmp_ideregistro());
		
		int resultadoTmp=ActualizarHomoSuscripcionDesus(request);
		//int resultado=repository.updateDsusDetsuscripSuscripcion(request.getDsus_estado(), request.getDsus_fecinicio(), convertir.convertirStringFechas(request.getDsus_fecexpira()), request.getUni_municipio(), request.getUni_tipusosuscr(), request.getPro_catestrato(), request.getCic_ideregistro(), request.getUni_liquidacion(), request.getDsus_ideregistr());
		int resultado2=repository.updateDsusDetsuscripIasus(request.getIasus_cobrojuridico()==null ? false :request.getIasus_cobrojuridico(), request.getIasus_pagapeaje()==null ? false : request.getIasus_pagapeaje(), request.getIasus_referenciacomercial(), request.getDsus_ideregistr());//request.getSus_ideregistro()
		if(resultado2==0)
		{
			int insertarIasus=repository.insertDsusDetsuscripIasus(request.getIasus_cobrojuridico()==null ? false :request.getIasus_cobrojuridico(), request.getIasus_pagapeaje()==null ? false : request.getIasus_pagapeaje(), request.getIasus_referenciacomercial(), request.getDsus_ideregistr(),request.getSus_ideregistro());
		}
		for(CosuConsuscripRequest tmp : request.getConceptosRelacionados())
		{
			if(tmp.getCosu_ideregistr()<0)
			{
				int resultado3=conRepository.deleteCosuConsuscrip(tmp.getCosu_ideregistr()*-1);
			}
			if(tmp.getCosu_ideregistr()==0)
			{
				int resultado4=conRepository.insertCosuConsuscrip(convertir.convertirStringFechas(tmp.getDesde()), convertir.convertirStringFechas(tmp.getHasta()), request.getDsus_ideregistr(), request.getUni_liquidacion(), tmp.getUni_concepto(), request.getEmp_ideregistro(), request.getUsu_ideregistro());
			}
		}
		///barrido
		
		if(request.getRut_ideregistro_bar()>0)
		{
			//System.err.println("que llego de barrido "+request.getRut_ideregistro_bar());
			Integer estructura=Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_barrido"));
			Integer ideRegistro=rutaRepository.buscarRutrecbarRegistro(request.getDsus_ideregistr(), estructura);
			//if(rutaRepository.rusuExistencia(request.getDsus_ideregistr(), Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_barrido")))!=null)
			if(ideRegistro!=null)
			{
				System.err.println("estoy en update de barrido...");
				//int barrido=rutaRepository.updateRusuRuta(request.getRut_ideregistro_bar(), request.getDsus_ideregistr());////
				int barrido=rutaRepository.updateRutrecbar(request.getRut_ideregistro_bar(), request.getDsus_ideregistr(), 0, "A", request.getUsu_ideregistro(),ideRegistro, Types.NULL);
			}
			else
			{
				System.err.println("Estoy en insertar de barrido...");
				int barrido=rutaRepository.insertRutrecbar(request.getRut_ideregistro_bar(), request.getDsus_ideregistr(), 0, "A", request.getUsu_ideregistro(), Types.NULL);
			}
			
		}		
		///recoleccion
		
		if(request.getRut_ideregistro_rec()>0)
		{
			Integer estructura=Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_microRuta"));
			Integer ideRegistro=rutaRepository.buscarRutrecbarRegistro(request.getDsus_ideregistr(), estructura);
			Integer rureIderegistro=rureRepository.buscaRureMacroRuta(request.getRut_macroRuta());
			//if(rutaRepository.rusuExistencia(request.getDsus_ideregistr(), Integer.parseInt(convertir.extraerValorParametro(parametros, "estructura_microRuta")))!=null)
			if(ideRegistro!=null)
			{
				System.err.println("estoy en update de recoleccion...");
				//int recoleccion=rutaRepository.updateRusuRuta(request.getRut_ideregistro_rec(), request.getDsus_ideregistr());////
				int barrido=rutaRepository.updateRutrecbar(request.getRut_ideregistro_rec(), request.getDsus_ideregistr(), request.getRut_macroRuta(), "A", request.getUsu_ideregistro(),ideRegistro, rureIderegistro);
			}
			else
			{
				System.err.println("Estoy en insertar de recoleccion...");
				//int recoleccion=rutaRepository.insertRusuRuta(".",request.getRut_ideregistro_rec(), request.getDsus_ideregistr(),0, request.getUsu_ideregistro());
				int barrido=rutaRepository.insertRutrecbar(request.getRut_ideregistro_rec(), request.getDsus_ideregistr(), request.getRut_macroRuta() , "A", request.getUsu_ideregistro(), rureIderegistro);
			}
		}
		
		///insertar aprovechamiento
		if(request.getAprovechamiento().getRutapr_ideregistro()>0)
		{
			int actualizarRutApr=rutaRepository.updateRutapr(request.getAprovechamiento().getRut_ideregistro(),request.getAprovechamiento().getTer_aprovechamiento() , request.getAprovechamiento().getRutapr_incentivo(), request.getAprovechamiento().getRutapr_aforado() , request.getUsu_ideregistro(), request.getDsus_ideregistr());
		}		
		if(request.getAprovechamiento().getRutapr_ideregistro()==0 && request.getAprovechamiento().getRut_ideregistro()>0)
		{
			int insertRutApr=rutaRepository.insertRutapr(request.getAprovechamiento().getRut_ideregistro(), request.getDsus_ideregistr(), request.getAprovechamiento().getTer_aprovechamiento() , request.getAprovechamiento().getRutapr_incentivo() , request.getAprovechamiento().getRutapr_aforado() , request.getUsu_ideregistro(), new Date());
		}
		///fin aprovechamiento
		///actualizar fecha dsus
		int resulFec=repository.actualizarFechaSuscripcion(new Date(), request.getDsus_ideregistr());
		return 0;
	}
	
	@Transactional
	@Modifying
	public int ActualizarHomoSuscripcionDesus(HomologacionInfoSuscripcionRequest request)
	{
		ConvertGeneral convertir=new ConvertGeneral();
		String adicionales="";
		 try
	        {
			 if(request.getDsus_fecexpira()!=null)
			 {
				 //adicionales=adicionales+" , dsus_fecexpira= :dsus_fecexpira";
				 adicionales=adicionales+" , dsus_fecact= :dsus_fecexpira";
			 }
			 if(convertir.convertirStringFechas(request.getDsus_fecinicio())!=null)
			 {
				 adicionales=adicionales+" , dsus_fecinicio= :dsus_fecinicio";
			 }
			 	String consulta="UPDATE\n" + 
	            		"dsus_detsuscrip\n" + 
	            		"SET dsus_estado = :dsus_estado , uni_municipio= :uni_municipio , uni_tipusosuscr = :uni_tipusosuscr ,\n"+
	            		"pro_catestrato = :pro_catestrato , cic_ideregistro = :cic_ideregistro , uni_liquidacion = :uni_liquidacion \n" + 
	            		 adicionales+ "\n"+
	            		"WHERE dsus_ideregistr= :dsus_ideregistr";
	            Query q=em.createNativeQuery(consulta);
	            if(request.getDsus_fecexpira()!=null)
				 {
					 q.setParameter("dsus_fecexpira", convertir.convertirStringFechas(request.getDsus_fecexpira()));
				 }
	            if(convertir.convertirStringFechas(request.getDsus_fecinicio())!=null)
				 {
					 q.setParameter("dsus_fecinicio", convertir.convertirStringFechas(request.getDsus_fecinicio()));
				 }
	            q.setParameter("dsus_estado", request.getDsus_estado());
	            q.setParameter("uni_municipio", request.getUni_municipio());
	            q.setParameter("uni_tipusosuscr", request.getUni_tipusosuscr());
	            q.setParameter("pro_catestrato", request.getPro_catestrato());
	            q.setParameter("cic_ideregistro", request.getCic_ideregistro());
	            q.setParameter("uni_liquidacion", request.getUni_liquidacion());
	            q.setParameter("dsus_ideregistr", request.getDsus_ideregistr());
	            return (int) q.getSingleResult();
	            //return q.executeUpdate();
	        } catch (NoResultException e)
	        {
	            System.out.println("error consulta...");
	            return 0;
	        }catch(TransactionRequiredException e)
		 	{
	        	System.out.println("error consulta...");
	        	return 0;
	        }catch (Exception e) {
				return 0;
			}
		 
	}
	
	
	//////////////////fin suscripcion//////////////
	
		///Homologacion/////////////
	
	
	public List<Object[]> busquedaConsultaHomo(Integer dsus, String medidor , String pcodigo, Integer empresa)
	{
		String consultaBase="SELECT\n" + 
				"dsus.dsus_ideregistr,\n" + 
				"dsus.uni_tipusosuscr,\n" + 
				"dsus.pro_catestrato,\n" + 
				"dsus.dsus_pcodigo,\n" + 
				"dsus.cic_ideregistro,\n" + 
				"sus.cnre_ideregistr,\n" + 
				"cnre.cnre_nombre,\n" +
				"pro.pro_idepropieda,\n" +
				"dsus.ter_ideregistro,\n" +
				"sus.sus_ideregistro,\n" +
				"cic.cic_nombre as ciclo, \n"+
				"uni.uni_nombre1 as tipoUso  \n"+
				"FROM dsus_detsuscrip dsus\n" + 
				"INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro \n" + 
				"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro\n" + 
				"INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr=sus.cnre_ideregistr \n" + 
				"INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro \n"+
				"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr \n"+
				"WHERE dsus.emp_ideregistro ="+empresa;
		String condiciones="";
		if(dsus!=null)
		{
			condiciones=" AND dsus.dsus_ideregistr="+dsus;
		}
		if(pcodigo.length()>0)
		{
			condiciones=condiciones+" AND dsus.dsus_pcodigo='"+pcodigo+"'";
		}
		if(medidor.length()>0)
		{
			condiciones=condiciones+" AND pro.pro_idepropieda='"+medidor+"'";
		}
		if(condiciones.length()==0)
		{
			condiciones=" AND 10=1";
		}
		System.out.println(condiciones);
		Query q=em.createNativeQuery(consultaBase+condiciones);
		return q.getResultList();
		
	}
	
	public List<HashMap<String, Object>> informacionHomologacion(Integer dsus,Integer empresasession)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();	
		
    	for(Object[] tmp2: repository.informacionHomologacion(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dsus_ideregistr", tmp2[0]);
    		tmp1.put("cnre_ideregistr",tmp2[1]);
    		tmp1.put("ter_ideregistro",tmp2[2]);   
    		tmp1.put("cnre_nombre",tmp2[3]);
    		tmp1.put("sus_ideregistro",tmp2[4]);
    		tmp1.put("per_ideregistro",tmp2[5]);
    		tmp1.put("detalles",informacionHomologacionDetalle(dsus));
    		tmp1.put("listaDsusHomo", suscripcionService.informacionDsusHomo(((BigInteger) tmp2[4]).intValue(),((BigInteger) tmp2[0]).intValue()));
    		tmp1.put("ter_nomcompleto",tmp2[6]);
    		tmp1.put("dsus_pcodigo",tmp2[7]);
    		tmp1.put("pro_direccion",tmp2[8]);
    		tmp1.put("pro_numcatastral",tmp2[9]);
    		tmp1.put("pro_idepropieda",tmp2[10]);
			tmp1.put("pro_ideregistro",tmp2[11]);
    		tmp1.put("Alterna",empRepository.empresaAlternaDsus(((BigInteger) tmp2[4]).intValue(),empresasession));
    		tmp1.put("emp_ideregistro",empresasession);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> informacionHomologacionDetalle(Integer dsus)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();		

    	for(Object[] tmp2: repository.informacionHomologacionDetalle(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("ghom_ideregistr", tmp2[0]);
    		tmp1.put("idSuscripcion",tmp2[1]);
    		tmp1.put("emp_ideregistro",tmp2[2]);   
    		tmp1.put("tercero",tmp2[3]);
    		tmp1.put("pro_catestrato",tmp2[4]);
    		tmp1.put("empresa", tmp2[5]);
    		tmp1.put("consumo",tmp2[6]);
    		tmp1.put("tipoUso", tmp2[7]);
    		tmp1.put("suscripcion", tmp2[8]);
    		tmp1.put("medidor", tmp2[9]);
    		tmp1.put("fecha", tmp2[10]);
    		tmp1.put("observaciones", tmp2[11]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	
	public Integer crearHomologacion(HomologacionInfoHomoRequest request)
	{
		try
		{
			// Validacion Convenios Homologacion JLMENDOZA
			Integer cicloDist = 0;
			List<Integer>SuscripcionDeshomologada= new ArrayList<>();
			List<HashMap<String, Object>>listaConveniosrespuesta=new ArrayList<>();
			SusSuscripcion alternaSus;			
			for(Object[] tmp0: repository.buscarSuscripciones(request.getSuscripcion1().intValue()))
	    	{
				List<HashMap<String, Object>>listaConvenios = empresaService.listaConvenios((Integer)tmp0[1]);				
				List<HashMap<String, Object>>listaConveniosHomologador = empresaService.listaConveniosHomologablesDsus(request.getEmpresaHomologador(), request.getSuscripcion2());
				
				listaConveniosrespuesta=listaConvenios.stream().filter(f->listaConveniosHomologador.stream()
						.anyMatch(lc->lc.get("cnre_ideregistr")==f.get("cnre_ideregistr"))).collect(Collectors.toList());
				if(listaConveniosrespuesta.size()==0) {
					SuscripcionDeshomologada.add(((BigInteger)tmp0[0]).intValue());
				}
				
	    	}
			//* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  *//
				
				SusSuscripcion sus=new SusSuscripcion();
				//sus.setSusIderegistro(new Integer(0));
				sus.setCnreIderegistr(request.getNuevoConvenio());
				sus.setTerIderegistro(request.getNuevoTercero());
				sus.setSusDescripcion(request.getNombreNuevoConvenio());
				sus.setSusModconvenio("N");
				sus.setUsuIderegistro(request.getUsuario());
				SusSuscripcion resultado=suscripcionRepository.save(sus);
				//insertar ghom y dgho
				//Ghom anterior
				log.error("dsusHomologa:"+request.getDsusHomologa().toString());
				GhomGestionhomologa ghomAnt = ghomRepository.findByDsusIderegistrHom(request.getDsusHomologa().intValue()).orElse(null);
				if(!Objects.isNull(ghomAnt)) {
					ghomAnt.setGhomEstado("I");
					ghomAnt.getDghoDetallegestionhomologaList().stream().forEach(d->d.setDghoEstado("I"));
					ghomRepository.save(ghomAnt);
				}

				GhomGestionhomologa ghom =new GhomGestionhomologa();
				ghom.setGhomIderegistr(new Long(0));
				ghom.setSusIderegistro(resultado.getSusIderegistro().intValue());
				ghom.setGhomFecharegistro(new Date());
				ghom.setGhomFechaactualiza(new Date());
				ghom.setPerIderegistro(request.getPeriodoHomologa().longValue());				
				ghom.setGhomEstado("A");
				ghom.setUsuIderegistro(request.getUsuario().longValue());
				ghom.setObservaciones(request.getObservaciones());
				ghom.setDsusIderegistr(request.getDsusHomologa().longValue());
				ghom.setEmpIderegistro(request.getEmpresaHomologador().longValue());
				//ghom.setEmpIderegistro(request.getEmpresaHomologa().longValue());

				for(Object[] tmp2: repository.buscarSuscripciones(request.getSuscripcion2().intValue()))
		    	{
					JSONArray j=new JSONArray();
					List<Integer> mapList = new ArrayList<>();

					for(Integer i:lecturaRepository.ultimosConsumosBase(((BigInteger) tmp2[0]).intValue())) {
						j.put(i);
						mapList.add(i);

					}
					DghoDetallegestionhomologa detalle=new DghoDetallegestionhomologa();
					detalle.setDghoIderegistr(0L);
					detalle.setGhomGestionhomologa(ghom);
					//detalle.setDsusIderegistr(((Long) tmp2[0]));
					//detalle.setEmpIderegistro(((Long) tmp2[1]));
					detalle.setDsusIderegistr( ((BigInteger) tmp2[0]).longValue());
					detalle.setEmpIderegistro(((Number) tmp2[1]).longValue());
					detalle.setDsusPcodigo(tmp2[2].toString());
					detalle.setDghoEstado("A");
					//detalle.setDghoConsumo(lecturaRepository.ultimosConsumosBase(((BigInteger) tmp2[0]).intValue()).toString());		

					detalle.setDghoConsumo(mapList);
					detalle.setDghoNumeromedidor(((String) tmp2[2]).toString());
					detalle.setDghoFecharegistro(new Date());
					detalle.setUsuIderegistro(request.getUsuario().longValue());
					detalle.setSusIderegistroHomologa(request.getSuscripcion2().longValue());
					detalle.setSusIderegistroHomologados(request.getSuscripcion1().longValue());
					if(ghom.getDghoDetallegestionhomologaList()==null)
					{
						ghom.setDghoDetallegestionhomologaList(new ArrayList<>());
					}
					ghom.getDghoDetallegestionhomologaList().add(detalle);
					
		    	}
				
				ghomRepository.save(ghom);			
				
				//Suscripciones que no coincide el convenio se aislan en otra suscripcion JLMENDOZA
				if(SuscripcionDeshomologada.size()>0) {
					
					List<Integer> empresasTmp=empresaService.listaempresasSuscripcion(request.getSuscripcion1());
					///obtener el convenio
					Integer convenioTmp=buscarConveniosEmpresas(empresasTmp);
					
					alternaSus = new SusSuscripcion();
					alternaSus.setCnreIderegistr(convenioTmp);
					alternaSus.setTerIderegistro(request.getNuevoTercero());
					alternaSus.setSusDescripcion("Deshomologacion");
					alternaSus.setSusModconvenio("N");
					alternaSus.setUsuIderegistro(request.getUsuario());
					SusSuscripcion resultadoAlterno=suscripcionRepository.save(alternaSus);
					
					SuscripcionDeshomologada.stream().forEach(s->{
						Integer suscriptor3 = repository.actualizardsusDeshomologacion(resultadoAlterno.getSusIderegistro().intValue(), s);
					});
					
					
				}	
				
				List<Object []> facturas = facRepository.facFacturaActualDsusAndEmpresa(request.getDsusHomologa().intValue(), request.getEmpresaHomologa());
				List<FacturaMarcadaG> facmarcs = facmarcRepository.listaFacturaMarcadaG(Long.parseLong(request.getDsusHomologa().toString()));
				
				if(facmarcs.size() > 0) {
				
				List<Object []> fs =facturas.stream().filter(f-> {
				boolean rest = true;
				for(int i = 0 ; i < facmarcs.size() ; i ++) {
					if (facmarcs.get(i).getFacIderegistro()==((BigInteger)f[0]).longValue()) {
						rest = false;
					}
				}				
				return rest;
				}).collect(Collectors.toList());					
				
				facturas = fs;				
				}
				
				
				for(Object [] $factura : facturas) {		
					FacturaMarcadaG fg = new FacturaMarcadaG();
					fg.setFacIderegistro(((BigInteger)$factura[0]).longValue());					
					fg.setFacEstado((String)$factura[3]);
					fg.setFacFecha((java.sql.Timestamp)$factura[4]);
					fg.setPerIderegistro(Long.parseLong(((Integer)$factura[20]).toString()));
					fg.setFacSdoreal(((BigDecimal)$factura[26]).doubleValue());
					fg.setFacVlrreal(((BigDecimal)$factura[32]).doubleValue());
					fg.setDsusIderegistr(Long.parseLong(request.getDsusHomologa().toString()));
					Long dsus = ghomRepository.findByDsusIderegistrHom(request.getDsusHomologa()).get().getGhomIderegistr();
					fg.setGhomIderegistr(dsus);
					fg.setEmpIderegistro(Long.parseLong(request.getEmpresaHomologa().toString()));
					fg.setUsuIderegistro(request.getUsuario().longValue());	
					fg.setFacMarcEstado((String.valueOf($factura[36])).equalsIgnoreCase("A") ? "P" : "A");
					facmarcRepository.save(fg);
				}				
				
				cicloDist = repository.buscarCicloLiquidacionSuscripcionAlterna(request.getDsusHomologador());
				
				///actualizar suscripciones que son homologadas
				Integer suscriptor1=repository.actualizarSuscripcion(resultado.getSusIderegistro().intValue(), request.getSuscripcion1());
				///actualizar suscripciones con las que se van a homologar
				Integer suscriptor2=repository.actualizarSuscripcion(resultado.getSusIderegistro().intValue(), request.getSuscripcion2());
				///actualizar dsus
				//int resulFec=repository.actualizarFechaSuscripcion(new Date(), request.getDsusHomologador());
				int resulFec=repository.actualizarFechaSuscripcionCicloLiquidacion(new Date(), request.getDsusHomologa(),cicloDist);

		return 0;
		
		}catch (Exception e) {
			System.err.println(e.getMessage());
			return 1;
		}
		
	}
	
	public Integer crearDesHomologacion(HomologacionInfoHomoRequest request,Integer empresasesion)
	{
		try
		{
		int cicloDist = 238;	
		SusSuscripcion sus=new SusSuscripcion();
		//sus.setSusIderegistro(new Integer(0));
		sus.setCnreIderegistr(request.getNuevoConvenio());
		sus.setTerIderegistro(request.getNuevoTercero());
		sus.setSusDescripcion(request.getNombreNuevoConvenio());
		sus.setSusModconvenio("N");
		sus.setUsuIderegistro(request.getUsuario());
		SusSuscripcion resultado=suscripcionRepository.save(sus);
		
		//Ghom anterior
		log.error("dsusHomologa:"+request.getDsusHomologa().toString());
		GhomGestionhomologa ghomAnt = ghomRepository.findByDsusIderegistrHom(request.getDsusHomologa().intValue()).orElse(null);
		if(!Objects.isNull(ghomAnt)) {
			ghomAnt.setGhomEstado("I");
			ghomAnt.getDghoDetallegestionhomologaList().stream().forEach(d->d.setDghoEstado("I"));
			ghomRepository.save(ghomAnt);
		}
		
		//insertar ghom y dgho
		GhomGestionhomologa ghom =new GhomGestionhomologa();
		ghom.setGhomIderegistr(new Long(0));
		ghom.setSusIderegistro(resultado.getSusIderegistro().intValue());
		ghom.setGhomFecharegistro(new Date());
		ghom.setGhomFechaactualiza(new Date());
		ghom.setPerIderegistro(request.getPeriodoHomologa().longValue());
		ghom.setGhomEstado("A");
		ghom.setUsuIderegistro(request.getUsuario().longValue());
		ghom.setObservaciones(request.getObservaciones());
		ghom.setDsusIderegistr(request.getDsusHomologa().longValue());
		//ghom.setEmpIderegistro(request.getEmpresaHomologador());
		ghom.setEmpIderegistro(request.getEmpresaHomologa().longValue());
		
			DghoDetallegestionhomologa detalle=new DghoDetallegestionhomologa();
			detalle.setDghoIderegistr(0L);
			detalle.setGhomGestionhomologa(ghom);
			detalle.setDsusIderegistr(request.getDsusHomologador().longValue());
			detalle.setEmpIderegistro(empresasesion.longValue());
			detalle.setDsusPcodigo(request.getPcodigoHomologador());
			detalle.setDghoEstado("A");
			detalle.setDghoConsumo(request.getConsumomap());
			detalle.setDghoNumeromedidor(request.getMedidor());
			detalle.setDghoFecharegistro(new Date());
			detalle.setUsuIderegistro(request.getUsuario().longValue());
			detalle.setSusIderegistroHomologa(request.getSuscripcion2().longValue());
			detalle.setSusIderegistroHomologados(request.getSuscripcion1().longValue());
			if(ghom.getDghoDetallegestionhomologaList()==null)
			{
				ghom.setDghoDetallegestionhomologaList(new ArrayList<>());
			}
			ghom.getDghoDetallegestionhomologaList().add(detalle);			
		
		ghomRepository.save(ghom);
		
		///actualizar suscripciones que homologan
		/*Integer suscriptor1=repository.actualizardsusDeshomologacion(resultado.getSusIderegistro().intValue(), request.getDsusHomologador());*/
		Integer suscriptor1=repository.actualizardsusDeshomologacionDatos(resultado.getSusIderegistro().intValue(), request.getDsusHomologador(), cicloDist);
		
		///actualizar suscripcion sobrante
		
				//obtener empresas sobrantes
		List<Integer> empresasTmp=empresaService.listaempresasSuscripcion(request.getSuscripcion2());
				///obtener el convenio
		Integer convenioTmp=buscarConveniosEmpresas(empresasTmp);
		//System.err.println("que convenio llego a ver "+convenioTmp);
		
		SusSuscripcion sus2=new SusSuscripcion();
		sus2.setCnreIderegistr(convenioTmp);
		sus2.setTerIderegistro(request.getNuevoTercero());
		sus2.setSusDescripcion("Deshomologacion");
		sus2.setSusModconvenio("N");
		sus2.setUsuIderegistro(request.getUsuario());
		SusSuscripcion resultado2=suscripcionRepository.save(sus2);
		Integer suscriptor2=repository.actualizarSuscripcion(resultado2.getSusIderegistro().intValue(), request.getSuscripcion2());
		
		///actualizar dsus
		//int resulFec=repository.actualizarFechaSuscripcion(new Date(), request.getDsusHomologador());
		int resulFec=repository.actualizarFechaSuscripcion(new Date(), request.getDsusHomologa());
		return 0;
		
		}catch (Exception e) {
			System.err.println(e.getMessage());
			return 1;
		}
		
	}
	
	
	////gestion de actualizacion/////////////
	
	public List<HashMap<String, Object>> informacionGestion(Integer dsus)
	{
		Integer empresaDsus=repository.buscarEmpresaDsus(dsus);
		ConvertGeneral convert=new ConvertGeneral();
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.informacionGestion(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dsus_ideregistr", tmp2[0]);
    		tmp1.put("dsus_pcodigo",tmp2[1]);
    		tmp1.put("parametros",repository.parametroValor(empresaDsus));
    		tmp1.put("fecha1", "");
    		tmp1.put("observaciones", "");
    		tmp1.put("visita", 0);
    		tmp1.put("liquidacion", 0);
    		tmp1.put("colaborador", 0);
    		tmp1.put("archivos", new ArrayList<>());
    		tmp1.put("usu_ideregistro",0);
    		tmp1.put("reclamo_numpqr", "");
    		//tmp1.put("contactoTerceroLista",contactoService.contactoTercero(((BigInteger) tmp2[20]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public Integer insertarGestionActualizacion(HomologacionInfoGestionRequest request)
	{
		try
		{
		ConvertGeneral convertir=new ConvertGeneral();
		GactGestionActualizacion gestion=new GactGestionActualizacion();
		gestion.setGactIderegistro(new Long(0));
		gestion.setDsusIderegistro(request.getDsus_ideregistr());
		gestion.setUniNovedadVisita(request.getVisita());
		gestion.setUniNovedadLiquidacion(request.getLiquidacion());
		gestion.setGactFecgestion(convertir.convertirStringFechas(request.getFecha1()));
		gestion.setGactObservaciones(request.getObservaciones());
		gestion.setGactSwtact("A");
		gestion.setUsuIderegistro(request.getUsu_ideregistro());
		gestion.setDateCreated(new Date());
		gestion.setReclamoNumpqr(request.getReclamo_numpqr());
		if(gestion.getDgactDetagestionActualizacionList()==null)
		{
			gestion.setDgactDetagestionActualizacionList(new ArrayList<DgactDetagestionActualizacion>());
		}
		for(String tmp:request.getArchivos())
		{
			DgactDetagestionActualizacion detalle=new DgactDetagestionActualizacion();
			detalle.setDgactIderegistro(new Integer(0));
			detalle.setGactIderegistro(gestion);
			detalle.setUsuIderegistro(request.getUsu_ideregistro());
			detalle.setDateCreated(new Date());
			detalle.setDgactAzId(tmp);
			gestion.getDgactDetagestionActualizacionList().add(detalle);
		}
		gactRepository.save(gestion);
		if(request.getReclamo_numpqr().length()>0)
		{
			int resultadoVisita=reclamosRepository.insertVisitasSol(convertir.convertirStringFechas(request.getVisitas().getFecha()), request.getVisitas().getNovedad(), request.getVisitas().getCuadrilla(), request.getVisitas().getObservaciones(), request.getVisitas().getReclamo_numpqr(),request.getVisitas().getNovReporte(),request.getDsus_pcodigo());
			System.err.println("insertar en visitasSol "+resultadoVisita);
		}
		///actualizar dsus
		int resulFec=repository.actualizarFechaSuscripcion(new Date(), request.getDsus_ideregistr());
		return 1;
		}catch (Exception e) {
			return 0;
		}
		
	}
	/*
	public Page<GactGestionActualizacion> buscarGestion(BusquedaHomologacionGestionRequest request, Pageable pageable)
	{
		return gactRepository.findAll(GactGestionActualizacionSpecifications.byBusqueda(request), pageable);
	}
	*/
	
	public List<HashMap<String, Object>> buscarGestion(BusquedaHomologacionGestionRequest request,Integer empresaSesion)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();	

    	for(Object[] tmp2: consultaBaseGEstion(request,empresaSesion))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("gact_ideregistro", tmp2[0]);
    		tmp1.put("gact_fecgestion",tmp2[1]);
    		tmp1.put("uni_liquidacion",tmp2[2]);   
    		tmp1.put("uni_vista",tmp2[3]);
    		tmp1.put("gact_observaciones",tmp2[4]);
    		tmp1.put("usuario_nom",tmp2[5]);
    		tmp1.put("reclamo_numpqr",tmp2[6]);
    		tmp1.put("archivos", dgactRepository.buscarArchivos(((BigInteger) tmp2[0]).longValue()));
    		tmp1.put("dsus_pcodigo",tmp2[7]);
    		tmp1.put("novedad_rep",tmp2[8]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<Object[]> consultaBaseGEstion(BusquedaHomologacionGestionRequest request, Integer empresaSesion)
	{
		String consulta="SELECT \n" + 
				"gact.gact_ideregistro, \n" + 
				"to_char(gact.gact_fecgestion,'DD-MM-YYYY'), \n" + 
				"uni.uni_nombre1 as liquidacion, \n" + 
				"uni2.uni_nombre1 as vista, \n" + 
				"gact.gact_observaciones, \n" + 
				"usu.usuario_nom, \n" + 
				"gact.reclamo_numpqr,\n" + 
				"dsus.dsus_pcodigo,\n" + 
				"(\n" + 
				"SELECT\n" + 
				"radi.novedadradicado_nom\n" + 
				"FROM visitas_sol sol\n" + 
				"INNER JOIN novedades_radicado radi ON radi.novedadradicado_cod=sol.visitasol_codrep\n" + 
				"INNER JOIN empresas e2 on e2.empresa_cod =radi.novedadradicado_codemp\n" + 
				"WHERE sol.visitasol_codsus=dsus.dsus_pcodigo AND radi.novedadradicado_gru='C'\n" + 
				"AND sol.visitasol_numpqr=gact.reclamo_numpqr AND sol.visitasol_fecvis=gact.gact_fecgestion\n" + 
				"AND e2.empresa_sevemp = "+empresaSesion+" \n" + 
				"LIMIT 1\n" + 
				") as solucion \n" + 
				"FROM aseo.gact_gestion_actualizacion gact \n" + 
				"INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=gact.dsus_ideregistro\n" + 
				"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=gact.uni_novedad_liquidacion \n" + 
				"INNER JOIN uni_unidad uni2 ON uni2.uni_ideregistro=gact.uni_novedad_visita \n" + 
				"INNER JOIN usuarios usu ON usu.usu_ideregistro=gact.usu_ideregistro WHERE gact.dsus_ideregistro= "+request.getDsus_ideregistro();
		
		String condiciones="";
		ConvertGeneral convertir=new ConvertGeneral();
		if(request.getDesde().length()>0 && request.getHasta().length()>0)
		{
			condiciones=" AND gact.gact_fecgestion BETWEEN '"+request.getDesde()+"' AND '"+request.getHasta()+"'";
		}
		if(request.getVisita()>0)
		{
			condiciones=condiciones+ " AND gact.uni_novedad_visita="+request.getVisita();
				
		}
		if(request.getLiquidacion()>0)
		{
			condiciones=condiciones +" AND gact.uni_novedad_liquidacion="+ request.getLiquidacion();
				
		}
		if(request.getColaborador()>0)
		{
			condiciones=condiciones + " AND gact.usu_ideregistro="+request.getColaborador();
				
		}
		Query q=em.createNativeQuery(consulta+condiciones+" ORDER BY gact.gact_fecgestion ASC");
		return q.getResultList();
		
	}
	
	public List<HashMap<String, Object>> informacionReclamos(Integer dsus, Integer empresa)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();	

    	for(Object[] tmp2: repository.informacionReclamos(dsus, empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("reclamo_fecsol", tmp2[0]);
    		tmp1.put("reclamo_numpqr",tmp2[1]);
    		tmp1.put("reclamo_obssol",tmp2[2]);   
    		total.add(tmp1);
    	}
    	return total;
	}
	
	
	///cruce Informacion
	
	public List<HashMap<String, Object>> busquedaCruceInfromacion(BusquedaHomologacionCruceRequest request)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();	
    	for(Object[] tmp2: repository.cruceInformacion(request.getCatastral(), request.getTercero(), request.getDireccion(), request.getEmpresaAlt()))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dsus_pcodigo", tmp2[0]);
    		tmp1.put("dsus_ideregistr",tmp2[1]);
    		tmp1.put("ter_nomcompleto",tmp2[2]);
    		tmp1.put("pro_direccion", tmp2[3]);
    		tmp1.put("barrio_nom",tmp2[4]);
    		tmp1.put("dsus_estado",tmp2[5]); 
    		tmp1.put("dsus_fecinicio", tmp2[6]);
    		tmp1.put("dsus_fecexpira",tmp2[7]);
    		tmp1.put("pro_numcatastral",tmp2[8]); 
    		tmp1.put("pro_numcatastralnacional", tmp2[9]);
    		tmp1.put("ter_documento",tmp2[10]);
    		tmp1.put("empresa_nom",tmp2[11]); 
    		tmp1.put("cnre_nombre", tmp2[12]);
    		tmp1.put("pro_idepropieda",tmp2[13]);
    		tmp1.put("sus_ideregistro",tmp2[14]); 
    		tmp1.put("cic_nombre", tmp2[15]);
    		tmp1.put("uni_nombre1", tmp2[16]);
    		tmp1.put("pro_catestrato", tmp2[17]);
    		tmp1.put("consumos",lecturaRepository.ultimosConsumos(((BigInteger) tmp2[1]).intValue()));
    		tmp1.put("Alterna",empRepository.empresaAlternaDsus(((BigInteger) tmp2[14]).intValue(),request.getEmpresa()));  
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> columnasTabla(String tabla)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();	

    	for(Object[] tmp2: repository.columnasTabla(tabla))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("columna", tmp2[0]);  
    		total.add(tmp1);
    	}
    	return total;
	}
	
	
	////buscar convenios deshomologacion...
	public Integer buscarConveniosEmpresas(List<Integer> empresas)
	{
		String innners="";
		String condicionFactura=" AND dicn.dicn_empfactura='S'";
		String condicionFinal=" ORDER BY cnre.cnre_ideregistr ASC LIMIT 1";
		if(empresas.size()>1)
		{
			condicionFactura=" ";
			condicionFinal=" ORDER BY cnre.cnre_ideregistr DESC LIMIT 1";
		}
		for(Integer tmp: empresas)
		{
			innners=innners+" INNER JOIN LATERAL( \n" + 
					"SELECT\n" + 
					"DISTINCT cnre.cnre_ideregistr as ideConvenio,\n" + 
					"cnre.cnre_nombre,\n" + 
					"dicn.dicn_empfactura,\n" + 
					"dicn.emp_ideregistro\n" + 
					"FROM cnre_cnvrecaudo cnre\n" + 
					"INNER JOIN dicn_disconven dicn ON dicn.cnre_ideregistr=cnre.cnre_ideregistr\n" + 
					"WHERE dicn.emp_ideregistro IN ("+tmp+") "+condicionFactura+"--ORDER BY cnre.cnre_ideregistr DESC\n" + 
					") tmp"+tmp+" ON tmp"+tmp+".ideConvenio=cnre.cnre_ideregistr \n";
		}
		String consulta="SELECT\n" + 
				"cnre.cnre_ideregistr\n" + 
				"FROM cnre_cnvrecaudo cnre \n "+innners;
		Query q=em.createNativeQuery(consulta+condicionFinal);
		
		return (Integer)q.getResultList().get(0);
	}
	
	
	@Override
	protected JpaRepository<HomologacionEntity, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}
	
	public List<HashMap<String, Object>> resultadoBusquedaCruceDatos(BusquedaHomologacionRequest request,Pageable pageable)
	{
		String condiciones="";
		String condicionEmpresa="";
		String tmpFechaDesde = null;
		String tmpParametro =  null;
		Map<String, Object> datosClase=new HashMap<String, Object>();
		Reflection refle=new Reflection();
		datosClase=refle.refelxionGeneneral(request);  ///convierte la clase en un map
		for (Map.Entry<String, Object> entry : datosClase.entrySet())
		{
			if(entry.getValue()!=null)
			{
				if(entry.getValue().toString().length()>0 && !entry.getValue().toString().equals("0") && entry.getKey().indexOf("9")>=0)
				{
					//Pro_direccion 
					if(entry.getKey().indexOf("ñ")>=0)
					{
						condiciones=condiciones.length()==0 ? "WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+" ILIKE "+"'%"+entry.getValue()+"%'" : condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+" ILIKE "+"'%"+entry.getValue()+"%'";
					}
					else
					{
						/*
						 * Ciclo,Estado,FechaInicio,Pcodigo,Procatestrato,Barrio,UnitipoSuscriptor
						 * Numcatastral,NumcatastralNacional,uniTipoVivienda,ProyectoIdeRegistro,RutaIderegistro,
						 * Ter_documento,Ter_Ideregistro
						 */
						if(entry.getValue() instanceof String)
						{
							//System.err.println("entre a string "+ entry.getKey().indexOf("ñ"));
							condiciones=condiciones.length()==0 ? "WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+"='"+entry.getValue()+"'" : condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+"='"+entry.getValue()+"'";
						}
						else
						{
							//System.err.println("entre al else");
							condiciones=condiciones.length()==0 ? "WHERE "+entry.getKey().replace("9", ".").replace("ñ", "")+"="+entry.getValue() : condiciones+" AND "+entry.getKey().replace("9", ".").replace("ñ", "")+"="+entry.getValue();
						}
					}					
				}
				if(entry.getValue() instanceof Date) {
					String patron = "yyyy-MM-dd";
					SimpleDateFormat simpleFormato=new SimpleDateFormat(patron);
					
					if( entry.getKey().indexOf("8")>=0) {
						
						condiciones="WHERE " + tmpParametro + " between '"+ simpleFormato.format(entry.getValue()) + "' and '"+tmpFechaDesde+"'";
					}
					else {
							tmpFechaDesde = simpleFormato.format(entry.getValue());
							tmpParametro =  entry.getKey().replace("9", ".").toString();
							condiciones="WHERE " + tmpParametro + " ='"+tmpFechaDesde+"'";
					}
				}
		   }

		}
		if(request.getEmpresa()>0)
		{
			condiciones=condiciones.length()==0 ? "WHERE "+empresaAlternaCruce(request.getEmpresa(), request.getProidepropieda(), request.getDsusIderegistr(), request.getDsusPcodigo(),request.getEmpresaSession()) : condiciones+ " AND "+empresaAlternaCruce(request.getEmpresa(), request.getProidepropieda(), request.getDsusIderegistr(), request.getDsusPcodigo(),request.getEmpresaSession());
		}
		if(condiciones.length()==0)
		{
			condiciones="WHERE 10=1";
		}
		
		String pagination = "LIMIT "+pageable.getPageSize() + "OFFSET "+pageable.getOffset();
		
		List<HashMap<String, Object>> total=new ArrayList<>();	

    	for(Object[] tmp2: consultaBaseCruceDatos(condiciones,pagination,condicionEmpresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("Codigo", tmp2[0]);
    		tmp1.put("Identificacion",tmp2[1]);
    		tmp1.put("Nombres",tmp2[2]);
    		tmp1.put("Direccion",tmp2[3]);
    		tmp1.put("Catastral",tmp2[4]);
    		tmp1.put("Estrato",tmp2[5]);
    		tmp1.put("Ciclo",tmp2[6]);
    		tmp1.put("Clase",tmp2[16]);
    		tmp1.put("Fecha",tmp2[8]);
    		tmp1.put("Dsuscripcion",tmp2[9]);
    		tmp1.put("Convenio",tmp2[10]);
    		tmp1.put("Barrio",tmp2[11]);
    		tmp1.put("Estado",tmp2[12]);
    		tmp1.put("FechaExpira",tmp2[13]);
    		tmp1.put("Suscripcion",tmp2[14]);
    		tmp1.put("Medidor", tmp2[15]);
    		tmp1.put("Alterna",empRepository.empresaAlternaDsus(((BigInteger) tmp2[14]).intValue(),request.getEmpresaSession()));
    		tmp1.put("TipoDocumento", tmp2[17]);
    		tmp1.put("EmpIderegistro",request.getEmpresa());
    		//tmp1.put("dsusAlt",tmp2[18]);
    		//tmp1.put("cicloAlt",tmp2[19]);
    		tmp1.put("EmpNombre",empRepository.findById(request.getEmpresaSession().longValue()).orElse(new Empresas()).getEmpresaNom());
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<Object[]> consultaBaseCruceDatos(String condiciones,String pagination,String condicionEmpresa)
	{
		String consulta="SELECT DISTINCT \n" +  
				"			dsus.dsus_pcodigo as pcodigo,  \n" + 
				"			ter.ter_documento as documento,   \n" + 
				"			ter.ter_nomcompleto as nombreCompleto, \n" + 
				"			pro.pro_direccion as direccion, \n" + 
				"			pro.pro_numcatastral, \n" + 
				"			dsus.pro_catestrato as estrato, \n" + 
				"			cic.cic_nombre as ciclo,  \n" + 
				"			CASE WHEN dsus.uni_tipusosuscr=6 THEN 'Residencial'  \n" + 
				"					 WHEN dsus.uni_tipusosuscr=5 THEN 'C'  \n" + 
				"					 WHEN dsus.uni_tipusosuscr=7 THEN 'I'  \n" + 
				"					 WHEN dsus.uni_tipusosuscr=197 THEN 'GNV'  \n" + 
				"					 END as tiposuo,   \n" + 
				"			CAST(to_char(dsus.dsus_fecinicio, 'YYYY-MM-DD') as varchar) as inicio,  \n" + 
				"			dsus.dsus_ideregistr as idesuscripcion,  \n" +
				"			cnre.cnre_nombre as convenio,  \n" +
				"			barrio_nom as barrio,  \n" +
				"			dsus.dsus_estado,  \n" +
				"			CAST(to_char(dsus.dsus_fecact, 'YYYY-MM-DD') as varchar) as fechaexpira,  \n" +
				"			sus.sus_ideregistro,  \n" +
				"           pro.pro_idepropieda, \n"+
				"			uni.uni_nombre1 as clase,   \n"+
				"			uniTipo.uni_nombre1 \n"+
				//"			dd.dsus_ideregistr, \n"+
				//"           cics.cic_nombre \n"+
				"			FROM dsus_detsuscrip dsus  \n" + 
				"			INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro  \n" + 
				"			INNER JOIN proyectos proyecto ON dsus.uni_municipio=proyecto.proyecto_ideregistro  \n" + 
				"			INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio  \n" + 
				"			INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro  \n" + 
				"			INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro  \n" + 
				"			INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro  \n" +
				"			INNER JOIN cnre_cnvrecaudo cnre on cnre.cnre_ideregistr=sus.cnre_ideregistr  \n" +
				//condicionEmpresa + 
				"           inner join dicn_disconven dc on dc.cnre_ideregistr = cnre.cnre_ideregistr \n"  +
				"			INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr  \n"+
				//"			left join dsus_detsuscrip dd on dd.sus_ideregistro = sus.sus_ideregistro and \n"+
				//"			dd.dsus_ideregistr <> dsus.dsus_ideregistr \n"+
				//"			left JOIN cic_ciclo cics ON cics.cic_ideregistro=dd.cic_ideregistro \n"+				
				"			LEFT JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr  \n" + 
				"			LEFT JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro  \n" + 
				"			LEFT JOIN uni_unidad uniTipo ON uniTipo.uni_ideregistro=ter.uni_tipidentifica \n"+
				"			";
		
				Query q=em.createNativeQuery(consulta+condiciones +" limit 10");		
				return q.getResultList();	
	}
	

}
