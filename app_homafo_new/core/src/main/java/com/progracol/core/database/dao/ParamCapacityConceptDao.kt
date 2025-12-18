package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamCapacityConcept

@Dao
abstract class ParamCapacityConceptDao: BaseDao<ParamCapacityConcept>("param_capacity_concept")