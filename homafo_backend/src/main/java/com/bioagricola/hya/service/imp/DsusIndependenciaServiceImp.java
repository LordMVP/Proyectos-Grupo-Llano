package com.bioagricola.hya.service.imp;

import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.entity.TmpActSuscripcion;
import com.bioagricola.hya.repository.TmpActSuscripcionRepository;
import com.bioagricola.hya.service.AzService;
import com.bioagricola.hya.service.DsusIndependenciaService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 *Clase que contiene la logica relacionada con el registro de independencia
 * @author cperez@progracol.com
 */
@Service
public class DsusIndependenciaServiceImp implements DsusIndependenciaService {

    private final TmpActSuscripcionRepository actSuscripcionRepository;

    private final DsusDetsuscripRepository dsusRepository;

    private final AzService azService;

    public DsusIndependenciaServiceImp(TmpActSuscripcionRepository actSuscripcionRepository, DsusDetsuscripRepository dsusRepository, AzService azService) {
        this.actSuscripcionRepository = actSuscripcionRepository;
        this.dsusRepository = dsusRepository;
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
        if(data.getDsusPcodigo().equals(null) || data.getDsusPcodigo().equals("")) throw new FailuresServiceException("Codigo de las suscripción es requerido");
        DsusDetsuscrip dsusDetsuscrip=this.dsusRepository.findByDsusPcodigo(data.getDsusPcodigo());
        if(dsusDetsuscrip==null) throw new FailuresServiceException("No se encontro la suscripcion con codigo:"+data.getDsusPcodigo());
        Long dsusId = dsusDetsuscrip.getDsusIderegistr();

        boolean allNonEmptyOrNull = data.getUniCondspredio().stream()
                .allMatch(Objects::nonNull);
        if(!allNonEmptyOrNull) data.setUniCondspredio(new ArrayList<>());

        data.setFechaEncuesta(LocalDate.now());
        data.setDsusIderegistro(dsusId);
        data.setProDireccion(data.getProDireccion().toUpperCase());
        data.setActsusEstado('P');
        data.setActsusFecha(LocalDateTime.now());
        data.setActsusImagenesaz(null);
        data.setActsusImagenesaz(this.azService.cargarImagenesAz(imagenes,token));
        return actSuscripcionRepository.save(data);
    }

}
