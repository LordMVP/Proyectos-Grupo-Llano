package com.bioagricola.hya.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.CicCiclo;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.entity.HrrHorrecoleccion;
import com.bioagricola.common.entity.ParParametro;
import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.ConConceptoAforosRepository;
import com.bioagricola.common.repository.EstEstructuraRepository;
import com.bioagricola.common.repository.HrrHorrecoleccionRepository;
import com.bioagricola.common.repository.RutRutaRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.repository.CicCicloRepository;
import com.bioagricola.homologaciones.repository.MubaMunbarrioRepository;
import com.bioagricola.hya.config.EntityToDTOFactory;
import com.bioagricola.hya.dto.ComboUtilDTO;
import com.bioagricola.hya.dto.UniUnidadDTO;
import com.bioagricola.hya.repository.CiudadesRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import lombok.extern.log4j.Log4j2;

/**
 * Clase que contiene la logica relcionada con los items de los selectores
 *
 * @author dsolano
 */
@Service
@Transactional
@Log4j2
public class ComboUtilService {
    private final CiudadesRepository ciudadesRepository;
    private final UniUnidadRepository unidadRepository;
    private final TerTerceroRepository terceroRepository;
    private final EntityToDTOFactory entityToDTOFactory;
    private final EstEstructuraRepository structureRepository;
    private final RutRutaRepository rutaRepository;
    private final HrrHorrecoleccionRepository hrrHorrecoleccionRepository;
    private final CicCicloRepository cicCicloRepository;
    private final ConConceptoAforosRepository conConceptoAforosRepository;
    private final MubaMunbarrioRepository munbarrioRepository;
    
    @Autowired
    private ParParametroService _parParametroService;

    /**
     * Constructor de la clase
     *  @param ciudadesRepository
     * @param unidadRepository
     * @param entityToDTOFactory
     * @param parParametroRepository
     * @param structureRepository
     * @param rutaRepository
     * @param hrrHorrecoleccionRepository
     * @param cicCicloRepository
     * @param conConceptoAforosRepository
     * @param munbarrioRepository
     */
    public ComboUtilService(CiudadesRepository ciudadesRepository, UniUnidadRepository unidadRepository,
                            TerTerceroRepository terceroRepository, EntityToDTOFactory entityToDTOFactory, 
                            EstEstructuraRepository structureRepository,RutRutaRepository rutaRepository, 
                            HrrHorrecoleccionRepository hrrHorrecoleccionRepository,CicCicloRepository cicCicloRepository, 
                            ConConceptoAforosRepository conConceptoAforosRepository, MubaMunbarrioRepository munbarrioRepository) {
        this.ciudadesRepository = ciudadesRepository;
        this.unidadRepository = unidadRepository;
        this.terceroRepository = terceroRepository;
        this.entityToDTOFactory = entityToDTOFactory;
        this.structureRepository = structureRepository;
        this.rutaRepository = rutaRepository;
        this.hrrHorrecoleccionRepository = hrrHorrecoleccionRepository;
        this.cicCicloRepository = cicCicloRepository;
        this.conConceptoAforosRepository = conConceptoAforosRepository;
        this.munbarrioRepository = munbarrioRepository;
    }

