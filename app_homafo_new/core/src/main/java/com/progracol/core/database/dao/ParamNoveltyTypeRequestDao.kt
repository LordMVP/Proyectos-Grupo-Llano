package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamNoveltyTypeRequest

@Dao
abstract class ParamNoveltyTypeRequestDao: BaseDao<ParamNoveltyTypeRequest>("param_novelty_type_request")