package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.TidoTipdocumen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TidoTipdocumenRepository extends JpaRepository<TidoTipdocumen, Long> {

}
