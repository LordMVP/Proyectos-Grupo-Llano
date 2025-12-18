package com.progracol.hya.ui.base

import android.content.Context
import android.content.res.Resources
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.PopupWindow
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.progracol.core.util.screenRectPx
import com.progracol.hya.R

class ItemMarkerPointDialog(
    val context: Context,
    val deleteMarker: () -> Unit,
    val hideMarker: () -> Unit
) {
    fun showPopup(anchorView: View) {
        val inflater = LayoutInflater.from(context)
        val popupView = inflater.inflate(R.layout.dialog_item_marker, null)

        val popupWindow = PopupWindow(
            popupView,
            (screenRectPx.width() * 0.5F).toInt(),
            ViewGroup.LayoutParams.WRAP_CONTENT,
            true
        )

        popupWindow.setBackgroundDrawable(ContextCompat.getDrawable(context, com.progracol.core.R.drawable.background_dialog))
        popupWindow.elevation = 10f
        popupWindow.isOutsideTouchable = true
        popupWindow.isFocusable = true

        // Calcular desplazamiento horizontal para centrar debajo del botón
        anchorView.post {
            val location = IntArray(2)
            anchorView.getLocationOnScreen(location)

            val screenWidth = Resources.getSystem().displayMetrics.widthPixels
            val popupWidth = (screenWidth * 0.5F).toInt()
            popupWindow.width = popupWidth

            // Mostrar justo debajo y alineado al borde derecho del itemView (tarjeta)
            val offsetX = anchorView.width - popupWidth
            popupWindow.showAsDropDown(anchorView, offsetX, 10)
        }

        // Listeners
        popupView.findViewById<TextView>(R.id.marker_delete).setOnClickListener {
            deleteMarker()
            popupWindow.dismiss()
        }

        popupView.findViewById<TextView>(R.id.marker_hide).setOnClickListener {
            hideMarker()
            popupWindow.dismiss()
        }
    }
}