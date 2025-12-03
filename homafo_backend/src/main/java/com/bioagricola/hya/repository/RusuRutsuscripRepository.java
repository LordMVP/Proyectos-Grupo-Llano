package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.RusuRutsuscrip;
import com.bioagricola.common.entity.RutRuta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Map;

@Repository
public interface RusuRutsuscripRepository extends JpaRepository<RusuRutsuscrip, Long> {

    @Modifying
    @Transactional
    @Query(value = "update RusuRutsuscrip r set r.rutIderegistro=:ruta where r.dsusDetsuscrip.dsusIderegistr=:dsusId")
    void updateRusuByDsus(RutRuta ruta, Long dsusId);

    @Query(value = "select r.rutIderegistro.rutIderegistro as idruta,r.rutIderegistro.rutNombre as rutanombre from RusuRutsuscrip r where r.dsusDetsuscrip.dsusIderegistr=:dsusId")
    Map<String, Object> consultaRutaByDsus(Long dsusId);

    @Query(value = "select r.rutIderegistro.rutIderegistro as idruta,r.rutIderegistro.rutNombre as rutanombre from RusuRutsuscrip r where r.dsusDetsuscrip.dsusIderegistr=:dsusId")
    RusuRutsuscrip getRusuRutsuscripByRusuIderegistr(Long dsusId);

}
