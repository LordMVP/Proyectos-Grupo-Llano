package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamNoveltyInvoice

@Dao
abstract class ParamNoveltyInvoiceDao: BaseDao<ParamNoveltyInvoice>("param_novelty_invoice")