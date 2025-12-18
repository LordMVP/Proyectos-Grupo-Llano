package com.progracol.core.repository

import com.progracol.core.database.dao.MediaStorageDao
import com.progracol.core.database.entities.MediaStorage
import javax.inject.Inject

class GalleryRepository  @Inject constructor(
    private val mediaStorageDao: MediaStorageDao
) {

    suspend fun insert(mediaStorageEntity: MediaStorage) = mediaStorageDao.insert(mediaStorageEntity)

    suspend fun getData(subscriptionId: String = "", noveltyId: Long = 0, visitId: Long = 0, pointId: Long = 0, mediaStorageType: Int) = mediaStorageDao.getData(subscriptionId, noveltyId, visitId, pointId,mediaStorageType)

    suspend fun updateNoveltiesId(noveltyId: Long, oldNoveltyId: Long) = mediaStorageDao.updateNoveltyId(noveltyId, oldNoveltyId)

    suspend fun updatePointId(pointId: Long, oldPointId: Long) = mediaStorageDao.updatePointId(pointId,oldPointId)

    suspend fun deleteById(id: Long) = mediaStorageDao.deleteById(id)

    suspend fun deleteByParameters(subscriptionId: String = "", noveltyId: Long = 0, visitId: Long = 0, pointId: Long = 0, mediaStorageType: Int) = mediaStorageDao.deleteByParameters(subscriptionId, noveltyId, visitId, pointId,mediaStorageType)

}