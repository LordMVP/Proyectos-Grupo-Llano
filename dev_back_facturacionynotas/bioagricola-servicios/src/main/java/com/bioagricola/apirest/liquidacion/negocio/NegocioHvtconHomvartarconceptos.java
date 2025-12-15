package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.HvtconHomvartarconceptosDTO;
import com.bioagricola.apirest.modelo.entidades.HvtconHomvartarconceptos;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHvtconHomvartarconceptos;
import com.gell.estandar.dto.AuditoriaDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NegocioHvtconHomvartarconceptos extends NegocioAbstracto<HvtconHomvartarconceptos, HvtconHomvartarconceptosDTO> {


    @Autowired
    private ManejadorHvtconHomvartarconceptos manejadorHvtconHomvartarconceptos;


    public HvtconHomvartarconceptosDTO crear(HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO) {
        HvtconHomvartarconceptos hvtconHomvartarconceptos = new HvtconHomvartarconceptos();
        hvtconHomvartarconceptos.setHvtconIderegistr(manejadorHvtconHomvartarconceptos.getNextId());
        copiarPropiedades(hvtconHomvartarconceptos, hvtconHomvartarconceptosDTO);
        //si ya existe el registro, no lo crea
        if (manejadorHvtconHomvartarconceptos.existsById(hvtconHomvartarconceptos.getHvtconIderegistr())) {
            return null;
        }

        manejadorHvtconHomvartarconceptos.save(hvtconHomvartarconceptos);
        return hvtconHomvartarconceptosDTO;
    }

    public HvtconHomvartarconceptosDTO actualizar(HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO) {
        HvtconHomvartarconceptos hvtconHomvartarconceptos = manejadorHvtconHomvartarconceptos.findById(hvtconHomvartarconceptosDTO.getHvtconIderegistr()).get();
        copiarPropiedades(hvtconHomvartarconceptos, hvtconHomvartarconceptosDTO);
        manejadorHvtconHomvartarconceptos.save(hvtconHomvartarconceptos);
        return hvtconHomvartarconceptosDTO;
    }

    public HvtconHomvartarconceptosDTO eliminar(Integer hvtconHomvartarconceptosDTO) {
        HvtconHomvartarconceptos hvtconHomvartarconceptos = manejadorHvtconHomvartarconceptos.findById(hvtconHomvartarconceptosDTO).get();
        manejadorHvtconHomvartarconceptos.delete(hvtconHomvartarconceptos);
        return null;
    }

    public HvtconHomvartarconceptosDTO consultar(Integer hvtconIderegistr) {
        HvtconHomvartarconceptos hvtconHomvartarconceptos = manejadorHvtconHomvartarconceptos.findById(hvtconIderegistr).get();
        HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO = new HvtconHomvartarconceptosDTO();
        copiarPropiedades(hvtconHomvartarconceptosDTO, hvtconHomvartarconceptos);
        return hvtconHomvartarconceptosDTO;
    }

    public List<HvtconHomvartarconceptosDTO> listar(){
        List<HvtconHomvartarconceptos> hvtconHomvartarconceptos = manejadorHvtconHomvartarconceptos.findAll();
        List<HvtconHomvartarconceptosDTO> listaHvtconHomvartarconceptosDTO = new ArrayList<>();
        for (HvtconHomvartarconceptos hvtconHomvartarconcepto : hvtconHomvartarconceptos) {
            HvtconHomvartarconceptosDTO hvtconHomvartarconceptosDTO = new HvtconHomvartarconceptosDTO();
            copiarPropiedades(hvtconHomvartarconceptosDTO, hvtconHomvartarconcepto);
            listaHvtconHomvartarconceptosDTO.add(hvtconHomvartarconceptosDTO);
        }
        return listaHvtconHomvartarconceptosDTO;
    }
    public List<Integer> consultarEncabezadoPorTipo(String hvtconTipo){
        return manejadorHvtconHomvartarconceptos.consultarEncabezadoPorTipo(hvtconTipo);
    }
    public List<Object[]> consultarAñoMesActualizar(){
        AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
        Integer id_empresa = auditoriaDTO.getIdEmpresa();
        return manejadorHvtconHomvartarconceptos.consultarAñoMesActualizar(id_empresa);
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
    protected HvtconHomvartarconceptosDTO instanciarDAO() {
        return null;
    }
}
