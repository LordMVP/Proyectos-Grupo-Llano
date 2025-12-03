package com.bioagricola.hya.service.imp;

import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.GhomGestionhomologa;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.entity.DsialDsusInfoAlternaEntity;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.DsialDsusInfoAlternaRepository;
import com.bioagricola.homologaciones.repository.EmpresasRepository;
import com.bioagricola.homologaciones.repository.GhomGestionhomologaRepository;
import com.bioagricola.homologaciones.repository.HomologacionRepository;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.dto.CosuConsuscripDTO;
import com.bioagricola.hya.dto.DsusInfoAlternaDTO;
import com.bioagricola.hya.dto.DsusInfoDTO;
import com.bioagricola.hya.dto.FiltroDsusDTO;
import com.bioagricola.hya.service.DsusFiltroService;
import com.bioagricola.hya.util.Criterio;
import com.bioagricola.hya.util.Especificacion;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.bytebuddy.dynamic.DynamicType.Builder.FieldDefinition.Optional.Valuable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.persistence.Tuple;
import javax.swing.event.ListDataEvent;

/**
 *Clase que contiene la logica relacionada con el filtro de suscripciones
 * @author cperez@progracol.com
 */
@Service
public class DsusFiltroServiceImp implements DsusFiltroService {

    private final DsusDetsuscripRepository dsusDetsuscripRepository;

    private final UniUnidadRepository unidadRepository;

    private final IasusInforadicionalsuscripcionRepository infoAdSuscripcionRepository;

    private final BarriosRepository barriosRepository;

    private final EmpresasRepository empresasRepository;
    
    private final DsialDsusInfoAlternaRepository alternaRepository;
    
    private final ApiArcGis apiArcGis;
    
    @Autowired
	private HomologacionRepository repositoryHm;
    
    @Autowired
    private GhomGestionhomologaRepository gestionhomologaRepository;


    public DsusFiltroServiceImp(DsusDetsuscripRepository dsusDetsuscripRepository, UniUnidadRepository unidadRepository, IasusInforadicionalsuscripcionRepository infoAdSuscripcionRepository, BarriosRepository barriosRepository, EmpresasRepository empresasRepository, DsialDsusInfoAlternaRepository alternaRepositoryAux,ApiArcGis apiArcGis) {
        this.dsusDetsuscripRepository = dsusDetsuscripRepository;
        this.unidadRepository = unidadRepository;
        this.infoAdSuscripcionRepository = infoAdSuscripcionRepository;
        this.barriosRepository = barriosRepository;
        this.empresasRepository = empresasRepository;
        this.alternaRepository = alternaRepositoryAux;
        this.apiArcGis = apiArcGis;
    }

    @Override
    public Map<String, Object> getUnidadesFiltro() {
        Map<String,Object> map=new HashMap<>();
        map.put("estados",this.getEstados());
        map.put("empresasAlternas",this.getEmpresasAlternas());
        return map;
    }

