package com.bioagricola.hya.service.imp;

import com.bioagricola.aforos.entity.AdjuntoVisita;
import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;
import com.bioagricola.aforos.entity.DetalleMaestroVisita;
import com.bioagricola.aforos.repository.AdjuntoVisitaRepository;
import com.bioagricola.aforos.repository.AforoRepository;
import com.bioagricola.aforos.repository.DetalleMaestroVisitaRepository;
import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.Usuarios;
import com.bioagricola.common.repository.ConConceptoAforosRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.repository.UsuariosRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.dto.AforoVisitaDto;
import com.bioagricola.hya.dto.DetalleVisitaDTO;
import com.bioagricola.hya.service.AforoVisitaService;
import com.bioagricola.hya.service.AzService;
import com.gell.estandar.comunicacion.ClienteArchivo;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


/**
 *Clase que contiene la logica relacionada con las visitas de aforos
 * @author cperez@progracol.com
 */
@Service
public class AforoVisitaServiceImp implements AforoVisitaService {

    private final AforoRepository aforoRepository;

    private final DetalleMaestroVisitaRepository detalleVisitaRepository;

    private final UniUnidadRepository unidadRepository;

    private final DetalleMaestroVisitaRepository detalleMaestroVisitaRepository;

    private final AdjuntoVisitaRepository adjuntoVisitaRepository;

    private final ConConceptoAforosRepository conceptoAforosRepository;

    private final UsuariosRepository usuariosRepository;

    private final TerTerceroRepository terTerceroRepository;

    private final AzService azService;

    private final ApiArcGis apiArcGis;
    
    @Autowired
    private ParParametroService _parParametroService;

    public AforoVisitaServiceImp(AforoRepository aforoRepository, DetalleMaestroVisitaRepository detalleVisitaRepository, UniUnidadRepository unidadRepository, DetalleMaestroVisitaRepository detalleMaestroVisitaRepository, AdjuntoVisitaRepository adjuntoVisitaRepository, ConConceptoAforosRepository conceptoAforosRepository, UsuariosRepository usuariosRepository, TerTerceroRepository terTerceroRepository, AzService azService, ApiArcGis apiArcGis) {
        this.aforoRepository = aforoRepository;
        this.detalleVisitaRepository = detalleVisitaRepository;
        this.unidadRepository = unidadRepository;
        this.detalleMaestroVisitaRepository = detalleMaestroVisitaRepository;
        this.adjuntoVisitaRepository = adjuntoVisitaRepository;
        this.conceptoAforosRepository = conceptoAforosRepository;
        this.usuariosRepository = usuariosRepository;
        this.terTerceroRepository = terTerceroRepository;
        this.azService = azService;
        this.apiArcGis = apiArcGis;
    }

