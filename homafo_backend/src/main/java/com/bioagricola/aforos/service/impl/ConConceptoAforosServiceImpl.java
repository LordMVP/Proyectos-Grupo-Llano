package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.repository.ConConceptoAforosRepository;
import com.bioagricola.common.service.ParParametroService;

@Service
public class ConConceptoAforosServiceImpl{

	@Autowired
	private ConConceptoAforosRepository conConceptoRepository;
	@Autowired
	private AuthenticationFacade authenticationFacade;
	@Autowired
    private ParParametroService _parParametroService;

	public List<ConConcepto> getConceptosRecipientes() {
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		return conConceptoRepository.findConConceptosAforo(hya_parametros.getLong("est_conceptos_liq_aseo"),hya_parametros.getLong("uni_liquidacion"));
	}

	public List<StaticContentResponseDTO<String>> getConceptosByEmpresa(){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<ConConcepto> conceptos = conConceptoRepository.findConceptosByEmpresa(authenticationFacade.getCredentials().getEstempresa());

		conceptos.stream().forEach(c->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(c.getConNombre());
											 item.setId(c.getUniConcepto());
			response.add(item);
		});
		return response.stream().distinct().collect(Collectors.toList());
	}
}
