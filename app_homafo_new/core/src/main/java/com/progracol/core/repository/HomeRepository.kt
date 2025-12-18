package com.progracol.core.repository

import com.progracol.core.database.dao.*
import com.progracol.core.database.entities.*
import com.progracol.core.network.APIClient
import javax.inject.Inject

class HomeRepository @Inject constructor(
    private val service: APIClient,
    private val paramAlternativeCompanyDao: ParamAlternativeCompanyDao,
    private val paramConditionsHouseDao: ParamConditionHouseDao,
    private val paramTypeUseDao: ParamTypeUseDao,
    private val paramStratumDao: ParamStratumDao,
    private val paramCapacityTypeDao: ParamCapacityTypeDao,
    private val paramContainerTypeDao: ParamContainerTypeDao,
    private val paramBillingSegmentDao: ParamBillingSegmentDao,
    private val paramCommercialActivityDao: ParamCommercialActivityDao,
    private val paramLiquidationDao: ParamLiquidationDao,
    private val paramNeighborhoodDao: ParamNeighborhoodDao,
    private val paramStateDao: ParamStateDao,
    private val paramMarcacionDao: ParamMarcacionDao,
    private val paramFacturacionDao: ParamFacturacionDao,
    private val paramNoveltyVisitDao: ParamNoveltyVisitDao,
    private val paramNoveltyResultTypeDao: ParamNoveltyResultTypeDao,
    private val paramNoveltyTypeRequestDao: ParamNoveltyTypeRequestDao,
    private val paramNoveltyInvoiceDao: ParamNoveltyInvoiceDao,
    private val visitDao: VisitDao,
    private val subscriptionDetailDao: SubscriptionDetailDao,
    private val independenceDao: IndependenceDao,
    private val pointDao: PointDao,
    private val noveltyDao: NoveltyDao,
    private val mediaStorageDao: MediaStorageDao,
    private val visitConceptDao: VisitConceptDao,
    private val markerPointMapDao: MarkerPointMapDao
) {
    suspend fun consultarVersionApp() = service.getConsultarVersionApp()

    suspend fun getFilterUnits() = service.getFilterUnits()

    suspend fun getEditUserUnits() = service.getEditUserUnits()

    suspend fun getUnitsCapacity() = service.getUnitsCapacity()

    suspend fun getNeighborhoods() = service.getFilterNegbordhood()

    suspend fun getNoveltiesParams() = service.getNoveltyUnits()

    suspend fun getVisits() = service.getVisits()

    suspend fun getSavedVisits() = visitDao.getPendingVisits()


    suspend fun saveAllAlternatives(paramsList: List<ParamAlternativeCompany>) {
        paramAlternativeCompanyDao.updateData(paramsList)
    }

    suspend fun saveAllStatus(paramsList: List<ParamState>) {
        paramStateDao.updateData(paramsList)
    }

    suspend fun saveAllConditionLand(paramsList: List<ParamConditionHouse>) {
        paramConditionsHouseDao.updateData(paramsList)
    }

    suspend fun saveAllTypeUse(paramsList: List<ParamTypeUse>) {
        paramTypeUseDao.updateData(paramsList)
    }

    suspend fun saveAllStratum(paramsList: List<ParamStratum>) {
        paramStratumDao.updateData(paramsList)
    }

    suspend fun saveAllTypeCapacity(paramsList: List<ParamCapacityType>) {
        paramCapacityTypeDao.updateData(paramsList)
    }

    suspend fun saveAllContainerType(paramsList: List<ParamContainerType>) {
        paramContainerTypeDao.updateData(paramsList)
    }

    suspend fun saveAllBillingSegment(paramsList: List<ParamBillingSegment>) {
        paramBillingSegmentDao.updateData(paramsList)
    }

    suspend fun saveAllCommercialActivity(paramsList: List<ParamCommercialActivity>) {
        paramCommercialActivityDao.updateData(paramsList)
    }

    suspend fun saveAllLiquidation(paramsList: List<ParamLiquidation>) {
        paramLiquidationDao.updateData(paramsList)
    }

    suspend fun saveNeighborhoods(paramsList: List<ParamNeighborhood>) {
        paramNeighborhoodDao.updateData(paramsList)
    }

    suspend fun saveMarcaciones(paramsList: List<ParamMarcacion>) {
        paramMarcacionDao.updateData(paramsList)
    }

    suspend fun saveTiposFacturacion(paramsList: List<ParamFacturacion>) {
        paramFacturacionDao.updateData(paramsList)
    }

    /**** Novelty *****/

    suspend fun saveNoveltyVisits(noveltyVisits: List<ParamNoveltyVisit>) {
        paramNoveltyVisitDao.updateData(noveltyVisits)
    }

    suspend fun saveNoveltyResultTypes(noveltyTypeRequests: List<ParamNoveltyResultType>) {
        paramNoveltyResultTypeDao.updateData(noveltyTypeRequests)
    }

    suspend fun saveNoveltyTypeRequests(noveltyTypeRequests: List<ParamNoveltyTypeRequest>) {
        paramNoveltyTypeRequestDao.updateData(noveltyTypeRequests)
    }

    suspend fun saveNoveltyInvoices(noveltyInvoices: List<ParamNoveltyInvoice>) {
        paramNoveltyInvoiceDao.updateData(noveltyInvoices)
    }

    suspend fun saveVisits(visits: List<Visit>) = visitDao.insertAll(visits)

    suspend fun deleteVisits() = visitDao.deleteAll()

    suspend fun getPendingVisits() = visitDao.getPendingVisits()

    suspend fun getPendingSubscriptions() = subscriptionDetailDao.getPendingSubscriptions()

    suspend fun getPendingNovelties() = noveltyDao.getPendingNovelties()

    suspend fun getPendingIndependences() = independenceDao.getPendingIndependences()

    suspend fun deleteSubscriptions() = subscriptionDetailDao.deleteAll()

    suspend fun deleteNovelties() = noveltyDao.deleteAll()

    suspend fun deleteIndependences() = independenceDao.deleteAllParameters()

    suspend fun deleteAllMediaStorage() = mediaStorageDao.deleteAllMediaStorage()

    suspend fun getCompleteOrCancelVisits() = visitDao.getCompleteOrCancelVisits()

    suspend fun deleteAllVisitConcept() = visitConceptDao.deleteAllVisitConcept()

    suspend fun deletePoints() = pointDao.deleteAllParameters()

    suspend fun deleteMarkersPoints() = markerPointMapDao.deleteAll()

}