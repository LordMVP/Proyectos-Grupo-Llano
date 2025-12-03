package com.llanoGas.microservicio.services;
import java.util.List;

import com.llanoGas.microservicio.Entity.Irc_imprecaudocomision;
import com.llanoGas.microservicio.Entity.Prc_parecaudocomision;
import com.llanoGas.microservicio.Entity.Tido_tipdocumen;
public interface Irc_imprecaudocomisionService {
public List<Irc_imprecaudocomision> impuesto();
public Irc_imprecaudocomision findById(int id);
public List<Irc_imprecaudocomision> datosestado1();

public List<Irc_imprecaudocomision>  save(List<Irc_imprecaudocomision> irc_imprecaudocomision);

public List<Prc_parecaudocomision> lista();

public void delete(List<Irc_imprecaudocomision> irc_imprecaudocomisio);
}