    /**
     * @param idEmp
     * @param searchedParameter
     * @return
     */
    public List<UniUnidad> getUnitsByParameter(Long idEmp, String searchedParameter) {
        ParParametro parameter = _parParametroService.findByEmpresa(idEmp.intValue()).get();
        JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, idEmp);
        try {
            Map<String, Object> hashMap = new ObjectMapper().readValue(parameter.getParParametro(), HashMap.class);
            Map<String, Object> parameters = (Map<String, Object>) hashMap.get(UtilConstantes.UNIT_HOMOLOGATIONS);
            Integer claId = (Integer) (parameters.get(searchedParameter));

            List<UniUnidad> response = new ArrayList<>();

            structureRepository.findByEmpIdAndClaId(idEmp, claId.longValue()).stream()
            .collect(Collectors.partitioningBy(e->e.getEstIderegistro() == hya_parametros.getLong("est_tipouso") || e.getEstIderegistro() == hya_parametros.getLong("est_liquidacion")))
            .entrySet().stream().forEach(m->{
            	if(m.getKey()) {
            		m.getValue().stream().forEach(entity -> {
                    	if(entity.getEstIderegistro() == hya_parametros.getLong("est_tipouso") ) {
                    		response.addAll(unidadRepository.findUnitsByEstIdCondicion(entity.getEstIderegistro()));
                    	}
                    	if(entity.getEstIderegistro() == hya_parametros.getLong("est_liquidacion")) {
                    		response.addAll(unidadRepository.findUnitsByEstIdCondicionLiquidacion(entity.getEstIderegistro(),idEmp));
                    	}
            		});
            	}else {
            		m.getValue().stream().forEach(entity -> {
            			response.addAll(unidadRepository.findUnitsByEstId(entity.getEstIderegistro()));
            		});
            	}
            });
            return response;
        } catch (IOException e) {
            throw new IllegalArgumentException(UtilConstantes.PARAMETER_ERROR_MSG);
        }
    }

    /**
     * tipos de contacto
     * @return
     */
    public List<ComboUtilDTO> getContactTypes() {
        JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
        List<UniUnidad> contactTypes= this.unidadRepository.findUnitsByEstId(hya_parametros.getLong("est_tiposcontacto"));
        List<ComboUtilDTO> utilContact=new ArrayList<>();
        for (UniUnidad unit:contactTypes) {
            utilContact.add(new ComboUtilDTO(unit.getUniIderegistro().toString(),unit.getUniNombre1()));
        }
        return utilContact;
    }

    /**
     * Metodo para obtener unidades de tipo persona
     *
     * @return lista de unidades
     */
    public List<UniUnidadDTO> getPersonTypes(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_TIPO_TERCERO);
        ModelMapper mapper = new ModelMapper();

        return unitsByParameter.stream()
                .map(unit -> entityToDTOFactory.convertToUniUnidadDTO(mapper).apply(unit))
                .collect(Collectors.toList());
    }

    /**
     * Metodo para obtener unidades de tipo identificacion
     *
     * @return lista de unidades
     */
    public List<UniUnidadDTO> getIdentificationTypes(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_TIPO_IDENTIFICACION);
        ModelMapper mapper = new ModelMapper();

        return unitsByParameter.stream()
                .map(unit -> entityToDTOFactory.convertToUniUnidadDTO(mapper).apply(unit))
                .collect(Collectors.toList());
    }

    /**
     * Metodo para obtener unidades de permisos para botones por usuario y programa
     *
     * @param program id programa
     * @return lista de unidades
     */
    public List<ComboUtilDTO> getUnityPrograms(Integer program, Integer idUsu) {
        return getComboUtilDTOS(unidadRepository.findUnidadesUsuarioPrograma(program, idUsu));
    }

    private List<ComboUtilDTO> getComboUtilDTOS(List<Object[]> objects) {
        List<ComboUtilDTO> response = new ArrayList<>();

        for (Object[] obj : objects) {
            ComboUtilDTO dto = new ComboUtilDTO();

            dto.setId(obj[0].toString());
            dto.setNombre((String) obj[1]);
            response.add(dto);
        }

        return response;
    }

    /**
     * Metodo para consultar ciudades que coincidan con parametro ingresado
     *
     * @param name parametro nombre ciudad
     * @return lista de ciudades que coinciden
     */
    public List<ComboUtilDTO> searchCities(String name) {
        return getComboUtilDTOS(ciudadesRepository.buscaCiudadCoincide(name));
    }

    /**
     * Metodo para listar nombres de los terceros
     *
     * @param name parametro busqueda
     * @return lista de nombres terceros
     */
    public List<ComboUtilDTO> getAllNamesTer(String name) {
        return getComboUtilDTOS(terceroRepository.findNamesLike(name));
    }

    /**
     * Metodo que retorna mapa con las unidades relacionadas a un programa
     *
     * @param idProgram id del programa
     * @return listado de items
     */
    public Map<Integer, List<ComboUtilDTO>> getAllCombos(Integer idProgram, Integer idEmp) {
        List<Object[]> objects = unidadRepository.findUnitsByProgram(idProgram, idEmp);
        List<ComboUtilDTO> response = new ArrayList<>();

        for (Object[] obj : objects) {
            ComboUtilDTO dto = new ComboUtilDTO();

            dto.setIdGrupo((Integer) obj[0]);
            dto.setId(obj[1].toString());
            dto.setNombre((String) obj[2]);

            List<Object[]> objItemsHijos = unidadRepository.findUnitsByUnitFather((Integer) obj[1]);
            List<ComboUtilDTO> itemsHijos = new ArrayList<>();

            if (!objItemsHijos.isEmpty()) {
                for (Object[] objHijo : objItemsHijos) {
                    ComboUtilDTO dtoHijo = new ComboUtilDTO();

                    dtoHijo.setIdGrupo((Integer) objHijo[0]);
                    dtoHijo.setId(objHijo[1].toString());
                    dtoHijo.setNombre((String) objHijo[2]);
                    itemsHijos.add(dtoHijo);
                }

                dto.setItemsHijos(itemsHijos);
            }

            response.add(dto);
        }

        return response.stream().collect(Collectors.groupingBy(ComboUtilDTO::getIdGrupo));
    }

    /**
     * Metodo que retorna lista de clasificaciones de terceros
     *
     * @param idEmp id de la empresa
     * @return listado de clasificaciones
     */
    public List<ComboUtilDTO> getAllClassifications(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_TERCERO_APROVECHADORES);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo que retorna lista de tipos de propiedad
     *
     * @param idEmp id de empresa
     * @return listado de tipos de propiedad
     */
    public List<ComboUtilDTO> getAllHomeClassifications(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_CLASIFICACION_VIVIENDA);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo que retorna lista de tipos de propiedad
     *
     * @param idEmp id de empresa
     * @return listado de tipos de propiedad
     */
    public List<ComboUtilDTO> getPropertyTypes(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_TIPO_PROPIEDAD);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getEstIderegistro().getClaIderegistro().getClaIderegistro().intValue(),
                        unit.getUniIderegistro().toString(), unit.getUniNombre1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo que retorna lista de municipios
     *
     * @return lista de municipios
     */
    public List<ComboUtilDTO> getAllCities(Integer idEmp) {
        return getComboUtilDTOS(unidadRepository.findMunicipiosByUserAndEnt(idEmp));
    }

    /**
     * Metodo que retorna lista de barrios por municipio
     *
     * @param idCity id de municipio
     * @return lista de barrios
     */
    public List<ComboUtilDTO> getAllNeighborhoodsByCity(Integer idCity) {
        List<Object[]> neighborhoodsObj=unidadRepository.findBarriosByMunAndEnt(idCity);
        List<ComboUtilDTO> response = new ArrayList<>();
        for (Object[] obj : neighborhoodsObj) {
            ComboUtilDTO dto = new ComboUtilDTO();
            dto.setId(obj[0].toString());
            dto.setNombre((String) obj[1]);
            dto.setRiesgo((Boolean)obj[2]);
            response.add(dto);
        }
        return response;
    }

    /**
     * Metodo que retorna lista de complementos de direccion
     *
     * @param idCity         id de municipio
     * @param idNeighborhood id de barrio
     * @return lista de complementos
     */
    public List<ComboUtilDTO> getAllDirections(Integer idCity, Integer idNeighborhood) {
        return getComboUtilDTOS(unidadRepository.findCompDirecByMunBar(idCity, idNeighborhood));
    }

    /**
     * Metodo que retorna retorna lista de estados suscripcion por id empresa
     *
     * @param idEmp id de empresa
     * @return lista de estados suscripcion por id empresa
     */
    public List<ComboUtilDTO> getAllStates(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_ESTADOS_SUSCRIPCION);
        Collections.reverse(unitsByParameter);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1(), unit.getUniCodigo1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo para listar tipos de uso suscripcion por ide empresa
     *
     * @param idEmp id empresa
     * @return lista tipos de uso
     */
    public List<ComboUtilDTO> getAllUseTypes(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_TIPO_USO);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1(), unit.getUniCodigo1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo que retorna lista de tipos de estratos
     *
     * @param idEmp id empresa
     * @return lista tipos de estrato
     */
    public List<ComboUtilDTO> getAllStrataTypes(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_ESTRATO);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1(), unit.getUniCodigo1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo para listar liquidaciones por tipo de uso, id ciclo y municipio
     *
     * @param idEmp id empresa
     * @return lista de liquidaciones
     */
    public List<ComboUtilDTO> getAllSettlements(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_LIQUIDACION);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1(), unit.getUniCodigo1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo que retorna las macrorutas
     *
     * @return macrorutas
     */
    public List<RutRuta> getAllMacroRoutes() {
        return rutaRepository.findAllActive();
    }

    /**
     * Metodo que retorna las macrorutas
     *
     * @return macrorutas
     */
    public List<HrrHorrecoleccion> getAllSchedulesByMacroRouteId(Integer id) {
        return hrrHorrecoleccionRepository.getAllByIdMacroRoute(id.longValue());
    }

    public List<Map<String, Object>>  getAllSchedulesByRouteBarId(Integer ruta) {
        String schedules= rutaRepository.buscarMacroRuta(ruta);
        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();
        List<Map<String,Object>> schedulesMap = gson.fromJson(schedules,List.class);
        return schedulesMap;
    }

    public List<Map<String, Object>>  getAllRoutesBarByMunBar(Long idmunicipality, Long idneighborhood) {
        List<Map<String,Object>> routes=new ArrayList<>();
        JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        for(Object[] rutaObj: this.rutaRepository.listaRutasBarrioTipo(hya_parametros.getInt("est_microrutasbarrido"),idneighborhood.intValue()))
        {
            HashMap<String, Object> tmp1=new HashMap<>();
            tmp1.put("rutIderegistro", rutaObj[0]);
            tmp1.put("rutNombre", rutaObj[1]);
            routes.add(tmp1);
        }
        return routes;
    }

    /*public List<Map<String, Object>>  getAllRoutesBarByMunBar(Long idmunicipality, Long idneighborhood) {
        Long muba = this.munbarrioRepository.findIdByMunBar(idmunicipality,idneighborhood);
        if (muba == null) return new ArrayList<>();

        List<String> routesBar= this.rutaRepository.buscarRutasBarByMuba(muba.intValue());
        List<Map<String, Object>> responseRoutes= new ArrayList<>();

        for (String obj:routesBar) {
            GsonBuilder builder = new GsonBuilder();
            builder.setPrettyPrinting();
            Gson gson = builder.create();
            List<Map<String,Object>> schedulesMap = gson.fromJson(obj,List.class);
            responseRoutes.addAll(schedulesMap);
        }
        return responseRoutes;
    }*/

    /**
     * Metodo que retorna las microrutas
     *
     * @return microrutas
     */
    public List<ComboUtilDTO> getAllMicroRoutesByMacroRouteId(Integer id) {
        ConvertGeneral convert = new ConvertGeneral();
        List<ComboUtilDTO> response = new ArrayList<>();
        List<Object[]> objects = rutaRepository.getAllMicroRoutesByMacroRouteId(id.longValue());

        for (Object[] obj : objects) {
            ComboUtilDTO dto = new ComboUtilDTO();
            List<ComboUtilDTO> innerList = new ArrayList<>();

            dto.setId(obj[0].toString());

            for (HashMap<String, Object> hashMap : convert.convertStringToArray(obj[1])) {
                if (hashMap.containsKey("microRuta") && hashMap.containsKey("nombre"))
                    innerList.add(new ComboUtilDTO(hashMap.get("microRuta").toString(), hashMap.get("nombre").toString()));
            }

            dto.setItemsHijos(innerList);
            response.add(dto);
        }
        return response;
    }

    /**
     * Metodo para listar los ciclos por ruta y empresa
     *
     * @return listado de ciclos
     */
    public List<CicCiclo> getAllCycles(Integer idEmp) {
        return cicCicloRepository.findAllCyclesByEmpId(idEmp);
    }

   /* public List<CicCiclo> getAllCycles(Integer idEmp,Integer idliquidacion) {
        return cicCicloRepository.findAllCyclesByEmpId(idEmp,idliquidacion);
    }*/

    /**
     * Metodo para obtener ciclo
     *
     * @return ciclo
     */
    public CicCiclo getCycleById(Long id) {
        return cicCicloRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("cycle not found"));
    }

    /**
     * Metodo para listar las rutas por ciclo
     *
     * @return listado de rutas por ciclo
     */
    public List<RutRuta> getAllRoutesByIdCycle(Integer idCycle) {
        return rutaRepository.getAllRoutesByIdCycle(idCycle);
    }

    /**
     * Metodo para listar actividades econimicas suscripcion
     *
     * @return lista actividades economicas
     */
    public List<ComboUtilDTO> getAllEconomicActivities(Integer idEmp) {
        List<UniUnidad> unitsByParameter = getUnitsByParameter(idEmp.longValue(), UtilConstantes.CLASE_ACTIVIDAD_ECONOMICA);

        return unitsByParameter.stream()
                .map(unit -> new ComboUtilDTO(unit.getUniIderegistro().toString(), unit.getUniNombre1()))
                .collect(Collectors.toList());
    }

    /**
     * Metodo para listar conceptos por programa, id liquidacion, detale suscripcion id y empresa
     *
     * @return lista de conceptos
     */
    public List<ConConcepto> getAllConceptsByIdProgram(Integer usuario) {
        return conConceptoAforosRepository.getAllConceptsByIdProgram(20,usuario);
    }
    
    /**
     * Metodo para listar conceptos por programa, id liquidacion, detale suscripcion id y empresa
     *
     * @return lista de conceptos
     */
    public List<ConConcepto> getAllConceptsByIdProgramPrograma(Integer usuario,Integer programa) {
        return conConceptoAforosRepository.getAllConceptsByIdProgramPrograma(20,usuario,programa);
    }

    /**
     * Metodo para listar los tipos de suscripcion por id convenio
     *
     * @param idconvenio id convenio
     * @return lista de tipos suscripcion
     */
    public List<ComboUtilDTO> getAllSubscriptionTypes(Integer idconvenio, Integer idempresa, Integer idmunicipio) {
        return getComboUtilDTOS(unidadRepository.findTiposSusByConvenio(idconvenio, idempresa, idmunicipio));
    }

    /**
     * Servicio que retorna lista de empresas
     *
     * @return lista de empresas
     */
    public List<ComboUtilDTO> getAllEnterprises(Integer idempresa) {
    	ParParametro parameter = _parParametroService.findByEmpresa(idempresa).get();
    	Integer claId = 0 ;
        try {
            Map<String, Object> hashMap = new ObjectMapper().readValue(parameter.getParParametro(), HashMap.class);
            Map<String, Object> parameters = (Map<String, Object>) hashMap.get(UtilConstantes.UNIT_HOMOLOGATIONS);
            claId = (Integer) (parameters.get(UtilConstantes.UNIDAD_TERCERO_APROVECHAMIENTO));

        } catch (IOException e) {
            throw new IllegalArgumentException(UtilConstantes.PARAMETER_ERROR_MSG +" "+ UtilConstantes.UNIDAD_TERCERO_APROVECHAMIENTO );
        }
    	    	
        return getComboUtilDTOS(unidadRepository.getAllEnterprisesByUnitId(claId));
    }

    /**
     * Metodo para listar los tipos de documentos
     *
     * @param idTipoSuscripcion
     * @param idMunicipio
     * @return
     */
    public List<ComboUtilDTO> listarTiposDocumentos(Integer idTipoSuscripcion, Integer idMunicipio, Integer idEmp, Integer idUsu) {
        return getComboUtilDTOS(this.unidadRepository.findDocumentType(idUsu, 18, idEmp, idTipoSuscripcion, idMunicipio));
    }

    /**
     * Metodo para listar los conceptos de las liquidaciones
     *
     * @param idLiquidaciones ids de liquidaciones
     * @return listado de conceptos
     */
    public List<Map<String, Object>> listarConceptosLiquidaciones(List<Integer> idLiquidaciones) {
        return unidadRepository.findConceptosLiquidaciones(idLiquidaciones);
    }
}
