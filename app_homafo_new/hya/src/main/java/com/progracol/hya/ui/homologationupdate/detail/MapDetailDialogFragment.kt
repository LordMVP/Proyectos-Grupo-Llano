package com.progracol.hya.ui.homologationupdate.detail

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.database.entities.UserMap
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentMapDetailBinding
import com.progracol.hya.databinding.FragmentMapDetailDialogBinding
import com.progracol.hya.databinding.FragmentMapOfflineDialogBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MapDetailDialogFragment(
    val userMap: UserMap
) : BottomSheetDialogFragment() {

    private lateinit var binding: FragmentMapDetailDialogBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentMapDetailDialogBinding.inflate(inflater, container, false)

        binding.mapName.text = userMap.name
        binding.creationDate.text = userMap.date

        return binding.root
    }

}