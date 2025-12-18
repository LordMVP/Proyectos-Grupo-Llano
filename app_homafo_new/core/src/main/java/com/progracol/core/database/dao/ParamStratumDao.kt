package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.sqlite.db.SimpleSQLiteQuery
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamStratum

@Dao
abstract class ParamStratumDao : BaseDao<ParamStratum>("param_stratum") {

    fun getStratumByName(name: String): ParamStratum? {
        val query = SimpleSQLiteQuery("SELECT * FROM param_stratum WHERE name LIKE '%$name%' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }

}