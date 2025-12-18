package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamNoveltyResultType

@Dao
abstract class ParamNoveltyResultTypeDao: BaseDao<ParamNoveltyResultType>("param_novelty_result_type")