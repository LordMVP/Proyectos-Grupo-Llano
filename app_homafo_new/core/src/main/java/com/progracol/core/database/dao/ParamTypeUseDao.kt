package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.sqlite.db.SimpleSQLiteQuery
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamTypeUse

@Dao
abstract class ParamTypeUseDao : BaseDao<ParamTypeUse>("param_type_use") {

    fun getTypeUseByName(name: String): ParamTypeUse? {
        val query = SimpleSQLiteQuery("SELECT * FROM param_type_use WHERE name LIKE '%$name%' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }

}