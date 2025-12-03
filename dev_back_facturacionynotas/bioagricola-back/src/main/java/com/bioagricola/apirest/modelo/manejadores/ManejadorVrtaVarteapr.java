package com.bioagricola.apirest.modelo.manejadores;


import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.bioagricola.apirest.modelo.entidades.VrtaVarterapr;

public interface ManejadorVrtaVarteapr extends CrudRepository<VrtaVarterapr, Integer> {

    @Query("select v from VrtaVarterapr v where v.perIderegistro = :idPeriodo and v.empIderegistro= :idEmpresa and v.conIderegistro = :idConcepto")
    List<VrtaVarterapr> getPorcentajeParticipacionTaras(@Param("idPeriodo") Integer idPeriodo,
                                                        @Param("idEmpresa") Integer idEmpresa,
                                                        @Param("idConcepto") Integer idConcepto);
}
