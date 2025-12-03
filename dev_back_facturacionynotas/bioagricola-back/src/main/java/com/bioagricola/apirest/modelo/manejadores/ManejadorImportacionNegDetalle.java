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

    @Query(value = "select ind from ImportacionNegDetalle ind where ind.fechaImportacion = :fechaImportacion and ind.estadoCargue = :state and ind.idSuscripcion is not null")
    List<ImportacionNegDetalle> findAllByFechaAplicacionNota(@Param("fechaImportacion") Date fechaImportacion, @Param("state") String state);

    @Query(value = "select ind from ImportacionNegDetalle ind where ind.idSuscripcion = :idSus")
    Optional<ImportacionNegDetalle> findByIdSuscripcion(@Param("idSus") String idSus);

    @Query(value = "select ing from ImportacionNegDetalle ing where ing.fechaAplicacionNota is not null and ing.fechaAplicacionNota between :startDate and :endDate")
    List<ImportacionNegDetalle> findAllByConceptAndEstadoCargue(@Param("startDate")Date startDate, @Param("endDate") Date endDate);
}
