package com.progracol.hya.ui.map.sync

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import androidx.fragment.app.viewModels
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.common.UploadStatus
import com.progracol.core.network.Resource
import com.progracol.hya.R

import com.progracol.hya.databinding.FragmentSyncBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class   SyncFragment : BottomSheetDialogFragment() {

    private lateinit var binding: FragmentSyncBinding
    private val viewModel: SyncViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentSyncBinding.inflate(inflater, container, false)

        binding.syncButton.setOnClickListener { sync() }
        addObservers()

        return binding.root
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun sync() {
        viewModel.sync().observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.syncButton.text = resources.getText(R.string.synchronization)
                    binding.syncButton.isEnabled = false
                }
                Resource.Status.SUCCESS -> {
                    binding.syncButton.text = resources.getText(R.string.sync)
                    binding.syncButton.isEnabled = true
                    //messageDialog.showMessage(resources.getString(R.string.success_sync))
                }
                Resource.Status.ERROR -> {
                    binding.syncButton.text = resources.getText(R.string.sync)
                    binding.syncButton.isEnabled = true
                    //messageDialog.showErrorMessage(resources.getString(R.string.error_sync))
                }
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private fun addObservers() {
        viewModel.subscription.observe(viewLifecycleOwner) { subscriptions ->
            binding.totalSubscription.text = "Total suscripciones: (${
                subscriptions.count { it.status == UploadStatus.UPLOADED.status }
            }/${
                subscriptions.count()
            })"
        }
        viewModel.novelties.observe(viewLifecycleOwner) { novelties ->
            binding.totalNovelty.text = "Total novedades: (${
                novelties.count { it.status == UploadStatus.UPLOADED.status }
            }/${
                novelties.count()
            })"
        }
        viewModel.independences.observe(viewLifecycleOwner) { independences ->
            binding.totalIndependence.text = "Total independencias: (${
                independences.count { it.status == UploadStatus.UPLOADED.status }
            }/${
                independences.count()
            })"
        }
        viewModel.points.observe(viewLifecycleOwner) { points ->
            binding.totalPoint.text = "Total puntos nuevos: (${
                points.count { it.status == UploadStatus.UPLOADED.status }
            }/${
                points.count()
            })"
        }
        viewModel.loadPendingSubscriptionNoveltyIndependence()
    }

}