    /**
     * Metodo para obtener informacion de la suscripcion seleccionada (app h&a)
     * @param dsuspcodigo codigo de suscripcion
     * @return info suscripcion
     */
    @Override
    public DsusInfoAlternaDTO buscarInfoSuscripcion(String dsuspcodigo) {
        DsusDetsuscrip suscripcion = this.dsusDetsuscripRepository.findByDsusPcodigo(dsuspcodigo);

        DsusInfoAlternaDTO suscripcionDto = new DsusInfoAlternaDTO();
        Optional<List<Object[]>> listCosu = this.dsusDetsuscripRepository.cosuConsuscriptDTOList(suscripcion.getDsusIderegistr());
        List<CosuConsuscripDTO> listaPar = new ArrayList<>();
        List<CosuConsuscripDTO> listaParFusion = new ArrayList<>();
                
        /* PAR_PARAMETROS*/
        List<Object[]> parametros=repositoryHm.parametroValor(suscripcion.getEmpIderegistro());
		ConvertGeneral convertir=new ConvertGeneral();
		
		String mLiquidacion = convertir.extraerValorParametro(parametros, "marcacion_liquidacion");		
        List<CosuConsuscripDTO> listConceptoLiquidacion = new ArrayList<CosuConsuscripDTO>();
        
        if(listCosu.isPresent()) {
        	AtomicInteger index = new AtomicInteger(0);
        	listConceptoLiquidacion = listCosu.get().stream()
        	        .map(t -> new CosuConsuscripDTO(
        	                t[0] instanceof Number ? ((Number) t[0]).longValue() : null,
        	                t[1] instanceof Number ? ((Number) t[1]).longValue() : null,
        	                t[2] instanceof Number ? ((Number) t[2]).intValue() : null,
        	                t[3] instanceof Number ? ((Number) t[3]).intValue() : null,
        	                t[4] instanceof Number ? ((Number) t[4]).intValue() : null,
        	                t[5] instanceof Timestamp ? new Date(((Timestamp) t[5]).getTime()) : null,
        	                t[6] instanceof Timestamp ? new Date(((Timestamp) t[6]).getTime()) : null,
        	                t[7] != null ? String.valueOf(t[7]) : null,
        	                (index.getAndIncrement() + 1)		        	                		
        	        ))
        	        .collect(Collectors.toList());
        }
		
		try {
			
			ObjectMapper obMp = new ObjectMapper ();
			listaPar = obMp.readValue(mLiquidacion, obMp.getTypeFactory().constructCollectionType(List.class, CosuConsuscripDTO.class));				
			Map<Long, CosuConsuscripDTO> mListaPar = listConceptoLiquidacion.stream().collect(Collectors.toMap(CosuConsuscripDTO::getUniConcepto, c -> c));
				
				listaParFusion = listaPar.stream().map(l -> {
					if(mListaPar.containsKey(l.getUniConcepto())) {
						CosuConsuscripDTO cosuTempo = mListaPar.get(l.getUniConcepto());
						l.setCosuEstado(cosuTempo.getCosuEstado());
						l.setCosuIdregistr(cosuTempo.getCosuIdregistr());						
					}
					return l;
				}).collect(Collectors.toList());	
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
        suscripcionDto.setDsusIderegistr(suscripcion.getDsusIderegistr());
        suscripcionDto.setDsusPcodigo(suscripcion.getDsusPcodigo());
        suscripcionDto.setNumCatastral(suscripcion.getProPropiedad().getProNumcatastral());
        suscripcionDto.setNumCatastral30(suscripcion.getProPropiedad().getProNumcatastralnacional());

        List<DsialDsusInfoAlternaEntity> DatosAlternos = alternaRepository.findEmpresaBySuscripcionAlterna("A",Long.parseLong(suscripcion.getDsusIderegistr().toString()));
                       
        List<DsusInfoDTO> lista_alterna = new ArrayList<>();
        for (DsialDsusInfoAlternaEntity datoAlterno : DatosAlternos) {
        	DsusInfoDTO alterna = new DsusInfoDTO();
        	alterna.setIdempresa(datoAlterno.getEmpAlterna());
            alterna.setPcodigo(datoAlterno.getDsialCodigoalterna());
            alterna.setMedidor(datoAlterno.getDsialNumerimedidor());
            suscripcionDto.setObservacion(datoAlterno.getDialObservaciones());
            lista_alterna.add(alterna);
		}
        
        suscripcionDto.setDsusAlterna(lista_alterna);
        suscripcionDto.setConceptosLiquidacion(listaParFusion);
        
        suscripcionDto.setNomCompleto(suscripcion.getTerIderegistro().getTerNomcompleto());
        suscripcionDto.setProDireccion(suscripcion.getProPropiedad().getProDireccion());

        Map<String,Object> barrio= new HashMap<>();
        barrio.put("llave",suscripcion.getUniBarrio().getBarrioIderegistro());
        barrio.put("valor",suscripcion.getUniBarrio().getBarrioNom());

        Map<String,Object> complemento=null;
        if(suscripcion.getProPropiedad().getUniCmpdireccion()!=null){
            complemento=new HashMap<>();
            complemento.put("llave",suscripcion.getProPropiedad().getUniCmpdireccion());
            complemento.put("valor",this.unidadRepository.findNameByUnit(suscripcion.getProPropiedad().getUniCmpdireccion()));
        }

        Map<String,Object> tipoUso= new HashMap<>();
        tipoUso.put("llave",suscripcion.getUniTipusosuscr());
        tipoUso.put("valor",this.unidadRepository.findNameByUnit(suscripcion.getUniTipusosuscr()));


        Map<String,Object> liquidacion= new HashMap<>();
        liquidacion.put("llave",suscripcion.getUniLiquidacion());
        liquidacion.put("valor",this.unidadRepository.findNameByUnit(suscripcion.getUniLiquidacion()));

        List<Map<String,Object>> condsPredio = suscripcion.getProPropiedad().getUniClasificacionvivienda();
        if(condsPredio==null) condsPredio = new ArrayList<>();
        List<Map<String,Object>> condsPredioResponse= new ArrayList<>();
        condsPredio.forEach(map->{
            Map<String,Object>resp = new HashMap<>();
            resp.put("llave", map.get("uni_ideregistro"));
            resp.put("valor", map.get("uni_nombre1"));
            condsPredioResponse.add(resp);
        });

        Map<String,Object> actividadComercial= new HashMap<>();
        if(suscripcion.getUniActsuscripc()!=null){
            actividadComercial.put("llave",suscripcion.getUniActsuscripc());
            actividadComercial.put("valor",this.unidadRepository.findNameByUnit(suscripcion.getUniActsuscripc()));
        }
        
        Map<String,Object> estrato = new HashMap<>();
        estrato.put("llave",suscripcion.getProCatestrato());
        estrato.put("valor",this.unidadRepository.findNameByEstAndUniCodigo1(191,suscripcion.getProCatestrato().toString()));

        suscripcionDto.setNomEstablecimiento(this.infoAdSuscripcionRepository.getNombreEstablecimientoBydsus(suscripcion.getDsusIderegistr()));
        suscripcionDto.setBarrio(barrio);
        suscripcionDto.setComplemento(complemento);
        suscripcionDto.setTipoUso(tipoUso);
        suscripcionDto.setLiquidacion(liquidacion);
        suscripcionDto.setCondicionPredio(condsPredioResponse);
        suscripcionDto.setActividadComercial(actividadComercial);
        suscripcionDto.setEstrato(estrato);
        return suscripcionDto;
    }

    /**
     * Metodo para consultar barrios
     * @param idempresa id empresa
     * @return listado de barrios
     */
    @Override
    public List<Map<Integer, String>> getBarrios(Integer idempresa) {
        return barriosRepository.findBarriosBySevemp(idempresa);
    }

    /**
     * Metodo para filtrar suscripciones
     * @param filtroDsusDto parametros del filtro
     * @param page pagina
     * @param size tamaño de pagina
     * @return resultados del filtro
     */
    @Override
    public Page<DsusInfoDTO> filtrar(FiltroDsusDTO filtroDsusDto, int page, int size) {
        Especificacion<DsusDetsuscrip> idempresaFiltro=null;
        Especificacion<DsusDetsuscrip> medidorFiltro=null;
        Especificacion<DsusDetsuscrip> pcodigoalternaFiltro=null;
        Especificacion<DsusDetsuscrip> pcodigobioFiltro=null;
        Especificacion<DsusDetsuscrip> pcodigobioDsusFiltro=null;
        Especificacion<DsusDetsuscrip> direccionFiltro=null;
        Especificacion<DsusDetsuscrip> idbarrioFiltro=null;
        Especificacion<DsusDetsuscrip> numpqrFiltro=null;
        Especificacion<DsusDetsuscrip> estadoFiltro=null;

        if(filtroDsusDto.getIdempresa()!=null){
            idempresaFiltro = new Especificacion(new Criterio("empIderegistro","=",filtroDsusDto.getIdempresa()));
        }

        if(filtroDsusDto.getMedidor()!=null && filtroDsusDto.getMedidor()!=""){
            medidorFiltro = new Especificacion(new Criterio("proPropiedad","proIdepropieda",":::",filtroDsusDto.getMedidor()));
        }

        if(filtroDsusDto.getPcodigoalterna()!=null && filtroDsusDto.getPcodigoalterna()!=""){
            pcodigoalternaFiltro = new Especificacion(new Criterio("dsusPcodigo","=",filtroDsusDto.getPcodigoalterna()));
        }

        if(filtroDsusDto.getPcodigobio()!=null && filtroDsusDto.getPcodigobio()!=""){
            medidorFiltro=null;
            pcodigoalternaFiltro=null;
            idempresaFiltro = new Especificacion(new Criterio("empIderegistro","=",317));
            pcodigobioFiltro = new Especificacion(new Criterio("dsusPcodigo","=",filtroDsusDto.getPcodigobio()));
            pcodigobioDsusFiltro = new Especificacion(new Criterio("dsusIderegistr","=",filtroDsusDto.getPcodigobio()));
        }

        if(filtroDsusDto.getDireccion()!=null && filtroDsusDto.getDireccion()!=""){
            direccionFiltro = new Especificacion(new Criterio("proPropiedad","proDireccion",":::",filtroDsusDto.getDireccion().trim().toUpperCase()));
        }

        if(filtroDsusDto.getIdbarrio()!=null){
            idbarrioFiltro = new Especificacion(new Criterio("uniBarrio","barrioIderegistro","=",filtroDsusDto.getIdbarrio()));
        }

        if(filtroDsusDto.getEstado()!=null  && filtroDsusDto.getEstado()!=""){
            estadoFiltro = new Especificacion(new Criterio("dsusEstado",":",filtroDsusDto.getEstado()));
        }

        if(filtroDsusDto.getNumpqr()!=null  && filtroDsusDto.getNumpqr()!=""){
            numpqrFiltro = new Especificacion(new Criterio("reclamos","reclamoNumpqr","::",filtroDsusDto.getNumpqr().trim()));
        }

        Page<DsusInfoDTO> results = dsusDetsuscripRepository.findAll(
                Specification.where(idempresaFiltro).and(medidorFiltro).and(pcodigoalternaFiltro).and(pcodigobioDsusFiltro).or(pcodigobioFiltro).and(direccionFiltro).and(idbarrioFiltro).and(estadoFiltro).and(numpqrFiltro),
                PageRequest.of(page, size, Sort.by("dsusIderegistr").descending())).map(this::complementaConsulta);

        String token = apiArcGis.getAccessTokenTwo();
        
        for (DsusInfoDTO dsusInfoDTO : results) {
        	String consulta = "COD_BIOAGRICOLA+IN+" + "('"+dsusInfoDTO.getPcodigo()+"')";
        	List<LinkedHashMap<String,Object>> coordenadas = apiArcGis.consultaCoordenadasSuscripcionBio(token, consulta);
        	if(coordenadas!=null && !coordenadas.isEmpty()){
                Map<String,Object> features = coordenadas.get(0);
                Map<String,Object> attributes = (Map<String,Object>) features.get("attributes");
                Map<String,Object> geometry = (Map<String,Object>) features.get("geometry");
                dsusInfoDTO.setFacturacion(attributes.get("FACTURACION")==null? "" : attributes.get("FACTURACION").toString());
                dsusInfoDTO.setLongitude(geometry.get("x")==null? "" : geometry.get("x").toString());
                dsusInfoDTO.setLatitude(geometry.get("y")==null? "" : geometry.get("y").toString());
            }
		}
        //Iterables.removeIf(results, Predicates.isNull()).;
        return results;
    }

    /**
     * Metodo para consultar suscripcion alterna de bioagricola
     * @param dsus detalle suscripcion
     * @return detalle suscripcion dto
     */
    private DsusInfoDTO complementaConsulta(DsusDetsuscrip dsus){
        List<Object[]> empAlternas=this.empresasRepository.listaEmpresasAlternasHomologablesOld(dsus.getEmpIderegistro());
        if(dsus.getEmpIderegistro()==317){
            DsusInfoDTO dsusInfoDto= this.convertir(dsus);
            DsusDetsuscrip dsusAlterna=this.consultarAlterna(dsus,empAlternas);
            if (dsusAlterna!=null){
                DsusInfoDTO dsusAlternaDto= new DsusInfoDTO();
                dsusAlternaDto.setPcodigo(dsusAlterna.getDsusPcodigo());
                dsusAlternaDto.setDsusid(dsusAlterna.getDsusIderegistr());
                dsusAlternaDto.setIdempresa(dsusAlterna.getEmpIderegistro());
                dsusAlternaDto.setNombrempresa(this.empresasRepository.findNombreBySevemp(dsusAlterna.getEmpIderegistro()));
                dsusInfoDto.setAlterna(dsusAlternaDto);
            }
            return dsusInfoDto;
        }else{
            DsusDetsuscrip dsusBio=this.consultarAlterna(dsus,empAlternas);
            if (dsusBio!=null){
                DsusInfoDTO dsusInfoDto= this.convertir(dsusBio);
                DsusInfoDTO dsusAlternaDto= new DsusInfoDTO();
                dsusAlternaDto.setPcodigo(dsus.getDsusPcodigo());
                dsusAlternaDto.setDsusid(dsus.getDsusIderegistr());
                dsusAlternaDto.setIdempresa(dsus.getEmpIderegistro());
                dsusAlternaDto.setNombrempresa(this.empresasRepository.findNombreBySevemp(dsus.getEmpIderegistro()));
                dsusInfoDto.setAlterna(dsusAlternaDto);
                return dsusInfoDto;
            }else{
                DsusInfoDTO dsusInfoDto= this.convertir(dsus);
                return dsusInfoDto;
            }
        }
    }

    /**
     * Metodo para convertir entidad dsus a dto
     * @param dsus entidad dsus
     * @return dto dsus
     */
    private DsusInfoDTO convertir(DsusDetsuscrip dsus) {
        DsusInfoDTO dsusDto = new DsusInfoDTO();
        dsusDto.setIdempresa(dsus.getEmpIderegistro());
        dsusDto.setNombrempresa(this.empresasRepository.findNombreBySevemp(dsus.getEmpIderegistro()));
        dsusDto.setTernombre(dsus.getTerIderegistro().getTerNomcompleto());
        dsusDto.setPcodigo(dsus.getDsusPcodigo());
        dsusDto.setDsusid(dsus.getDsusIderegistr());
        dsusDto.setEstado(this.getEstado(dsus.getDsusEstado()));
        dsusDto.setTipouso(this.unidadRepository.findNameByUnit(dsus.getUniTipusosuscr()));
        dsusDto.setDireccion(dsus.getProPropiedad().getProDireccion());
        String compdireccion="";
        if(dsus.getProPropiedad().getUniCmpdireccion()!=null){
            compdireccion=this.unidadRepository.findNameByUnit(dsus.getProPropiedad().getUniCmpdireccion());
        }
        dsusDto.setBarrio(dsus.getUniBarrio().getBarrioNom() +" "+ compdireccion);
        dsusDto.setMedidor(dsus.getProPropiedad().getProIdepropieda());
        return dsusDto;
    }

    /**
     * Consulta de suscripcion alterna
     * @param dsus detalle suscripcion
     * @param empAlternas listado de empresas alternas
     * @return detalle suscripcion
     */
    private DsusDetsuscrip consultarAlterna(DsusDetsuscrip dsus,List<Object[]> empAlternas){
        DsusDetsuscrip dsusAlterna=null;
        for (Object[] obj:empAlternas) {
            dsusAlterna = this.dsusDetsuscripRepository.findBySusIderegistroAndEmpIderegistroAndTerIderegistro_TerIderegistro(dsus.getSusIderegistro(),(Integer) obj[0],dsus.getTerIderegistro().getTerIderegistro());
            if (dsusAlterna!=null) break;
        }
        return dsusAlterna;
    }

    /**
     * Metodo que retorna los estados de suscripcion
     * @return lista de estados
     */
    private List<Map<String, String>> getEstados() {
       String[] estados={"A","P","U","E","R"};
       List<Map<String,String>> estadosList=new ArrayList<>();
        for (String estado:estados) {
            Map<String,String> estadoMap=new HashMap<>();
            //estadoMap.put(estado,this.getEstado(estado));
            estadoMap.put("llave", estado);
            estadoMap.put("valor", this.getEstado(estado));
            estadosList.add(estadoMap);
        }
        return estadosList;
    }

    private List<Map<String, Object>> getEmpresasAlternas() {
        List<Map<String, Object>> total=new ArrayList<>();
        for(Object[] obj: this.empresasRepository.listaEmpresasAlternasHomologablesOld(317))
        {
            Map<String, Object> empresa=new HashMap<>();
            empresa.put("llave", obj[0]);
            empresa.put("valor", obj[1]);
            total.add(empresa);
        }
        return total;
        }

    /**
     * Metodo que retorna valor textual de estados
     * @param estado estado
     * @return significado
     */
    public String getEstado(String estado){
        switch (estado){
            case "A":
                return "Activo";
            case "P":
                return "Pendiente";
            case "U":
                return "Suspensión Usuario";
            case "E":
                return "Eliminada";
            case "R":
                return "Suspensión Remodelación";
            default:
                return null;
        }
    }
}
