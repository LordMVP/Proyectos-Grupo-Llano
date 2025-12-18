package com.progracol.hya.ui.map.offline

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.database.entities.UserMap
import com.progracol.core.network.Resource
import com.progracol.hya.databinding.FragmentMapOfflineDialogBinding
import com.progracol.hya.ui.map.MapViewModel
import java.time.LocalDate


class MapOfflineDialogFragment : BottomSheetDialogFragment() {
    private lateinit var binding: FragmentMapOfflineDialogBinding
    private val viewModel: MapViewModel by activityViewModels()

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentMapOfflineDialogBinding.inflate(inflater, container, false)
        dialog?.setCancelable(false)
        binding.saveButton.setOnClickListener {
            //save()
        }

        return binding.root
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun save() {
        viewModel.mapName = binding.mapName.text.toString()
        val newUserMap = UserMap(
            name = viewModel.mapName,
            path = viewModel.path,
            date = LocalDate.now().toString()
        )
        viewModel.saveUserMap(newUserMap).observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {}
                Resource.Status.SUCCESS -> findNavController().popBackStack()
                Resource.Status.ERROR -> error("Error al guardar el mapa.")
            }
        }

    }
}