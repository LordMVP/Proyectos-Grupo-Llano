package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.sqlite.db.SimpleSQLiteQuery
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamCommercialActivity
import com.progracol.core.database.entities.ParamTypeUse

@Dao
abstract class ParamCommercialActivityDao : BaseDao<ParamCommercialActivity>("param_commercial_activity") {
    fun getCommercialActivitiesByName(name: String): ParamCommercialActivity? {
        val query = SimpleSQLiteQuery("SELECT * FROM param_commercial_activity WHERE name LIKE '%$name%' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }
}