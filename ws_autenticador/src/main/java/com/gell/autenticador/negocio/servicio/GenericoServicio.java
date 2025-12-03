/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.servicio;

import com.gell.estandar.util.FuncionesDatoUtil;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.autenticador.negocio.util.AuditoriaUtil;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

/**
 *
 * @author god
 */
public class GenericoServicio extends FuncionesDatoUtil {

    protected static final int NO_REGISTROS = 0;

    @Autowired
    @Qualifier("prisma")
    protected DataSource dataSource;

    @Autowired
    @Qualifier("seven")
    protected DataSource dataSourceSeven;
    
    @Autowired
    @Qualifier("kactus")
    protected DataSource dataSourceKactus;

    @Autowired
    @Qualifier("risise")
    protected DataSource dataSourceRisise;

    @Autowired
    @Qualifier("targas")
    protected DataSource dataSourceTargas;

    public AuditoriaDTO auditoria() {
        return AuditoriaUtil.auditoria();
    }

}
