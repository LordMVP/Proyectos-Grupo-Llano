package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ImportacionNegDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ManejadorImportacionNegDetalle extends JpaRepository<ImportacionNegDetalle, Long>, JpaSpecificationExecutor<ImportacionNegDetalle> {
    @Query(value = "select ind from ImportacionNegDetalle ind where ind.idParent = :id and ind.estadoCargue != :state ")
    List<ImportacionNegDetalle> findAllByIdParent(@Param("id") Long id, @Param("state") String state);

    @Query(value = "select ind from ImportacionNegDetalle ind where ind.idParent = :id")
    List<ImportacionNegDetalle> findAllByIdParent(@Param("id") Long id);

    @Query(value = "select count(int) from ImportacionNegDetalle int where int.codigoEmsa = :client and int.fechaRegistroEmsa = :recordingDate and int.valorCargado = :paid")
    Long countByClientAndRecordingDateAnPaid(@Param("client") String client, @Param("recordingDate") Date recordingDate, @Param("paid") Double paid);

    @Query(value = "select ind from ImportacionNegDetalle ind where ind.fechaImportacion =:fechaImportacion and ind.estadoCargue = :state and ind.idSuscripcion is not null")
    List<ImportacionNegDetalle> findAllByFechaAplicacionNota(@Param("fechaImportacion") Date fechaImportacion,@Param("state") String state);//@Param("fechaImportacion") Date fechaImportacion,

    @Query(value = "select ind from ImportacionNegDetalle ind where ind.idSuscripcion = :idSus")
    Optional<ImportacionNegDetalle> findByIdSuscripcion(@Param("idSus") String idSus);

    @Query(value = "select ing from ImportacionNegDetalle ing where ing.fechaImportacion is not null and ing.fechaArchivoRecaudo between :startDate and :endDate")
    /*@Query(value="select iind.* from aseo.impneg_importacion_negativos_emsa iine inner join aseo.impnegdet_importacion_negativos_detalle iind on "
            + " iind.impnegdet_fecha_importacion is not null and iind.impneg_idregistro = iine.impneg_idregistro where iine.impneg_fecha_archivo between :startDate and :endDate "
            + " and iine.impneg_estado ='APLICADO'",nativeQuery = true)*/
    List<ImportacionNegDetalle> findAllByConceptAndEstadoCargue(@Param("startDate")Date startDate, @Param("endDate") Date endDate);
}
