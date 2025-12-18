package com.progracol.core.database.dao

import androidx.room.*
import com.progracol.core.database.entities.Independence
@Dao
interface IndependenceDao {

    @Insert
    suspend fun insert(independence: Independence): Long

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(independence: Independence): Int

    @Query("DELETE FROM independence")
    suspend fun deleteAllParameters()

    @Query("SELECT * FROM independence WHERE status = 'PENDING'")
    suspend fun getPendingIndependences(): List<Independence>

    @Query("SELECT * FROM independence WHERE subscription_code = :code")
    suspend fun getBySubscriptionCode(code: String): Independence?

    @Query("SELECT * FROM independence WHERE id = :id")
    suspend fun getByIndependenceId(id: Long): Independence?

    @Query("UPDATE independence SET status = 'UPLOADED' WHERE id = :id")
    suspend fun updateUploadedIndependence(id: Long)

    @Query("DELETE FROM independence WHERE id = :id")
    fun delete(id: Long)

    @Transaction
    suspend fun deleteIndependence(id: Long) {
        val subscription = getByIndependenceId(id)
        subscription?.let {
            delete(id)
        }
    }

    @Transaction
    open suspend fun insertOrUpdate(independence: Independence): Long {
        getBySubscriptionCode(independence.subscriptionCode ?: "")?.let {
            update(independence)
            return independence.id ?: 0
        } ?: run {
            return insert(independence!!)
        }
    }
}