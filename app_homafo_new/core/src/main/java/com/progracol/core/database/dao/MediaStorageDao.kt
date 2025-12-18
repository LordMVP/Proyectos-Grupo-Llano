package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Transaction
import com.progracol.core.database.entities.MediaStorage

@Dao
interface MediaStorageDao{

    @Insert
    suspend fun insert(entity: MediaStorage): Long

    @Insert
    suspend fun insertAll(parameters: List<MediaStorage>)

    @Query("SELECT * FROM media_storage WHERE subscription_id = :subscriptionId AND novelty_id = :noveltyId AND visit_id = :visitId AND point_id = :pointId AND media_storage_type = :mediaStorageType ")
    suspend fun getData(subscriptionId: String = "", noveltyId: Long = 0, visitId: Long = 0, pointId: Long = 0, mediaStorageType: Int): MutableList<MediaStorage>

    @Transaction
    suspend fun updateData(parameters: List<MediaStorage>) {
        deleteAllParameters()
        insertAll(parameters)
    }

    @Query("DELETE FROM media_storage WHERE id= :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM media_storage WHERE subscription_id = :subscriptionId AND novelty_id = :noveltyId AND visit_id = :visitId AND point_id = :pointId AND media_storage_type = :mediaStorageType ")
    suspend fun deleteByParameters(subscriptionId: String = "", noveltyId: Long = 0, visitId: Long = 0, pointId: Long = 0, mediaStorageType: Int)

    @Query("DELETE FROM media_storage")
    suspend fun deleteAllParameters()

    @Query("DELETE FROM media_storage")
    suspend fun deleteAllMediaStorage()

    @Query("UPDATE media_storage SET novelty_id = :noveltyId WHERE novelty_id = :oldNoveltyId")
    suspend fun updateNoveltyId(noveltyId: Long, oldNoveltyId: Long)

    @Query("UPDATE media_storage SET point_id = :pointId WHERE point_id = :oldPointId")
    suspend fun updatePointId(pointId: Long, oldPointId: Long)

}