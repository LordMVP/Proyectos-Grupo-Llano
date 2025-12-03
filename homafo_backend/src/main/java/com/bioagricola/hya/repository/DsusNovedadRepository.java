package com.bioagricola.hya.repository;

import com.bioagricola.hya.entity.TmpDsusNovedad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Clase repositorio de la entidad DsnovDsusNovedad
 * @author cperez@progracol.com
 */
@Repository
public interface DsusNovedadRepository extends JpaRepository<TmpDsusNovedad,Long> {

    Page<TmpDsusNovedad> findAllByDsnovEstado(Character dsnovEstado, Pageable pageable);
    Page<TmpDsusNovedad> findAllByDsnovEstadoAndDsusIderegistro(Character dsnovEstado,Long dsusId, Pageable pageable);

    List<TmpDsusNovedad> findAllByDsusIderegistroAndDsnovEstado(Long dsusIderegistro,Character dsnovEstado);
}
