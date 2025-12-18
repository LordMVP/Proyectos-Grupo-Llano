package com.progracol.core.di

import android.content.Context
import androidx.room.Room
import com.progracol.core.database.HyaDatabase
import com.progracol.core.database.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
class RoomModule {

    @Singleton
    @Provides
    fun provideAppDB(@ApplicationContext context: Context): HyaDatabase {
        return Room
            .databaseBuilder(
                context,
                HyaDatabase::class.java,
                HyaDatabase.DATABASE_NAME
            )
            .fallbackToDestructiveMigration()
            .build()
    }

    @Singleton
    @Provides
    fun provideParamTypeUseDao(appDatabase: HyaDatabase): ParamTypeUseDao {
        return appDatabase.paramTypeUseDao()
    }

    @Singleton
    @Provides
    fun provideParamStratumDao(appDatabase: HyaDatabase): ParamStratumDao {
        return appDatabase.paramStratumDao()
    }

    @Singleton
    @Provides
    fun provideParamLiquidationDao(appDatabase: HyaDatabase): ParamLiquidationDao {
        return appDatabase.paramLiquidationDao()
    }

    @Singleton
    @Provides
    fun provideParamConditionHouseDao(appDatabase: HyaDatabase): ParamConditionHouseDao {
        return appDatabase.paramConditionsHouseDao()
    }

    @Singleton
    @Provides
    fun provideParamCommercialActivityDao(appDatabase: HyaDatabase): ParamCommercialActivityDao {
        return appDatabase.paramCommercialActivityDao()
    }

    @Singleton
    @Provides
    fun provideParamAlternativeCompanyDao(appDatabase: HyaDatabase): ParamAlternativeCompanyDao {
        return appDatabase.paramAlternativeCompanyDao()
    }

    @Singleton
    @Provides
    fun provideParamCapacityConceptDao(appDatabase: HyaDatabase): ParamCapacityConceptDao {
        return appDatabase.paramCapacityConceptsDao()
    }

    @Singleton
    @Provides
    fun provideParamCapacitySegmentDao(appDatabase: HyaDatabase): ParamBillingSegmentDao {
        return appDatabase.paramCapacitySegmentDao()
    }

    @Singleton
    @Provides
    fun provideParamCapacityTypeDao(appDatabase: HyaDatabase): ParamCapacityTypeDao {
        return appDatabase.paramCapacityTypeDao()
    }

    @Singleton
    @Provides
    fun provideIndependenceDao(appDatabase: HyaDatabase): IndependenceDao {
        return appDatabase.independenceDao()
    }

    @Singleton
    @Provides
    fun provideSubscriptionDetailDao(appDatabase: HyaDatabase): SubscriptionDetailDao {
        return appDatabase.subscriptionDetailDao()
    }

    @Singleton
    @Provides
    fun provideParamContainerTypeDao(appDatabase: HyaDatabase): ParamContainerTypeDao {
        return appDatabase.paramContainerTypeDao()
    }

    @Singleton
    @Provides
    fun provideParamStateDao(appDatabase: HyaDatabase): ParamStateDao {
        return appDatabase.paramStateDao()
    }

    @Singleton
    @Provides
    fun provideParamMarcacionDao(appDatabase: HyaDatabase): ParamMarcacionDao {
        return appDatabase.paramMarcacionDao()
    }

    @Singleton
    @Provides
    fun provideParamFacturacionDao(appDatabase: HyaDatabase): ParamFacturacionDao {
        return appDatabase.paramFacturacionDao()
    }

    @Singleton
    @Provides
    fun provideMediaStorageDao(appDatabase: HyaDatabase): MediaStorageDao {
        return appDatabase.mediaStorageDao()
    }


    @Singleton
    @Provides
    fun provideParamNoveltyInvoiceDao(appDatabase: HyaDatabase): ParamNoveltyInvoiceDao {
        return appDatabase.paramNoveltyInvoiceDao()
    }

    @Singleton
    @Provides
    fun provideParamNoveltyResultTypeDao(appDatabase: HyaDatabase): ParamNoveltyResultTypeDao {
        return appDatabase.paramNoveltyResultTypeDao()
    }

    @Singleton
    @Provides
    fun provideParamNoveltyTypeRequestDao(appDatabase: HyaDatabase): ParamNoveltyTypeRequestDao {
        return appDatabase.paramNoveltyTypeRequestDao()
    }

    @Singleton
    @Provides
    fun provideParamNoveltyVisitDao(appDatabase: HyaDatabase): ParamNoveltyVisitDao {
        return appDatabase.paramNoveltyVisitDao()
    }

    @Singleton
    @Provides
    fun provideNoveltyDao(appDatabase: HyaDatabase): NoveltyDao {
        return appDatabase.noveltyDao()
    }


    @Singleton
    @Provides
    fun provideVisitDao(appDatabase: HyaDatabase): VisitDao {
        return appDatabase.visitDao()
    }

    @Singleton
    @Provides
    fun provideVisitConceptDao(appDatabase: HyaDatabase): VisitConceptDao {
        return appDatabase.visitConceptDao()
    }

    @Singleton
    @Provides
    fun provideNeighborhoodDao(appDatabase: HyaDatabase): ParamNeighborhoodDao {
        return appDatabase.paramNeighborhoodDao()
    }

    @Singleton
    @Provides
    fun provideMapDao(appDatabase: HyaDatabase): UserMapDao {
        return appDatabase.mapDao()
    }

    @Singleton
    @Provides
    fun provideMarkerPointMapDao(appDatabase: HyaDatabase): MarkerPointMapDao {
        return appDatabase.markerPointMapDao()
    }

    @Singleton
    @Provides
    fun providePointDao(appDatabase: HyaDatabase): PointDao {
        return appDatabase.pointDao()
    }

}