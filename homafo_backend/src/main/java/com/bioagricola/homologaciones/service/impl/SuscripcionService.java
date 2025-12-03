package com.bioagricola.homologaciones.service.impl;

import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.ProPropiedad;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.ProPropiedadRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.dto.SuscripcionDto;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.HomologacionRepository;
import com.bioagricola.homologaciones.repository.MubaMunbarrioRepository;
import com.bioagricola.homologaciones.repository.SuscripcionRepository;
import com.bioagricola.hya.service.DsusSuscripcionService;

import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Log4j2
@Service
public class SuscripcionService {
	
	private final Integer EMPRESA_ASEO=317;
	private final Integer EMPRESA_GAS = 322;
	private final Integer EMPRESA_ENERGIA = 299;
	private final Integer CNRE_HOMASEOGAS = 2;
	private final Integer CNRE_HOMASEOENERGIA = 12;
	private final Long UNI_MUNICIPIO = 30L;

    @Autowired
    private SuscripcionRepository repository;

    @Autowired
    private TerTerceroRepository terceroRepository;
    
    @Autowired
	private EmpresasService empresaService;
    
    @Autowired
    private MubaMunbarrioRepository mubaRepository;
    
    @Autowired
    ProPropiedadRepository propiedadRepository;
    
    @Autowired
    DsusDetsuscripRepository dsusRepository;
    
    @Autowired
    DsusSuscripcionService dsusService;
    
    @Autowired
	private HomologacionRepository repositoryHm;
    
    @Autowired
    private BarriosRepository barrioRepos;
    
	@PersistenceContext
	private EntityManager em;

    public SusSuscripcion findById(Long id) {
        return this.repository.findById(id).orElseThrow(() -> new EntityNotFoundException(""));
    }

    public List<HashMap<String, Object>> informacionDsusHomo(Integer sus, Integer dsus) {
        List<HashMap<String, Object>> total = new ArrayList<>();

        for (Object[] tmp2 : repository.informacionDsusHomo(sus, dsus)) {
            HashMap<String, Object> tmp1 = new HashMap<>();
            tmp1.put("nombreCompleto", tmp2[0]);
            tmp1.put("pcodigo", tmp2[1]);
            tmp1.put("estrato", tmp2[2]);
            tmp1.put("empresa", tmp2[3]);
            tmp1.put("medidor", tmp2[4]);
            tmp1.put("idSuscripcion", tmp2[5]);
            total.add(tmp1);
        }
        return total;
    }

    /**
     * Metodo para agregar convenios a tercero (crear suscriptor)
     *
     * @param susSuscripcion suscripcion
     * @param idUs         id de usuario logueado
     * @return suscripcion creada
     */
    public SusSuscripcion create(SusSuscripcion susSuscripcion, Integer idUs) {
        if (susSuscripcion.getTerIderegistro() == null)
            throw new IllegalArgumentException("Id de tercero es requerido");

        if (!terceroRepository.existsByTerIderegistro(susSuscripcion.getTerIderegistro().longValue()))
            throw new IllegalArgumentException("No se encuentra el tercero.");

        susSuscripcion.setSusModconvenio("N");
        susSuscripcion.setUsuIderegistro(idUs);
        return repository.save(susSuscripcion);
    }
    
