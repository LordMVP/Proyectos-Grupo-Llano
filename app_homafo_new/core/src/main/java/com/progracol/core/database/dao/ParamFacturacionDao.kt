package com.progracol.core.database.dao

import androidx.room.Dao
import androidx.sqlite.db.SimpleSQLiteQuery
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamFacturacion

@Dao
abstract class ParamFacturacionDao: BaseDao<ParamFacturacion>("param_facturacion") {
    fun getFacturacionByName(name: String): ParamFacturacion? {
        val query = SimpleSQLiteQuery("SELECT * FROM param_facturacion WHERE name LIKE '%$name%' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }
}