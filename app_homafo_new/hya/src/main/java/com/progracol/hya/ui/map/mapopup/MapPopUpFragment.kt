package com.progracol.hya.ui.map.mapopup

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.progracol.core.ui.BaseFragment
import com.progracol.hya.databinding.FragmentMapPopUpBinding

class MapPopUpFragment : BaseFragment() {

    private val viewModel: MapPopUpViewModel by viewModels()
    private lateinit var binding: FragmentMapPopUpBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentMapPopUpBinding.inflate(inflater, container, false)

        return binding.root
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        // TODO: Use the ViewModel
    }

}