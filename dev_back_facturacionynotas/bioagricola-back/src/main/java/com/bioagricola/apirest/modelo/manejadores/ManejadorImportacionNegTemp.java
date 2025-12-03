package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ImportacionNegTemp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ManejadorImportacionNegTemp extends JpaRepository<ImportacionNegTemp, Long>, JpaSpecificationExecutor<ImportacionNegTemp> {
    @Query(value = "select int from ImportacionNegTemp int where int.idParent = :id")
    List<ImportacionNegTemp> findAllByIdParent(@Param("id") Long id);

    @Query(value = "select count(int) from ImportacionNegTemp int where int.client = :client and int.recordingDate = :recordingDate and int.paid = :paid")
    Long countByClientAndRecordingDateAnPaid(@Param("client") String client, @Param("recordingDate") Date recordingDate, @Param("paid") Double paid);
}
