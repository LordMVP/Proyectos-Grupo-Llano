package com.progracol.core.ui

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.core.content.ContextCompat
import com.progracol.core.R
import com.progracol.core.util.screenRectPx

class CancelCapacity(
    val context: Context,
    private val onClickListener: OnClickListener?
){

    interface OnClickListener{
        fun onItemClick()
    }

    private lateinit var dialog: Dialog

    fun startCancelAforoDilog(){
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.dialog_cancel_aforos, null) as View
        builder.setView(view)
        val unbutton : Button = view.findViewById(R.id.No_button)
        val yesbutton : Button = view.findViewById(R.id.yes_button)

        dialog = builder.create().apply {
            val backgroud = ContextCompat.getDrawable(context, R.drawable.background_dialog)
            window?.setBackgroundDrawable(backgroud)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.8F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

        unbutton.setOnClickListener {
            dialog.dismiss()
        }

        yesbutton.setOnClickListener {
            onClickListener?.onItemClick()
            dialog.dismiss()
        }
    }

    fun startConfirmDialog(){
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
        //val view = inflater.inflate(R.layout.dialog_confirm_button, null) as View
        //builder.setView(view)
        //val nobt : Button = view.findViewById(R.id.no_bt)
        //val yesbt : Button = view.findViewById(R.id.yes_bt)

        dialog = builder.create().apply {
            val backgroud = ContextCompat.getDrawable(context, R.drawable.background_dialog)
            window?.setBackgroundDrawable(backgroud)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.8F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

        //nobt.setOnClickListener {
            //dialog.dismiss()
        //}

        //yesbt.setOnClickListener {
            //onClickListener?.onItemClick()
            //dialog.dismiss()
        //}
    }

    fun startTermsAndConditionsDialog(){
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
        //val view = inflater.inflate(R.layout.dialog_terms_and_conditions, null) as View
        //builder.setView(view)

        dialog = builder.create().apply {
            val backgroud = ContextCompat.getDrawable(context, R.drawable.background_dialog)
            window?.setBackgroundDrawable(backgroud)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.8F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

    }
}