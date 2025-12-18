package com.progracol.aforos.ui.novelty.bottomsheets

import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.progracol.aforos.R
import com.progracol.aforos.ui.novelty.NoveltyViewModel

class CapacityNoveltiesFragment : Fragment() {

    companion object {
        fun newInstance() = CapacityNoveltiesFragment()
    }

    private lateinit var viewModel: NoveltyViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_novelty, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProvider(this).get(NoveltyViewModel::class.java)
        // TODO: Use the ViewModel
    }

}