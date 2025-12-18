package com.progracol.aforos.ui.visit.assignment

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.aforos.R
import com.progracol.aforos.common.MapDetail
import com.progracol.aforos.databinding.FragmentAssignmentMapDetailBinding
import com.progracol.aforos.databinding.FragmentAssignmentVisitBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class AssignmentMapDetailFragment(
    private val mapDetail: MapDetail
) : BottomSheetDialogFragment() {

    private lateinit var binding: FragmentAssignmentMapDetailBinding
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<View>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =  FragmentAssignmentMapDetailBinding.inflate(inflater, container, false)

        binding.contractName.text = mapDetail.contractName
        binding.subscriberName.text =  mapDetail.consumerName
        binding.establishment.text = mapDetail.establishment
        binding.code.text = mapDetail.code
        binding.cadastral.text = mapDetail.cadastral
        binding.activityType.text = mapDetail.activityType
        binding.neighborhood.text = mapDetail.neighborhood
        binding.address.text = mapDetail.address
        binding.stratum.text = mapDetail.stratum
        binding.propertyUse.text = mapDetail.propertyUse
        binding.creationDate.text = mapDetail.creationDate
        binding.latitude.text = mapDetail.latitude
        binding.longitude.text = mapDetail.longitude


        binding.closeButton.setOnClickListener { this.dismiss() }

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        bottomSheetBehavior = BottomSheetBehavior.from(view.parent as View)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED

    }
}