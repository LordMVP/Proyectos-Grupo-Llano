package com.progracol.hya.ui.base.adapter

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.progracol.hya.ui.form.detail.DetailFragment
import com.progracol.hya.ui.form.independence.IndependenceFragment
import com.progracol.hya.ui.form.novelty.NoveltyFragment
import com.progracol.hya.ui.form.point.PointFragment

class ViewPagerAdapter(
    activity: FragmentActivity,
    private val posFragments: List<String>
) : FragmentStateAdapter(activity) {

    private val fragments: MutableList<Fragment> = mutableListOf()
    val tabTitles: MutableList<String> = mutableListOf()

    init {
        posFragments.forEach { pos ->
            val elemento = pos.toInt()
            when (elemento) {
                0 -> {
                    fragments.add(DetailFragment())
                    tabTitles.add("Registro Actualización")
                }
                1 -> {
                    fragments.add(IndependenceFragment())
                    tabTitles.add("Registro Independencia")
                }
                2 -> {
                    fragments.add(NoveltyFragment())
                    tabTitles.add("Registro Novedad")
                }
                3 -> {
                    fragments.add(PointFragment())
                    tabTitles.add("Registro Punto Nuevo")
                }
            }
        }
    }

    override fun getItemCount(): Int = fragments.size

    override fun createFragment(position: Int): Fragment = fragments[position]
}