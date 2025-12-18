package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.sqlite.db.SimpleSQLiteQuery
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamCommercialActivity
import com.progracol.core.database.entities.ParamLiquidation

@Dao
abstract class ParamLiquidationDao: BaseDao<ParamLiquidation>("param_liquidation") {
    fun getSettlementsByName(name: String): ParamLiquidation? {
        val query = SimpleSQLiteQuery("SELECT * FROM param_liquidation WHERE name LIKE '%$name%' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }
}