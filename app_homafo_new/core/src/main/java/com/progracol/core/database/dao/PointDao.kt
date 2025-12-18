package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import com.progracol.core.database.entities.Point

@Dao
interface PointDao {

    @Insert
    suspend fun insert(point: Point): Long

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(point: Point): Int

    @Query("DELETE FROM point")
    suspend fun deleteAllParameters()

    @Query("SELECT * FROM point WHERE status = 'PENDING'")
    suspend fun getPendingPoints(): List<Point>

    @Query("SELECT * FROM point WHERE id = :id")
    suspend fun getByPointId(id: Long): Point?

    @Query("UPDATE point SET status = 'UPLOADED' WHERE id = :id")
    suspend fun updateUploadedPoint(id: Long)

    @Query("DELETE FROM point WHERE id = :id")
    fun delete(id: Long)

    @Transaction
    suspend fun deletePoint(id: Long) {
        val subscription = getByPointId(id)
        subscription?.let {
            delete(id)
        }
    }

    @Transaction
    open suspend fun insertOrUpdate(point: Point): Long {
        (point.id ?: null)?.let {
            getByPointId(it)?.let {
                update(point)
                return point.id ?: 0
            }
        } ?: run {
            return insert(point!!)
        }
    }
}