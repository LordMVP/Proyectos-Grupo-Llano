package com.bioagricola.hya.service.imp;

import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.homologaciones.entity.DgactDetagestionActualizacion;
import com.bioagricola.homologaciones.entity.GactGestionActualizacion;
import com.bioagricola.homologaciones.repository.GactGestionActualizacionRepository;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.dto.BasicSearchDTO;
import com.bioagricola.hya.dto.DsnovDsusNovedadDTO;
import com.bioagricola.hya.entity.TmpDsusNovedad;
import com.bioagricola.hya.repository.DsusNovedadRepository;
import com.bioagricola.hya.service.AzService;
import com.bioagricola.hya.service.DsusNovedadService;
import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

/**
 *Clase que contiene la logica relacionada con novedades de suscripcion
 * @author cperez@progracol.com
 */
@Service
public class DsusNovedadServiceimp implements DsusNovedadService {

    private final DsusNovedadRepository dsusNovedadRepository;

    private final UniUnidadRepository unidadRepository;

    private final DsusDetsuscripRepository dsusRepository;

    private final GactGestionActualizacionRepository gactGestionActualizacionRepository;

    private final AzService azService;
    
    @Autowired
    private ParParametroService _parParametroService;

    public DsusNovedadServiceimp(DsusNovedadRepository dsusNovedadRepository, UniUnidadRepository unidadRepository, DsusDetsuscripRepository dsusRepository, GactGestionActualizacionRepository gactGestionActualizacionRepository, AzService azService) {
        this.dsusNovedadRepository = dsusNovedadRepository;
        this.unidadRepository = unidadRepository;
        this.dsusRepository = dsusRepository;
        this.gactGestionActualizacionRepository = gactGestionActualizacionRepository;
        this.azService = azService;
    }

