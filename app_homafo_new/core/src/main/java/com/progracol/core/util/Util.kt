package com.progracol.core.util

import java.math.RoundingMode
import java.text.DecimalFormat

object Util {

    fun roundOffDecimal(number: Double?): Double {
        if(number == null) {
            return 0.0
        }
        if(number.isNaN()) {
            return 0.0
        }
        val df = DecimalFormat("#.###")
        df.roundingMode = RoundingMode.CEILING
        return df.format(number).toDouble()
    }


}