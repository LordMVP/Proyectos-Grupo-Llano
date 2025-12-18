package com.progracol.aforos.ui.visit.register

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.progracol.aforos.databinding.FragmentTermsBinding
import com.progracol.core.ui.BaseBottomSheetDialogFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class TermsFragment : BaseBottomSheetDialogFragment() {

    private lateinit var binding: FragmentTermsBinding
    private val viewModel: RegisterVisitViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentTermsBinding.inflate(inflater, container, false)

        return binding.root
    }

}