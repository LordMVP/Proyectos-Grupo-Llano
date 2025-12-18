package com.progracol.core.di


import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.portal.Portal
import com.esri.arcgisruntime.portal.PortalItem
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import javax.inject.Singleton

/*@Module
@InstallIn(SingletonComponent::class)
class MapModule {

    @Singleton
    @Provides
    fun provideMap(): ArcGISMap {
        ArcGISRuntimeEnvironment.setApiKey("AAPK1380595589e7414ca0ff8d8b2d4822b98YcI6acp87nE-yk_F2uWK02_zuHsX_4IAEGHfbVrDIfc6LYjIMcJC9qHk6p3ATtp")
        val portal = Portal("https://www.arcgis.com")
        val portalItem = PortalItem(portal, "953ba78eee1949d1abff1bdc27e17f26")
        return ArcGISMap(portalItem)
    }

}*/