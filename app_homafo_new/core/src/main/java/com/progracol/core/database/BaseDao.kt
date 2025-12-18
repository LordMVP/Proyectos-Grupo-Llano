package com.progracol.core.database

import androidx.room.*
import androidx.sqlite.db.SimpleSQLiteQuery
import androidx.sqlite.db.SupportSQLiteQuery


@Dao
abstract class BaseDao<T: BaseEntity>(private val tableName: String)  {


    @Insert
    abstract fun insert(entity: T)

    @Insert
    abstract fun insert(entities: List<T>)

    @Update
    abstract fun update(entity: T)

    @Update
    abstract fun update(entities: List<T>)

    @Delete
    abstract fun delete(entity: T)

    @Delete
    abstract fun delete(entities: List<T>)

    @RawQuery
    protected abstract fun deleteAll(query: SupportSQLiteQuery): Int

    @Transaction
    open suspend fun updateData(entities: List<T>) {
        this.deleteAll()
        this.insert(entities)
    }

    suspend fun getAll(): List<T> {
        return getAll(SimpleSQLiteQuery("SELECT * FROM $tableName"))
    }

    @RawQuery
    protected abstract fun getAll(query: SupportSQLiteQuery): List<T>

    fun getByCode(code: String): T? {
        val query = SimpleSQLiteQuery("SELECT * FROM $tableName WHERE code = '$code' LIMIT 1")
        return getEntitySync(query)?.firstOrNull()
    }

    fun deleteAll() {
        val query = SimpleSQLiteQuery("DELETE FROM $tableName")
        deleteAll(query)
    }

    @RawQuery
    protected abstract fun getEntitySync(query: SupportSQLiteQuery): List<T>?

    fun getEntitySync(id: Int): T? {
        return getEntitySync(listOf(id))?.firstOrNull()
    }

    private fun getEntitySync(ids: List<Int>): List<T>? {
        val result = StringBuilder()
        for (index in ids.indices) {
            if (index != 0) {
                result.append(",")
            }
            result.append("'").append(ids[index]).append("'")
        }
        val query = SimpleSQLiteQuery("SELECT * FROM $tableName WHERE id IN ($result);")
        return getEntitySync(query)
    }
}