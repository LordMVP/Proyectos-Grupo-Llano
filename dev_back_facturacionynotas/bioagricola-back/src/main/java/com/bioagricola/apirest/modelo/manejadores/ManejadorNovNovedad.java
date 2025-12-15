/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.NovNovedad;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author jlmendoza
 */
@Service
public interface ManejadorNovNovedad extends ManejadorCrud<NovNovedad, Integer>, IManejadorCrud<NovNovedad, Integer>{
    
    @Query(value = "SELECT n FROM NovNovedad n where n.dsusIderegistr = :dsus and n.perIderegistro= :per")
    public Optional<NovNovedad> findByDsusIderegistrAndPerIderegistro(Long dsus, Integer per);
    
}
