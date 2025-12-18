package com.progracol.core.database.dao

import android.util.Log
import androidx.room.*
import androidx.sqlite.db.SimpleSQLiteQuery
import androidx.sqlite.db.SupportSQLiteQuery
import com.progracol.core.database.entities.SubscriptionDetail

@Dao
interface SubscriptionDetailDao {

    @Transaction
    suspend fun updateData(parameters: List<SubscriptionDetail>) {
        deleteAllParameters()
        insertAll(parameters)
    }

    @Insert
    suspend fun insertAll(parameters: List<SubscriptionDetail>)

    @Insert
    suspend fun insert(subscriptionDetail: SubscriptionDetail)

    @Query("DELETE FROM subscription_detail")
    suspend fun deleteAllParameters()

    @Query("SELECT * FROM subscription_detail")
    suspend fun getAllData(): List<SubscriptionDetail>

    @Query("SELECT * FROM subscription_detail WHERE status = 'PENDING'")
    suspend fun getPendingSubscriptions(): List<SubscriptionDetail>

    @Query("SELECT * FROM subscription_detail WHERE subscription_code = :code")
    suspend fun getSubscriptionDetailByCode(code: String): SubscriptionDetail?

    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(subscriptionDetail: SubscriptionDetail): Int

    @Query("UPDATE subscription_detail SET status = 'UPLOADED' WHERE id = :id")
    suspend fun updateUploadedSubscription(id: Long)

    @Query("DELETE FROM subscription_detail WHERE id = :id")
    fun delete(id: Long)

    suspend fun deleteAll() {
        deleteAll(SimpleSQLiteQuery("DELETE FROM subscription_detail"))
    }

    @RawQuery
    fun deleteAll(query: SupportSQLiteQuery): Int

    @Transaction
    suspend fun deleteSubscription(code: String) {
        val subscription = getSubscriptionDetailByCode(code)
        subscription?.let {
            delete(subscription.id ?: 0)
        }
    }

    @Transaction
    suspend fun insertOrUpdate(subscriptionDetail: SubscriptionDetail) {
        val subscription = getSubscriptionDetailByCode(subscriptionDetail.subscriptionCode ?: "")
        subscription?.let {
            update(subscriptionDetail)
        } ?: run {
            insert(subscriptionDetail)
        }
    }

}