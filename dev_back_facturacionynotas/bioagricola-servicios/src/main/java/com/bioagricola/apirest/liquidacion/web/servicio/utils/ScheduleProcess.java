package com.bioagricola.apirest.liquidacion.web.servicio.utils;

import com.bioagricola.apirest.modelo.entidades.*;
import com.bioagricola.apirest.modelo.manejadores.*;
import org.apache.log4j.Logger;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ScheduleProcess {
    private static final Logger logger = Logger.getLogger(ScheduleProcess.class);
    private final ManejadorImportacionNeg manejadorImportacionNeg;
    private final ManejadorHistoricoNeg manejadorHistoricoNeg;
    private final ManejadorImportacionNegTemp manejadorImportacionNegTemp;
    private final ManejadorImportacionNegDetalle manejadorImportacionNegDetalle;
    private final ManejadorHistoricoNegDetalle manejadorHistoricoNegDetalle;
    private final ModelMapper modelMapper;

    public ScheduleProcess(ManejadorImportacionNeg manejadorImportacionNeg,
                           ManejadorHistoricoNeg manejadorHistoricoNeg,
                           ManejadorImportacionNegTemp manejadorImportacionNegTemp, ManejadorImportacionNegDetalle manejadorImportacionNegDetalle,
                           ManejadorHistoricoNegDetalle manejadorHistoricoNegDetalle, ModelMapper modelMapper) {
        this.manejadorImportacionNeg = manejadorImportacionNeg;
        this.manejadorHistoricoNeg = manejadorHistoricoNeg;
        this.manejadorImportacionNegTemp = manejadorImportacionNegTemp;
        this.manejadorImportacionNegDetalle = manejadorImportacionNegDetalle;
        this.manejadorHistoricoNegDetalle = manejadorHistoricoNegDetalle;
        this.modelMapper = modelMapper;
    }

//    @Scheduled(cron = "0 0/1 * * * *") every minute
    @Scheduled(cron = "0 0 0 1 1/1 *")
    public void releaseRecords() {
        Date date = Date.from(ZonedDateTime.now().minusYears(1).toInstant());

        logger.info("release records: " + date);

        List<ImportacionNegEMSA> negEMSAList = manejadorImportacionNeg.findAllByCreationDate(date);
        negEMSAList.forEach(importacionNegEMSA -> {
            List<ImportacionNegTemp> allByIdParent = manejadorImportacionNegTemp.findAllByIdParent(importacionNegEMSA.getId());
            if (!allByIdParent.isEmpty())
                manejadorImportacionNegTemp.deleteAll(allByIdParent);
        });

        Date auditDate = new Date();

        manejadorHistoricoNeg.saveAll(negEMSAList.stream().map(neg -> {
            HistoricoNegEMSA map = modelMapper.map(neg, HistoricoNegEMSA.class);

            map.setId(null);
            map.setAuditDate(auditDate);
            return map;
        }).collect(Collectors.toList()));
        negEMSAList.forEach(emsa -> {
            List<ImportacionNegDetalle> negDetalles = manejadorImportacionNegDetalle.findAllByIdParent(emsa.getId());

            manejadorHistoricoNegDetalle.saveAll(negDetalles.stream().map(negDetail -> {
                HistoricoNegDetalle negDetalle = modelMapper.map(negDetail, HistoricoNegDetalle.class);

                negDetalle.setId(null);
                negDetalle.setAuditDate(auditDate);
                return negDetalle;
            }).collect(Collectors.toList()));
            manejadorImportacionNegDetalle.deleteAll(manejadorImportacionNegDetalle.findAllByIdParent(emsa.getId()));
        });

        manejadorImportacionNeg.deleteAll(negEMSAList);
        logger.info("end process release records: " + auditDate);
    }
}
