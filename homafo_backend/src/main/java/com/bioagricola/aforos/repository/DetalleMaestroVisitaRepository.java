package com.bioagricola.aforos.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.DetalleMaestroVisita;

import java.util.List;
import java.util.Map;

@Repository
@Transactional
public interface DetalleMaestroVisitaRepository  extends CrudRepository<DetalleMaestroVisita,Long>,JpaSpecificationExecutor<DetalleMaestroVisita>{

    @Query(value = "select count(*) visitasTotal,\n" +
            "       (select count(*)\n" +
            "        from aseo.dmaf_detallemaestrovisitas dmaf\n" +
            "        inner join aseo.mafv_maestroaforovisitas mafv on mafv.mafv_ideregistro = dmaf.mafv_ideregistro\n" +
            "        inner join aseo.afo_aforos afo on mafv.afo_ideregistro = afo.afo_ideregistro\n" +
            "        where afo.afo_ideregistro=:aforoId and dmaf.dmaf_estado='T') visitasRealizadas\n" +
            "from aseo.dmaf_detallemaestrovisitas dmaf\n" +
            "inner join aseo.mafv_maestroaforovisitas mafv on mafv.mafv_ideregistro = dmaf.mafv_ideregistro\n" +
            "inner join aseo.afo_aforos afo on mafv.afo_ideregistro = afo.afo_ideregistro\n" +
            "where afo.afo_ideregistro=:aforoId", nativeQuery = true)
    Map<String,Object> countVisitasByAforo(@Param("aforoId") Integer aforoId);

    @Query(value = "select dmaf from DetalleMaestroVisita dmaf " +
            "where dmaf.maestroAforoVista.mafvIderegistro=:mafvIderegistro " +
            "and dmaf.dmavConsecutivovisita>:dmavConsecutivovisita " +
            "order by  dmaf.dmavConsecutivovisita asc")
    List<DetalleMaestroVisita> findVisitasCancelar(Long mafvIderegistro, Long dmavConsecutivovisita);
    
    @Query(value = "select dmaf from DetalleMaestroVisita dmaf " +
            "where dmaf.maestroAforoVista.mafvIderegistro=:mafvIderegistro " +
            "order by  dmaf.dmavConsecutivovisita asc")
    List<DetalleMaestroVisita> getDetalleMaestroVisitasByIdMvfAndEstado(Long mafvIderegistro);
	
}

