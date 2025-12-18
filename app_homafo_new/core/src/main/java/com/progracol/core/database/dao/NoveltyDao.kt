package com.progracol.core.database.dao

import androidx.room.*
import androidx.sqlite.db.SimpleSQLiteQuery
import androidx.sqlite.db.SupportSQLiteQuery
import com.progracol.core.database.entities.Novelty

@Dao
interface NoveltyDao {

    @Query("SELECT * FROM novelty WHERE subscription_id = :id")
    suspend fun getAllNoveltiesBySubscriptionId(id: String): List<Novelty>

    @Query("SELECT * FROM novelty WHERE status = 'PENDING'")
    suspend fun getPendingNovelties(): List<Novelty>

    @Insert
    suspend fun insert(novelty: Novelty): Long

    @Query("SELECT * FROM novelty WHERE id = :id")
    suspend fun getNoveltyById(id: Long): Novelty?

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(novelty: Novelty): Int

    @Query("UPDATE novelty SET status = 'UPLOADED' WHERE id = :id")
    suspend fun updateUploadedNovelty(id: Long)

    @Query("DELETE FROM novelty WHERE id = :id")
    fun delete(id: Long)

    suspend fun deleteAll() {
        deleteAll(SimpleSQLiteQuery("DELETE FROM novelty"))
    }

    @RawQuery
    fun deleteAll(query: SupportSQLiteQuery): Int

    @Transaction
    suspend fun deleteNovelty(id: Long) {
        val subscription = getNoveltyById(id)
        subscription?.let {
            delete(id)
        }
    }

    @Transaction
    open suspend fun insertOrUpdate(novelty: Novelty): Long {
        val foundNovelty = getNoveltyById(novelty.id ?: 0)
        foundNovelty?.let {
            update(novelty)
            return novelty.id!!
        } ?: run {
            return insert(novelty)
        }
    }

}