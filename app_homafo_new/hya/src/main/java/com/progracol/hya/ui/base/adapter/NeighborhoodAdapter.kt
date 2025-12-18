package com.progracol.hya.ui.base.adapter

import android.app.Activity
import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Filter
import android.widget.TextView
import androidx.annotation.LayoutRes
import com.progracol.core.database.entities.ParamNeighborhood

class NeighborhoodAdapter(context: Context,
                          @LayoutRes private val layoutResource: Int,
                          var values: List<ParamNeighborhood>) : ArrayAdapter<ParamNeighborhood>(context, layoutResource, values)  {

    private val neighborhoods: MutableList<ParamNeighborhood> = ArrayList(values)
    private var allNeighborhoods: List<ParamNeighborhood> = ArrayList(values)
    var neighborhoodSelected: ParamNeighborhood? = null

    override fun getCount() = neighborhoods.size

    override fun getItem(position: Int) = neighborhoods[position]

    override fun getItemId(position: Int) = neighborhoods[position].code.toLong()

    fun updateData(data: List<ParamNeighborhood>) {
        neighborhoods.clear()
        neighborhoods.addAll(data)
        allNeighborhoods = data
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var convertView = convertView
        if (convertView == null) {
            val inflater = (context as Activity).layoutInflater
            convertView = inflater.inflate(layoutResource, parent, false)
        }
        try {
            val neighborhood = getItem(position)
            val neighborhoodAutoCompleteView = convertView as TextView
            neighborhoodAutoCompleteView.text = neighborhood.name
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return convertView!!
    }

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun convertResultToString(resultValue: Any) :String {
                return (resultValue as ParamNeighborhood).name ?: ""
            }
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filterResults = FilterResults()
                if (constraint != null) {
                    val neighborhoodSuggestion: MutableList<ParamNeighborhood> = ArrayList()
                    for (neighborhood in allNeighborhoods) {
                        if (neighborhood.name!!.lowercase().contains(constraint.toString().lowercase())) {
                            neighborhoodSuggestion.add(neighborhood)
                        }
                    }
                    filterResults.values = neighborhoodSuggestion
                    filterResults.count = neighborhoodSuggestion.size
                }
                return filterResults
            }
            override fun publishResults(constraint: CharSequence?, results: FilterResults) {
                neighborhoods.clear()
                if (results.count > 0) {
                    for (result in results.values as List<*>) {
                        if (result is ParamNeighborhood) {
                            neighborhoods.add(result)
                        }
                    }
                    notifyDataSetChanged()
                } else if (constraint == null) {
                    neighborhoods.addAll(allNeighborhoods)
                    notifyDataSetInvalidated()
                }
            }
        }
    }

}