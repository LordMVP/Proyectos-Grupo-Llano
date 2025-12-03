package com.bioagricola.hya.service.imp;

import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.entity.TmpActSuscripcion;
import com.bioagricola.hya.repository.TmpActSuscripcionRepository;
import com.bioagricola.hya.service.AzService;
import com.bioagricola.hya.service.DsusIndependenciaService;
import com.bioagricola.hya.service.DsusPointService;
import com.bioagricola.hya.util.CoordinateConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;

/**
 *Clase que contiene la logica relacionada con el registro de independencia
 * @author cperez@progracol.com
 */
@Service
public class DsusPointServiceImp implements DsusPointService {

    private final TmpActSuscripcionRepository actSuscripcionRepository;

    private final AzService azService;

    public DsusPointServiceImp(TmpActSuscripcionRepository actSuscripcionRepository, AzService azService) {
        this.actSuscripcionRepository = actSuscripcionRepository;
        this.azService = azService;
    }

    /**
     * Metodo para guardar un nuevo registro de independencia
     * @param data formulario info
     * @return TmpIndeSuscripcion guardado
     */
    @Transactional
    @Override
    public TmpActSuscripcion guardar(TmpActSuscripcion data, List<MultipartFile> imagenes,String token) {

        boolean allNonEmptyOrNull = data.getUniCondspredio().stream()
                .allMatch(Objects::nonNull);
        if(!allNonEmptyOrNull) data.setUniCondspredio(new ArrayList<>());

        data.setProDireccion(data.getProDireccion().toUpperCase());
        data.setActsusEstado('P');
        data.setActsusFecha(LocalDateTime.now());
        data.setActsusImagenesaz(null);
        data.setActsusImagenesaz(this.azService.cargarImagenesAz(imagenes,token));
        return actSuscripcionRepository.save(data);
    }

}