    /**
     * Metodo para listar aforos- visitas del dia por usuario logueado y fecha actual
     * @param idUsu id usuario logueado
     * @return listado de aforos - visitas
     */
    @Override
    public List<AforoVisitaDto> listarVisitasUsuario(Integer idUsu) {
        List<AforoVisitaDto> aforosIfoResponse= new ArrayList<>();

        List<Map<String,Object>> aforoVisitas=this.aforoRepository.findVisitasAforosByUserAndFecha(this.getIdterceroByUsuario(idUsu), LocalDate.now());
       // List<Map<String,Object>> aforoVisitas=this.aforoRepository.findVisitasAforosByUserAndFecha(461505, LocalDate.of(2022,7,18));

        for (Map aforoMap:aforoVisitas) {
            boolean exist=false;
            ModelMapper modelMapper = new ModelMapper();
            AforoVisitaDto dto = modelMapper.map(aforoMap, AforoVisitaDto.class);
            Map<String, Object> detalleVisitas= this.detalleVisitaRepository.countVisitasByAforo(dto.getAforoId());
            dto.setVisitasTotal(detalleVisitas.get("visitasTotal").toString());
            dto.setVisitasRealizadas(detalleVisitas.get("visitasRealizadas").toString());

            if(dto.getClaseAforo().trim().equalsIgnoreCase("Multiusuario")){
                String sus=dto.getSuscripcion();
                String dir= dto.getDireccion();
                String pcodigo= dto.getCodSusBio();
                dto.setNombreEstablecimiento(this.aforoRepository.findNombreEstablecimientoAfoMultiusuario(dto.getAforoId()));
                dto.setSuscripcion("Multiples");
                if(aforoMap.get("direccionmulti")!=null)
                    dto.setDireccion((String) aforoMap.get("direccionmulti"));

                for (AforoVisitaDto afodto:aforosIfoResponse) {
                    if(dto.getVisitaId().intValue()==afodto.getVisitaId().intValue()){
                        Map<String,Object> mapsusDto= new HashMap<>();
                        mapsusDto.put("suscripcion",sus);
                        mapsusDto.put("direccion",dir);
                        mapsusDto.put("codSusBio",pcodigo);
                       if(afodto.getSuscripcionesMulti()==null) {
                           afodto.setSuscripcionesMulti(new ArrayList<>());
                       }
                        afodto.getSuscripcionesMulti().add(mapsusDto);
                        if (afodto.getCodSusMulti() == null) {
                            afodto.setCodSusMulti(pcodigo);
                        } else {
                            afodto.setCodSusMulti(afodto.getCodSusMulti() + ',' + pcodigo);
                        }
                        exist=true;
                        break;
                    }
                }
            }

            if(!exist) {
                aforosIfoResponse.add(dto);
            }
        }

        if(!aforosIfoResponse.isEmpty()){
            this.consultaCoordenadasSuscripcionesBio(aforosIfoResponse);
        }
        return aforosIfoResponse;
    }

    private void consultaCoordenadasSuscripcionesBio(List<AforoVisitaDto> aforos){
        String parametrosBio = aforos.stream()
                .map(s -> "'" + s.getCodSusBio() + "'")
                .collect(Collectors.joining(", ", "(", ")"));
        String consulta = "COD_BIOAGRICOLA+IN+" + parametrosBio;

        String token = apiArcGis.getAccessTokenTwo();
        List<LinkedHashMap<String,Object>> coordenadas = this.apiArcGis.consultaCoordenadasSuscripcionBio(token,consulta);

        aforos.forEach(dto -> {
            Optional<LinkedHashMap<String, Object>> match = coordenadas.stream()
                    .filter(map -> {
                        Map<String,Object> features = (Map<String,Object>) map.get("attributes");
                        return dto.getCodSusBio().trim().equals((String)features.get("COD_BIOAGRICOLA"));
                    })
                    .findFirst();
            if (match.isPresent()) {
                Map<String,Object> geometry = (Map<String,Object>) match.get().get("geometry");
                dto.setLocationX((Double) geometry.get("x"));
                dto.setLocationY((Double) geometry.get("y"));
            }
        });
    }

    /**
     * Metodo para listar visitas realizadas por el usuario
     * @param idUsu id usuario logueado
     * @return listado de aforos - visitas realizadas
     */
    @Override
    public List<AforoVisitaDto> listarVisitasRealizadasUsuario(Integer idUsu) {
        List<AforoVisitaDto> aforosIfoResponse= new ArrayList<>();
        List<Map<String,Object>> aforoVisitas=this.aforoRepository.findVisitasAforosRealizadasByUser(this.getIdterceroByUsuario(idUsu));
       // List<Map<String,Object>> aforoVisitas=this.aforoRepository.findVisitasAforosRealizadasByUser(461505);
        for (Map aforoMap:aforoVisitas) {
            ModelMapper modelMapper = new ModelMapper();
            AforoVisitaDto dto = modelMapper.map(aforoMap, AforoVisitaDto.class);
            Map<String, Object> detalleVisitas= this.detalleVisitaRepository.countVisitasByAforo(dto.getAforoId());
            dto.setVisitasTotal(detalleVisitas.get("visitasTotal").toString());
            dto.setVisitasRealizadas(detalleVisitas.get("visitasRealizadas").toString());
            aforosIfoResponse.add(dto);
        }
        return aforosIfoResponse;
    }

