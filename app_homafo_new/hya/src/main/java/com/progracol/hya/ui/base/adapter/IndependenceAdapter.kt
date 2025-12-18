package com.progracol.hya.ui.base.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.progracol.core.database.entities.Independence
import com.progracol.hya.R
import com.progracol.hya.ui.base.ItemDataDialog

class IndependenceAdapter(val context: Context,
                          val delete: (independence: Independence) -> Unit,
                          val edit: (independence: Independence) -> Unit
): ListAdapter<Independence, IndependenceAdapter.ViewHolder>(object: DiffUtil.ItemCallback<Independence>(){
    override fun areItemsTheSame(oldItem: Independence, newItem: Independence): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: Independence, newItem: Independence): Boolean {
        return oldItem.id == newItem.id
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.simple_list_item_data, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val menuButton: ImageButton = itemView.findViewById(R.id.menu_button_item)
        val titleTextView: TextView = itemView.findViewById(R.id.text_item)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val independence = getItem(position)
        holder.menuButton.setOnClickListener{
            showDialog(independence,holder.itemView)
        }
        holder.titleTextView.text = independence.id.toString() + "-I-" + independence.subscriptionCode + "-" + independence.name
    }

    private fun showDialog(independence: Independence, anchorView: View) {
        val itemDialog = ItemDataDialog((context), { delete(independence)}, { edit(independence) })
        itemDialog.showPopup(anchorView)
    }


}