package com.progracol.core.database.dao

import androidx.room.*
import androidx.sqlite.db.SimpleSQLiteQuery
import androidx.sqlite.db.SupportSQLiteQuery
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.ParamTypeUse
import com.progracol.core.database.entities.Visit

@Dao
interface VisitDao {

    @Query("SELECT * FROM visit")
    suspend fun getVisits(): List<Visit>

    @Query("SELECT * FROM visit WHERE id = :id")
    suspend fun getVisit(id: Long): Visit?

    @Query("SELECT * FROM visit WHERE status = 'PENDING' OR status = 'DRAFT'")
    suspend fun getPendingVisits(): List<Visit>

    @Query("SELECT * FROM visit WHERE status = 'COMPLETE' OR status = 'CANCELED' AND updated_time IS NULL")
    suspend fun getCompleteOrCancelVisits(): List<Visit>

    @Query("SELECT * FROM visit WHERE status = 'COMPLETE' AND updated_time IS NULL")
    suspend fun getCompleteVisits(): List<Visit>

    @Query("SELECT * FROM visit WHERE status = 'CANCELED' AND updated_time IS NULL")
    suspend fun getCanceledVisits(): List<Visit>

    @Query("SELECT * FROM visit WHERE status = 'UPLOADED' AND updated_time IS NOT NULL")
    suspend fun getUploadedVisits(): List<Visit>

    @Insert
    suspend fun insertAll(visits: List<Visit>)

    @Update
    suspend fun update(visit: Visit)

    @Query("UPDATE visit SET status = 'COMPLETE' WHERE id = :id")
    suspend fun updateVisitComplete(id: Long)

    @Query("UPDATE visit SET status = 'CANCELED', cancel_note = :note WHERE id = :id")
    suspend fun cancelVisit(id: Long, note: String)

    @Query("UPDATE visit SET updated_time = CURRENT_TIMESTAMP, status = :status WHERE id = :id")
    suspend fun updateUploadedVisit(id: Long, status: String)

    suspend fun deleteAll() {
        deleteAll(SimpleSQLiteQuery("DELETE FROM visit"))
    }

    @RawQuery
    fun deleteAll(query: SupportSQLiteQuery): Int


    @Query("SELECT * FROM visit WHERE establishment LIKE  '%' || :businessName || '%' AND case_number LIKE  '%' || :caseNumber || '%' AND user_code LIKE '%' || :userCode || '%' AND visit_type LIKE '%' || :visitType || '%'")
    suspend fun getVisitSearch(businessName: String, caseNumber: String, userCode: String, visitType: String) : List<Visit>

}