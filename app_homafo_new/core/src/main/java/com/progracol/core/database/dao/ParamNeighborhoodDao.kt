package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.sqlite.db.SimpleSQLiteQuery
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamNeighborhood

@Dao
abstract class ParamNeighborhoodDao : BaseDao<ParamNeighborhood>("param_neighborhood") {

    fun getNeighborhoodByName(name: String): ParamNeighborhood? {
        val query = SimpleSQLiteQuery("SELECT * FROM param_neighborhood WHERE name LIKE '%$name%' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }

}