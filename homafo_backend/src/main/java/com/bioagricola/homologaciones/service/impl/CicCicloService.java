package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.common.entity.CicCiclo;
import com.bioagricola.homologaciones.repository.CicCicloRepository;

@Service
public class CicCicloService extends AbstractService<CicCiclo, Long>
{
	public CicCicloService() {
		super(CicCiclo.class);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private CicCicloRepository repository;
	
	public List<HashMap<String, Object>> listaCiclos(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaCiclos(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cic_ideregistro", tmp2[0]);
    		tmp1.put("cic_nombre", tmp2[1]);
    		tmp1.put("cic_diainicia",tmp2[2]);
    		tmp1.put("cic_diafinaliza",tmp2[3]);
    		tmp1.put("cic_estado",tmp2[4]);
    		tmp1.put("cic_periodos",tmp2[5]);
    		tmp1.put("cic_anoactual",tmp2[6]);
    		tmp1.put("usu_ideregistro",tmp2[7]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaCiclos2(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaCiclos2(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cic_ideregistro", tmp2[0]);
    		tmp1.put("cic_nombre", tmp2[1]);
    		tmp1.put("cic_diainicia",tmp2[2]);
    		tmp1.put("cic_diafinaliza",tmp2[3]);
    		tmp1.put("cic_estado",tmp2[4]);
    		tmp1.put("cic_periodos",tmp2[5]);
    		tmp1.put("cic_anoactual",tmp2[6]);
    		tmp1.put("usu_ideregistro",tmp2[7]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<StaticContentResponseDTO<String>> getCiclosActivosAforos(){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<CicCiclo> ciclos = repository.obtenerCiclosActivosAforos();
		
		ciclos.stream().forEach(i->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(i.getCicNombre());
											 item.setId(i.getCicIderegistro());
			response.add(item);
		});
		return response;
	}

	@Override
	protected JpaRepository<CicCiclo, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
