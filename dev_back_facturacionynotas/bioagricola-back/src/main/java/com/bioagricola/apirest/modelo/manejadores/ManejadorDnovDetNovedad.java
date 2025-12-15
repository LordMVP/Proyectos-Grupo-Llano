/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.DnovDetNovedad;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Service;

/**
 *
 * @author jlmendoza
 */
@Service
public interface ManejadorDnovDetNovedad extends ManejadorCrud<DnovDetNovedad, Integer>, IManejadorCrud<DnovDetNovedad, Integer>{
    
}
