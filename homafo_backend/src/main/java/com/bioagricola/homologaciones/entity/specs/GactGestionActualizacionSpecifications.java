package com.bioagricola.homologaciones.entity.specs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.dto.BusquedaHomologacionGestionRequest;
import com.bioagricola.homologaciones.entity.GactGestionActualizacion;

public class GactGestionActualizacionSpecifications
{
	public static Specification<GactGestionActualizacion> byBusqueda(BusquedaHomologacionGestionRequest request)
	{
		ConvertGeneral convertir=new ConvertGeneral();
		return (root, query, cb) -> {						
			List<Predicate> conditions = new ArrayList<>();
			if(request.getLiquidacion()>0)
			{
				conditions.add(cb.equal(root.get("uniNovedadLiquidacion"), request.getLiquidacion()));
			}
			if(request.getVisita()>0)
			{
				conditions.add(cb.equal(root.get("uniNovedadVisita"), request.getVisita()));
			}
			if(request.getColaborador()>0)
			{
				conditions.add(cb.equal(root.get("usuIderegistro"), request.getColaborador()));
			}
			if(request.getDesde().length()>0 && request.getHasta().length()>0)
			{
				conditions.add(cb.between(root.get("gactFecgestion"),convertir.convertirStringFechas(request.getDesde()),convertir.convertirStringFechas(request.getHasta())));
			}
			return cb.and(conditions.toArray(new Predicate[conditions.size()]));			
		};
	}
}
