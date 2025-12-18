package com.progracol.aforos.ui.visit.sync

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.progracol.aforos.R
import com.progracol.aforos.common.VisitType
import com.progracol.aforos.databinding.FragmentSyncAforoBinding
import com.progracol.aforos.ui.visit.VisitFragment
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseBottomSheetDialogFragment

class SyncAforoFragment : BaseBottomSheetDialogFragment() {

    private lateinit var binding: FragmentSyncAforoBinding
    private val viewModel: SyncAforoViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSyncAforoBinding.inflate(inflater, container, false)

        binding.syncButton.setOnClickListener { sync() }
        addObservers()

        return binding.root
    }

    private fun sync() {
        viewModel.sync().observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                    binding.syncButton.text = resources.getText(R.string.synchronization)
                    binding.syncButton.isEnabled = false
                }
                Resource.Status.SUCCESS -> {
                    (parentFragment as? VisitFragment)?.onPullToRefresh()
                    binding.syncButton.text = resources.getText(R.string.sync_up)
                    binding.syncButton.isEnabled = true
                    messageDialog.showMessage(it.message ?: resources.getString(R.string.success_sync))
                }
                Resource.Status.ERROR -> {
                    binding.syncButton.text = resources.getText(R.string.sync_up)
                    binding.syncButton.isEnabled = true
                    messageDialog.showWarningMessage(it.message ?: resources.getString(R.string.error_sync))
                }
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private fun addObservers() {
        viewModel.completeVisit.observe(viewLifecycleOwner) { visits ->
            Log.e("sync_complete", visits.toString())
            binding.totalUploadedVisit.text = "Total visitas realizadas: (${
                visits.count { it.updatedTime != null && it.status == VisitType.VISIT_UPLOADED.status }
            }/${
                visits.count()
            })"
        }
        viewModel.canceledVisit.observe(viewLifecycleOwner) { visits ->
            Log.e("sync_canceled", visits.toString())
            binding.totalCanceledVisit.text = "Total visitas canceladas: (${
                visits.count { it.updatedTime != null && it.status == VisitType.VISIT_UPLOADED.status }
            }/${
                visits.count()
            })"
        }
        viewModel.loadPendingVisits()
    }

}