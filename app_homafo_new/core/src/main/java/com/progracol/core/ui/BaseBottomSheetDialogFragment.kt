package com.progracol.core.ui

import android.os.Bundle
import android.util.TypedValue
import android.view.View
import android.widget.TextView
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
open class BaseBottomSheetDialogFragment : BottomSheetDialogFragment() {

    lateinit var messageDialog: MessageDialog

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        messageDialog = MessageDialog(requireContext())
    }

    fun getHeaderLabel(text: String) : TextView {
        val labelTextView = TextView(requireContext())
        labelTextView.text = text
        labelTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16.0.toFloat())
        labelTextView.setTextColor(resources.getColor(com.progracol.core.R.color.white, null))
        return labelTextView
    }

    fun getRowLabel(text: String) : TextView {
        val labelTextView = TextView(requireContext())
        labelTextView.text = text
        labelTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16.0.toFloat())
        labelTextView.setTextColor(resources.getColor(com.progracol.core.R.color.title, null))
        return labelTextView
    }

}