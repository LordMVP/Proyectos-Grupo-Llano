package com.progracol.core.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.progracol.core.database.dao.*
import com.progracol.core.database.entities.*
import com.progracol.core.database.entities.UserMap

@Database(
    /**
     * Registrar los Entities.
     */
    entities = [
        ParamAlternativeCompany::class,
        ParamCommercialActivity::class,
        ParamConditionHouse::class,
        ParamLiquidation::class,
        ParamTypeUse::class,
        ParamState::class,
        ParamMarcacion::class,
        ParamFacturacion::class,
        ParamStratum::class,

        ParamCapacityConcept::class,
        ParamBillingSegment::class,
        ParamCapacityType::class,
        ParamContainerType::class,
        ParamNeighborhood::class,

        MediaStorage::class,

        SubscriptionDetail::class,
        ParamNoveltyInvoice::class,
        ParamNoveltyResultType::class,
        ParamNoveltyTypeRequest::class,
        ParamNoveltyVisit::class,
        Novelty::class,

        Independence::class,
        Point::class,

        Visit::class,
        VisitConcept::class,

        UserMap::class,

        MarkerPointMap::class

    ], version = 68
)
abstract class HyaDatabase : RoomDatabase() {
    companion object {
        const val DATABASE_NAME = "hya_db"
    }
    /**
     * Registrar los DAOs
     */
    abstract fun paramTypeUseDao(): ParamTypeUseDao
    abstract fun paramLiquidationDao(): ParamLiquidationDao
    abstract fun paramConditionsHouseDao(): ParamConditionHouseDao
    abstract fun paramCommercialActivityDao(): ParamCommercialActivityDao
    abstract fun paramAlternativeCompanyDao(): ParamAlternativeCompanyDao
    abstract fun paramCapacityConceptsDao(): ParamCapacityConceptDao
    abstract fun paramCapacitySegmentDao(): ParamBillingSegmentDao
    abstract fun paramCapacityTypeDao(): ParamCapacityTypeDao
    abstract fun paramStateDao(): ParamStateDao
    abstract fun paramMarcacionDao(): ParamMarcacionDao
    abstract fun paramFacturacionDao(): ParamFacturacionDao
    abstract fun paramStratumDao(): ParamStratumDao

    abstract fun independenceDao(): IndependenceDao
    abstract fun pointDao(): PointDao

    abstract fun subscriptionDetailDao(): SubscriptionDetailDao
    abstract fun paramContainerTypeDao(): ParamContainerTypeDao
    abstract fun paramNeighborhoodDao(): ParamNeighborhoodDao
    abstract fun mediaStorageDao(): MediaStorageDao

    abstract fun paramNoveltyInvoiceDao(): ParamNoveltyInvoiceDao
    abstract fun paramNoveltyResultTypeDao(): ParamNoveltyResultTypeDao
    abstract fun paramNoveltyTypeRequestDao(): ParamNoveltyTypeRequestDao
    abstract fun paramNoveltyVisitDao(): ParamNoveltyVisitDao

    abstract fun visitDao(): VisitDao
    abstract fun visitConceptDao(): VisitConceptDao

    abstract fun noveltyDao(): NoveltyDao

    abstract fun mapDao(): UserMapDao

    abstract fun markerPointMapDao(): MarkerPointMapDao
}