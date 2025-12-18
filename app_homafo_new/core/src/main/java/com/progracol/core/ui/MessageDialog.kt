package com.progracol.core.ui

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.content.DialogInterface
import android.text.Editable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.progracol.core.R
import com.progracol.core.util.screenRectPx

class MessageDialog (
    val context: Context
) {

    private lateinit var dialog: Dialog

    fun showMessage(message: String) {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.dialog_success, null) as View
        view.findViewById<TextView>(R.id.message).text = Editable.Factory.getInstance().newEditable(message)
        val acceptButton = view.findViewById<Button>(R.id.accept_button)
        builder.setView(view)

        dialog = builder.create().apply {
            val background = ContextCompat.getDrawable(context, R.drawable.background_dialog)
            window?.setBackgroundDrawable(background)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.8F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

        acceptButton.setOnClickListener {
            dialog.dismiss()
        }
    }

    fun showWarningMessage(message: String) {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.dialog_informative, null) as View
        view.findViewById<TextView>(R.id.message).text = Editable.Factory.getInstance().newEditable(message)
        val acceptButton = view.findViewById<Button>(R.id.accept_button)
        builder.setView(view)

        dialog = builder.create().apply {
            val background = ContextCompat.getDrawable(context, R.drawable.background_dialog)
            window?.setBackgroundDrawable(background)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.8F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

        acceptButton.setOnClickListener {
            dialog.dismiss()
        }
    }

    fun showErrorMessage(message: String) {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.dialog_error, null) as View
        view.findViewById<TextView>(R.id.message).text = Editable.Factory.getInstance().newEditable(message)
        val acceptButton = view.findViewById<Button>(R.id.accept_button)
        builder.setView(view)

        dialog = builder.create().apply {
            val background = ContextCompat.getDrawable(context, R.drawable.background_dialog)
            window?.setBackgroundDrawable(background)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.8F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

        acceptButton.setOnClickListener {
            dialog.dismiss()
        }
    }

    fun showOKMessage(message: String, okListener: DialogInterface.OnClickListener, cancelListener: DialogInterface.OnClickListener) {
        androidx.appcompat.app.AlertDialog.Builder(context)
            .setMessage(message)
            .setPositiveButton(context.resources.getString(R.string.ok), okListener)
            .setNegativeButton(context.resources.getString(R.string.cancel), cancelListener)
            .create()
            .show()
    }

}