    /**
     * Metodo para listar visitas canceladas por el usuario
     * @param idUsu id usuario logueado
     * @return listado de aforos - visitas canceladas
     */
    @Override
    public List<AforoVisitaDto> listarVisitasCanceladasUsuario(Integer idUsu,  String token) {
        List<AforoVisitaDto> aforosIfoResponse= new ArrayList<>();
        List<Map<String,Object>> aforoVisitas=this.aforoRepository.findVisitasAforosCanceladasByUser(this.getIdterceroByUsuario(idUsu),LocalDate.now());
        //List<Map<String,Object>> aforoVisitas=this.aforoRepository.findVisitasAforosCanceladasByUser(461505,LocalDate.of(2022,7,22));
        for (Map aforoMap:aforoVisitas) {
            ModelMapper modelMapper = new ModelMapper();
            AforoVisitaDto dto = modelMapper.map(aforoMap, AforoVisitaDto.class);
            Map<String, Object> detalleVisitas= this.detalleVisitaRepository.countVisitasByAforo(dto.getAforoId());
            dto.setVisitasTotal(detalleVisitas.get("visitasTotal").toString());
            dto.setVisitasRealizadas(detalleVisitas.get("visitasRealizadas").toString());

            AdjuntoVisita adjuntoVisita= this.adjuntoVisitaRepository.findByDmafIderegistro(dto.getVisitaId());
            if(adjuntoVisita!= null) {
                try {
                    token = token.replace("Bearer Bearer", "Bearer");
                    ClienteArchivo clientFile = this.azService.getClienteArchivo(token);
                    byte[] imagen = clientFile.consultarByte(adjuntoVisita.getAdvaIdfererenciaazdigital());
                    String imagenString = Base64.getEncoder().encodeToString(imagen);
                    Map<String, Object> mapaImagen = new HashMap<>();
                    mapaImagen.put("id", adjuntoVisita.getAdvaIdfererenciaazdigital());
                    mapaImagen.put("tipo", adjuntoVisita.getAdvaTipoarchivo());
                    mapaImagen.put("imagen", imagenString);
                    dto.setImage(mapaImagen);
                } catch (AplicacionExcepcion e) {
                    e.printStackTrace();
                    throw new RuntimeException(e.getMensaje());
                }
            }
            aforosIfoResponse.add(dto);
        }
        return aforosIfoResponse;
    }

