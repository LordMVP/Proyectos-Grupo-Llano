package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.InAproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.entidades.CoapConsolidadoapro;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorCoapConsolidadoapro 
extends ManejadorCrud<CoapConsolidadoapro, Integer>, IManejadorCrud<CoapConsolidadoapro, Integer>{

	@Query("select new com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO("+
			"tt.terIderegistro, tt.terNomcompleto , " + 
			"sum(cc.coapSaldoFactCc), sum(cc.coapSaldoFactTa) ," + 
			"sum(cc.coapCambioVlrCteTa) ,sum (cc.coapPagoCteCc) ," + 
			"sum(cc.coapPagoCteTa) , sum(cc.coapFactAjusteCc)," + 
			"sum(cc.coapFactAjusteTa) , sum(cc.coapPagoAjusteCc) ," + 
			"sum(cc.coapPagoAjusteTa) , sum(cc.coapCambioVlrPagoCte), " + 
			"sum(cc.coapVlrCastigado)) from CoapConsolidadoapro cc " + 
			"inner join DprlDetliquidacionapro dd on dd.dprlIderegistro = cc.dprlIderegistro "+
			"inner join PrlLiquidacionapro pl on pl.prlIderegistro = dd.prlIdregistro "+
			"inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "+
			"inner join FacFactura ff on ff.facIderegistro = dd.facIderegistro "+
			"where pl.prlIderegistro = :prlaIderegistro and ff.perIderegistro in :perIderegistro and tt.terIderegistro in :terIderegistro " + 
			"and dd.idEmpresa = :idEmpresa and pl.prlTipoProceso = 1 group by tt.terIderegistro")
	List<AproCoapConsolidadoDTO> getResumenLiquidacionApro (@Param("prlaIderegistro") Integer prlaIderegistro, 
			@Param("perIderegistro") List<Integer> perIderegistro, @Param("terIderegistro")List<Long> terIderegistro, @Param("idEmpresa")int idEmpresa);
	
	@Query("select ff.perIderegistro, extract(month from pp.perFecfinal)|| '-' ||extract(year from pp.perFecfinal) ," + 
			"sum(cc.coapSaldoFactCc), sum(cc.coapSaldoFactTa) ," + 
			"sum(cc.coapCambioVlrCteTa) ,sum (cc.coapPagoCteCc) ," + 
			"sum(cc.coapPagoCteTa) , sum(cc.coapFactAjusteCc)," + 
			"sum(cc.coapFactAjusteTa) , sum(cc.coapPagoAjusteCc) ," + 
			"sum(cc.coapPagoAjusteTa) , sum(cc.coapCambioVlrPagoCte), " + 
			"sum(cc.coapVlrCastigado) from CoapConsolidadoapro cc " + 
			"inner join DprlDetliquidacionapro dd on dd.dprlIderegistro = cc.dprlIderegistro "+
			"inner join PrlLiquidacionapro pl on pl.prlIderegistro = dd.prlIdregistro "+
			"inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "+
			"inner join FacFactura ff on ff.facIderegistro = dd.facIderegistro "+
			"inner join PerPeriodo pp on pp.perIderegistro = ff.perIderegistro "+
			"where pl.prlIderegistro = :prlaIderegistro and ff.perIderegistro in :perIderegistro and tt.terIderegistro in :terIderegistro " + 
			"and dd.idEmpresa = :idEmpresa group by ff.perIderegistro, pp.perIderegistro ")
	Optional<List<Object>> getDetalle (@Param("prlaIderegistro") Integer prlaIderegistro, 
			@Param("perIderegistro") List<Integer> perIderegistro, @Param("terIderegistro")List<Long> terIderegistro, @Param("idEmpresa")int idEmpresa);
	
	@Query("select new com.bioagricola.apirest.modelo.dtos.InAproCoapConsolidadoDTO("+
			"tt.terIderegistro, tt.terNomcompleto , c2.ciudadNom," + 
			"sum(cc.coapSaldoFactIa), sum(cc.coapCambioVlrCteIa) ," + 
			"sum(cc.coapPagoCteIa), sum(cc.coapCambioVlrPagoCteIa) ," + 
			"sum(cc.coapVlrCastigadoIa)) from CoapConsolidadoapro cc " + 
			"inner join DprlDetliquidacionapro dd on dd.dprlIderegistro = cc.dprlIderegistro "+
			"inner join PrlLiquidacionapro pl on pl.prlIderegistro = dd.prlIdregistro "+
			"inner join TerTercero tt on tt.terIderegistro = dd.terIderegistro "+
			"inner join Ciudades c2 on c2.ciudadCod = tt.ciudadCod "+
			"inner join FacFactura ff on ff.facIderegistro = dd.facIderegistro "+
			"where pl.prlIderegistro = :prlaIderegistro " + 
			"and dd.idEmpresa = :idEmpresa and pl.prlTipoProceso = 2 group by tt.terIderegistro, c2.ciudadNom")
	List<InAproCoapConsolidadoDTO> getResumenLiquidacionInApro (@Param("prlaIderegistro") Integer prlaIderegistro, 
			@Param("idEmpresa")int idEmpresa);
	
	
}
