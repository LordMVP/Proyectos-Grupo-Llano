package com.progracol

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.ui.AppBarConfiguration
import com.facebook.stetho.Stetho
import com.google.firebase.FirebaseApp
import com.progracol.aforos.ui.MainAforosActivity
import com.progracol.core.R
import com.progracol.core.common.HomeListener
import com.progracol.hya.ui.MainHYAActivity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : AppCompatActivity(), HomeListener {

    private lateinit var appBarConfiguration: AppBarConfiguration
   // private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Stetho.initializeWithDefaults(applicationContext)
        FirebaseApp.initializeApp(applicationContext)

        supportFragmentManager.addOnBackStackChangedListener {
            val fm = supportFragmentManager
            Log.e("MainActivity", fm.backStackEntryCount.toString())
        }


        /*binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val navController = findNavController(R.id.nav_host_fragment_content_main)
        appBarConfiguration = AppBarConfiguration(navController.graph)
        setupActionBarWithNavController(navController, appBarConfiguration)

        binding.fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null).show()
        }*/
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        //menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        //return when (item.itemId) {
         //   R.id.action_settings -> true
         //   else -> super.onOptionsItemSelected(item)
        //}
        return false
    }

    override fun onSupportNavigateUp(): Boolean {
        //val navController = findNavController(R.id.nav_host_fragment_content_main)
        //return navController.navigateUp(appBarConfiguration)
        //        || super.onSupportNavigateUp()
        return false
    }

    override fun showHYA() {
        val intent = Intent(this, MainHYAActivity::class.java)
        startActivity(intent)
    }

    override fun showAforos() {
        val intent = Intent(this, MainAforosActivity::class.java)
        startActivity(intent)
    }
}