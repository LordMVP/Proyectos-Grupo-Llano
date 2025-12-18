package com.progracol.core.network

import com.progracol.core.data.AccessToken
import com.progracol.core.data.Company
import com.progracol.core.data.MenuOptions
import com.progracol.core.database.entities.Independence
import com.progracol.core.network.response.*
import com.progracol.core.database.entities.SubscriptionDetail
import okhttp3.MultipartBody
import retrofit2.Response
import retrofit2.http.*

interface APIClient {

   @GET("api/consultar-version-app")
   suspend fun getConsultarVersionApp(): String

   @POST("login")
   suspend fun login(
     @Body body: Any
   ) : AccessToken

   @POST("api/global/empresas")
   suspend fun getCompanies(): ArrayList<Company>

   @POST("homologacion/rememberpass")
   suspend fun recoverPassword(
     @Body body: HashMap<String, Any?>
   ): MessageResponse

   @GET("api/menu-app/787")
   suspend fun getMenuOptions(): ArrayList<MenuOptions>

   @GET("arcgis/listar/mapas")
   suspend fun getListMaps(): Response<List<MapArcGISModel>>

   @GET("api/arcgis/geolocalizacion/capas")
   suspend fun getListLayersMap(): Response<List<LayerMapModel>>

   @GET("api/empresas/alternasOld")
   suspend fun getAlternativeCompanies(): ArrayList<Any>

   @POST("api/suscripcion/filtrar/0/5")
   suspend fun filterMap(
     @Body body: HashMap<String, Any?>
   ): Any

   /**
   * Filtro
   */

   @GET("api/suscripcion/filtro/unidades")
   suspend fun getFilterUnits(): UnitFilterResponse

   @GET("api/aforo/unidades")
   suspend fun getUnitsCapacity(): CapacityUnitsResponse

   @GET("api/barrios/empresa/317")
   suspend fun getFilterNegbordhood(): List<UnitKeyValueResponse>

   /**
   * Editar Usuario
   */

   @GET("api/actualizar/suscripcion/unidades")
   suspend fun getEditUserUnits(): EditUserUnitsResponse

   @GET("api/suscripcion/filtro/info/{code}")
   suspend fun getSubscriptionDetailById(@Path("code") code: String): SubscriptionDetail

   @GET("api/suscripcion/filtro/info/{code}")
   suspend fun getIndependeceById(@Path("code") code: String): Independence

   /**
   * Novedades Novedades
   */

   @GET("api/suscripcion/novedad/unidades")
   suspend fun getNoveltyUnits(): NoveltyParamResponse

   /**
   * Visitas Pendientes
   */

   @GET("api/aforo/pendiente/listar")
   suspend fun getVisits(): ArrayList<VisitResponse>

   /**
    * Sync
    */

   @Multipart
   @POST("api/actualizar/suscripcion")
   @JvmSuppressWildcards
   suspend fun uploadSubscription(
      @Part data: MultipartBody.Part,
      @Part images: List<MultipartBody.Part>,
   ): MessageResponse

   @Multipart
   @POST("api/suscripcion/novedad")
   @JvmSuppressWildcards
   suspend fun uploadNovelty(
      @Part data: MultipartBody.Part,
      @Part images: List<MultipartBody.Part>,
   ): MessageResponse

   @Multipart
   @POST("api/suscripcion/independencia")
   @JvmSuppressWildcards
   suspend fun uploadIndependence(
      @Part data: MultipartBody.Part,
      @Part images: List<MultipartBody.Part>,
   ): MessageResponse

   @Multipart
   @POST("api/suscripcion/point")
   @JvmSuppressWildcards
   suspend fun uploadPoint(
      @Part data: MultipartBody.Part,
      @Part images: List<MultipartBody.Part>,
   ): MessageResponse

   @Multipart
   @POST("api/aforo/visita/realizar")
   @JvmSuppressWildcards
   suspend fun uploadCompleteVisit(
      @Part data: MultipartBody.Part,
      @Part image: List<MultipartBody.Part>,
   ): MessageResponse

   @Multipart
   @POST("api/aforo/visita/cancelar")
   @JvmSuppressWildcards
   suspend fun uploadCancelVisit(
      @Part data: MultipartBody.Part,
      @Part image: List<MultipartBody.Part>,
   ): MessageResponse

   @GET("api/aforo/validar_visita/{id_aforo}/{id_visita}")
   suspend fun validar_visita(
      @Path("id_aforo") id_aforo: Int,
      @Path("id_visita") id_visita: Int
   ): ValidVisitResponse

   /**
    * Map
    */
   @GET("arcgis/token")
   suspend fun getArcgisToken(): ArcGisTokenResponse

   /**
    * Search
    */
   @POST("api/suscripcion/filtrar/{page}/5")
   suspend fun search(
      @Path("page") page: Int,
      @Body body: HashMap<String, String?>
   ): SearchResponse

   /**
    * Obtener la lista de actualizaciones que se han sincronizado y aprobado en la app
    */
   @POST("api/actualizar/suscripcion/listar_registros_sincronizados/{id}/{page}/5")
   suspend fun getListActSyncSubscription(
      @Path("id") id: Long,
      @Path("page") page: Int
   ): ActSyncResponse

   /**
    * Obtener la lista de imagenes de una actualizacion.
    */
   @GET("api/actualizar/suscripcion/imagenes/{id}")
   suspend fun getImagenesActualizacion(
      @Path("id") id: Long
   ): List<ActImagenItemResponse>
}