package com.progracol.hya.ui.map.imagen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.bumptech.glide.Glide
import com.progracol.core.network.response.ActImagenItemResponse
import com.progracol.hya.databinding.DialogImagePreviewBinding
import com.progracol.hya.databinding.FragmentDataSyncBinding

class ImagePreviewDialogFragment(
    private val imagen: ActImagenItemResponse,
    private val position : Int
) : DialogFragment() {

    private lateinit var binding: DialogImagePreviewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Hacer el fondo transparente
        setStyle(STYLE_NO_FRAME, android.R.style.Theme_Translucent_NoTitleBar)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        binding = DialogImagePreviewBinding.inflate(inflater, container, false)

        Glide.with(requireContext())
            .load("data:${imagen.tipo};base64,${imagen.url}")
            .into(binding.previewImage)

        binding.captionImagenPreview.text = "${imagen.id} - Imágen ${position + 1}"
        binding.btnClosePreview.setOnClickListener { dismiss() }

        return binding.root
    }
}
