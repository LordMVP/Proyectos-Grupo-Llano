package com.progracol.hya.ui.base.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.bumptech.glide.request.RequestOptions
import com.progracol.core.network.response.ActImagenItemResponse
import com.progracol.hya.R

class ImagenAdapter(
    val context: Context,
    val onItemSelected: (item: ActImagenItemResponse, position: Int) -> Unit
) : ListAdapter<ActImagenItemResponse, ImagenAdapter.ViewHolder>(object: DiffUtil.ItemCallback<ActImagenItemResponse>(){

    override fun areItemsTheSame(oldItem: ActImagenItemResponse, newItem: ActImagenItemResponse): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: ActImagenItemResponse, newItem: ActImagenItemResponse): Boolean {
        return oldItem.id == newItem.id
    }
}){
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.item_imagen, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val imagen = getItem(position)

        Glide
            .with(context)
            .load("data:${imagen.tipo};base64,${imagen.url}")
            .centerCrop()
            .apply(RequestOptions.bitmapTransform(RoundedCorners(14)))
            .placeholder(com.progracol.core.R.drawable.placeholder)
            .into(holder.imagenActImagenView);

        holder.imagenActImagenView.setOnClickListener {
            onItemSelected(imagen,position)
        }
        holder.captionTextView.text = "${imagen.id} - Imágen ${position + 1}"
    }

    class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val imagenActImagenView: ImageView = itemView.findViewById(R.id.imagen_act)
        val captionTextView: TextView = itemView.findViewById(R.id.caption_imagen)
    }

}
