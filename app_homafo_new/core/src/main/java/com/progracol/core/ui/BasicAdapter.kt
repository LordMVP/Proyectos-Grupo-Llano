package com.progracol.core.ui

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.annotation.LayoutRes
import com.progracol.core.R
import com.progracol.core.data.ModelDisplayName
import com.progracol.core.database.BaseEntity

class BasicAdapter constructor(context: Context,
                               @LayoutRes private val layoutResource: Int = 0,
                               var data: List<BaseEntity>) :
    ArrayAdapter<BaseEntity>(context, layoutResource) {

    var selectedItem: BaseEntity? = null

    override fun getItem(position: Int): BaseEntity = data[position]

    override fun getCount() = data.size

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.list_popup_window_item, parent, false)
        val vh = ViewHolder(view)
        vh.nameTextView.text = getItem(position).name
        return bindData(getItem(position), vh.nameTextView)
    }

    class ViewHolder(view: View?) {
        val nameTextView: TextView = view?.findViewById(R.id.name) as TextView
    }

    private fun bindData(value: BaseEntity, view: TextView): TextView {
        view.text = value.name
        return view
    }

}