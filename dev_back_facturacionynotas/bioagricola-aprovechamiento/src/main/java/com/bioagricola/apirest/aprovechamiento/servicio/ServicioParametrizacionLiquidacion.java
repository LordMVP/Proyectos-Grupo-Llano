package com.bioagricola.apirest.aprovechamiento.servicio;
import com.bioagricola.apirest.aprovechamiento.negocio.NegocioParametrizacionLiquidacion;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IParametrizacionLiquidacion;
import com.bioagricola.apirest.modelo.dtos.ColiConliquidaAproDTO;
import com.bioagricola.apirest.modelo.dtos.ConConceptoDTO;
import com.bioagricola.apirest.modelo.dtos.LiquidacionesConceptoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/webresources/servicios/parparametrizacion")
public class ServicioParametrizacionLiquidacion implements IParametrizacionLiquidacion {
	
	@Autowired
	private NegocioParametrizacionLiquidacion negocioParametrizacionLiquidacion;

    private static final Logger logger = Logger.getLogger(ServicioParametrizacionLiquidacion.class.getName());

    /**
     * Metodo para retornar conceptos de parametrizacion para liquidar pago a aprovechadores
	  * @return List<LiquidacionesConceptoDTO>
     */
    @GetMapping("/conceptosParametrizacion")
    public List<LiquidacionesConceptoDTO> consultaParametrosLiquidacione()
			throws IOException, InvalidParameterException {
 
        return negocioParametrizacionLiquidacion.consultaParametrosLiquidaciones();
    }
    
    /**
     * Metodo para retornar los municipios asociados a un tercero aprovechador
     * @return List<Object>
     * @throws IOException
     * @throws InvalidParameterException
     */
    @GetMapping("/municipioTerceroAprovechador")
	public List<Object> consultaMunicipiosTA(@RequestParam("terIderegistro")Long terIderegistro)
			throws IOException, InvalidParameterException {
 
		return negocioParametrizacionLiquidacion.consultaParametrosTercero(terIderegistro);
    }
    
    /**
     * Metodo para insertar un registro de concepto para parametrizar liquidacion de pago a aprovechadores
     * @param cuapCuentaAprovechamientoDTO
     * @return Boolean
     */
    @PostMapping(consumes = "application/json", produces = "application/json")
    public Boolean insertarConceptosParam(@RequestBody ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO) {

        return negocioParametrizacionLiquidacion.insertarConceptosParam(coliConliquidaAprovechamientoDTO);
     }
    
    /**
     * Metodo para consultar parametrizacion de aprovechamiento e incentivo de aprovechamiento
     * @return List<ConConceptoDTO>
     */
    @GetMapping("/conceptosAprovechamiento")
	public List<ConConceptoDTO> consultarConceptosAprov(@RequestParam ("uniLiquidacion")Integer uniLiquidacion) throws IOException {
		return negocioParametrizacionLiquidacion.consultarConceptosAprov(uniLiquidacion);
    }
    
    /**
     * Metodo para consultar conceptos parametrizados
     * @return
     */
    @GetMapping("/listaConceptosParam")
	public Page<ColiConliquidaAproDTO> listarConceptosParametrizados(@RequestParam(value = "search")String search,
			@RequestParam(value = "apro")String apro, Pageable page) {
		return negocioParametrizacionLiquidacion.listarConceptosParametrizados(search, apro, page);
    }
    
	/**
	 * Metodo para consultar permisos de usuario
	 * @param idPrograma
	 * @return boolean
	 * @throws IOException
	 */
    @GetMapping("/privilegios")
    public boolean consultarPrivilegios (@RequestParam("idPrograma") Integer idPrograma) throws IOException {
		return negocioParametrizacionLiquidacion.consultaPrivilegios(idPrograma);
	}
    

}