    @Override
    public Map<String, Object> listarUnidadesFormulario() {
        JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        Map<String, Object> response = new HashMap<>();
        response.put("novedadesVisita",this.unidadRepository.findUnidadesByClaseAndEmpresa(Integer.valueOf(hya_parametros.getInt("clase_novvisita")),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("novedadesFactura",this.unidadRepository.findUnidadesByClaseAndEmpresa(Integer.valueOf(hya_parametros.getInt("clase_novfactura")),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("tipoSolicitud",this.getTiposSolicitud());
        response.put("seleccione",this.unidadRepository.findUnidadesByClaseAndEmpresa(Integer.valueOf(hya_parametros.getInt("clase_novedadescampo")),UtilConstantes.BIOAGRICOLA.intValue()));
        return response;
    }

    private List<Map<String,Object>> getTiposSolicitud(){
        String jsonParametros=this.unidadRepository.findParametrosById(UtilConstantes.BIOAGRICOLA.intValue());
        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();
        Map<String,Object> mapParametros = gson.fromJson(jsonParametros,Map.class);
        Map<String, Object> homologaciones = (Map<String, Object>) mapParametros.get("HOMOLOGACIONES");

        List<Map<String,Object>> response= (List<Map<String,Object>>)homologaciones.get("tipos_solicitud");
        for (Map<String,Object> map:response) {
            Double llave= (Double) map.get("llave");
            map.replace("llave",llave.intValue());
        }
        return response;
    }

    /**
     * Metodo para guardar novedad de suscripcion
     * @param dsusNovedad novedad de suscripcion a guardar
     * @return novedad guardada
     */
    @Override
    public TmpDsusNovedad guardar(TmpDsusNovedad dsusNovedad, List<MultipartFile> files, String token) {
        if(dsusNovedad.getDsusPcodigo().equals(null) || dsusNovedad.getDsusPcodigo().equals("")) throw new FailuresServiceException("Codigo de las suscripción es requerido");
        DsusDetsuscrip dsusDetsuscrip= this.dsusRepository.findByDsusPcodigo(dsusNovedad.getDsusPcodigo());
        if(dsusDetsuscrip==null )
            throw new FailuresServiceException("No se encuentra usuario con codigo "+dsusNovedad.getDsusPcodigo());

        Long dsusId = dsusDetsuscrip.getDsusIderegistr();
        if(dsusId==null) throw new FailuresServiceException("No se encontro la suscripcion con codigo:"+dsusNovedad.getDsusPcodigo());


        boolean allNonEmptyOrNull = dsusNovedad.getUniNovedades().stream()
                .allMatch(Objects::nonNull);
        if(!allNonEmptyOrNull) dsusNovedad.setUniNovedades(new ArrayList<>());

        dsusNovedad.setDsusIderegistro(dsusId);
        dsusNovedad.setDsnovImagenesAz(this.azService.cargarImagenesAz(files,token));
        dsusNovedad.setDsnovEstado('P');
        dsusNovedad.setDsnovFecha(LocalDateTime.now());
        return this.dsusNovedadRepository.save(dsusNovedad);
    }

    /**
     * Metodo para listar registros de novedades paginados
     * @param page pagina
     * @param size tamaño de pagina
     * @return listado de novedades
     */
    @Override
    public Page<DsnovDsusNovedadDTO> listar(BasicSearchDTO search,int page, int size) {
        Page<DsnovDsusNovedadDTO> responseList;
        if(search.getSearch()==null || search.getSearch().equals("")){
            responseList = this.dsusNovedadRepository.findAllByDsnovEstado('P',PageRequest.of(page, size)).map(this::convertirDto);
        } else {
            try{
                responseList = this.dsusNovedadRepository.findAllByDsnovEstadoAndDsusIderegistro('P',Long.valueOf(search.getSearch()),PageRequest.of(page, size)).map(this::convertirDto);
            } catch (NumberFormatException nex){
                throw new NumberFormatException("Id suscripción invalido "+search.getSearch());
            }
        }
        return responseList;
    }

    /**
     * Metodo para convertir entidad en dto
     * @param tmpDsusNovedad entidad DsnovDsusNovedad
     * @return DsnovDsusNovedadDTO
     */
    private DsnovDsusNovedadDTO convertirDto(TmpDsusNovedad tmpDsusNovedad) {
        ModelMapper modelMapper = new ModelMapper();
        DsnovDsusNovedadDTO dto = modelMapper.map(tmpDsusNovedad, DsnovDsusNovedadDTO.class);

        Map<String,Object> novVisita= new HashMap<>();
        novVisita.put("llave", tmpDsusNovedad.getUniNovisita());
        novVisita.put("valor",unidadRepository.findNameByUnit(tmpDsusNovedad.getUniNovisita()));

        Map<String,Object> novFactura= new HashMap<>();
        novFactura.put("llave", tmpDsusNovedad.getUniNovfactura());
        novFactura.put("valor",unidadRepository.findNameByUnit(tmpDsusNovedad.getUniNovfactura()));

        Map<String,Object> tipSolicitud= new HashMap<>();
        tipSolicitud.put("llave", tmpDsusNovedad.getUniTipSolicitud());
        tipSolicitud.put("valor",unidadRepository.findNameByUnit(tmpDsusNovedad.getUniTipSolicitud()));

        List<Object> novedades=new ArrayList<>();
        if(tmpDsusNovedad.getUniNovedades()!=null && !tmpDsusNovedad.getUniNovedades().isEmpty()){
            for (Long idnovedad: tmpDsusNovedad.getUniNovedades()) {
                Map<String,Object> novedad= new HashMap<>();
                novedad.put("llave",idnovedad);
                novedad.put("valor",unidadRepository.findNameByUnit(idnovedad));
                novedades.add(novedad);
            }
        }

        dto.setNovVisita(novVisita);
        dto.setNovFactura(novFactura);
        dto.setTipSolicitud(tipSolicitud);
        dto.setNovedades(novedades);
        return dto;
    }


    /**
     * Metodo para buscar novedades por id de suscripcion
     * @param dsusIderegistro id suscripcion
     * @return listado de novedades de la suscripcion
     */
    @Override
    public List<DsnovDsusNovedadDTO> buscar(Long dsusIderegistro) {
        List<TmpDsusNovedad> novedades = this.dsusNovedadRepository.findAllByDsusIderegistroAndDsnovEstado(dsusIderegistro,'P');
        List<DsnovDsusNovedadDTO> novedadesDto= new ArrayList<>();
        for (TmpDsusNovedad novedad:novedades) {
            novedadesDto.add(this.convertirDto(novedad));
        }
        return novedadesDto;
    }

    /**
     * Metodo para eliminar una novedad
     * @param idnovedad id de novedad
     */
    @Override
    public void eliminar(Long idnovedad,Integer idusuario) {
        TmpDsusNovedad novedad= this.dsusNovedadRepository.findById(idnovedad).orElseThrow(()-> new FailuresServiceException("La novedad con id " +idnovedad+ " no existe."));
        if(novedad.getDsnovEstado().equals('C')) throw new FailuresServiceException("El registro con id "+idnovedad+" ya se encuentra en estado Cancelado.");
        novedad.setUsuIderegistro(idusuario.longValue());
        novedad.setDsnovEstado('C');
        novedad.setDsnovFecha(LocalDateTime.now());
        this.dsusNovedadRepository.save(novedad);
    }

    /**
     * Metodo para consultar las imagenes por id de novedad
     * @param idnovedad id de novedad
     * @param token token
     * @return listado imagenes
     */
    @Override
    public List<Map<String, Object>> consultaImagenes(Long idnovedad, String token) {
        TmpDsusNovedad novedad= this.dsusNovedadRepository.findById(idnovedad).orElseThrow(()-> new FailuresServiceException("no se encuentra la novedad."));
        if(novedad.getDsnovImagenesAz()==null || novedad.getDsnovImagenesAz().isEmpty()) throw new FailuresServiceException("La novedad seleccionada no tiene imagenes guardadas.");
        try {
            token = token.replace("Bearer Bearer", "Bearer");
            ClienteArchivo clientFile = this.azService.getClienteArchivo(token);
            List<Map<String,Object>> imagenes= new ArrayList<>();
            for (ArchivoDTO archivo :novedad.getDsnovImagenesAz()) {
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
     * Metodo para aprobar una novedad
     * @param idnovedad id de novedad a aprobar
     * @param idUsu id usuario
     * @return entidad resultado de la aprobacion
     */
    @Transactional
    @Override
    public GactGestionActualizacion aprobarnovedad(Long idnovedad, Integer idUsu) {
        TmpDsusNovedad novedad= this.dsusNovedadRepository.findById(idnovedad).orElseThrow(()-> new FailuresServiceException("no se encuentra la novedad."));
        if(!novedad.getDsnovEstado().equals('P')){
            throw new FailuresServiceException("La novedad con id "+idnovedad+" ya no se encuentra en estado pendiente.");
        }
        GactGestionActualizacion response=this.crearGact(novedad,idUsu);
        novedad.setUsuIderegistro(idUsu.longValue());
        novedad.setDsnovEstado('R');
        novedad.setDsnovFecha(LocalDateTime.now());
        this.dsusNovedadRepository.save(novedad);
        return response;

    }

    /**
     * Metodo para crear nuevo registro de gestion de actualizacion (novedad)
     * @param novedad novedad aprobada
     * @param idUsu id usuario logueado
     * @return entidad de registro creado
     */
    private GactGestionActualizacion crearGact( TmpDsusNovedad novedad, Integer idUsu){
        GactGestionActualizacion  gestionActualizacion= new GactGestionActualizacion();
        gestionActualizacion.setDsusIderegistro(novedad.getDsusIderegistro().intValue());
        gestionActualizacion.setUniNovedadVisita(novedad.getUniNovisita().intValue());
        gestionActualizacion.setUniNovedadLiquidacion(novedad.getUniNovfactura().intValue());
        gestionActualizacion.setGactFecgestion(Date.from(novedad.getDsnovNovFecha().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        gestionActualizacion.setGactObservaciones(novedad.getDsnovObservaciones());
        gestionActualizacion.setGactSwtact("A");
        gestionActualizacion.setUsuIderegistro(idUsu);
        gestionActualizacion.setDateCreated(new Date());
        gestionActualizacion.setReclamoNumpqr(novedad.getDsnovNumpqr());

        List<DgactDetagestionActualizacion> detalleList=new ArrayList<>();

        if(novedad.getDsnovImagenesAz()!=null){
            for (ArchivoDTO archivo:novedad.getDsnovImagenesAz()) {
                DgactDetagestionActualizacion detalle=new DgactDetagestionActualizacion();
                detalle.setGactIderegistro(gestionActualizacion);
                detalle.setDgactAzId(archivo.getId());
                detalle.setUsuIderegistro(idUsu);
                detalle.setDateCreated(gestionActualizacion.getDateCreated());

                detalleList.add(detalle);
            }
        }
        gestionActualizacion.setDgactDetagestionActualizacionList(detalleList);
        return this.gactGestionActualizacionRepository.save(gestionActualizacion);
    }
}
