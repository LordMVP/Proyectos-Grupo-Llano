package com.progracol.core.network

import android.util.Log
import com.progracol.core.network.response.MapArcGISModel
import com.progracol.core.network.response.LayerMapModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

class ArcGISService @Inject constructor(
    private val apiClient: APIClient
) {
    suspend fun getListMaps() : List<MapArcGISModel>{
        return withContext(Dispatchers.IO){
            val response = apiClient.getListMaps()
            Log.e("error", response.body().toString())
            response.body() ?: emptyList()
        }
    }

    suspend fun getListLayersMap() : List<LayerMapModel>{
        return withContext(Dispatchers.IO){
            val response = apiClient.getListLayersMap()
            Log.e("error", response.body().toString())
            response.body() ?: emptyList()
        }
    }
}