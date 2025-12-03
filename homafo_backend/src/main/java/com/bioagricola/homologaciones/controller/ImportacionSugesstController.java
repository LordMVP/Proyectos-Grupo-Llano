package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.dto.DefaultJsonValorDTO;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.common.service.DiccColumnasServiceImpl;
import com.bioagricola.common.service.DictTablasServiceImpl;
import com.bioagricola.common.util.SQLBuilderUtil;
import com.bioagricola.homologaciones.dto.ImportacionSuggestRequest;
import com.bioagricola.homologaciones.entity.DiminsDimportarInsertsEntity;
import com.bioagricola.homologaciones.service.impl.DiminsDimportarInsertsService;
import com.google.gson.Gson;

@RestController
@RequestMapping(path = "api/importacion/suggest")
public class ImportacionSugesstController {

	@Autowired
	private DiminsDimportarInsertsService diminsService;
	@Autowired
	private Gson gson;
	@Autowired
	private GenericSQLRepository genericSQLRepository;
	@Autowired
	private SQLBuilderUtil sqlBuilderUtil;
	@Autowired 
	private AuthenticationFacade authFacade;
	@Autowired
	private DictTablasServiceImpl dictTabla;
	@Autowired
	private DiccColumnasServiceImpl diccService;
	
	@RequestMapping(path="/",method = RequestMethod.POST)
	public ResponseEntity<Optional<List<HashMap<String, String>>>> getSuggest(@RequestBody ImportacionSuggestRequest request ){
		DiminsDimportarInsertsEntity dimins = this.diminsService.findById(request.getDiminsId());
		if(dimins.getDiminsJsonSugerido()!=null) {
			DefaultJsonValorDTO jsonValor = gson.fromJson(dimins.getDiminsJsonSugerido(), DefaultJsonValorDTO.class);
			String sql = jsonValor.getValor();			
			HashMap<String,String> parameters = new HashMap<String, String>();
			parameters.put("SEARCH_VALUE",request.getSearchValue());
			parameters.put("EMPRESA_SESION",authFacade.getIdEmpresaLong().toString());
			parameters.put("USUARIO_SESION",authFacade.getIdUsuarioLong().toString());
			sql = sqlBuilderUtil.setParametersSQL(sql, parameters);
			System.out.println(sql);
			Optional<List<HashMap<String, String>>> result = genericSQLRepository.executeSelectWithColumnsNamesWithAs(sql, request.getLimit());			
			return ResponseEntity.ok(result);			
		}
		return ResponseEntity.of(Optional.empty());		
	}
	
	@RequestMapping(path = "/diccionario/{tabla}",method = RequestMethod.POST)
	ResponseEntity<String> getTableDicc(@PathVariable(name = "tabla") String tabla){
		return ResponseEntity.ok(dictTabla.findEtiquetaTabla(tabla).map(t->t.getDictEtiqueta()).orElse(null));
	}
	@RequestMapping(path = "/diccionario/{tabla}/{columna}",method = RequestMethod.POST)
	ResponseEntity<String> getColumnaDicc(@PathVariable(name = "tabla") String tabla,@PathVariable(name = "columna")String columna){
		return ResponseEntity.ok(diccService.findByTabla(tabla, columna).map(c->c.getDiccEtiqueta()).orElse(null));
	}
}
