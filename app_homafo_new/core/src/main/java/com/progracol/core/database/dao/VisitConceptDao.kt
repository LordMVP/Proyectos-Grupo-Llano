package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.progracol.core.database.entities.VisitConcept

@Dao
interface VisitConceptDao {

    @Query("SELECT * FROM visit_concept WHERE visit_id = :id")
    suspend fun getVisitConceptByVisitId(id: Long): List<VisitConcept>

    @Insert
    suspend fun insertAll(visitConcepts: List<VisitConcept>)

    @Query("DELETE FROM visit_concept")
    suspend fun deleteAllVisitConcept()

}