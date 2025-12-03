package com.bioagricola.hya.service.imp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.json.JSONArray;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.CnreCnvrecaudo;
import com.bioagricola.common.entity.CosuConsuscrip;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.GhomGestionhomologa;
import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;
import com.bioagricola.common.entity.ProPropiedad;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.CnreCnvrecaudoRepository;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.ProPropiedadRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.homologaciones.entity.DsialDsusInfoAlternaEntity;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.CosuConsuscripRepository;
import com.bioagricola.homologaciones.repository.DsialDsusInfoAlternaRepository;
import com.bioagricola.homologaciones.repository.EmpresasRepository;
import com.bioagricola.homologaciones.repository.GhomGestionhomologaRepository;
import com.bioagricola.homologaciones.repository.LiqLiquidacionRepository;
import com.bioagricola.homologaciones.repository.SuscripcionRepository;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.dto.AlternaDto;
import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.ConLiquidacionDto;
import com.bioagricola.hya.dto.TmpActSuscripcionDTO;
import com.bioagricola.hya.entity.TmpActSuscripcion;
import com.bioagricola.hya.repository.TmpActSuscripcionRepository;
import com.bioagricola.hya.service.ActHomologacionService;
import com.bioagricola.hya.service.AzService;
import com.bioagricola.hya.service.DsusSuscripcionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;

import net.minidev.json.JSONObject;


/**
 *Clase que contiene la logica relacionada con la tabla intermedia de actualizacion de suscripciones
 * @author cperez@progracol.com
 */
@Service
public class ActHomologacionServiceImp implements ActHomologacionService {

    private final TmpActSuscripcionRepository actSuscripcionRepository;

    private final DsusDetsuscripRepository dsusRepository;

    private final UniUnidadRepository unidadRepository;

    private final LiqLiquidacionRepository liquidacionRepository;

    private final BarriosRepository barriosRepository;

    private final EmpresasRepository empresasRepository;

    private final IasusInforadicionalsuscripcionRepository infoAdSuscripcionRepository;

    private final ProPropiedadRepository propiedadRepository;

    private final SuscripcionRepository suscripcionRepository;
    
    private final TerTerceroRepository terceroRepository;
    
    private final CosuConsuscripRepository cosuConSuscripRepository;
    
    private final DsialDsusInfoAlternaRepository alternaRepository;

    private final AzService azService;

    private final ApiArcGis apiArcGis;
    
    private final CnreCnvrecaudoRepository cnreCnvrecaudoRepository;
    
    @Autowired
    private ParParametroService _parParametroService;
    
    @Autowired
    DsusSuscripcionService dsusService;

    public ActHomologacionServiceImp(
    		TmpActSuscripcionRepository actSuscripcionRepository, DsusDetsuscripRepository dsusRepository, 
    		UniUnidadRepository unidadRepository, LiqLiquidacionRepository liquidacionRepository, 
    		BarriosRepository barriosRepository, EmpresasRepository empresasRepository, 
    		IasusInforadicionalsuscripcionRepository infoAdSuscripcionRepository, 
    		ProPropiedadRepository propiedadRepository, SuscripcionRepository suscripcionRepository, 
    		CosuConsuscripRepository cosuRepository, DsialDsusInfoAlternaRepository alternaRepositoryAux, 
    		AzService azService, ApiArcGis apiArcGis, TerTerceroRepository terceroRepository,
    	    CnreCnvrecaudoRepository cnreCnvrecaudoRepository
    ) {
        this.actSuscripcionRepository = actSuscripcionRepository;
        this.dsusRepository = dsusRepository;
        this.unidadRepository = unidadRepository;
        this.liquidacionRepository = liquidacionRepository;
        this.barriosRepository = barriosRepository;
        this.empresasRepository = empresasRepository;
        this.infoAdSuscripcionRepository = infoAdSuscripcionRepository;
        this.propiedadRepository = propiedadRepository;
        this.suscripcionRepository = suscripcionRepository;
        this.cosuConSuscripRepository = cosuRepository;
        this.alternaRepository = alternaRepositoryAux;
        this.azService = azService;
        this.apiArcGis = apiArcGis;
        this.terceroRepository = terceroRepository;
        this.cnreCnvrecaudoRepository = cnreCnvrecaudoRepository;
    }

