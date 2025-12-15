package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.HhvcoHistorvarconceptosDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface IHhvcoHistorvarconceptos {

    public HhvcoHistorvarconceptosDTO crear(HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO) throws InvalidParameterException;

    public HhvcoHistorvarconceptosDTO actualizar(HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO) throws InvalidParameterException;

    public String eliminar(Integer hhvcoIderegistr);

    public HhvcoHistorvarconceptosDTO consultarPorId(Integer hhvcoIderegistr);

    public List<HhvcoHistorvarconceptosDTO> consultar(Long filterBy, String orderBy, Integer from, Integer to);

    public List<HhvcoHistorvarconceptosDTO> listar();
    public Boolean actualizarConceptosValorRango(Map<String, Object> parametros);

    public Integer sincronizarConceptosValorRango(Map<String, Object> parametros);
    List<HhvcoHistorvarconceptosDTO> listarRecientes(Integer anio, Integer mes);
}
