package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ImportacionNegEMSA;
import com.bioagricola.apirest.modelo.entidades.ImportacionNegTemp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ManejadorImportacionNeg extends JpaRepository<ImportacionNegEMSA, Long>, JpaSpecificationExecutor<ImportacionNegEMSA> {
    @Query(value = "select count(ing) from ImportacionNegEMSA ing where ing.filename = :filename and ing.state != :state")
    Long countByFilename(@Param("filename") String filename, @Param("state") String state);

    @Query(value = "select ing from ImportacionNegEMSA ing where ing.state = :state")
    List<ImportacionNegEMSA> getAllByState(@Param("state") String state);

    @Query(value = "select ind from ImportacionNegEMSA ind where ind.creationDate <= :date")
    List<ImportacionNegEMSA> findAllByCreationDate(@Param("date") Date date);
}
