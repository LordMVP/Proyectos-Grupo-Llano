package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.aprovechamiento.model.SevenDataDto;
import com.bioagricola.apirest.aprovechamiento.negocio.NegocioLiquidacion;
import com.bioagricola.apirest.aprovechamiento.repository.SevenRepository;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.entidades.AprsevSeven;
import com.bioagricola.apirest.modelo.entidades.ParParametro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorAprsevSeven;
import com.bioagricola.apirest.modelo.manejadores.ManejadorParParametro;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


/**
 *
 * @author Yoner Silva
 */
@Service
public class SevenProcesoScheduled {
    
    private static Logger logger = Logger.getLogger(NegocioLiquidacion.class.getName());

    private static final String CFL_CODI = "cfl_codi";
    private static final String ITEM = "item";
    
    @Autowired
    private SevenRepository sevenRepository;
    
    @Autowired
    private ManejadorAprsevSeven aprsevSevenRepository;

    @Autowired
    private ManejadorParParametro manejadorParParametro;

    public SevenProcesoScheduled() {
    }
    
    @Scheduled( cron = "0 0 6 * * ?", zone = "America/Bogota" )
    public void sincronizarValoresSeven(){
        Date fecha_now = new Date();
        LocalDateTime now = LocalDateTime.now();
        logger.info("Se inicia el proceso de sincronización del valores de seven. Hora: " + fecha_now.toLocaleString());
        String codUse = "";
        String codIncentiveUse = "";
        
        try {
            ParParametro parametrosEmpresa = this.manejadorParParametro.consultaParametros(317);
            Map<String, Object> parameters = (Map<String, Object>) new ObjectMapper().readValue(parametrosEmpresa.getParParametro(), HashMap.class).get(ConstantesServicios.UNIDAD_APROVECHAMIENTO);
            List<LinkedHashMap<String, String>> budgetMap = (List<LinkedHashMap<String, String>>) parameters.get(ConstantesServicios.REPORTE_PRESUPUESTO_APROVECHAMIENTO);

            for (LinkedHashMap<String, String> map : budgetMap) {
                if (map.get(ITEM).equals("Aprovechamiento"))
                    codUse = map.get(CFL_CODI);
                else if (map.get(ITEM).equals("Incentivo Aprovechamiento"))
                    codIncentiveUse = map.get(CFL_CODI);
            }
            
            for (String mes : ConstantesServicios.MESES) {
                AprsevSeven aprsev_seven = aprsevSevenRepository.findByMesAnoEmp(Integer.parseInt(mes), now.getYear(), 317);

                if(aprsev_seven == null) aprsev_seven = new AprsevSeven();
                
                SevenDataDto sevenDataUse = sevenRepository.sevenData(Integer.parseInt(mes), now.getYear(), 317, Integer.parseInt(codUse));
                aprsev_seven.setMes(sevenDataUse.getMonth());
                aprsev_seven.setAno(sevenDataUse.getYear());
                aprsev_seven.setEmp_ideregistro(sevenDataUse.getCodeCompany());
                    
                aprsev_seven.setValor_ejecutado_aprov(sevenDataUse.getExecutedValue());
                aprsev_seven.setValor_proyectado_aprov(sevenDataUse.getProjectedValue());
                
                SevenDataDto sevenDataUseIat = sevenRepository.sevenData(Integer.parseInt(mes), now.getYear(), 317, Integer.parseInt(codIncentiveUse));
                aprsev_seven.setValor_ejecutado_iat(sevenDataUseIat.getExecutedValue());
                aprsev_seven.setValor_proyectado_iat(sevenDataUseIat.getProjectedValue());
                if(aprsev_seven.getAprsev_ideregistro() == null){
                    aprsevSevenRepository.save(aprsev_seven);
                }else{
                    aprsevSevenRepository.updateAprsev(
                            aprsev_seven.getAprsev_ideregistro(),
                            aprsev_seven.getValor_proyectado_aprov().doubleValue(),
                            aprsev_seven.getValor_ejecutado_aprov().doubleValue(),
                            aprsev_seven.getValor_proyectado_iat().doubleValue(),
                            aprsev_seven.getValor_ejecutado_iat().doubleValue());
                }                    
            }
        } catch (Exception e) {
            logger.info(e.getMessage());
            System.err.println(e.getMessage());
        }
        fecha_now = new Date();
        logger.info("Se finaliza el proceso de sincronización del valores de seven. Hora: " + fecha_now.toLocaleString());
    }
}
