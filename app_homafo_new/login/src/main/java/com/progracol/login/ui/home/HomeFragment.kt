package com.progracol.login.ui.home

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import com.progracol.core.common.HomeListener
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.login.BuildConfig
import com.progracol.login.R
import com.progracol.login.databinding.HomeFragmentBinding

class HomeFragment : BaseFragment(
    "H&A",
    isHome = true
){

    lateinit var binding: HomeFragmentBinding
    private val viewModel: HomeViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = HomeFragmentBinding.inflate(inflater, container, false)

        binding.homeMenu.visibility = View.GONE

        binding.aforoButton.setOnClickListener {
            (requireActivity() as HomeListener).showAforos()
        }

        binding.haButton.setOnClickListener {
            (requireActivity() as HomeListener).showHYA()
        }

        verificarVersionApp()
        getOptionsMenu()
        configureApp()

        setBackButton(requireActivity() as MenuHost)

        return binding.root
    }

    private fun verificarVersionApp() {
        viewModel.verificarVersionApp().observe(viewLifecycleOwner) {
            when(it.status){
                Resource.Status.LOADING ->{
                }
                Resource.Status.SUCCESS ->{
                    val versionAppNueva: String = it.data.toString()
                    val pInfo = requireContext().packageManager.getPackageInfo(requireContext().packageName, 0)
                    val versionAppActual: String = pInfo.versionName
                    if (!versionAppActual.equals(versionAppNueva)) {
                        messageDialog.showErrorMessage(resources.getString(R.string.version_app_diferente))
                        viewModel.logout()
                        deleteAllImagesFromExternal(requireContext())
                        findNavController().navigate(HomeFragmentDirections.actionHomeFragmentToLoginFragment())
                    }
                }
                Resource.Status.ERROR->{
                }
            }
        }
    }

    private fun getOptionsMenu() {
        binding.message.visibility = View.GONE
        binding.homeMenu.visibility = View.VISIBLE

        viewModel.getMenuOptions().observe(viewLifecycleOwner){
            when(it.status){
                Resource.Status.LOADING ->{
                    binding.message.visibility = View.VISIBLE
                    //binding.message.text = resources.getString(R.string.loading)
                }
                Resource.Status.SUCCESS ->{
                    binding.message.visibility = View.GONE
                    binding.homeMenu.visibility = View.VISIBLE
                    //addObserver()
                }
                Resource.Status.ERROR->{
                    binding.message.visibility = View.VISIBLE
                   // binding.message.text = resources.getString(R.string.error_loading_options_menu)
                }
            }
        }
    }

    private fun configureApp() {
        viewModel.configureApp().observe(viewLifecycleOwner){
            when(it.status){
                Resource.Status.LOADING ->{
                    //binding.message.visibility = View.VISIBLE
                    //binding.message.text = "Configurando Base de datos"
                }
                Resource.Status.SUCCESS ->{
                    binding.message.visibility = View.GONE
                    binding.homeMenu.visibility = View.VISIBLE

                    binding.haButton.visibility = View.VISIBLE
                    binding.aforoButton.visibility = View.VISIBLE
                }
                Resource.Status.ERROR->{
                    //binding.message.visibility = View.VISIBLE
                    //binding.message.text = "Error al cargar los datos de parametrizacion"
                }
            }
        }
    }

    private fun logout() {
       viewModel.getPendingData().observe(viewLifecycleOwner) {
            if(it) {
                messageDialog.showOKMessage(resources.getString(R.string.confirm_logout),
                    {_, _ ->
                        viewModel.logout()
                        deleteAllImagesFromExternal(requireContext())
                        //requireActivity().finish()
                        findNavController().navigate(HomeFragmentDirections.actionHomeFragmentToLoginFragment())
                    }, {_,_ ->
                    })
            } else {
                viewModel.logout()
                //requireActivity().finish()
                findNavController().navigate(HomeFragmentDirections.actionHomeFragmentToLoginFragment())
            }
        }
    }

    override fun setBackButton(menuHost: MenuHost) {
        super.setBackButton(menuHost)
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
                menuInflater.inflate(R.menu.nav_menu_home, menu)
            }
            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if(menuItem.itemId == R.id.log_out) {
                    logout()
                }
                return true
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

    fun deleteAllImagesFromExternal(context: Context) {
        val dcimDir = context.getExternalFilesDir("DCIM")
        if (dcimDir != null && dcimDir.exists() && dcimDir.isDirectory) {
            dcimDir.listFiles()?.forEach { file ->
                if (file.isFile) {
                    file.delete()
                }
            }
        }
    }

}