package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.dto.ResumenConsolidadoAprovDto;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.CuapCuentaAprovechamientoDTO;
import com.bioagricola.apirest.modelo.dtos.DetalleResumenConsDTO;
import com.bioagricola.apirest.modelo.dtos.FiltrosResumenLiquDTO;
import com.bioagricola.apirest.modelo.dtos.InAproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoFactDTO;
import com.bioagricola.apirest.modelo.dtos.TerceroPorFactDTO;
import com.bioagricola.apirest.modelo.entidades.CuapCuentaAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCoapConsAproImp;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCoapConsolidadoapro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPrlLiquidacionapro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorTerTercero;
import com.bioagricola.apirest.modelo.projections.PeriodoFactProjection;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NegocioResumLiqui extends NegocioAbstracto<CuapCuentaAprovechamiento, CuapCuentaAprovechamientoDTO> {

    @Autowired
    private ManejadorCoapConsolidadoapro manejadorCoapConsolidadoapro;
    @Autowired
    private ManejadorPrlLiquidacionapro manejadorPrlLiquidacionapro;
    @Autowired
    private ManejadorTerTercero manejadorTerTercero;
    @Autowired
    private ManejadorCoapConsAproImp manejadorCoapConsAproImp;

    private static final Logger logger = Logger.getLogger(NegocioResumLiqui.class.getName());

    //Consulta resumen liquidacion APROVECHAMIENTO 
    public List<ResumenConsolidadoAprovDto> consultaResumenLiq(FiltrosResumenLiquDTO filtrosResumenLiquDTO) {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<ResumenConsolidadoAprovDto> resumenAprovechamiento = new ArrayList<>();

        for (PeriodoFactDTO periodo : filtrosResumenLiquDTO.getPeriodos()) {
            List<Object[]> resultStage = manejadorCoapConsAproImp.getResumenLiquidacion(periodo, filtrosResumenLiquDTO.getTerIderegistro().stream()
                                      .map(String::valueOf)
                                      .collect(Collectors.joining(",")),
                    idEmpresa, filtrosResumenLiquDTO.getEstado(), filtrosResumenLiquDTO.getTipoProceso());
            
            if (!resultStage.isEmpty()) {
                ResumenConsolidadoAprovDto resumenDto = null;
                for (Object[] it : resultStage) {
                    resumenDto = new ResumenConsolidadoAprovDto();
                    resumenDto.setTerIderegistro(Long.valueOf(it[0].toString()));
                    resumenDto.setTerNomcompleto(it[1].toString());
                    resumenDto.setCoapSaldoFactCc(new BigDecimal(it[2].toString()));
                    resumenDto.setCoapSaldoFactTa(new BigDecimal(it[3].toString()));
                    resumenDto.setCoapCambioVlrCteTa(new BigDecimal(it[4].toString()));
                    resumenDto.setCoapPagoCteCc(new BigDecimal(it[5].toString()));
                    resumenDto.setCoapPagoCteTa(new BigDecimal(it[6].toString()));
                    resumenDto.setCoapFactAjusteCc(new BigDecimal(it[7].toString()));
                    resumenDto.setCoapFactAjusteTa(new BigDecimal(it[8].toString()));
                    resumenDto.setCoapPagoAjusteCc(new BigDecimal(it[9].toString()));
                    resumenDto.setCoapPagoAjusteTa(new BigDecimal(it[10].toString()));
                    resumenDto.setCoapCambioVlrPagoCte(new BigDecimal(it[11].toString()));
                    resumenDto.setCoapVlrCastigado(new BigDecimal(it[12].toString()));
                    resumenDto.setPerIdregistr(Long.valueOf(it[13].toString()));
                    resumenDto.setPerFacturacion(Integer.valueOf(it[14].toString()));
                    resumenDto.setMaprcIderegistr(Integer.valueOf(it[15].toString()));
                    resumenAprovechamiento.add(resumenDto);
                }
            }
        }
        
        long id = 1;
        for (ResumenConsolidadoAprovDto resumenConsolidadoAprovDto : resumenAprovechamiento) {
            resumenConsolidadoAprovDto.setId(id);
            id++;
        }

        return resumenAprovechamiento;
    }

    //Consulta resumen liquidacion INCENTIVO APROVECHAMIENTO
    public List<ResumenConsolidadoAprovDto> consultaResumenLiqIA(FiltrosResumenLiquDTO filtrosResumenLiquDTO) {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<ResumenConsolidadoAprovDto> resumenIncentivo = new ArrayList<>();
        
        for (PeriodoFactDTO periodo : filtrosResumenLiquDTO.getPeriodos()) {
            List<Object[]> resultStage = manejadorCoapConsAproImp.getResumenLiquidacionIA(periodo,filtrosResumenLiquDTO.getPrlIderegistro(),
                idEmpresa, filtrosResumenLiquDTO.getEstado(), filtrosResumenLiquDTO.getTipoProceso(), filtrosResumenLiquDTO.getTerIderegistro().stream()
                                      .map(String::valueOf)
                                      .collect(Collectors.joining(",")));
            
            if (!resultStage.isEmpty()) {
                ResumenConsolidadoAprovDto resumenDto = null;
                for (Object[] it : resultStage) {
                    resumenDto = new ResumenConsolidadoAprovDto();
                    resumenDto.setTerIderegistro(Long.valueOf(it[0].toString()));
                    resumenDto.setTerNomcompleto(it[1].toString());
                    resumenDto.setCoapSaldoFactIa(new BigDecimal(it[2].toString()));
                    resumenDto.setCoapFactAjusteIa(new BigDecimal(it[3].toString()));
                    resumenDto.setCoapPagoIa(new BigDecimal(it[4].toString()));
                    resumenDto.setCoapPagoCteIa(new BigDecimal(it[5].toString()));
                    resumenDto.setCoapVlrCastigadoIa(new BigDecimal(it[6].toString()));
                    resumenDto.setCoapCambioVlrCteIa(new BigDecimal(it[7].toString()));
                    resumenDto.setCoapCambioVlrPagoCteIa(new BigDecimal(it[8].toString()));
                    resumenDto.setPerFacturacion(Integer.valueOf(it[9].toString()));
                    resumenIncentivo.add(resumenDto);
                }
            }
        }
        
        long id = 1;
        for (ResumenConsolidadoAprovDto resumenConsolidadoAprovDto : resumenIncentivo) {
            resumenConsolidadoAprovDto.setId(id);
            id++;
        }
        
        return resumenIncentivo;
    }

    public List<Object[]> consultarPeriodoConsolidado() {
        String [] estados = {"A","P"};
        return manejadorPrlLiquidacionapro.consultarPeriodosConsolidado(estados);
    }

    public List<PeriodoFactDTO> consultarPeriodoFacturacion(Long prlaIderegistro) {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<PeriodoFactDTO> periodos = new ArrayList<>();
        final List<PeriodoFactProjection> periodos_liquidados = manejadorPrlLiquidacionapro.consultarPeriodoFacturacion(idEmpresa, prlaIderegistro);

        for (PeriodoFactProjection periodo : periodos_liquidados) {
            periodos.add(new PeriodoFactDTO(periodo.getPer_nombre(), periodo.getPer_ideregistro(), periodo.getMaprc_ideregistr(),periodo.getPer_facturacion()));
        }
        return periodos;
    }

    public List<TerceroPorFactDTO> consultarTerceroFactura(FiltrosResumenLiquDTO filtrosResumenLiquDTO) {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

        List<Integer> periodos_fact = new ArrayList<>();
        List<Integer> maprc_id = new ArrayList<>();
        for (PeriodoFactDTO periodo : filtrosResumenLiquDTO.getPeriodos()) {
            periodos_fact.add(periodo.getPerFacturacion());
            maprc_id.add(periodo.getMaprcIderegistr());
        }
        maprc_id = maprc_id.stream().distinct().collect(Collectors.toList());
        periodos_fact = periodos_fact.stream().distinct().collect(Collectors.toList());
        List<TerceroPorFactDTO> terceros_asociados = this.manejadorCoapConsAproImp.consultaTerceroPorPeriodoFac(idEmpresa,maprc_id,periodos_fact,filtrosResumenLiquDTO.getTipoProceso());
        return terceros_asociados;
    }

    public List<DetalleResumenConsDTO> consultarDetalle(FiltrosResumenLiquDTO filtrosResumenLiquDTO) {
        int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
        List<DetalleResumenConsDTO> detalle = new ArrayList<>();

        for (PeriodoFactDTO periodo : filtrosResumenLiquDTO.getPeriodos()) {
            List<Object[]> results = manejadorCoapConsAproImp.getDetalleStage(periodo,idEmpresa, filtrosResumenLiquDTO.getEstado(), filtrosResumenLiquDTO.getTerIderegistro().stream().map(String::valueOf).collect(Collectors.joining(",")));
            if (results != null && !results.isEmpty()) {
                DetalleResumenConsDTO detalleResumenConsDTO = null;
                for (Object[] out : results) {
                    detalleResumenConsDTO = new DetalleResumenConsDTO();
                    detalleResumenConsDTO.setPerIderegistro(new BigInteger(out[0].toString()));
                    detalleResumenConsDTO.setFechaPrestacion(Integer.parseInt(out[1].toString()));
                    detalleResumenConsDTO.setFechaFacturacion(Integer.parseInt(out[2].toString()));
                    detalleResumenConsDTO.setCoapSaldoFactCc(new BigDecimal(out[3].toString()));
                    detalleResumenConsDTO.setCoapSaldoFactTa(new BigDecimal(out[4].toString()));
                    detalleResumenConsDTO.setCoapCambioVlrCteTa(new BigDecimal(out[5].toString()));
                    detalleResumenConsDTO.setCoapPagoCteCc(new BigDecimal(out[6].toString()));
                    detalleResumenConsDTO.setCoapPagoCteTa(new BigDecimal(out[7].toString()));
                    detalleResumenConsDTO.setCoapFactAjusteCc(new BigDecimal(out[8].toString()));
                    detalleResumenConsDTO.setCoapFactAjusteTa(new BigDecimal(out[9].toString()));
                    detalleResumenConsDTO.setCoapPagoAjusteCc(new BigDecimal(out[10].toString()));
                    detalleResumenConsDTO.setCoapPagoAjusteTa(new BigDecimal(out[11].toString()));
                    detalleResumenConsDTO.setCoapCambioVlrPagoCte(new BigDecimal(out[12].toString()));
                    detalleResumenConsDTO.setCoapVlrCastigado(new BigDecimal(out[13].toString()));
                    detalle.add(detalleResumenConsDTO);
                }
            }
        }

        long id = 1;
        for (DetalleResumenConsDTO detalleResumenConsDTO : detalle) {
            detalleResumenConsDTO.setId(id);
            id++;
        }
        return detalle;
    }

    private Object fechaPrestacion(Integer perIderegistro) {
        Object fechaPrestacion = manejadorCoapConsAproImp.getFechaPrestacion(perIderegistro);
        return fechaPrestacion;
    }

    public boolean insertarConsolidado(AproCoapConsolidadoDTO coapConsolidadoaproDTO) {
        if (coapConsolidadoaproDTO.getCoapIderegistro() == null) {
            int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
            int usuIderegistro = JwtUtil.auditoriaDTO.getIdUsuario();
            Date fechaReg = new Date();

            manejadorCoapConsAproImp.insertarConsolidado(coapConsolidadoaproDTO, idEmpresa, usuIderegistro, fechaReg);
        }
        return true;

    }

    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        // TODO Auto-generated method stub
        return CuapCuentaAprovechamiento.contieneAtributo(nombreAtributo);
    }

    @Override
    protected Logger getLogger() {
        // TODO Auto-generated method stub
        return logger;
    }

    @Override
    protected CuapCuentaAprovechamientoDTO instanciarDAO() {
        // TODO Auto-generated method stub
        return new CuapCuentaAprovechamientoDTO();
    }

}