    /**
     * Metodo para cancelar un aforo - visita
     * @param detalleVisitaDTO informacion visita cancelada
     * @param images imagen soporte
     * @param token token usuario logueado
     * @param idUsu id usuario logueado
     * @param idempresa id empresa usuario logueado
     */
    @Transactional
    @Override
    public boolean cancelarAforoVisita(DetalleVisitaDTO detalleVisitaDTO, List<MultipartFile> images, String token, Integer idUsu, Integer idempresa) {
        DetalleMaestroVisita visita = this.detalleMaestroVisitaRepository.findById(detalleVisitaDTO.getVisitaId()).orElseThrow(() -> new FailuresServiceException("No se encuentra la visita con ID:"+detalleVisitaDTO.getVisitaId()));
        if(!visita.getDmafEstado().trim().equals("P")) {
            return false;
        } else {
            List<DetalleConceptoVisitaAforo> detalleVisitaList= new ArrayList<>();
            DetalleConceptoVisitaAforo detalleVisita = new DetalleConceptoVisitaAforo();
            detalleVisita.setDmafIderegistro(visita);
            ConConcepto concepto= new ConConcepto();
            concepto.setUniConcepto(new Long(2726));//no aplica recipiente
            detalleVisita.setUniConcepto(concepto);
            detalleVisita.setDcvaCantidadconcepto(0L);
            detalleVisita.setDcvaVolumenaforo((double) 0);
            detalleVisita.setDcvaFecharegistro(new Date());
            detalleVisita.setDcvaFechaactualiza(new Date());
            detalleVisita.setDcvaPesoaforo((double) 0);
            detalleVisita.setUsuIderegistro(Long.valueOf(idUsu));
            detalleVisitaList.add(detalleVisita);
            visita.setDmafEstado("C"); //Cancelada
            try {
                visita.setDmafObservaciones(new String(detalleVisitaDTO.getObservacionVisita().getBytes("ISO-8859-1"),"UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            visita.getDetalleConceptosList().addAll(detalleVisitaList);
            detalleMaestroVisitaRepository.save(visita);
            this.savePhotos(detalleVisitaDTO, visita, images, token, idUsu, idempresa);

            // Actualizacion consecutivos
            List<DetalleMaestroVisita>visitasConsecutivo= new ArrayList<>();
            visitasConsecutivo.addAll(this.detalleMaestroVisitaRepository.findVisitasCancelar(visita.getMaestroAforoVista().getMafvIderegistro(),visita.getDmavConsecutivovisita()));

            for (DetalleMaestroVisita dmafv:visitasConsecutivo) {
                dmafv.setDmafEstado("C"); //Cancelada
                dmafv.setDmafObservaciones("Cancelado por consecutivo de visita "+visita.getDmafIderegistro() +" - "+ visita.getDmafObservaciones());
            }
            detalleMaestroVisitaRepository.saveAll(visitasConsecutivo);

            visita.getMaestroAforoVista().getAforo().setAfoEstado("Inactivo");
            aforoRepository.save(visita.getMaestroAforoVista().getAforo());
            return true;
        }
    }

    /**
     * Metodo para Tramitar aforo -visita
     * @param detalleVisitaDTO info visita realizada
     * @param images imagenes de soporte
     * @param token token de usuario logueado
     * @param idUsu id de usuario logueado
     * @param idempresa id empresa usuario logueadoi
     * @return Detalles de visita insertados
     */
    @Transactional
    @Override
    public List<DetalleConceptoVisitaAforo> realizarAforoVisita(DetalleVisitaDTO detalleVisitaDTO, List<MultipartFile> images, String token, Integer idUsu, Integer idempresa) {
        DetalleMaestroVisita visita = this.detalleMaestroVisitaRepository.findById(detalleVisitaDTO.getVisitaId()).orElseThrow(() -> new FailuresServiceException("No se encuentra la visita con ID:"+detalleVisitaDTO.getVisitaId()));
        if(!visita.getDmafEstado().trim().equals("P")){
            return null;
        } else {
            for (DetalleConceptoVisitaAforo detalleVisita:detalleVisitaDTO.getDetallesVisita()) {
                ConConcepto concepto= new ConConcepto();
                concepto.setUniConcepto(detalleVisita.getUniConceptoId());
                detalleVisita.setUniConcepto(concepto);
                detalleVisita.setDmafIderegistro(visita);
                detalleVisita.setDcvaFecharegistro(new Date());
                detalleVisita.setDcvaFechaactualiza(new Date());
                detalleVisita.setUsuIderegistro(Long.valueOf(idUsu));
            }

            visita.setDmafEstado("T"); //Tramitada
            try {
                visita.setDmafObservaciones(new String(detalleVisitaDTO.getObservacionVisita().getBytes("ISO-8859-1"),"UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            visita.getDetalleConceptosList().addAll(detalleVisitaDTO.getDetallesVisita());
            detalleMaestroVisitaRepository.save(visita);

            this.savePhotos(detalleVisitaDTO, visita, images, token, idUsu, idempresa);

            // TODO: 3/11/2022 ajuste para pruebas
        /*List<DetalleConceptoVisitaAforo> listTest = visita.getDetalleConceptosList();
        this.restaurarVisita(visita);
        return listTest;*/
            return visita.getDetalleConceptosList();
        }
    }

    private void savePhotos(DetalleVisitaDTO detalleVisitaDTO,DetalleMaestroVisita visita,List<MultipartFile> images, String token, Integer idUsu, Integer idempresa){
        List<ArchivoDTO> imageneSubida=this.azService.cargarImagenesAz(images,token);
        List<AdjuntoVisita> adjuntosVisita=new ArrayList<>();
        for (ArchivoDTO archivoDTO:imageneSubida) {
            AdjuntoVisita adjuntoVisita= new AdjuntoVisita();
            adjuntoVisita.setMafvIderegistro(visita.getMaestroAforoVista().getMafvIderegistro().intValue());
            adjuntoVisita.setDmafIderegistro(visita.getDmafIderegistro().intValue());
            adjuntoVisita.setUniTipoadjunto(3406);//foto de soporte
            adjuntoVisita.setAdvaIdfererenciaazdigital(archivoDTO.getId());
            adjuntoVisita.setEmpIderegistro(idempresa);
            adjuntoVisita.setTerAforador(this.getIdterceroByUsuario(idUsu));
            adjuntoVisita.setAdvaFecha(new Date());
            String a = detalleVisitaDTO.getDetalleImagenMap().get(archivoDTO.getNombreOriginal().trim());
            try {
                adjuntoVisita.setAdvaObservaciones(new String(a.getBytes("ISO-8859-1"),"UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            adjuntoVisita.setUsuIderegistro(idUsu);
            adjuntoVisita.setAdvaNombre(archivoDTO.getNombreOriginal());
            adjuntoVisita.setAdvaTamanio(String.valueOf(archivoDTO.getTamanio()));
            adjuntoVisita.setAdvaTipoarchivo(archivoDTO.getTipo());
            adjuntosVisita.add(adjuntoVisita);
        }
        adjuntoVisitaRepository.saveAll(adjuntosVisita);
    }

    //metodo para pruebas unicamente
    private void restaurarVisita(DetalleMaestroVisita visita){
        visita.setDmafEstado("P");
        visita.setDmafObservaciones("");
        List<DetalleConceptoVisitaAforo> data =  visita.getDetalleConceptosList();
        visita.getDetalleConceptosList().clear();
        detalleMaestroVisitaRepository.save(visita);
        visita.setDetalleConceptosList(data);


    }

    /**
     * Metodo para consultar tercero por id de usuario logueado
     * @param idUsu id usuario logueado
     * @return id tercero
     */
    private Integer getIdterceroByUsuario(Integer idUsu){
        Usuarios usuario = this.usuariosRepository.findById(Long.valueOf(idUsu)).orElseThrow(()-> new FailuresServiceException("No se encontro el usuario con id: "+idUsu));
        TerTercero terTercero = this.terTerceroRepository.findByIdentification(usuario.getUsuarioNit()).orElseThrow(()-> new FailuresServiceException("No se encontro el tercero asociado al usuario: "+idUsu));
        return terTercero.getTerIderegistro().intValue();
    }

    /**
     * Metodo para listar unidades del filtro de las visitas app
     * @return Listado de items
     */
    @Override
    public Map<String, Object> listarUnidades() {
        org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        Map<String, Object> response = new HashMap<>();
        response.put("tiposAforo",this.unidadRepository.findUnidadesByClaseAndEmpresa(hya_parametros.getInt("clase_tipoaforo"),UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("segmentoFac",this.unidadRepository.findSegmentosFacturacion(UtilConstantes.BIOAGRICOLA.intValue()));
        response.put("tiposRecipiente",this.conceptoAforosRepository.findConConceptosAforoSimpleItem(hya_parametros.getLong("est_conceptos_liq_aseo"),hya_parametros.getLong("uni_liquidacion")));
        return response;
    }
    
    @Override
    public Map<String, Object> validarVisitaAforo(Integer id_aforo, Integer id_visita) {
    	return this.aforoRepository.findVisitaAforo(id_aforo, id_visita);
    }
}
