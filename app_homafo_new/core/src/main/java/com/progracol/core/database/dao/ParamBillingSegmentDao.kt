package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamBillingSegment

@Dao
abstract class ParamBillingSegmentDao: BaseDao<ParamBillingSegment>("param_novelty_segment")