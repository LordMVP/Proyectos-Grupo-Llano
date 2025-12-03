package com.bioagricola.aforos.service.impl;

import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.MaestroAforoVisita;
import com.bioagricola.aforos.entity.dto.LiquidacionDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.util.BDToDTOUtil;


@Service
public class LiquidacionServiceImpl {

	@Autowired
	private AuthenticationFacade authenticationFacade;
	@Autowired
	private BDToDTOUtil bDToDTOUtil;
	@PersistenceContext
	private EntityManager em;

	@Autowired
	private SearchComponentServiceImpl searchComponentServiceImpl;

	public LiquidacionDTO search(LiquidacionDTO dto){
		return bDToDTOUtil.mapAforoToLiquidacionDTO(searchComponentServiceImpl.searchAforoLiquidacion(dto));
	}

	public LiquidacionDTO preLiquidar(LiquidacionDTO dto){
		String consulta="select aseo.fn_liquida_visita(:mafvId, CAST('P' as varchar(1)), :usuario)";
		Query q=em.createNativeQuery(consulta);

		Aforo aforoBD = searchComponentServiceImpl.searchAforoLiquidacion(dto);

		q.setParameter("mafvId", Optional.ofNullable(aforoBD.getMaestrosAforosVisitas().get(0)).map(MaestroAforoVisita::getMafvIderegistro).orElse(0L).intValue());
		q.setParameter("usuario", authenticationFacade.getCredentials().getUsuprgunid().intValue());
		java.math.BigDecimal r = (java.math.BigDecimal)q.getSingleResult();
		Long response= r.longValue();

		LiquidacionDTO l = new LiquidacionDTO();
		if(response.compareTo(-1L)==0) {
			l.setMensaje(String.format("El identificador de la visita para el aforo no existe %d", response));
		}else if(response.compareTo(-2L)==0) {
			l.setMensaje("La visita no se encuentra tramitada en su totalidad");
		}else if(response.compareTo(-3L)==0) {
			l.setMensaje("La visita se encuentra vencida");
		}else if(response.compareTo(0L)==0) {
			l.setMensaje("No se han podido ejecutar las tareas");
		}

		if(StringUtils.isEmpty(l.getMensaje()))
			return bDToDTOUtil.mapAforoToLiquidacionDTO(searchComponentServiceImpl.searchAforoLiquidacion(dto));
		else
			return l;
	}


	public LiquidacionDTO liquidar(LiquidacionDTO dto){
		String consulta="select aseo.fn_liquida_visita(:mafvId, CAST('L' as varchar(1)), :usuario)";
		Query q=em.createNativeQuery(consulta);

		Aforo aforoBD = searchComponentServiceImpl.searchAforoLiquidacion(dto);

		q.setParameter("mafvId", Optional.ofNullable(aforoBD.getMaestrosAforosVisitas().get(0)).map(MaestroAforoVisita::getMafvIderegistro).orElse(0L).intValue());
		q.setParameter("usuario", authenticationFacade.getCredentials().getUsuprgunid().intValue());
		java.math.BigDecimal r = (java.math.BigDecimal)q.getSingleResult();
		Long response= r.longValue();

		LiquidacionDTO l = new LiquidacionDTO();
		if(response.compareTo(-1L)==0) {
			l.setMensaje(String.format("El identificador de la visita para el aforo no existe %d", response));
		}else if(response.compareTo(-2L)==0) {
			l.setMensaje("La visita no se encuentra tramitada en su totalidad");
		}else if(response.compareTo(-3L)==0) {
			l.setMensaje("La visita se encuentra vencida");
		}else if(response.compareTo(0L)==0) {
			l.setMensaje("No se han podido ejecutar las tareas");
		}

		if(StringUtils.isEmpty(l.getMensaje()))
			return bDToDTOUtil.mapAforoToLiquidacionDTO(searchComponentServiceImpl.searchAforoLiquidacion(dto));
		else
			return l;
	}


}
