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
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.hya.R
import com.progracol.hya.ui.base.ItemDataDialog

class SubscriptionDetailAdapter(val context: Context,
                                val delete: (subscriptionDetail: SubscriptionDetail) -> Unit,
                                val edit: (subscriptionDetail: SubscriptionDetail) -> Unit
): ListAdapter<SubscriptionDetail, SubscriptionDetailAdapter.ViewHolder>(object: DiffUtil.ItemCallback<SubscriptionDetail>(){
    override fun areItemsTheSame(oldItem: SubscriptionDetail, newItem: SubscriptionDetail): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: SubscriptionDetail, newItem: SubscriptionDetail): Boolean {
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
        val subscriptionDetail = getItem(position)
        holder.menuButton.setOnClickListener{
            showDialog(subscriptionDetail,holder.itemView)
        }
        holder.titleTextView.text = subscriptionDetail.id.toString() + "-A-" + subscriptionDetail.subscriptionId + "-" + subscriptionDetail.name
    }

    private fun showDialog(subscriptionDetail: SubscriptionDetail, anchorView: View) {
        val itemDialog = ItemDataDialog((context), { delete(subscriptionDetail)}, { edit(subscriptionDetail) })
        itemDialog.showPopup(anchorView)
    }


}