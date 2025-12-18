package com.progracol.hya.ui.form.novelty

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AutoCompleteTextView
import android.widget.CheckBox
import android.widget.LinearLayout
import androidx.fragment.app.activityViewModels
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.BaseEntity
import com.progracol.core.database.entities.Novelty
import com.progracol.core.database.entities.ParamNoveltyResultType
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.ui.BasicAdapter
import com.progracol.core.ui.gallery.GalleryFragment
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentNoveltyFormBinding
import com.progracol.hya.databinding.FragmentNoveltyListBinding
import com.progracol.hya.ui.base.adapter.NoveltyAdapter
import com.progracol.hya.ui.form.FormViewModel
import com.progracol.hya.ui.form.detail.DetailFragment
import java.text.SimpleDateFormat
import java.util.*

class NoveltyFragment : BaseFragment() {

    private val viewModel: FormViewModel by activityViewModels()
    private lateinit var binding: FragmentNoveltyListBinding

    private lateinit var noveltyAdapter: NoveltyAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentNoveltyListBinding.inflate(inflater, container, false)

        loadNovelties()
        addObserver()

        noveltyAdapter = NoveltyAdapter(requireContext()) {

        }
        binding.noveltyList.adapter = noveltyAdapter

        binding.newNoveltyButton.setOnClickListener {
            newNovelty()
        }

        return binding.root
    }

    private fun newNovelty() {
        val noveltyFormFragment = NoveltyFormFragment()
        viewModel.newNovelty()
        noveltyFormFragment.show(parentFragmentManager, NoveltyFragment::class.simpleName)
    }

    private fun loadNovelties() {
        viewModel.getNoveltiesBySubscriptionId().observe(viewLifecycleOwner) {
            Log.e("fragment", it.toString())
        }
    }

    private fun addObserver() {
        viewModel.novelties.observe(viewLifecycleOwner) {
            noveltyAdapter.submitList(it)
        }
    }

}