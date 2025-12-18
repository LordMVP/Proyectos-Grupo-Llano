package com.progracol.core.database.dao

import androidx.room.Dao
import com.progracol.core.database.BaseDao
import com.progracol.core.database.entities.ParamAlternativeCompany

@Dao
abstract class ParamAlternativeCompanyDao : BaseDao<ParamAlternativeCompany>("param_alternative_company")