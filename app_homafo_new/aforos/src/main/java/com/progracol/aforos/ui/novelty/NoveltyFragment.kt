package com.progracol.aforos.ui.novelty

import android.os.Bundle
import android.view.*
import androidx.fragment.app.viewModels
import com.progracol.aforos.R
import com.progracol.aforos.databinding.FragmentNoveltyBinding
import com.progracol.core.ui.BaseFragment

class NoveltyFragment : BaseFragment("Aforos") {

    private val viewModel: NoveltyViewModel by viewModels()
    private lateinit var binding: FragmentNoveltyBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentNoveltyBinding.inflate(inflater, container, false)

        //binding.map.map = viewModel.map

        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.nav_menu_novelties, menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when(item.itemId){
            R.id.visualization_of_capacity ->{
                //findNavController().navigate(CapacityNoveltiesFragmentDirections.actionCapacityNoveltiesFragmentToBottomSheetFragment())
            }
            R.id.base_map ->{
                //findNavController().navigate(CapacityNoveltiesFragmentDirections.actionCapacityNoveltiesFragmentToBaseMapFragment())
            }
            R.id.number_reports ->{
                //findNavController().navigate(CapacityNoveltiesFragmentDirections.actionCapacityNoveltiesFragmentToNumberReportsFragment())
            }
        }
        return false
    }

}