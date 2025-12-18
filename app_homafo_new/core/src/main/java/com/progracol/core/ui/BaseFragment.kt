package com.progracol.core.ui

import android.content.Context
import android.content.DialogInterface
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.util.TypedValue
import android.view.*
import androidx.fragment.app.Fragment
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.navigation.fragment.findNavController
import com.progracol.core.R
import com.progracol.core.database.BaseEntity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
open class BaseFragment constructor(
    val title : String = "",
    private val isHome : Boolean = false
) : Fragment() {

    lateinit var messageDialog: MessageDialog

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        activity?.window?.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE or WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)

        messageDialog = MessageDialog(requireContext())

        (requireActivity() as AppCompatActivity).supportActionBar?.let {
            it.title = title
            it.setDisplayHomeAsUpEnabled(!isHome)
        }
    }

    /*override fun onOptionsItemSelected(item: MenuItem): Boolean {
        //findNavController().popBackStack()
        val inputManager = requireContext().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        inputManager.hideSoftInputFromWindow(this.view?.windowToken, 0)
        return super.onOptionsItemSelected(item)
    }*/

    fun hideKeyboard(view: View) {
        val imm = requireContext().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(view.windowToken, 0)
    }

    fun showDialog(message: String, okListener: DialogInterface.OnClickListener, cancelListener: DialogInterface.OnClickListener) {
        messageDialog.showOKMessage(message, okListener, cancelListener)
    }

    fun setSpinner(autoCompleteTextView: AutoCompleteTextView, adapter: BasicAdapter) {
        autoCompleteTextView.setAdapter(adapter)
        autoCompleteTextView.setOnItemClickListener { adapterView, _, position, _ ->
            val selectedItem = adapterView.getItemAtPosition(position) as BaseEntity
            autoCompleteTextView.setText(selectedItem.name)
            adapter.selectedItem = selectedItem
        }
    }

    fun setDataSpinner(adapter: BasicAdapter, list: List<BaseEntity>, code: String, input: AutoCompleteTextView) {
        adapter.data = list
        list.findLast { it.code == code }?.let {
            adapter.selectedItem = it
            input.setText(it.name)
        }
    }

    open fun setBackButton(menuHost: MenuHost) {

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

    fun getDeleteButton(onDeleteItem: () -> Unit): ImageButton {
        val imageButton = ImageButton(requireContext())
        imageButton.setImageResource(R.drawable.ic_delete_red)
        imageButton.scaleType = ImageView.ScaleType.FIT_CENTER
        imageButton.setPadding(20,5,20,5)
        imageButton.setBackgroundColor(Color.TRANSPARENT)
        imageButton.setOnClickListener { onDeleteItem() }
        return imageButton
    }

}