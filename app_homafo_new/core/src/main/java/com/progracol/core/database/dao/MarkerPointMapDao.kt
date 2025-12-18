package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.RawQuery
import androidx.sqlite.db.SimpleSQLiteQuery
import androidx.sqlite.db.SupportSQLiteQuery
import com.progracol.core.database.entities.MarkerPointMap


@Dao
interface MarkerPointMapDao {

    @Query("SELECT * FROM marker_point_map")
    suspend fun getMarkersPointMap(): List<MarkerPointMap>

    @Insert
    suspend fun insertAll(markers: List<MarkerPointMap>)

    @Insert
    suspend fun insert(marker: MarkerPointMap): Long

    suspend fun deleteAll() {
        deleteAll(SimpleSQLiteQuery("DELETE FROM marker_point_map"))
    }

    @RawQuery
    suspend fun deleteAll(query: SupportSQLiteQuery): Int

    @Query("DELETE FROM marker_point_map WHERE id = :id")
    suspend fun deleteMarkerPointMap(id: Long)
}