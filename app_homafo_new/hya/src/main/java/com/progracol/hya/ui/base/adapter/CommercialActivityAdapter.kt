package com.progracol.hya.ui.base.adapter

import android.app.Activity
import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Filter
import android.widget.TextView
import androidx.annotation.LayoutRes
import com.progracol.core.database.entities.ParamCommercialActivity

class CommercialActivityAdapter(context: Context,
                                @LayoutRes private val layoutResource: Int,
                                var values: List<ParamCommercialActivity>) : ArrayAdapter<ParamCommercialActivity>(context, layoutResource, values)  {

    private val commercialsActivities: MutableList<ParamCommercialActivity> = ArrayList(values)
    private var allCommercialsActivities: List<ParamCommercialActivity> = ArrayList(values)
    var commercialActivitySelected: ParamCommercialActivity? = null

    override fun getCount() = commercialsActivities.size

    override fun getItem(position: Int) = commercialsActivities[position]

    override fun getItemId(position: Int) = commercialsActivities[position].code.toLong()

    fun updateData(data: List<ParamCommercialActivity>) {
        commercialsActivities.clear()
        commercialsActivities.addAll(data)
        allCommercialsActivities = data
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var convertView = convertView
        if (convertView == null) {
            val inflater = (context as Activity).layoutInflater
            convertView = inflater.inflate(layoutResource, parent, false)
        }
        try {
            val commercialActivity = getItem(position)
            val commercialActivityAutoCompleteView = convertView as TextView
            commercialActivityAutoCompleteView.text = commercialActivity.name
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return convertView!!
    }

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun convertResultToString(resultValue: Any) :String {
                return (resultValue as ParamCommercialActivity).name ?: ""
            }
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filterResults = FilterResults()
                if (constraint != null) {
                    val commercialActivitySuggestion: MutableList<ParamCommercialActivity> = ArrayList()
                    for (commercialActivity in allCommercialsActivities) {
                        if (commercialActivity.name!!.lowercase().contains(constraint.toString().lowercase())) {
                            commercialActivitySuggestion.add(commercialActivity)
                        }
                    }
                    filterResults.values = commercialActivitySuggestion
                    filterResults.count = commercialActivitySuggestion.size
                }
                return filterResults
            }
            override fun publishResults(constraint: CharSequence?, results: FilterResults) {
                commercialsActivities.clear()
                if (results.count > 0) {
                    for (result in results.values as List<*>) {
                        if (result is ParamCommercialActivity) {
                            commercialsActivities.add(result)
                        }
                    }
                    notifyDataSetChanged()
                } else if (constraint == null) {
                    commercialsActivities.addAll(allCommercialsActivities)
                    notifyDataSetInvalidated()
                }
            }
        }
    }

}