    public DsusDetsuscrip creaSuscripcion(SuscripcionDto sus,Integer usuario,Integer idemp) {
    	
    	List<Object[]>dsusDuplicate = repository.dsusSuscripcionListado(sus.getSusIderegistro() ,idemp);
    	if(dsusDuplicate.size() > 0 ) return null;
		SusSuscripcion sus1= repository.findById(sus.getSusIderegistro()).orElseThrow(()-> new EntityNotFoundException());
		
		SusSuscripcion susNew= new SusSuscripcion();
		String consultaConvenio=String.format("select cast(registro.valor ->> 'id_convenio_hijo' as bigint) as id_convenio_hijo "
				+ "FROM "
				+ "    ( "
				+ "        SELECT "
				+ "            jsonb_array_elements((json_extract_path_text(pp.par_parametro,'HOMOLOGACIONES')::json ->> 'CONVENIOS_HOMOLOGACION')::jsonb) AS valor "
				+ "        FROM public.par_parametro pp "
				+ "        WHERE pp.emp_ideregistro = %d "
				+ ") registro "
				+ "where (registro.valor ->> 'id_convenio_padre') = %d ",idemp,sus1.getCnreIderegistr());
		Query qc=em.createNativeQuery(consultaConvenio);
		Integer cnreNew = null ;
		Object result =qc.getSingleResult();
    	if (result != null) {
    	    cnreNew =  Integer.parseInt(result.toString());
    	} else {
    	    throw new IllegalStateException("No se obtuvo ningún resultado del Convenio Padre " + sus1.getCnreIderegistr());
    	}
		susNew.setCnreIderegistr(cnreNew);
		susNew.setTerIderegistro(sus1.getTerIderegistro());
		susNew.setSusModconvenio(sus1.getCnreIderegistr() == cnreNew ? "N" : "S");
		susNew.setSusDescripcion("Cruce de informacion homologacion");
		susNew.setUsuIderegistro(usuario);
  	
    	String consulta=String.format("select * from dsus_detsuscrip dd where dd.sus_ideregistro = %d",sus1.getSusIderegistro().intValue());
		Query q=em.createNativeQuery(consulta,DsusDetsuscrip.class);
		List<DsusDetsuscrip> dsusLista = q.getResultList();
		SusSuscripcion susNew2=repository.save(susNew);  
 	   	
		DsusDetsuscrip dsus= new DsusDetsuscrip();
		
    	if(dsusLista.size()>0) {    		
    		
        	ProPropiedad pro=new ProPropiedad();
        	Barrios barrio=new Barrios();
        	
        	List<Object[]> parametros=repositoryHm.parametroValor(idemp);
    		ConvertGeneral convertir=new ConvertGeneral();
        	
    		for(int i = 0; i < dsusLista.size() ; i ++) {
    			
    			DsusDetsuscrip dsus2= dsusLista.get(i);
    			dsus2.setSusIderegistro(susNew2.getSusIderegistro());
    			dsusRepository.save(dsus2);
    		}
    		
    			List<Object[]>dsusTemporal = repository.dsusSuscripcionListado(sus.getSusIderegistro() ,susNew2.getCnreIderegistr() == 
    					Integer.parseInt(convertir.extraerValorParametro(parametros, "cnre_id_emsa")) ? EMPRESA_ENERGIA : EMPRESA_GAS);
    			DsusDetsuscrip dsus2 = dsusRepository.findById(Long.parseLong(dsusTemporal.get(0).toString())).get();
    			dsus.setDsusEstado("P");
        		dsus.setDsusDescripcion("CruceInformacion");  		
        		dsus.setDsusPcodigo(dsusService.generatePCode());
        		
        		dsus.setSusIderegistro(susNew2.getSusIderegistro());
        		dsus.setTerIderegistro(dsus2.getTerIderegistro());
        		
        		ProPropiedad pro1=dsus2.getProPropiedad();
        		pro.setProIdepropieda("SIN CONTADOR");
        		pro.setProEstado("A");
        		pro.setProDescripcion("Casa");
        		pro.setProDireccion(pro1.getProDireccion());
        		pro.setTerIderegistro(pro1.getTerIderegistro());
        		pro.setProDigitos(5);        		
        		pro.setEstTippropieda(Long.parseLong(convertir.extraerValorParametro(parametros, "est_tipo_pro_aseo")));
        		pro.setUniTippropieda(Long.parseLong(convertir.extraerValorParametro(parametros, "uni_tipo_pro_casa")));        		
           	
            	dsus.setUniBarrio(barrio);
            	pro.setMubaSector(pro1.getMubaSector());
            	pro.setProSeccion(pro1.getProSeccion());
            	pro.setProManzana(pro1.getProManzana());
        		pro.setUniMunicipio(UNI_MUNICIPIO);            	
        		pro.setUniBarrio(Long.parseLong(convertir.extraerValorParametro(parametros, "uni_barrio_sinnombre")));
        		pro.setProZona(pro1.getProZona());
        		pro.setProAltriesgo("N");
        		pro.setProGpslatitud(pro1.getProGpslatitud());
        		pro.setProGpslongitud(pro1.getProGpslongitud());
        		pro.setProNumcatastral(pro1.getProNumcatastral());
        		pro.setProZona(pro1.getProZona());
        		pro.setUsuIderegistro(Long.parseLong(usuario.toString()));
        		pro.setProFecha(new Timestamp(new Date().getTime()));
        		pro.setProNumcatastralnacional(pro1.getProNumcatastralnacional());

        		dsus.setProPropiedad(propiedadRepository.save(pro));
        		
        		dsus.setProIderegistro(pro.getProIderegistro());
        		dsus.setUniBarrio(barrioRepos.findById(Long.parseLong(convertir.extraerValorParametro(parametros, "uni_barrio_sinnombre"))).get());
        		dsus.setUniMunicipio(UNI_MUNICIPIO);
        		dsus.setEstTipsuscripc(Long.parseLong(convertir.extraerValorParametro(parametros, "est_tipo_sus_aseo")));
        		dsus.setUniTipsuscripc(Long.parseLong(convertir.extraerValorParametro(parametros, "uni_tipo_sus")));
        		dsus.setEstTipusosuscr(Integer.parseInt(convertir.extraerValorParametro(parametros, "est_tipouso_sus")));
        		dsus.setUniTipusosuscr(Long.parseLong(sus.getTipoUso().toString()));        		
        		dsus.setEmpIderegistro(idemp);
        		String consultaCiclo=String.format("select dc.cic_ideregistro from public.dcic_detciclo dc where dc.dist_ideregistro = %d",dsus.getCicIderegistro());
        		Query qCiclo=em.createNativeQuery(consulta);        		
        		Long cicloCiclo = null ;
        		Object resultCiclo =qCiclo.getSingleResult();
            	if (resultCiclo != null) {
            	    cicloCiclo =  Long.parseLong(resultCiclo.toString());
            	} else {
            	    throw new IllegalStateException("No se obtuvo ningún resultado del Ciclo Padre " + sus1.getCnreIderegistr());
            	}        		
        		dsus.setCicIderegistro(cicloCiclo);
        		dsus.setEstLiquidacion(dsus2.getEstLiquidacion());
        		dsus.setUniLiquidacion(Long.parseLong(sus.getTipoLiquidacion().toString()));
        		dsus.setDsusFecinicio(new Date());
        		dsus.setProCatestrato(dsus2.getProCatestrato());
        		dsus.setDsusFactor(dsus2.getDsusFactor());
        		dsus.setUsuIderegistro(Long.parseLong(usuario.toString())); 
        		dsus.setDsusFecact(new Timestamp(new Date().getTime()));   		
    		  		
    		dsusRepository.save(dsus);    		
    	}
		System.out.println(susNew2.getSusIderegistro()+" getSusIderegistro");
    	return dsus;
    }
    
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

}
