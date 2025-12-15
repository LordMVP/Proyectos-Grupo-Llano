package com.bioagricola.apirest.liquidacion.negocio;

import com.bioagricola.apirest.liquidacion.negocio.interfaces.IDhvtcDetallehomvartarconceptos;
import com.bioagricola.apirest.modelo.dtos.DhvtcDetallehomvartarconceptosDTO;
import com.bioagricola.apirest.modelo.entidades.DhvtcDetallehomvartarconceptos;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDhvtcDetallehomvartarconceptos;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;

@Service
public class NegocioDhvtcDetallehomvartarconceptos extends NegocioAbstracto<DhvtcDetallehomvartarconceptos, DhvtcDetallehomvartarconceptosDTO> {

    @Autowired
    private ManejadorDhvtcDetallehomvartarconceptos manejadorDhvtcDetallehomvartarconceptos;


    @Override
    protected boolean entidadContieneAtributo(String nombreAtributo) {
        return false;
    }

    @Override
    protected Logger getLogger() {
        return null;
    }

    @Override
    protected DhvtcDetallehomvartarconceptosDTO instanciarDAO() {
        return null;
    }


    public DhvtcDetallehomvartarconceptosDTO crear(@RequestBody DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO) {
        DhvtcDetallehomvartarconceptos dhvtcDetallehomvartarconceptos = new DhvtcDetallehomvartarconceptos();
        copiarPropiedades(dhvtcDetallehomvartarconceptos, dhvtcDetallehomvartarconceptosDTO);

        manejadorDhvtcDetallehomvartarconceptos.save(dhvtcDetallehomvartarconceptos);
        return dhvtcDetallehomvartarconceptosDTO;
    }


    public DhvtcDetallehomvartarconceptosDTO actualizar(@RequestBody DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO) {
        DhvtcDetallehomvartarconceptos dhvtcDetallehomvartarconceptos = manejadorDhvtcDetallehomvartarconceptos.getOne(dhvtcDetallehomvartarconceptosDTO.getDhvtcIderegistr());
        copiarPropiedades(dhvtcDetallehomvartarconceptos, dhvtcDetallehomvartarconceptosDTO);
        manejadorDhvtcDetallehomvartarconceptos.save(dhvtcDetallehomvartarconceptos);
        return dhvtcDetallehomvartarconceptosDTO;
    }


    public void eliminar(Long dhvtcIderegistr) {
        manejadorDhvtcDetallehomvartarconceptos.deleteById(dhvtcIderegistr);
    }



    public List<DhvtcDetallehomvartarconceptosDTO> listar() {
        List<DhvtcDetallehomvartarconceptosDTO> listaDhvtcDetallehomvartarconceptosDTO = new ArrayList<>();

        List<DhvtcDetallehomvartarconceptos> listaDhvtcDetallehomvartarconceptos = manejadorDhvtcDetallehomvartarconceptos.findAll();
        for (DhvtcDetallehomvartarconceptos dhvtcDetallehomvartarconceptos : listaDhvtcDetallehomvartarconceptos) {
            DhvtcDetallehomvartarconceptosDTO dhvtcDetallehomvartarconceptosDTO = new DhvtcDetallehomvartarconceptosDTO();
            copiarPropiedades(dhvtcDetallehomvartarconceptosDTO, dhvtcDetallehomvartarconceptos);
            listaDhvtcDetallehomvartarconceptosDTO.add(dhvtcDetallehomvartarconceptosDTO);
        }
        return listaDhvtcDetallehomvartarconceptosDTO;
    }
}