package com.progracol.core.repository

import com.progracol.core.database.dao.MarkerPointMapDao
import com.progracol.core.database.entities.MarkerPointMap
import javax.inject.Inject


class MarkerPointMapRepository @Inject constructor(
    private val markerPointMapDao: MarkerPointMapDao,
) {

    suspend fun getMarkersPointMap() = markerPointMapDao.getMarkersPointMap()

    suspend fun saveMarkerPointMap(markerPoint: MarkerPointMap): Long {
        return markerPointMapDao.insert(markerPoint)
    }

    suspend fun saveAllMarkersPointMap(markersPoint: List<MarkerPointMap>) = markerPointMapDao.insertAll(markersPoint)

    suspend fun delete(id: Long) = markerPointMapDao.deleteMarkerPointMap(id)

    suspend fun deleteAll() = markerPointMapDao.deleteAll()

}