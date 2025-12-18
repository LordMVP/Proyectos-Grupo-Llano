package com.progracol.login.ui.home

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import androidx.lifecycle.viewModelScope
import com.progracol.core.data.MenuOptions
import com.progracol.core.database.entities.ParamAlternativeCompany
import com.progracol.core.database.entities.ParamBillingSegment
import com.progracol.core.database.entities.ParamCapacityType
import com.progracol.core.database.entities.ParamCommercialActivity
import com.progracol.core.database.entities.ParamConditionHouse
import com.progracol.core.database.entities.ParamContainerType
import com.progracol.core.database.entities.ParamFacturacion
import com.progracol.core.database.entities.ParamLiquidation
import com.progracol.core.database.entities.ParamMarcacion
import com.progracol.core.database.entities.ParamNeighborhood
import com.progracol.core.database.entities.ParamNoveltyInvoice
import com.progracol.core.database.entities.ParamNoveltyResultType
import com.progracol.core.database.entities.ParamNoveltyTypeRequest
import com.progracol.core.database.entities.ParamNoveltyVisit
import com.progracol.core.database.entities.ParamState
import com.progracol.core.database.entities.ParamStratum
import com.progracol.core.database.entities.ParamTypeUse
import com.progracol.core.database.entities.Visit
import com.progracol.core.network.Resource
import com.progracol.core.network.TokenManager
import com.progracol.core.repository.HomeRepository
import com.progracol.core.repository.LoginRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val loginRepository: LoginRepository,
    private val homeRepository: HomeRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private var _menuOptionLiveData: MutableLiveData<List<MenuOptions>> = MutableLiveData()
    val menuOptionLiveData: LiveData<List<MenuOptions>>
    get() = _menuOptionLiveData

    var pendingData: Boolean = false

    fun verificarVersionApp() = liveData {
        emit(Resource.loading(null))
        try {
            val versionAppNueva: String = homeRepository.consultarVersionApp()
            emit(Resource.success(versionAppNueva))
        } catch (exception: Exception) {
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    fun getMenuOptions() = liveData {
        emit(Resource.loading(null))
        try {
            _menuOptionLiveData.postValue(loginRepository.getMenuOptions())
            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }
    }

    /**
     * Configure ROOM Database For Filters
     */
    fun configureApp() = liveData {
        if(!tokenManager.getLastSync().isNullOrEmpty()) {
            emit(Resource.success(null))
            return@liveData
        }
        emit(Resource.loading(null))
        try {
            homeRepository.getFilterUnits().let {
                val companies = it.companyAlternative.map { ca -> ParamAlternativeCompany(ca.key, ca.value) }
                homeRepository.saveAllAlternatives(companies)
                val status = it.statusSubscription.map { s -> ParamState(s.key, s.value) }
                homeRepository.saveAllStatus(status)
            }
            homeRepository.getEditUserUnits().let {
                val conditions = it.conditionLand.map { ca -> ParamConditionHouse(ca.key, ca.value) }
                homeRepository.saveAllConditionLand(conditions)
                val types = it.typesUse.map { ca -> ParamTypeUse(ca.key, ca.value) }
                homeRepository.saveAllTypeUse(types)
                val stratums = it.estratos.map { ca -> ParamStratum(ca.key, ca.value) }
                homeRepository.saveAllStratum(stratums)
                val commercialActivities = it.commercialActivities.map { ca -> ParamCommercialActivity(ca.key, ca.value) }
                homeRepository.saveAllCommercialActivity(commercialActivities)
                val liquidations = it.settlement.map { ca -> ParamLiquidation(ca.key, ca.value) }
                homeRepository.saveAllLiquidation(liquidations)
                val marcacion_liquidacion = it.marcacionLiquidacion.map { ca -> ParamMarcacion(ca.uni_concepto.toString(), ca.nombre, ca.orden) }
                homeRepository.saveMarcaciones(marcacion_liquidacion)
                val tipo_facturacion = it.tipoFacturacion.map { ca -> ParamFacturacion(ca.orden,ca.nombre, ca.color) }
                homeRepository.saveTiposFacturacion(tipo_facturacion)
            }
            homeRepository.getUnitsCapacity().let {
                val capacityTypes = it.typeOfCapacity.map { ca -> ParamCapacityType(ca.key, ca.value) }
                homeRepository.saveAllTypeCapacity(capacityTypes)
                val containerTypes = it.containerTypes.map { ca -> ParamContainerType(ca.vol, ca.key, ca.value) }
                homeRepository.saveAllContainerType(containerTypes)
                val invoiceSegments = it.invoiceSegment.map { ca -> ParamBillingSegment(ca.key, ca.value) }
                homeRepository.saveAllBillingSegment(invoiceSegments)
            }
            homeRepository.getNeighborhoods().let {
                val neighborhoods = it.map { ca -> ParamNeighborhood(ca.key, ca.value) }
                homeRepository.saveNeighborhoods(neighborhoods)
            }
            homeRepository.getNoveltiesParams().let {
                val noveltyVisits = it.noveltyVisits.map { ca -> ParamNoveltyVisit(ca.key, ca.value) }
                homeRepository.saveNoveltyVisits(noveltyVisits)
                val noveltyTypeRequests = it.typeRequests.map { ca -> ParamNoveltyTypeRequest(ca.key, ca.value) }
                homeRepository.saveNoveltyTypeRequests(noveltyTypeRequests)
                val noveltyResultTypes = it.resultTypes.map { ca -> ParamNoveltyResultType(ca.key, ca.value) }
                homeRepository.saveNoveltyResultTypes(noveltyResultTypes)
                val noveltyInvoices = it.noveltyInvoices.map { ca -> ParamNoveltyInvoice(ca.key, ca.value) }
                homeRepository.saveNoveltyInvoices(noveltyInvoices)
            }

            emit(Resource.success(true))
        } catch (exception: Exception) {
            Log.e("error", exception.localizedMessage)
            emit(Resource.error(data = null, msg = exception.message ?: "Error Occurred!"))
        }


    }

    fun logout(){
        viewModelScope.launch(Dispatchers.IO) {
            tokenManager.deleteToken()
            homeRepository.deleteVisits()
            homeRepository.deleteNovelties()
            homeRepository.deleteIndependences()
            homeRepository.deletePoints()
            homeRepository.deleteSubscriptions()
            homeRepository.deleteAllMediaStorage()
            homeRepository.deleteAllVisitConcept()
            //homeRepository.deleteMarkersPoints()
        }

    }

    fun getPendingData() = liveData(Dispatchers.IO) {

            pendingData = (homeRepository.getCompleteOrCancelVisits().isNotEmpty()
                    || homeRepository.getPendingIndependences().isNotEmpty()
                    || homeRepository.getPendingNovelties().isNotEmpty()
                    || homeRepository.getPendingSubscriptions().isNotEmpty())

            Log.e("Visita valor",homeRepository.getCompleteOrCancelVisits().toString())
            emit(pendingData)

        Log.e("Valor para logut", pendingData.toString())
    }

}