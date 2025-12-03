package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.GhomGestionhomologa;
import com.bioagricola.homologaciones.repository.GhomGestionhomologaRepository;

@Service
public class GhomGestionhomologaService extends AbstractService<GhomGestionhomologa, Long>
{
	public GhomGestionhomologaService() {
		// TODO Auto-generated constructor stub
		super(GhomGestionhomologa.class);
	}
	@Autowired
	GhomGestionhomologaRepository repository;
	
	@PersistenceContext
	private EntityManager em;
	
	public List<HashMap<String, Object>> informacionGhom(Integer dsus,String condiciones,Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: busqueda1(dsus,condiciones, empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("Fecha", tmp2[0]);
    		tmp1.put("Convenio",tmp2[1]);
    		tmp1.put("Empresa",tmp2[2]);
    		tmp1.put("NombreCompleto",tmp2[3]);
    		tmp1.put("SuscripcionAlterna",tmp2[4]);
    		tmp1.put("Usuario",tmp2[5]);
    		tmp1.put("Observaciones",tmp2[6]);
    		tmp1.put("Empresa1",tmp2[7]);
    		tmp1.put("Empresa2",tmp2[8]);
    		tmp1.put("idSuscripcion",tmp2[9]);
    		tmp1.put("iddgho",tmp2[10]);
    		tmp1.put("idghom", tmp2[11]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<Object[]> busqueda1(Integer dsus,String condiciones,Integer empresa)
	{
		if(empresa>0)
		{
			condiciones=condiciones+" AND ghom.emp_ideregistro="+empresa;
					//+ "dsus.dsus_ideregistr and dgho.ghom_ideregistr = ghom.ghom_ideregistr";
		}
		String consulta="SELECT\n" +
				//"DISTINCT\n"+
				"to_char(ghom.ghom_fecharegistro,'DD-MM-YYYY'),\n" + 
				"cnre.cnre_nombre,\n" + 
				"emp.empresa_nom,\n" + 
				"ter.ter_nomcompleto,\n" + 
				/*"(SELECT\n" + 
				"detalle.dsus_pcodigo\n" + 
				"FROM aseo.dgho_detallegestionhomologa detalle\n" + 
				"INNER JOIN empresas empTmp ON empTmp.empresa_sevemp=detalle.emp_ideregistro\n" + 
				"AND detalle.ghom_ideregistr=ghom.ghom_ideregistr\n" + 
				"ORDER BY detalle.emp_ideregistro DESC\n" + 
				"limit 1\n" + 
				"),\n" + */
				"dgho.dsus_pcodigo,\n"+
				"usu.usuario_nom,\n" +
				"ghom.observaciones,\n" +
				"(select c2.cnre_nombre FROM aseo.dgho_detallegestionhomologa d2\n"+
				"inner join sus_suscripcion s2 on s2.sus_ideregistro = d2.sus_ideregistro_homologados\n"+
				"inner join cnre_cnvrecaudo c2 on c2.cnre_ideregistr = s2.cnre_ideregistr\n"+
				"where d2.ghom_ideregistr = ghom.ghom_ideregistr limit 1) as empresa1,\n"+
				"c3.cnre_nombre as empresa2,\n"+
				"dgho.dsus_ideregistr, \n" +
				"dgho.dgho_ideregistr, \n" +
				"ghom.ghom_ideregistr \n" +
				"FROM dsus_detsuscrip dsus \n" +
				//+ ",aseo.dgho_detallegestionhomologa dgho,aseo.ghom_gestionhomologa ghom\n" + 
				"inner join aseo.ghom_gestionhomologa ghom on ghom.dsus_ideregistr = dsus.dsus_ideregistr "+
				"inner join aseo.dgho_detallegestionhomologa dgho on dgho.ghom_ideregistr = ghom.ghom_ideregistr "+
				"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=ghom.sus_ideregistro\n" + 
				//"INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro=sus.sus_ideregistro\n" + 
				"INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr=sus.cnre_ideregistr\n" + 
				"INNER JOIN empresas emp ON emp.empresa_sevemp=ghom.emp_ideregistro\n" + 
				"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=sus.ter_ideregistro\n" + 
				"INNER JOIN usuarios usu ON usu.usu_ideregistro=ghom.usu_ideregistro\n" +
				"inner join sus_suscripcion s3 on s3.sus_ideregistro = ghom.sus_ideregistro\n"+
				"inner join cnre_cnvrecaudo c3 on c3.cnre_ideregistr = s3.cnre_ideregistr \n" ;
				
		Query q=em.createNativeQuery(consulta+" WHERE dsus.dsus_ideregistr="+dsus+condiciones+" order by ghom.ghom_fecharegistro desc");
		//Query q=em.createNativeQuery(consulta+condiciones);
		return q.getResultList();
	}

	@Override
	protected JpaRepository<GhomGestionhomologa, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}
	
}
