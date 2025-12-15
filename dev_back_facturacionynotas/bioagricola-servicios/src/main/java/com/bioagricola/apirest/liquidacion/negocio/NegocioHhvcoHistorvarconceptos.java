package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.modelo.dtos.HhvcoHistorvarconceptosDTO;
import com.bioagricola.apirest.modelo.entidades.HhvcoHistorvarconceptos;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHhvcoHistorvarconceptos;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class NegocioHhvcoHistorvarconceptos extends NegocioAbstracto<HhvcoHistorvarconceptos, HhvcoHistorvarconceptosDTO> {
    @Autowired
    private ManejadorHhvcoHistorvarconceptos manejadorHhvcoHistorvarconceptos;


    public HhvcoHistorvarconceptosDTO crear(HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO) {
        HhvcoHistorvarconceptos hhvcoHistorvarconceptos = new HhvcoHistorvarconceptos();
        if (hhvcoHistorvarconceptos.getHhvcoFecharegistro() == null) {
            hhvcoHistorvarconceptos.setHhvcoFecharegistro(new Timestamp(System.currentTimeMillis()));
        }
        if (hhvcoHistorvarconceptos.getHhvcoFechataras() == null) {
            hhvcoHistorvarconceptos.setHhvcoFechataras(new Timestamp(System.currentTimeMillis()));
        }
        if (hhvcoHistorvarconceptos.getHhvcoIderegistr() != null) {
            if (manejadorHhvcoHistorvarconceptos.existsById(hhvcoHistorvarconceptos.getHhvcoIderegistr())) {
                return null;
            }
        }

        hhvcoHistorvarconceptos.setHhvcoIderegistr(manejadorHhvcoHistorvarconceptos.getNextId());
        copiarPropiedades(hhvcoHistorvarconceptos, hhvcoHistorvarconceptosDTO);


        hhvcoHistorvarconceptos = manejadorHhvcoHistorvarconceptos.save(hhvcoHistorvarconceptos);
        hhvcoHistorvarconceptosDTO = new HhvcoHistorvarconceptosDTO();
        copiarPropiedades(hhvcoHistorvarconceptosDTO, hhvcoHistorvarconceptos);
        return hhvcoHistorvarconceptosDTO;
    }


    public HhvcoHistorvarconceptosDTO actualizar(HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO) {
        HhvcoHistorvarconceptos hhvcoHistorvarconceptos = manejadorHhvcoHistorvarconceptos.getOne(hhvcoHistorvarconceptosDTO.getHhvcoIderegistr());
        copiarPropiedades(hhvcoHistorvarconceptos, hhvcoHistorvarconceptosDTO);
        manejadorHhvcoHistorvarconceptos.save(hhvcoHistorvarconceptos);
        return hhvcoHistorvarconceptosDTO;
    }

    public void eliminar(Integer hhvcoIderegistr) {
        manejadorHhvcoHistorvarconceptos.deleteById(hhvcoIderegistr);
    }


    public List<HhvcoHistorvarconceptosDTO> listar() {
        List<HhvcoHistorvarconceptosDTO> listaHhvcoHistorvarconceptosDTO = new ArrayList<>();
        List<HhvcoHistorvarconceptos> listaHhvcoHistorvarconceptos = manejadorHhvcoHistorvarconceptos.findAll();
        for (HhvcoHistorvarconceptos hhvcoHistorvarconceptos : listaHhvcoHistorvarconceptos) {
            HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO = new HhvcoHistorvarconceptosDTO();
            copiarPropiedades(hhvcoHistorvarconceptosDTO, hhvcoHistorvarconceptos);
            listaHhvcoHistorvarconceptosDTO.add(hhvcoHistorvarconceptosDTO);
        }
        return listaHhvcoHistorvarconceptosDTO;
    }

    public HhvcoHistorvarconceptosDTO consultarPorId(Integer hhvcoIderegistr) {
        HhvcoHistorvarconceptos hhvcoHistorvarconceptos = manejadorHhvcoHistorvarconceptos.getOne(hhvcoIderegistr);
        HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO = new HhvcoHistorvarconceptosDTO();
        copiarPropiedades(hhvcoHistorvarconceptosDTO, hhvcoHistorvarconceptos);
        return hhvcoHistorvarconceptosDTO;
    }
    public Boolean actualizarConceptosValorRango(Integer empIderegistro, Integer usuario, Integer mesActualizado, Integer añoActualizado) {
       return  manejadorHhvcoHistorvarconceptos.actualizarConceptosValorRango(empIderegistro,  usuario, mesActualizado, añoActualizado);
    }

    public Integer sincronizarConceptosValorRango(Integer mesActualizado, Integer añoActualizado) {
       return  manejadorHhvcoHistorvarconceptos.sincronizarConceptosValorRango(mesActualizado, añoActualizado);
    }
    public void cancelarConceptosValorRango(Integer mesActualizado, Integer añoActualizado) {
         manejadorHhvcoHistorvarconceptos.cancelarConceptosValorRango(mesActualizado, añoActualizado);
    }
    //aprobados
    public List<Object> aprobados(Integer mesActualizado, Integer añoActualizado) {
        return manejadorHhvcoHistorvarconceptos.aprobados(mesActualizado, añoActualizado);
    }


    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return false;
    }

    @Override
    protected Logger getLogger() {
        return null;
    }

    @Override
    protected HhvcoHistorvarconceptosDTO instanciarDAO() {
        return null;
    }

    public List<Object> listarRecientes(int anio, int mes) {
        return manejadorHhvcoHistorvarconceptos.listarRecientes(anio, mes);
    }

    public Boolean existePeriodo(Integer mes, Integer año) {
        return manejadorHhvcoHistorvarconceptos.existePeriodo(mes, año);
    }
}