    @Override
    public Map<String, Object> listarUnidadesFormulario() {
        org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
        JSONArray marcacionLiquidacionArray = hya_parametros.getJSONArray("marcacion_liquidacion");
        JSONArray tipoFacturacionArray = hya_parametros.getJSONArray("tipo_facturacion");
        
        List<Map<String, Object>> marcacionList = new ArrayList<>();
        if (marcacionLiquidacionArray != null) {
            for (int i = 0; i < marcacionLiquidacionArray.length(); i++) {
                org.json.JSONObject item = marcacionLiquidacionArray.getJSONObject(i);
                
                Map<String, Object> mapItem = new HashMap<>();
                mapItem.put("nombre", item.optString("nombre", ""));
                mapItem.put("uniConcepto", item.optInt("uniConcepto", 0));
                mapItem.put("orden", item.optInt("orden", 0));
                marcacionList.add(mapItem);
            }
        }
        
        List<Map<String, Object>> tipoFacturacionList = new ArrayList<>();
        if (tipoFacturacionArray != null) {
            for (int i = 0; i < tipoFacturacionArray.length(); i++) {
                org.json.JSONObject item = tipoFacturacionArray.getJSONObject(i);
                
                Map<String, Object> mapItem = new HashMap<>();
                mapItem.put("nombre", item.optString("nombre", ""));
                mapItem.put("color", item.optString("color", ""));
                mapItem.put("orden", item.optString("orden", ""));
                tipoFacturacionList.add(mapItem);
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("tiposUso",this.unidadRepository.findUnidadesByEstAndEmpresa(hya_parametros.getInt("est_tipouso"),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("liquidaciones",this.liquidacionRepository.liquidacionesByEmp(UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("condsPredio",this.unidadRepository.findUnidadesByClaseAndEmpresa(hya_parametros.getInt("clase_connpredio"),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("actsComercial",this.unidadRepository.findUnidadesByClaseAndEmpresa(hya_parametros.getInt("clase_actscomercial"),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("compsDireccion",this.unidadRepository.findComplementosBarriosBio(hya_parametros.getInt("est_complementosdirbio")));
        response.put("estratos", this.unidadRepository.findEstratosByEstAndEmp(hya_parametros.getInt("est_estratos"),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("marcacionLiquidacion", marcacionList);
        response.put("tipoFacturacion", tipoFacturacionList);
        return response;
    }

    @Override
    public List<Map<String, Object>> listarBarrios(Long dsusIderegistro, Integer idempresa) {
        Integer municipioSus= dsusRepository.findProyByDsusIderegistro(dsusIderegistro).intValue();
        List<Object[]> barriosObject = this.unidadRepository.findBarriosByMunAndEnt(municipioSus,idempresa);
        List<Map<String, Object>> barriosResponse= new ArrayList<>();
        for (Object[] obj:barriosObject) {
            Map<String, Object> barrioMap=new HashMap<>();
            barrioMap.put("llave",obj[0]);
            barrioMap.put("valor",obj[1]);
            barriosResponse.add(barrioMap);
        }
        return barriosResponse;
    }

    /**
     * Metodo para listar registros de actualizacion pendientes
     * @return lista de registros pendientes
     */
    @Override
    public Page<TmpActSuscripcionDTO> listarTableOthers(BasicSearchDTO search,int page, int size) {
        Page<TmpActSuscripcionDTO> responseList;
        if(search.getSearch()==null || search.getSearch().equals("")){
            responseList = this.actSuscripcionRepository.listarPendientesTableOthers('P', PageRequest.of(page, size, Sort.by("actsusIderegistro").descending())).map(this::convertirDto);
        }else{
            try{
                responseList = this.actSuscripcionRepository.listarPendientesSuscripcion('P',Long.valueOf(search.getSearch()), PageRequest.of(page, size, Sort.by("actsusIderegistro").descending())).map(this::convertirDto);
            } catch (NumberFormatException nex){
                throw new NumberFormatException("Id suscripción invalido "+search.getSearch());
            }
        }
        return responseList;
    }
    
    /**
     * Metodo para listar registros de actualizacion pendientes
     * @return lista de registros pendientes
     */
    @Override
    public Page<TmpActSuscripcionDTO> listarTablePunto(int page, int size) {
        Page<TmpActSuscripcionDTO> responseList = this.actSuscripcionRepository.listarPendientesTablePunto('P', PageRequest.of(page, size, Sort.by("actsusIderegistro").descending())).map(this::convertirDto);
        return responseList;
    }
    
    /**
     * Metodo para listar registros de actualizacion sincronizados de una suscripcion
     * @return lista de registros sincronizados suscripcion
     */
    @Override
    public Page<TmpActSuscripcionDTO> listarRegSyncSuscripcion(Long dsusIderegistro,int page, int size) {
        Page<TmpActSuscripcionDTO> responseList = this.actSuscripcionRepository.listarSincronizadosSuscripcion('R', dsusIderegistro,PageRequest.of(page, size, Sort.by("actsusIderegistro").descending())).map(this::convertirDto);
        return responseList;
    }

    private TmpActSuscripcionDTO convertirDto(TmpActSuscripcion tmpActSuscripcion) {
        ModelMapper modelMapper = new ModelMapper();
        TmpActSuscripcionDTO dto = modelMapper.map(tmpActSuscripcion, TmpActSuscripcionDTO.class);

        if(tmpActSuscripcion.getDsusIderegistro() != null) {
            dto.setDsusPcodigoAseo(this.dsusRepository.findDsusPcodigoById(tmpActSuscripcion.getDsusIderegistro()));
        }

        Map<String,Object> barrio= new HashMap<>();
        if(tmpActSuscripcion.getUniBarrio()!=null){
            barrio.put("llave",tmpActSuscripcion.getUniBarrio());
            barrio.put("valor",barriosRepository.findNombreById(tmpActSuscripcion.getUniBarrio()));
        }

        Map<String,Object> complemento= null;
        if(tmpActSuscripcion.getUniComplemento()!=null){
            complemento= new HashMap<>();
            complemento.put("llave",tmpActSuscripcion.getUniComplemento());
            complemento.put("valor",unidadRepository.findNameByUnit(tmpActSuscripcion.getUniComplemento()));
        }

        Map<String,Object> tipUsosus= new HashMap<>();
        tipUsosus.put("llave",tmpActSuscripcion.getUniTipusosus());
        tipUsosus.put("valor",unidadRepository.findNameByUnit(tmpActSuscripcion.getUniTipusosus()));

        Map<String,Object> liquidacion= new HashMap<>();
        if(tmpActSuscripcion.getUniLiquidacion()!=null){
            liquidacion.put("llave",tmpActSuscripcion.getUniLiquidacion());
            liquidacion.put("valor",unidadRepository.findNameByUnit(tmpActSuscripcion.getUniLiquidacion()));
        }

        List<Object> condsPredio= new ArrayList<>();

        if(tmpActSuscripcion.getUniCondspredio()!=null && !tmpActSuscripcion.getUniCondspredio().isEmpty()){
            for (Long condpredio: tmpActSuscripcion.getUniCondspredio()) {
                Map<String,Object> condMap= new HashMap<>();
                condMap.put("llave",condpredio);
                condMap.put("valor",unidadRepository.findNameByUnit(condpredio));
                condsPredio.add(condMap);
            }
        }

        Map<String,Object> actComercial= new HashMap<>();
        if(tmpActSuscripcion.getUniActcomercial()!=null){
            actComercial.put("llave",tmpActSuscripcion.getUniActcomercial());
            actComercial.put("valor",unidadRepository.findNameByUnit(tmpActSuscripcion.getUniActcomercial()));
        }
        
        Map<String,Object> conceptosLiquidacion = new HashMap<>();
        conceptosLiquidacion.put("deshabitado", tmpActSuscripcion.getConLiquidacion().getDeshabitado());
        conceptosLiquidacion.put("aforado", tmpActSuscripcion.getConLiquidacion().getAforado());
        conceptosLiquidacion.put("descuento_pap", tmpActSuscripcion.getConLiquidacion().getDescuento_pap());

        Map<String,Object> estrato = new HashMap<>();
        if(tmpActSuscripcion.getProCatestrato()!=null){
            estrato.put("llave",tmpActSuscripcion.getProCatestrato());
            estrato.put("valor",unidadRepository.findNameByEstAndUniCodigo1(191,tmpActSuscripcion.getProCatestrato().toString()));
        }
        
        dto.setBarrio(barrio);
        dto.setComplemento(complemento);
        dto.setTipUsosus(tipUsosus);
        dto.setEstrato(estrato);
        dto.setLiquidacion(liquidacion);
        dto.setCondsPredio(condsPredio);
        dto.setActComercial(actComercial);
        dto.setConceptosLiquidacion(conceptosLiquidacion);
        dto.setObservacion(tmpActSuscripcion.getObservacion());
        return dto;
    }

    /**
     * Metodo para guardar un nuevo registro de actualizacion de suscripcion
     * @param data formulario info
     * @return TmpActSuscripcion guardado
     */
    @Transactional
    @Override
    public TmpActSuscripcion guardar(TmpActSuscripcion data, List<MultipartFile> imagenes,String token) {
        if(data.getDsusPcodigo().equals(null) || data.getDsusPcodigo().equals("")) throw new FailuresServiceException("Codigo de las suscripción es requerido");
        Long dsusId = this.dsusRepository.findByDsusPcodigo(data.getDsusPcodigo()).getDsusIderegistr();
        if(dsusId==null) throw new FailuresServiceException("No se encontro la suscripcion con codigo:"+data.getDsusPcodigo());

        boolean allNonEmptyOrNull = data.getUniCondspredio().stream()
                .allMatch(Objects::nonNull);
        if(!allNonEmptyOrNull) data.setUniCondspredio(new ArrayList<>());
        data.setFechaEncuesta(LocalDate.now());
        data.setDsusIderegistro(dsusId);
        data.setProDireccion(data.getProDireccion().toUpperCase());
        data.setActsusEstado('P');
        data.setActsusFecha(LocalDateTime.now());
        data.setActsusImagenesaz(this.azService.cargarImagenesAz(imagenes,token));
        return actSuscripcionRepository.save(data);
    }

    /**
     * Metodo para para cambiar de estado a eliminado(cancelado) de un registro de actualizacion pendiente
     * @param idTmpDsus id registro
     * @param idusuario id usuario logueado
     */
    @Override
    public void eliminar(Long idTmpDsus,Integer idusuario) {
        TmpActSuscripcion tmpActSuscripcion = this.actSuscripcionRepository.findById(idTmpDsus).orElseThrow(
                ()-> new FailuresServiceException("El registro con id "+idTmpDsus+" no existe."));

        if(tmpActSuscripcion.getActsusEstado().equals('C')) throw new FailuresServiceException("El registro con id "+idTmpDsus+" se encuentra en estado Cancelado.");
        tmpActSuscripcion.setUsuIderegistro(idusuario.longValue());
        tmpActSuscripcion.setActsusEstado('C');
        tmpActSuscripcion.setActsusFecha(LocalDateTime.now());
        this.actSuscripcionRepository.save(tmpActSuscripcion);
    }

    /**
     * Metodo para consultar imagenes por id de registro de actualizacion
     * @param actsusIderegistro id registro de actualizacion
     * @param token token
     * @return listado de imagenes (base 64)
     */
    @Override
    public List<Map<String, Object>> consultaImagenes(Long actsusIderegistro, String token) {
        TmpActSuscripcion actSuscripcion= this.actSuscripcionRepository.findById(actsusIderegistro).orElseThrow(()-> new FailuresServiceException("no se encuentra el registro con id: "+actsusIderegistro));
        if(actSuscripcion.getActsusImagenesaz()==null || actSuscripcion.getActsusImagenesaz().isEmpty()) throw new FailuresServiceException("La novedad seleccionada no tiene imagenes guardadas.");
        try {
            token = token.replace("Bearer Bearer", "Bearer");
            ClienteArchivo clientFile = this.azService.getClienteArchivo(token);
            List<Map<String,Object>> imagenes= new ArrayList<>();

            for (ArchivoDTO archivo :actSuscripcion.getActsusImagenesaz()) {
                byte [] imagen =  clientFile.consultarByte(archivo.getId());
                String imagenString = Base64.getEncoder().encodeToString(imagen);

                Map<String,Object> mapa=new HashMap<>();
                mapa.put("id",archivo.getId());
                mapa.put("tipo",archivo.getTipo());
                mapa.put("imagen", imagenString);

                imagenes.add(mapa);
            }
            return imagenes;
        } catch (AplicacionExcepcion e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMensaje());
        }
    }
    
    /**
     * Metodo para actualizacion suscripcion a partir de registro de solicitud de actualizacion tabla intermedia tmp_actsus_actsuscripcion
     * @param tmpActSuscripcion registro actualizacion actualizado
     * @return registro actualizacion actualizado
     */
    @Transactional
    @Override
    public TmpActSuscripcion actualizarActualizacion(TmpActSuscripcionDTO tmpActSuscripcion) {
        TmpActSuscripcion registroTmpSus = this.actSuscripcionRepository.findById(tmpActSuscripcion.getActsusIderegistro()).orElseThrow(()-> new FailuresServiceException("no se encuentra el registro con id " + tmpActSuscripcion.getActsusIderegistro()));
        registroTmpSus.setFechaEncuesta(tmpActSuscripcion.getFechaEncuesta());
        registroTmpSus.setUsuIderegistro(tmpActSuscripcion.getUsuIderegistro());
        registroTmpSus.setFacturacion(tmpActSuscripcion.getFacturacion());
        registroTmpSus.setTerNombre(tmpActSuscripcion.getTerNombre());
        registroTmpSus.setTerTipoDocumento(tmpActSuscripcion.getTerTipoDocumento());
        registroTmpSus.setTerDocumento(tmpActSuscripcion.getTerDocumento());
        registroTmpSus.setTerTelcelular(tmpActSuscripcion.getTerTelcelular());
        registroTmpSus.setTerCorreo(tmpActSuscripcion.getTerCorreo());
        registroTmpSus.setProDireccion(tmpActSuscripcion.getProDireccion());
        registroTmpSus.setProZona(tmpActSuscripcion.getProZona());
        registroTmpSus.setMubaSector(tmpActSuscripcion.getMubaSector());
        registroTmpSus.setProSeccion(tmpActSuscripcion.getProSeccion());
        registroTmpSus.setProManzana(tmpActSuscripcion.getProManzana());
        registroTmpSus.setUniBarrio(tmpActSuscripcion.getUniBarrio());
        registroTmpSus.setUniComplemento(tmpActSuscripcion.getUniComplemento());
        registroTmpSus.setNomEstablecimiento(tmpActSuscripcion.getNomEstablecimiento());
        registroTmpSus.setUniActcomercial(tmpActSuscripcion.getUniActcomercial());
        registroTmpSus.setProCatestrato(tmpActSuscripcion.getProCatestrato());
        registroTmpSus.setUniTipusosus(tmpActSuscripcion.getUniTipusosus());
        registroTmpSus.setUniLiquidacion(tmpActSuscripcion.getUniLiquidacion());
        registroTmpSus.setProNumcatastral(tmpActSuscripcion.getProNumcatastral());
        registroTmpSus.setProNumcatastralnacional(tmpActSuscripcion.getProNumcatastralnacional());
        
        List<AlternaDto> actsusAlterna = new ArrayList<>();
        actsusAlterna.add(new AlternaDto(tmpActSuscripcion.getServicioEmsa(), tmpActSuscripcion.getMedidorAlternoEmsa(), tmpActSuscripcion.getCodigoAlternoEmsa()));
        actsusAlterna.add(new AlternaDto(tmpActSuscripcion.getServicioGas(), tmpActSuscripcion.getMedidorAlternoGas(), tmpActSuscripcion.getCodigoAlternoGas()));

        registroTmpSus.setActsusAlterna(actsusAlterna);
        
        ConLiquidacionDto conLiquidacion = new ConLiquidacionDto(tmpActSuscripcion.getDeshabitado(), null, tmpActSuscripcion.getDescuento_pap());
        registroTmpSus.setConLiquidacion(conLiquidacion);
        
        registroTmpSus.setObservacion(tmpActSuscripcion.getObservacion());
        registroTmpSus.setResponseApprove("Se actualizó el registro con ID: " + tmpActSuscripcion.getActsusIderegistro());

        return actSuscripcionRepository.save(registroTmpSus);
    }

    /**
     * Metodo para actualizacion suscripcion a partir de registro de solicitud de actualizacion tabla intermedia tmp_actsus_actsuscripcion
     * @param idTmpDsus id de registro actualizacion aprobado
     * @param idusuario id de usuario aprueba
     * @return registro actualizacion aprobado y aplicado
     */
    @Transactional
    @Override
    public TmpActSuscripcion aprobarActualizacion(Long idTmpDsus, Integer idusuario) {
        TmpActSuscripcion tmpActSuscripcion = this.actSuscripcionRepository.findById(idTmpDsus).orElseThrow(()-> new FailuresServiceException("no se encuentra el registro con id " +idTmpDsus));
        if(!tmpActSuscripcion.getActsusEstado().equals('P')){
            String estado ="";
            if(tmpActSuscripcion.getActsusEstado().equals('C')) estado="Cancelado"; else if(tmpActSuscripcion.getActsusEstado().equals('R')) estado="Resuelto";
            throw new FailuresServiceException("El registro de actualizacion con id "+idTmpDsus+" se encuentra en estado " +estado);
        }
        
        if(tmpActSuscripcion.getActsusTipo().equalsIgnoreCase("Independencia")){
            return this.aprobarIndependencia(tmpActSuscripcion,idusuario);
        } else {
        	if(tmpActSuscripcion.getActsusTipo().equalsIgnoreCase("Punto")) {
                return this.aprobarPunto(tmpActSuscripcion,idusuario);
        	}else {
        		DsusDetsuscrip suscripcion=tmpActSuscripcion.getDsusDetsuscrip();
                suscripcion.getProPropiedad().setProDireccion(tmpActSuscripcion.getProDireccion());
                suscripcion.getProPropiedad().setUniBarrio(tmpActSuscripcion.getUniBarrio());
                suscripcion.getProPropiedad().setUniCmpdireccion(tmpActSuscripcion.getUniComplemento());

                suscripcion.setUniBarrio(new Barrios(tmpActSuscripcion.getUniBarrio()));
                suscripcion.setUniTipusosuscr(tmpActSuscripcion.getUniTipusosus());
                suscripcion.setEstTipusosuscr(unidadRepository.findEstByUnit(tmpActSuscripcion.getUniTipusosus()));
                suscripcion.setUniLiquidacion(tmpActSuscripcion.getUniLiquidacion());
                suscripcion.setEstLiquidacion(unidadRepository.findEstByUnit(tmpActSuscripcion.getUniLiquidacion()));
                suscripcion.setUniActsuscripc(tmpActSuscripcion.getUniActcomercial() != null ? tmpActSuscripcion.getUniActcomercial() : 0);

                List<Map<String, Object>> clasificacionesVivienda= new ArrayList<>();
                for (Long condicionId: tmpActSuscripcion.getUniCondspredio()) {
                    Map<String,Object> condMap=new HashMap<>();
                    condMap.put("uni_ideregistro",condicionId);
                    condMap.put("uni_nombre1",this.unidadRepository.findNameByUnit(condicionId));
                    clasificacionesVivienda.add(condMap);
                }

                suscripcion.getProPropiedad().setUniClasificacionvivienda(clasificacionesVivienda);
                suscripcion.setDsusFecact(Timestamp.from(Instant.now()));
                suscripcion.setProCatestrato(tmpActSuscripcion.getProCatestrato());
                suscripcion = this.dsusRepository.save(suscripcion);
                
                //Actualizar marcacion consu
                org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

                List<Long> conceptos_marcacion = new ArrayList<>(3);
                conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_deshabitado"));
                conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_aforado"));
                conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_puerta_puerta"));
                
                List<CosuConsuscrip> con_liquidacion = cosuConSuscripRepository.getAllByIdDsusConcepto(tmpActSuscripcion.getDsusDetsuscrip().getDsusIderegistr(),conceptos_marcacion);
                
                CosuConsuscrip deshabitado = con_liquidacion.stream().filter(cosu -> cosu.getUniConcepto() == hya_parametros.getLong("concepto_marcado_deshabitado")).findFirst().orElse(null);
                
                if( tmpActSuscripcion.getConLiquidacion().getDeshabitado() == null ) {
            		if( deshabitado != null ) {
            			/*deshabitado.setCosuEstado("I");
            			deshabitado.setCosuObservacion(tmpActSuscripcion.getObservacion());
            			cosuConSuscripRepository.save(deshabitado);*/
            			cosuConSuscripRepository.delete(deshabitado);
            		}
            	}else {
            		if( deshabitado == null ) {
            	        // Sumar 3 meses
            	        Calendar calendar = Calendar.getInstance();
            	        calendar.setTime(new Date());
            	        calendar.add(Calendar.MONTH, 3);
            	        Date fecha_final = calendar.getTime();
            	        
            			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
            			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
            			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
            			nuevaMarcacion.setDsusDetsuscrip(tmpActSuscripcion.getDsusDetsuscrip());nuevaMarcacion.setUniLiquidacion(suscripcion.getUniLiquidacion());
            			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_deshabitado"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
            			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
            			nuevaMarcacion.setCosuObservacion("");
            			cosuConSuscripRepository.save(nuevaMarcacion);
            		}
            	}
                
                /*CosuConsuscrip aforado = con_liquidacion.stream().filter(cosu -> cosu.getUniConcepto() == hya_parametros.getLong("concepto_marcado_aforado")).findFirst().orElse(null);
                
                if( tmpActSuscripcion.getConLiquidacion().getAforado() == null ) {
            		if( aforado != null ) {
            			//aforado.setCosuEstado("I");
            			//aforado.setCosuObservacion(tmpActSuscripcion.getObservacion());
            			//cosuConSuscripRepository.save(aforado);
            			cosuConSuscripRepository.delete(aforado);
            		}
            	}else {
            		if( aforado == null ) {
            			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
            			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
            			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(new Date());
            			nuevaMarcacion.setDsusDetsuscrip(tmpActSuscripcion.getDsusDetsuscrip());nuevaMarcacion.setUniLiquidacion(suscripcion.getUniLiquidacion());
            			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_aforado"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
            			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
            			nuevaMarcacion.setCosuObservacion("");
            			cosuConSuscripRepository.save(nuevaMarcacion);
            		}
            	}*/
                
                CosuConsuscrip descuento_pap = con_liquidacion.stream().filter(cosu -> cosu.getUniConcepto() == hya_parametros.getLong("concepto_marcado_puerta_puerta")).findFirst().orElse(null);
                
                if( tmpActSuscripcion.getConLiquidacion().getDescuento_pap() == null ) {
            		if( descuento_pap != null ) {
            			/*descuento_pap.setCosuEstado("I");
            			descuento_pap.setCosuObservacion(tmpActSuscripcion.getObservacion());
            			cosuConSuscripRepository.save(descuento_pap);*/
            			cosuConSuscripRepository.delete(descuento_pap);
            		}
            	}else {
            		if( descuento_pap == null ) {
            	        // Sumar 10 anos
            	        Calendar calendar = Calendar.getInstance();
            	        calendar.setTime(new Date());
            	        calendar.add(Calendar.YEAR, 10);
            	        Date fecha_final = calendar.getTime();
            	        
            			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
            			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
            			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
            			nuevaMarcacion.setDsusDetsuscrip(tmpActSuscripcion.getDsusDetsuscrip());nuevaMarcacion.setUniLiquidacion(suscripcion.getUniLiquidacion());
            			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_puerta_puerta"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
            			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
            			nuevaMarcacion.setCosuObservacion("");
            			cosuConSuscripRepository.save(nuevaMarcacion);
            		}
            	}
                
                for (DsialDsusInfoAlternaEntity alternaDato :alternaRepository.findEmpresaBySuscripcionAlterna("A", tmpActSuscripcion.getDsusIderegistro())) {
                	alternaDato.setDialEstado("I");
                	alternaRepository.save(alternaDato);
                }
                for (AlternaDto alterna:tmpActSuscripcion.getActsusAlterna()) {
                    if(alterna.getServicio_alterno() != "") {
                    	DsialDsusInfoAlternaEntity infoAlterna = new DsialDsusInfoAlternaEntity();
                        infoAlterna.setDsusIderegistr(tmpActSuscripcion.getDsusIderegistro().intValue());
                        infoAlterna.setEmpIderegistro(tmpActSuscripcion.getDsusDetsuscrip().getEmpIderegistro());
                        if(alterna.getServicio_alterno().equals("EMSA"))infoAlterna.setEmpAlterna(299);
                        if(alterna.getServicio_alterno().equals("GAS"))infoAlterna.setEmpAlterna(322);
                        infoAlterna.setDsialCodigoalterna(alterna.getCodigo_alterno());
                        infoAlterna.setDsialNumerimedidor(alterna.getMedidor_alterno());
                        infoAlterna.setDialEstado("A");
                        infoAlterna.setDialObservaciones(tmpActSuscripcion.getObservacion());
                        infoAlterna.setUsuIderegistro(idusuario);
                        alternaRepository.save(infoAlterna);
                    }
                }
                	
                List<IasusInforadicionalsuscripcion> infoAdicional = this.infoAdSuscripcionRepository.findInfoAdicionalSuscripcion(suscripcion.getDsusIderegistr());
                if(infoAdicional != null && !infoAdicional.isEmpty()){
                	for (IasusInforadicionalsuscripcion infoadSuscripcion : infoAdicional) {
                		String referenciaComercial = null;
                        UniUnidad unidadReferencia = unidadRepository.findById(tmpActSuscripcion.getUniActcomercial()).orElse(null);
                        if(unidadReferencia!=null) referenciaComercial = unidadReferencia.getUniNombre1();
                        
                        infoadSuscripcion.setIasusReferenciacomercial(referenciaComercial);
                        infoadSuscripcion.setIasusNombreestablecimiento(tmpActSuscripcion.getNomEstablecimiento());
                        infoAdSuscripcionRepository.save(infoadSuscripcion);
    				}
                } else {
                	if (
                		    tmpActSuscripcion.getNomEstablecimiento() != null &&
                		    !tmpActSuscripcion.getNomEstablecimiento().trim().isEmpty()
                		    ||
                		    tmpActSuscripcion.getUniActcomercial() != null &&
                		    tmpActSuscripcion.getUniActcomercial() != 0
                		) {
                        IasusInforadicionalsuscripcion infoadSuscripcion = new IasusInforadicionalsuscripcion();
                        infoadSuscripcion.setSusIderegistro(suscripcion.getSusIderegistro());
                        infoadSuscripcion.setIasusCobrojuridico(false);
                        infoadSuscripcion.setIasusPagapeaje(false);
                        String referenciaComercial = null;
                        UniUnidad unidadReferencia = unidadRepository.findById(tmpActSuscripcion.getUniActcomercial()).orElse(null);
                        if(unidadReferencia!=null) referenciaComercial = unidadReferencia.getUniNombre1();
                        
                        infoadSuscripcion.setIasusReferenciacomercial(referenciaComercial);
                        infoadSuscripcion.setIasusNombreestablecimiento(tmpActSuscripcion.getNomEstablecimiento());
                        infoadSuscripcion.setDsusIderegistr(suscripcion.getDsusIderegistr());
                        infoAdSuscripcionRepository.save(infoadSuscripcion);
                    }
                }

                tmpActSuscripcion.setActsusFecha(LocalDateTime.now());
                tmpActSuscripcion.setUsuIderegistro(idusuario.longValue());
                tmpActSuscripcion.setActsusEstado('R');
                tmpActSuscripcion.setResponseApprove("Se actualizó la suscripción con ID: "+suscripcion.getDsusIderegistr());

                // Actualizacion ArcGis
                String token = apiArcGis.getAccessTokenTwo();
                Map<String,?> mapIDs = this.apiArcGis.consultaPuntoSuscripcion(token,suscripcion.getDsusPcodigo());

                if(mapIDs==null){
                    throw new RuntimeException("No se encontro punto de la suscripcion en ArcGis.");
                }else{
                    String features = crearJsonActualizarPunto(mapIDs,suscripcion,tmpActSuscripcion);
                    Map<String,?>mapResponse = this.apiArcGis.actualizarPuntoTercero(token,features);
                    boolean added= false;
                    if(mapResponse.get("success")!=null){
                        added=(Boolean)mapResponse.get("success");
                    }
                    if(!added) throw new RuntimeException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");

                    ObjectMapper objectMapper = new ObjectMapper();
                    try {
                        String json = objectMapper.writeValueAsString(mapResponse);
                        tmpActSuscripcion.setPuntoArcgis(json);
                        actSuscripcionRepository.save(tmpActSuscripcion);

                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
                return tmpActSuscripcion;
        	}
        }
    }

    /**
     * Metodo para aprobar independencia
     * @param tmpActSuscripcion registro temporal de independencia
     * @param idusuario id de usuario
     * @return Registro de independencia aprobado
     */
    private TmpActSuscripcion aprobarIndependencia( TmpActSuscripcion tmpActSuscripcion, Integer idusuario){
        DsusDetsuscrip dsusPadre = this.dsusRepository.findById(tmpActSuscripcion.getDsusIderegistro()).orElseThrow(()-> new FailuresServiceException("No se encuentra suscripcion con id: "+tmpActSuscripcion.getDsusIderegistro()));
        ProPropiedad propiedadPadre = dsusPadre.getProPropiedad();

        ProPropiedad nuevaPropiedad = this.crearPropiedadIndependencia(propiedadPadre,tmpActSuscripcion,idusuario,propiedadPadre.getProIdepropieda());
        SusSuscripcion nuevaSuscripcion= this.crearSuscripcionIndependencia(dsusPadre.getTerIderegistro().getTerIderegistro().intValue(),
                dsusPadre.getSusSuscripcion().getSusIderegistro(),3, idusuario); //convenio solo aseo
        DsusDetsuscrip nuevaDsus = this.crearDetSuscripcionIndependencia(dsusPadre,nuevaPropiedad,nuevaSuscripcion,tmpActSuscripcion,idusuario);
        
        org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        List<Long> conceptos_marcacion = new ArrayList<>(3);
        conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_deshabitado"));
        conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_aforado"));
        conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_puerta_puerta"));
        
        //Actualizar marcacion consu
        if( tmpActSuscripcion.getConLiquidacion().getDeshabitado() != null ) {
	        // Sumar 3 meses
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(new Date());
	        calendar.add(Calendar.MONTH, 3);
	        Date fecha_final = calendar.getTime();
	        
			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
			nuevaMarcacion.setDsusDetsuscrip(nuevaDsus);nuevaMarcacion.setUniLiquidacion(nuevaDsus.getUniLiquidacion());
			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_deshabitado"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
			nuevaMarcacion.setCosuObservacion("");
			cosuConSuscripRepository.save(nuevaMarcacion);
    	}
        
        /*if( tmpActSuscripcion.getConLiquidacion().getAforado() != null ) {
	        // Sumar 1 mes
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(new Date());
	        calendar.add(Calendar.MONTH, 1);
	        Date fecha_final = calendar.getTime();
	        
			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
			nuevaMarcacion.setDsusDetsuscrip(nuevaDsus);nuevaMarcacion.setUniLiquidacion(nuevaDsus.getUniLiquidacion());
			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_aforado"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
			nuevaMarcacion.setCosuObservacion("");
			cosuConSuscripRepository.save(nuevaMarcacion);
    	}*/
        
        if( tmpActSuscripcion.getConLiquidacion().getDescuento_pap() != null ) {
	        // Sumar 10 anos
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(new Date());
	        calendar.add(Calendar.YEAR, 10);
	        Date fecha_final = calendar.getTime();
	        
			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
			nuevaMarcacion.setDsusDetsuscrip(nuevaDsus);nuevaMarcacion.setUniLiquidacion(nuevaDsus.getUniLiquidacion());
			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_puerta_puerta"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
			nuevaMarcacion.setCosuObservacion("");
			cosuConSuscripRepository.save(nuevaMarcacion);
    	}
        
        for (AlternaDto alterna:tmpActSuscripcion.getActsusAlterna()) {
            if(alterna.getServicio_alterno() != "") {
            	DsialDsusInfoAlternaEntity infoAlterna = new DsialDsusInfoAlternaEntity();
                infoAlterna.setDsusIderegistr(nuevaDsus.getDsusIderegistr().intValue());
                infoAlterna.setEmpIderegistro(nuevaDsus.getEmpIderegistro());
                if(alterna.getServicio_alterno().equals("EMSA"))infoAlterna.setEmpAlterna(299);
                if(alterna.getServicio_alterno().equals("GAS"))infoAlterna.setEmpAlterna(322);
                infoAlterna.setDsialCodigoalterna(alterna.getCodigo_alterno());
                infoAlterna.setDsialNumerimedidor(alterna.getMedidor_alterno());
                infoAlterna.setDialEstado("A");
                infoAlterna.setDialObservaciones(tmpActSuscripcion.getObservacion());
                infoAlterna.setUsuIderegistro(idusuario);
                alternaRepository.save(infoAlterna);
            }
        }
        
        if (
        	    tmpActSuscripcion.getNomEstablecimiento() != null &&
        	    !tmpActSuscripcion.getNomEstablecimiento().trim().isEmpty()
        	    ||
        	    tmpActSuscripcion.getUniActcomercial() != null &&
        	    tmpActSuscripcion.getUniActcomercial() != 0
        	) {
            IasusInforadicionalsuscripcion infoadSuscripcion= new IasusInforadicionalsuscripcion();
            infoadSuscripcion.setSusIderegistro(nuevaSuscripcion.getSusIderegistro());
            infoadSuscripcion.setIasusCobrojuridico(false);
            infoadSuscripcion.setIasusPagapeaje(false);
            String referenciaComercial = null;
            UniUnidad unidadReferencia = unidadRepository.findById(tmpActSuscripcion.getUniActcomercial()).orElse(null);
            if(unidadReferencia!=null) referenciaComercial = unidadReferencia.getUniNombre1();
            
            infoadSuscripcion.setIasusReferenciacomercial(referenciaComercial);
            infoadSuscripcion.setIasusNombreestablecimiento(tmpActSuscripcion.getNomEstablecimiento());
            infoadSuscripcion.setDsusIderegistr(nuevaDsus.getDsusIderegistr());
            infoAdSuscripcionRepository.save(infoadSuscripcion);
        }

        if (!tmpActSuscripcion.getLongitud().isEmpty() && !tmpActSuscripcion.getLatitud().isEmpty()) {
            String token = apiArcGis.getAccessTokenTwo();
            String feature = this.crearJsonPunto(tmpActSuscripcion.getLongitud(), tmpActSuscripcion.getLatitud(), nuevaDsus, tmpActSuscripcion);
            Map<String, Object> mapResponse = (Map<String, Object>) apiArcGis.guardarPuntoTercero(token, feature);

            boolean added = false;
            if (mapResponse.get("success") != null) {
                added = (Boolean) mapResponse.get("success");
            }
            if (!added) throw new RuntimeException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");

            ObjectMapper objectMapper = new ObjectMapper();
            try {
                String json = objectMapper.writeValueAsString(mapResponse);
                tmpActSuscripcion.setPuntoArcgis(json);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        tmpActSuscripcion.setDsusIderegistro(nuevaDsus.getDsusIderegistr());
        tmpActSuscripcion.setDsusDetsuscrip(nuevaDsus);
        tmpActSuscripcion.setActsusEstado('R');
        tmpActSuscripcion.setResponseApprove("Se creó la independencia con ID de suscripción: "+nuevaDsus.getDsusIderegistr());
        return tmpActSuscripcion;
    }

    /**
     * Metodo para crear nuevo de talle de suscripcion
     * @param dsusPadre detalle de suscripcion padre
     * @param nuevaPropiedad nueva popiedad para la suscripcion
     * @param nuevaSuscripcion nueva suscripcion
     * @param tmpActSuscripcion registro temporal de independencia
     * @param idusuario id de usuario logueado
     * @return nueva entidad detalle de suscripcion
     */
    private DsusDetsuscrip crearDetSuscripcionIndependencia(DsusDetsuscrip dsusPadre,ProPropiedad nuevaPropiedad, SusSuscripcion nuevaSuscripcion,TmpActSuscripcion tmpActSuscripcion,Integer idusuario){
        DsusDetsuscrip nuevaDsus = new DsusDetsuscrip();
        nuevaDsus.setDsusEstado("P");
        nuevaDsus.setDsusDescripcion("Nueva suscripcion independencia");
        nuevaDsus.setDsusPcodigo(dsusService.generatePCode());
        nuevaDsus.setSusIderegistro(nuevaSuscripcion.getSusIderegistro());
        nuevaDsus.setTerIderegistro(dsusPadre.getTerIderegistro());
        nuevaDsus.setProIderegistro(nuevaPropiedad.getProIderegistro());
        nuevaDsus.setProPropiedad(nuevaPropiedad);
        nuevaDsus.setUniMunicipio(dsusPadre.getUniMunicipio());

        nuevaDsus.setUniBarrio(new Barrios(nuevaPropiedad.getUniBarrio()));
        nuevaDsus.setEstTipsuscripc(dsusPadre.getEstTipsuscripc());
        nuevaDsus.setUniTipsuscripc(dsusPadre.getUniTipsuscripc());
        nuevaDsus.setUniTipusosuscr(tmpActSuscripcion.getUniTipusosus());
        nuevaDsus.setEstTipusosuscr(unidadRepository.findEstByUnit(nuevaDsus.getUniTipusosuscr()));
        nuevaDsus.setEmpIderegistro(dsusPadre.getEmpIderegistro());
        nuevaDsus.setUniLiquidacion(tmpActSuscripcion.getUniLiquidacion());
        nuevaDsus.setEstLiquidacion(unidadRepository.findEstByUnit(nuevaDsus.getUniLiquidacion()));
        nuevaDsus.setCicIderegistro(dsusPadre.getCicIderegistro());
        nuevaDsus.setDsusFecinicio(new Date());
        nuevaDsus.setProCatestrato(tmpActSuscripcion.getProCatestrato());
        nuevaDsus.setDsusFactor(dsusPadre.getDsusFactor());
        nuevaDsus.setUsuIderegistro(idusuario.longValue());
        nuevaDsus.setUniActsuscripc(tmpActSuscripcion.getUniActcomercial() != null ? tmpActSuscripcion.getUniActcomercial() : 0);
        nuevaDsus.setDsusFecact(Timestamp.valueOf(LocalDateTime.now()));
        return dsusRepository.save(nuevaDsus);
    }


    /**
     * Metodo para crear nueva suscripcion
     * @param terIderegistro tercero id
     * @param idusuario id de usuario logueado
     * @return nueva suscripcion
     */
    private final SusSuscripcion crearSuscripcionIndependencia(Integer terIderegistro,Long susIderegistroPadre,Integer cnrePadre,Integer idusuario){
        SusSuscripcion nuevaSuscripcion = new SusSuscripcion();
        nuevaSuscripcion.setTerIderegistro(terIderegistro);
        nuevaSuscripcion.setCnreIderegistr(cnrePadre);
        nuevaSuscripcion.setSusModconvenio("N");
        nuevaSuscripcion.setSusDescripcion("Independencia:"+susIderegistroPadre.toString());
        nuevaSuscripcion.setUsuIderegistro(idusuario);
        return suscripcionRepository.save(nuevaSuscripcion);
    }

    /**
     * Metodo para crear una nueva propiedad
     * @param propiedadPadre propiedad padre
     * @param tmpActSuscripcion registro temporal independencia
     * @param idusuario id de usuario logueado
     * @param medidor numero medidor
     * @return nueva propiedad
     */
    private ProPropiedad crearPropiedadIndependencia(ProPropiedad propiedadPadre,TmpActSuscripcion tmpActSuscripcion,Integer idusuario, String medidor){
        ProPropiedad nuevaPropiedad = new ProPropiedad();
        nuevaPropiedad.setProIdepropieda(medidor);
        nuevaPropiedad.setProEstado(propiedadPadre.getProEstado());
        nuevaPropiedad.setProDescripcion(propiedadPadre.getProDescripcion());
        nuevaPropiedad.setProDireccion(tmpActSuscripcion.getProDireccion());
        nuevaPropiedad.setTerIderegistro(propiedadPadre.getTerIderegistro());
        nuevaPropiedad.setUniTippropieda(propiedadPadre.getUniTippropieda());
        nuevaPropiedad.setEstTippropieda(propiedadPadre.getEstTippropieda());
        nuevaPropiedad.setProDigitos(propiedadPadre.getProDigitos());
        nuevaPropiedad.setMubaSector(propiedadPadre.getMubaSector());
        nuevaPropiedad.setProSeccion(propiedadPadre.getProSeccion());
        nuevaPropiedad.setProManzana(propiedadPadre.getProManzana());
        nuevaPropiedad.setUniMunicipio(propiedadPadre.getUniMunicipio());
        nuevaPropiedad.setUniBarrio(tmpActSuscripcion.getUniBarrio());
        nuevaPropiedad.setProAltriesgo(propiedadPadre.getProAltriesgo());
        nuevaPropiedad.setProGpsaltitud(propiedadPadre.getProGpsaltitud());
        nuevaPropiedad.setProGpslatitud(propiedadPadre.getProGpslatitud());
        nuevaPropiedad.setProGpslongitud(propiedadPadre.getProGpslongitud());
        nuevaPropiedad.setProNumcatastral(propiedadPadre.getProNumcatastral());
        nuevaPropiedad.setProZona(propiedadPadre.getProZona());
        nuevaPropiedad.setUsuIderegistro(idusuario.longValue());
        nuevaPropiedad.setUniCmpdireccion(propiedadPadre.getUniCmpdireccion());
        nuevaPropiedad.setProResolcatastral(propiedadPadre.getProResolcatastral());
        nuevaPropiedad.setProFecha(Timestamp.valueOf(LocalDateTime.now()));
        nuevaPropiedad.setProNumcatastralnacional(propiedadPadre.getProNumcatastralnacional());
        nuevaPropiedad.setUniTipovivienda(propiedadPadre.getUniTipovivienda());
        nuevaPropiedad.setProNummatriculainmobiliaria(propiedadPadre.getProNummatriculainmobiliaria());
        nuevaPropiedad.setProIdpadre(propiedadPadre.getProIderegistro());
        Long valueSequence=this.propiedadRepository.findChildsProperty(propiedadPadre.getProIdpadre());
        if(valueSequence!=null){
            valueSequence = valueSequence+1;
        }else{
            valueSequence = 1L;
        }
        nuevaPropiedad.setProSecuenciaindep(valueSequence);

        List<Map<String, Object>> clasificacionesVivienda= new ArrayList<>();
        for (Long condicionId: tmpActSuscripcion.getUniCondspredio()) {
            Map<String,Object> condMap=new HashMap<>();
            condMap.put("uni_ideregistro",condicionId);
            condMap.put("uni_nombre1",this.unidadRepository.findNameByUnit(condicionId));
            clasificacionesVivienda.add(condMap);
        }

        nuevaPropiedad.setUniClasificacionvivienda(clasificacionesVivienda);
        return propiedadRepository.save(nuevaPropiedad);
    }

    /**
     * Metodo para aprobar punto
     * @param tmpActSuscripcion registro temporal de punto
     * @param idusuario id de usuario
     * @return Registro de punto aprobado
     */
    private TmpActSuscripcion aprobarPunto( TmpActSuscripcion tmpActSuscripcion, Integer idusuario){
    	
    	if(
    		tmpActSuscripcion.getTerTipoDocumento() == null || tmpActSuscripcion.getTerTipoDocumento() == "" ||
    		tmpActSuscripcion.getTerDocumento() == null || tmpActSuscripcion.getTerDocumento() == ""
    	) {
            throw new FailuresServiceException("El registro de actualizacion con id "+tmpActSuscripcion.getActsusIderegistro()+" tiene el tipoDocumento o documento del tercero vacío.");
    	}
    	
    	if(
    		tmpActSuscripcion.getProDireccion() == null || tmpActSuscripcion.getProDireccion() == "" ||
        	tmpActSuscripcion.getProZona() == null || tmpActSuscripcion.getProZona() == ""
        ) {
    		throw new FailuresServiceException("El registro de actualizacion con id "+tmpActSuscripcion.getActsusIderegistro()+" tiene la dirección o zona del predio vacío.");
        }
    	
    	TerTercero nuevoTercero = crearTerceroPunto(tmpActSuscripcion,idusuario);
        ProPropiedad nuevaPropiedad = this.crearPropiedadPunto(nuevoTercero.getTerIderegistro(),tmpActSuscripcion,idusuario);
        SusSuscripcion nuevaSuscripcion = this.crearSuscripcionPunto(nuevoTercero.getTerIderegistro(),idusuario); //convenio solo aseo
        DsusDetsuscrip nuevaDsus = this.crearDetSuscripcionPunto(nuevoTercero,nuevaPropiedad,nuevaSuscripcion,tmpActSuscripcion,idusuario);
        
        org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        List<Long> conceptos_marcacion = new ArrayList<>(3);
        conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_deshabitado"));
        conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_aforado"));
        conceptos_marcacion.add(hya_parametros.getLong("concepto_marcado_puerta_puerta"));
        
        //Actualizar marcacion consu
        if( tmpActSuscripcion.getConLiquidacion().getDeshabitado() != null ) {
	        // Sumar 3 meses
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(new Date());
	        calendar.add(Calendar.MONTH, 3);
	        Date fecha_final = calendar.getTime();
	        
			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
			nuevaMarcacion.setDsusDetsuscrip(nuevaDsus);nuevaMarcacion.setUniLiquidacion(nuevaDsus.getUniLiquidacion());
			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_deshabitado"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
			nuevaMarcacion.setCosuObservacion("");
			cosuConSuscripRepository.save(nuevaMarcacion);
    	}
        
        /*if( tmpActSuscripcion.getConLiquidacion().getAforado() != null ) {
	        // Sumar 1 mes
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(new Date());
	        calendar.add(Calendar.MONTH, 1);
	        Date fecha_final = calendar.getTime();
	        
			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
			nuevaMarcacion.setDsusDetsuscrip(nuevaDsus);nuevaMarcacion.setUniLiquidacion(nuevaDsus.getUniLiquidacion());
			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_aforado"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
			nuevaMarcacion.setCosuObservacion("");
			cosuConSuscripRepository.save(nuevaMarcacion);
    	}*/
        
        if( tmpActSuscripcion.getConLiquidacion().getDescuento_pap() != null ) {
	        // Sumar 10 anos
	        Calendar calendar = Calendar.getInstance();
	        calendar.setTime(new Date());
	        calendar.add(Calendar.YEAR, 10);
	        Date fecha_final = calendar.getTime();
	        
			CosuConsuscrip nuevaMarcacion = new CosuConsuscrip();
			nuevaMarcacion.setCantidad(1);nuevaMarcacion.setVlrUnitario(1);nuevaMarcacion.setVlrTotal(1);
			nuevaMarcacion.setFecInicio(new Date());nuevaMarcacion.setFecFinal(fecha_final);
			nuevaMarcacion.setDsusDetsuscrip(nuevaDsus);nuevaMarcacion.setUniLiquidacion(nuevaDsus.getUniLiquidacion());
			nuevaMarcacion.setUniConcepto(hya_parametros.getLong("concepto_marcado_puerta_puerta"));nuevaMarcacion.setEmpIdRegistro(UtilConstantes.BIOAGRICOLA);
			nuevaMarcacion.setCosuEstado("A");nuevaMarcacion.setUsuIderegistro(idusuario);
			nuevaMarcacion.setCosuObservacion("");
			cosuConSuscripRepository.save(nuevaMarcacion);
    	}
        
        for (AlternaDto alterna:tmpActSuscripcion.getActsusAlterna()) {
            if(alterna.getServicio_alterno() != "") {
            	DsialDsusInfoAlternaEntity infoAlterna = new DsialDsusInfoAlternaEntity();
                infoAlterna.setDsusIderegistr(nuevaDsus.getDsusIderegistr().intValue());
                infoAlterna.setEmpIderegistro(nuevaDsus.getEmpIderegistro());
                if(alterna.getServicio_alterno().equals("EMSA"))infoAlterna.setEmpAlterna(299);
                if(alterna.getServicio_alterno().equals("GAS"))infoAlterna.setEmpAlterna(322);
                infoAlterna.setDsialCodigoalterna(alterna.getCodigo_alterno());
                infoAlterna.setDsialNumerimedidor(alterna.getMedidor_alterno());
                infoAlterna.setDialEstado("A");
                infoAlterna.setDialObservaciones(tmpActSuscripcion.getObservacion());
                infoAlterna.setUsuIderegistro(idusuario);
                alternaRepository.save(infoAlterna);
            }
        }
        
        if (
        	    tmpActSuscripcion.getNomEstablecimiento() != null &&
        	    !tmpActSuscripcion.getNomEstablecimiento().trim().isEmpty()
        	    ||
        	    tmpActSuscripcion.getUniActcomercial() != null &&
        	    tmpActSuscripcion.getUniActcomercial() != 0
        	) {
            IasusInforadicionalsuscripcion infoadSuscripcion= new IasusInforadicionalsuscripcion();
            infoadSuscripcion.setSusIderegistro(nuevaSuscripcion.getSusIderegistro());
            infoadSuscripcion.setIasusCobrojuridico(false);
            infoadSuscripcion.setIasusPagapeaje(false);
            String referenciaComercial = null;
            UniUnidad unidadReferencia = unidadRepository.findById(tmpActSuscripcion.getUniActcomercial()).orElse(null);
            if(unidadReferencia!=null) referenciaComercial = unidadReferencia.getUniNombre1();
            
            infoadSuscripcion.setIasusReferenciacomercial(referenciaComercial);
            infoadSuscripcion.setIasusNombreestablecimiento(tmpActSuscripcion.getNomEstablecimiento());
            infoadSuscripcion.setDsusIderegistr(nuevaDsus.getDsusIderegistr());
            infoAdSuscripcionRepository.save(infoadSuscripcion);
        }

        if (!tmpActSuscripcion.getLongitud().isEmpty() && !tmpActSuscripcion.getLatitud().isEmpty()) {
            String token = apiArcGis.getAccessTokenTwo();
            String feature = this.crearJsonPunto(tmpActSuscripcion.getLongitud(), tmpActSuscripcion.getLatitud(), nuevaDsus, tmpActSuscripcion);
            Map<String, Object> mapResponse = (Map<String, Object>) apiArcGis.guardarPuntoTercero(token, feature);

            boolean added = false;
            if (mapResponse.get("success") != null) {
                added = (Boolean) mapResponse.get("success");
            }
            if (!added) throw new RuntimeException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");

            ObjectMapper objectMapper = new ObjectMapper();
            try {
                String json = objectMapper.writeValueAsString(mapResponse);
                tmpActSuscripcion.setPuntoArcgis(json);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        tmpActSuscripcion.setDsusIderegistro(nuevaDsus.getDsusIderegistr());
        tmpActSuscripcion.setDsusDetsuscrip(nuevaDsus);
        tmpActSuscripcion.setActsusEstado('R');
        tmpActSuscripcion.setResponseApprove("Se creó el punto con ID de suscripción: "+nuevaDsus.getDsusIderegistr());
        return tmpActSuscripcion;
    }
    
    /**
     * Metodo para crear una nuevo tercero
     * @param tmpActSuscripcion registro temporal punto
     * @param idusuario id de usuario logueado
     * @return nuevo tercero
     */
    private TerTercero crearTerceroPunto(TmpActSuscripcion tmpActSuscripcion,Integer idusuario) {
    	//Se verifica si el tercero no existe para poder crear uno nuevo, sino se reemplaza los campos. 
    	TerTercero nuevoTercero = terceroRepository.findByIdentification(tmpActSuscripcion.getTerDocumento()).orElse(null);
    	if (nuevoTercero == null) {
    		nuevoTercero = new TerTercero();
    	}
    	nuevoTercero.setTerDocumento(tmpActSuscripcion.getTerDocumento());
    	nuevoTercero.setTerNombre("");
    	nuevoTercero.setTerApellido("");
    	nuevoTercero.setTerNomcompleto(tmpActSuscripcion.getTerNombre());
    	nuevoTercero.setTerSexo("");
    	nuevoTercero.setTerTelcelular(tmpActSuscripcion.getTerTelcelular());
    	nuevoTercero.setTerTelfijo("");
    	nuevoTercero.setEstTiptercero(5L);
    	//17 - CC y 20 NIT
    	nuevoTercero.setUniTiptercero(tmpActSuscripcion.getTerTipoDocumento() == "CC" ? 17L : 20L);
    	nuevoTercero.setTerCorreo(tmpActSuscripcion.getTerCorreo());
    	nuevoTercero.setUsuIderegistro(idusuario.longValue());
    	//nuevoTercero.setCiudadCod(null);
    	//nuevoTercero.setTerDocexpedicion(null);
    	//930 - CC y 929 NIT
    	nuevoTercero.setUniTipidentifica(tmpActSuscripcion.getTerTipoDocumento() == "CC" ? 930L : 929L);
    	//nuevoTercero.setTerFecnacimiento(null);
    	//nuevoTercero.setTerDigverificacion(null);
    	
    	return terceroRepository.save(nuevoTercero);
    }
    
    /**
     * Metodo para crear una nueva propiedad
     * @param tmpActSuscripcion registro temporal punto
     * @param idusuario id de usuario logueado
     * @return nueva propiedad
     */
    private ProPropiedad crearPropiedadPunto(Long terIderegistro ,TmpActSuscripcion tmpActSuscripcion,Integer idusuario){
        ProPropiedad nuevaPropiedad = new ProPropiedad();
        nuevaPropiedad.setProIdepropieda("");
        nuevaPropiedad.setProEstado("A");
        nuevaPropiedad.setProDescripcion("Nuevo Punto ARCGIS (HYA)");
        nuevaPropiedad.setProDireccion(tmpActSuscripcion.getProDireccion());
        nuevaPropiedad.setTerIderegistro(terIderegistro);
        //USUARIO DEBE CAMBIAR
        nuevaPropiedad.setUniTippropieda(11L);
        //USUARIO DEBE CAMBIAR
        nuevaPropiedad.setEstTippropieda(29L);
        nuevaPropiedad.setProDigitos(5);
        
        nuevaPropiedad.setMubaSector(tmpActSuscripcion.getMubaSector());
        nuevaPropiedad.setProSeccion(tmpActSuscripcion.getProSeccion());
        nuevaPropiedad.setProManzana(tmpActSuscripcion.getProManzana());
        
        nuevaPropiedad.setUniMunicipio(30L);
        nuevaPropiedad.setUniBarrio(tmpActSuscripcion.getUniBarrio());
        nuevaPropiedad.setProAltriesgo("N");
        nuevaPropiedad.setProNumcatastral(tmpActSuscripcion.getProNumcatastral());
        nuevaPropiedad.setProZona(tmpActSuscripcion.getProZona());
        nuevaPropiedad.setUsuIderegistro(idusuario.longValue());
        nuevaPropiedad.setProFecha(Timestamp.valueOf(LocalDateTime.now()));
        nuevaPropiedad.setProNumcatastralnacional(tmpActSuscripcion.getProNumcatastralnacional());

        List<Map<String, Object>> clasificacionesVivienda= new ArrayList<>();
        for (Long condicionId: tmpActSuscripcion.getUniCondspredio()) {
            Map<String,Object> condMap=new HashMap<>();
            condMap.put("uni_ideregistro",condicionId);
            condMap.put("uni_nombre1",this.unidadRepository.findNameByUnit(condicionId));
            clasificacionesVivienda.add(condMap);
        }

        nuevaPropiedad.setUniClasificacionvivienda(clasificacionesVivienda);
        return propiedadRepository.save(nuevaPropiedad);
    }
    
    /**
     * Metodo para crear nueva suscripcion
     * @param terIderegistro tercero id
     * @param idusuario id de usuario logueado
     * @return nueva suscripcion
     */
    private final SusSuscripcion crearSuscripcionPunto(Long terIderegistro,Integer idusuario){
        SusSuscripcion nuevaSuscripcion = new SusSuscripcion();
        nuevaSuscripcion.setTerIderegistro(terIderegistro.intValue());
        
        CnreCnvrecaudo agreement = cnreCnvrecaudoRepository.findByNameAndEmpId(UtilConstantes.SOLO_ASEO, UtilConstantes.BIOAGRICOLA)
                .orElseThrow(() -> new IllegalArgumentException("no existe convenio"));

        nuevaSuscripcion.setCnreIderegistr(agreement.getCnreIderegistr().intValue());
        nuevaSuscripcion.setCnreNombre(agreement.getCnreNombre());
        nuevaSuscripcion.setSusModconvenio("N");
        nuevaSuscripcion.setSusDescripcion("Nuevo Punto ARCGIS (HYA)");
        nuevaSuscripcion.setUsuIderegistro(idusuario);
        
        return suscripcionRepository.save(nuevaSuscripcion);
    }

    /**
     * Metodo para crear nuevo detalle de suscripcion
     * @param nuevoTercero nuevo tercero para la suscripcion
     * @param nuevaPropiedad nueva propiedad para la suscripcion
     * @param nuevaSuscripcion nueva suscripcion
     * @param tmpActSuscripcion registro temporal de punto
     * @param idusuario id de usuario logueado
     * @return nueva entidad detalle de suscripcion
     */
    private DsusDetsuscrip crearDetSuscripcionPunto(TerTercero nuevoTercero,ProPropiedad nuevaPropiedad, SusSuscripcion nuevaSuscripcion,TmpActSuscripcion tmpActSuscripcion,Integer idusuario){
        DsusDetsuscrip nuevaDsus = new DsusDetsuscrip();
        nuevaDsus.setDsusEstado("P");
        nuevaDsus.setDsusDescripcion("Nuevo Punto ARCGIS (HYA)");
        nuevaDsus.setDsusPcodigo(dsusService.generatePCode());
        nuevaDsus.setSusIderegistro(nuevaSuscripcion.getSusIderegistro());
        nuevaDsus.setTerIderegistro(nuevoTercero);
        nuevaDsus.setProIderegistro(nuevaPropiedad.getProIderegistro());
        nuevaDsus.setProPropiedad(nuevaPropiedad);
        nuevaDsus.setUniMunicipio(nuevaPropiedad.getUniMunicipio());

        nuevaDsus.setUniBarrio(new Barrios(nuevaPropiedad.getUniBarrio()));
        nuevaDsus.setEstTipsuscripc(24L);
        nuevaDsus.setUniTipsuscripc(1L);
        nuevaDsus.setUniTipusosuscr(tmpActSuscripcion.getUniTipusosus());
        nuevaDsus.setEstTipusosuscr(unidadRepository.findEstByUnit(nuevaDsus.getUniTipusosuscr()));
        nuevaDsus.setEmpIderegistro(UtilConstantes.BIOAGRICOLA.intValue());
        nuevaDsus.setUniLiquidacion(tmpActSuscripcion.getUniLiquidacion());
        nuevaDsus.setEstLiquidacion(unidadRepository.findEstByUnit(nuevaDsus.getUniLiquidacion()));
        nuevaDsus.setCicIderegistro(238L);
        nuevaDsus.setDsusFecinicio(new Date());
        nuevaDsus.setProCatestrato(tmpActSuscripcion.getProCatestrato());
        nuevaDsus.setDsusFactor(new BigDecimal(1));
        nuevaDsus.setUsuIderegistro(idusuario.longValue());
        nuevaDsus.setUniActsuscripc(tmpActSuscripcion.getUniActcomercial() != null ? tmpActSuscripcion.getUniActcomercial() : 0);
        nuevaDsus.setDsusFecact(Timestamp.valueOf(LocalDateTime.now()));
        return dsusRepository.save(nuevaDsus);
    }
        
    private String crearJsonPunto(String longitud, String latitud,DsusDetsuscrip nuevaDsus, TmpActSuscripcion tmpActSuscripcion){
        String result;

        JSONObject bodyFeatures=new JSONObject();

        JSONObject geometry=new JSONObject();
        geometry.put("x",longitud);
        geometry.put("y",latitud);

        JSONObject attributes=new JSONObject();
        attributes.put("ID_SUSCRIPCION",nuevaDsus.getDsusIderegistr());
        attributes.put("COD_BIOAGRICOLA",nuevaDsus.getDsusPcodigo());
        attributes.put("FACTURACION", tmpActSuscripcion.getFacturacion());
        if(tmpActSuscripcion.getActsusTipo() == "Independencia") {
            attributes.put("FECHA_ENCUESTA",tmpActSuscripcion.getActsusFecha() != null ? tmpActSuscripcion.getActsusFecha().toString() : "");
        }else {
            attributes.put("FECHA_ENCUESTA",tmpActSuscripcion.getFechaEncuesta() != null ? tmpActSuscripcion.getFechaEncuesta().toString() : "");
        }
        attributes.put("CUADRILLA",tmpActSuscripcion.getUsuIderegistro());
        attributes.put("NOMBRE_SUSCRIPTOR",nuevaDsus.getTerIderegistro().getTerNomcompleto());
        attributes.put("NUMERO_DOCUMENTO",nuevaDsus.getTerIderegistro().getTerDocumento());
        attributes.put("TELEFONO",nuevaDsus.getTerIderegistro().getTerTelcelular());
        attributes.put("CORREO_ELECTRONICO",nuevaDsus.getTerIderegistro().getTerCorreo());
        attributes.put("DIRECCION",nuevaDsus.getProPropiedad().getProDireccion());
        attributes.put("BARRIO",barriosRepository.findNombreById(nuevaDsus.getUniBarrio().getBarrioIderegistro()));
        attributes.put("NOMBRE_ESTABLECIMIENTO",tmpActSuscripcion.getNomEstablecimiento());
        attributes.put("ESTRATO",nuevaDsus.getProCatestrato());
        attributes.put("USO_PREDIO", unidadRepository.findNameByUnit(nuevaDsus.getUniTipusosuscr()).toUpperCase());
        attributes.put("TIPO_LIQUIDACION", unidadRepository.findNameByUnit(nuevaDsus.getUniLiquidacion()).toUpperCase());
        
        if(nuevaDsus.getUniActsuscripc()!=null)
            attributes.put("TIPO_ACTIVIDAD",unidadRepository.findNameByUnit(nuevaDsus.getUniActsuscripc()));
        else
            attributes.put("TIPO_ACTIVIDAD","");

        attributes.put("CATASTRAL_ANTERIOR",nuevaDsus.getProPropiedad().getProNumcatastral());
        attributes.put("CODIGO_CATASTRAL_30",nuevaDsus.getProPropiedad().getProNumcatastralnacional());
        attributes.put("NUM_PISOS","");
        attributes.put("IDENTIFICACION_APTO","");
        
        attributes.put("DESOCUPADO","");
        attributes.put("AFORADO","");
        attributes.put("DESCUENTO_PAP","");

        attributes.put("SERVICIO_GAS","NO");
        attributes.put("CODIGO_LLANOGAS","");
        attributes.put("MED_GAS","");
        
        attributes.put("SERVICIO_ENERGIA","NO");
        attributes.put("CODIGO_EMSA","");
        attributes.put("MED_ENERGIA","");

        for (AlternaDto alterna:tmpActSuscripcion.getActsusAlterna()) {
            if(alterna.getServicio_alterno().equals("GAS")){
                attributes.put("SERVICIO_GAS","SI");
                attributes.put("CODIGO_LLANOGAS",alterna.getCodigo_alterno());
                attributes.put("MED_GAS",alterna.getMedidor_alterno());
            }
            if(alterna.getServicio_alterno().equals("EMSA")){
                attributes.put("SERVICIO_ENERGIA","SI");
                attributes.put("CODIGO_EMSA",alterna.getCodigo_alterno());
                attributes.put("MED_ENERGIA",alterna.getMedidor_alterno());
            }
        }

        attributes.put("OBSERVACION",tmpActSuscripcion.getObservacion());
        attributes.put("TIPO_MEDIDA","");
        attributes.put("PQRS_RADICADO","");
        attributes.put("NOMBRE_CONTACTO","");
        attributes.put("TIPO_HABITANTE","");
        attributes.put("CARGAR","");

        bodyFeatures.put("geometry",geometry);
        bodyFeatures.put("attributes",attributes);
        result= bodyFeatures.toJSONString();
        return result;
    }

    private String crearJsonActualizarPunto(Map<String,?> objectIDs,DsusDetsuscrip suscripcion,TmpActSuscripcion tmpActSuscripcion){
        String result;
        JSONObject bodyFeatures=new JSONObject();
        JSONObject attributes=new JSONObject();

        attributes.put("OBJECTID",objectIDs.get("OBJECTID"));
        attributes.put("GlobalID",objectIDs.get("GlobalID"));
        attributes.put("FACTURACION", tmpActSuscripcion.getFacturacion());
        
        //Homologacion
        attributes.put("SERVICIO_GAS","NO");
        attributes.put("CODIGO_LLANOGAS","");
        attributes.put("MED_GAS","");
        
        attributes.put("SERVICIO_ENERGIA","NO");
        attributes.put("CODIGO_EMSA","");
        attributes.put("MED_ENERGIA","");
        
        for (AlternaDto alterna:tmpActSuscripcion.getActsusAlterna()) {
            if(alterna.getServicio_alterno().equals("GAS")){
                attributes.put("SERVICIO_GAS","SI");
                attributes.put("CODIGO_LLANOGAS",alterna.getCodigo_alterno());
                attributes.put("MED_GAS",alterna.getMedidor_alterno());
            }
            if(alterna.getServicio_alterno().equals("EMSA")){
                attributes.put("SERVICIO_ENERGIA","SI");
                attributes.put("CODIGO_EMSA",alterna.getCodigo_alterno());
                attributes.put("MED_ENERGIA",alterna.getMedidor_alterno());
            }
        }

        //Marcaciones
        attributes.put("DESOCUPADO", (tmpActSuscripcion.getConLiquidacion().getDeshabitado()!=null)?"SI":"NO");
        attributes.put("AFORADO", (tmpActSuscripcion.getConLiquidacion().getAforado()!=null)?"SI":"NO");
        attributes.put("DESCUENTO_PAP", (tmpActSuscripcion.getConLiquidacion().getDescuento_pap()!=null)?"SI":"NO");
        
        attributes.put("FECHA_ENCUESTA",tmpActSuscripcion.getFechaEncuesta() != null ? tmpActSuscripcion.getFechaEncuesta().toString() : "");
        attributes.put("DIRECCION",suscripcion.getProPropiedad().getProDireccion());
        attributes.put("BARRIO",barriosRepository.findNombreById(suscripcion.getUniBarrio().getBarrioIderegistro()));
        attributes.put("NOMBRE_ESTABLECIMIENTO",tmpActSuscripcion.getNomEstablecimiento());
        attributes.put("ESTRATO", suscripcion.getProCatestrato() != null ? suscripcion.getProCatestrato().toString() : "");
        attributes.put("USO_PREDIO", unidadRepository.findNameByUnit(suscripcion.getUniTipusosuscr()).toUpperCase());
        attributes.put("TIPO_LIQUIDACION", unidadRepository.findNameByUnit(suscripcion.getUniLiquidacion()).toUpperCase());

        if(suscripcion.getUniActsuscripc()!=null)
            attributes.put("TIPO_ACTIVIDAD",unidadRepository.findNameByUnit(suscripcion.getUniActsuscripc()));
        else
            attributes.put("TIPO_ACTIVIDAD","");

        attributes.put("CATASTRAL_ANTERIOR",suscripcion.getProPropiedad().getProNumcatastral());
        attributes.put("CODIGO_CATASTRAL_30",suscripcion.getProPropiedad().getProNumcatastralnacional());
        attributes.put("OBSERVACION",tmpActSuscripcion.getObservacion());
        
        if((!tmpActSuscripcion.getLongitud().equals("") && tmpActSuscripcion.getLongitud() != null) && (!tmpActSuscripcion.getLatitud().equals("") && tmpActSuscripcion.getLatitud() != null)){
            JSONObject geometry=new JSONObject();
        	geometry.put("x",tmpActSuscripcion.getLongitud());
            geometry.put("y",tmpActSuscripcion.getLatitud());
            
            bodyFeatures.put("geometry",geometry);
        }
        
        bodyFeatures.put("attributes",attributes);
        result= bodyFeatures.toJSONString();
        return result;
    }

}
