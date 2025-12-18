package com.progracol.hya.ui.base.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.progracol.core.network.response.SearchSubscriptionResponse
import com.progracol.hya.R
import kotlinx.android.synthetic.main.subscription_map_item.view.card_view

class SubscriptionMapAdapter(val context: Context,
                             val onItemSelected: (subscription: SearchSubscriptionResponse) -> Unit,
                             val onLocateClick: (subscription: SearchSubscriptionResponse) -> Unit,
                             val onVerSincronizacionesClick: (subscription: SearchSubscriptionResponse) -> Unit
): ListAdapter<SearchSubscriptionResponse, SubscriptionMapAdapter.ViewHolder>(object: DiffUtil.ItemCallback<SearchSubscriptionResponse>(){

    override fun areItemsTheSame(oldItem: SearchSubscriptionResponse, newItem: SearchSubscriptionResponse): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: SearchSubscriptionResponse, newItem: SearchSubscriptionResponse): Boolean {
        return oldItem.userCode == newItem.userCode
    }
}) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.subscription_map_item, parent, false)
        return ViewHolder(view)
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val userNameTextView: TextView = itemView.findViewById(R.id.user_name)
        val codeTextView: TextView = itemView.findViewById(R.id.code)
        val stateTextView: TextView = itemView.findViewById(R.id.state)
        val addressTextView: TextView = itemView.findViewById(R.id.address)
        val buttonBuscarPunto: Button = itemView.findViewById(R.id.buscar_punto)
        val buttonVerSincronizaciones: Button = itemView.findViewById(R.id.ver_lista_sincronizaciones)
    }

    override fun onBindViewHolder(holder: SubscriptionMapAdapter.ViewHolder, position: Int) {
        val subscription = getItem(position)
        holder.itemView.setOnClickListener{
            onItemSelected(subscription)
        }
        holder.userNameTextView.text = subscription.userName
        holder.codeTextView.text = subscription.userCode
        holder.stateTextView.text = subscription.state
        holder.addressTextView.text = subscription.address
        holder.buttonBuscarPunto.setOnClickListener{
            onLocateClick(subscription)
        }
        holder.buttonVerSincronizaciones.setOnClickListener{
            onVerSincronizacionesClick(subscription)
        }
    }

}