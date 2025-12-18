package com.progracol.core.repository

import androidx.lifecycle.liveData
import com.progracol.core.domain.model.MapsItem
import com.progracol.core.domain.model.LayersItem
import com.progracol.core.domain.model.toDomain
import com.progracol.core.network.APIClient
import com.progracol.core.network.ArcGISService
import com.progracol.core.network.TokenManager
import javax.inject.Inject
import kotlin.collections.HashMap

class ArcGISRepository @Inject constructor(
    private val api : ArcGISService,
    private val apiService: APIClient,
    private val tokenManager: TokenManager
) {
    suspend fun getAllMaps(): List<MapsItem> {
        val response = api.getListMaps()
        return response.map { it.toDomain() }
    }

    suspend fun getAllLayersMap(): List<LayersItem> {
        val response = api.getListLayersMap()
        return response.map { it.toDomain() }
    }

    suspend fun getToken(): String {
        val token = tokenManager.getArcGisToken()
        if (token.isEmpty()) {
            val tokenResp = apiService.getArcgisToken()
            tokenManager.saveArcGisToken(tokenResp.token)
            return tokenResp.token
        }
        return token
    }

}