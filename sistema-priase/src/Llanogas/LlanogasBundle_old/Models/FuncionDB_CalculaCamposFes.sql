
DROP FUNCTION  CalculaCamposFes(integer,integer) ;
CREATE OR REPLACE FUNCTION CalculaCamposFes(
IN factura integer ,
IN empresa integer )

RETURNS TABLE(Factura_27 numeric, sancionpormora_35 numeric,refacturado_39 numeric,
              interesesmora_40 numeric, servicios_41 numeric, otrosconceptos_42 numeric ,
              Impuesto_43 numeric , Impuesto1_44 numeric , Revqacu_45 numeric ,
              revqmines_46 numeric ,Cuota_amortizacion_g_49 numeric ,Plazo_g_50 numeric ,
              Cuotas_canceladas_g_51 numeric ,Plazo_pendiente_g_52 numeric ,Total_g_53 numeric,
              Deuda_anterior_g_54 numeric,Segvid_55 numeric ,Cuotadeamortizacion_56 numeric,
              Refacturadocartera_57  numeric,Mora_c_58 numeric,Cp_c_59 numeric ,
              Cuo_act_60 numeric, Otrosconceptoscartera_61 numeric,Totalcartera_lla_62 numeric ,
              Vencimiento_63 numeric, Des_71 numeric,Ipli_72 numeric,
              Io_73 numeric,Irst_74 numeric,Pdc_75 numeric ,
              Cc_C_76 numeric ,Interes_C_77 numeric, Int_Eacarteragas_78 numeric ,
              Ftdl_Fnr_81 numeric ,Swt_Exc_82 numeric,Nombrebarrio_85 numeric ,
              Mua_Cod_87 numeric, Lmf_Fac_88 numeric,Tipo_Aseo_89 character varying,Interesesmoraseo_90 numeric ,
              Lmf_Fecven_91 varchar(20),Mua_Cat_92 numeric, Mua_Est_93 numeric ,
              Mts_Aseo_94 numeric ,Cse_Frerec_95 numeric  ,Cse_Frebar_96 numeric, 
              Subsidio_Aseo_97 numeric,Contribucion_Aseo_98 numeric, Lmf_Totant001_99 numeric ,
              Lmf_Totant002_100 numeric ,Lmf_Totant003_101 numeric ,Lmf_Totant004_102 numeric ,
              Lmf_Totant005_103 numeric , Lmf_Totant006_104 numeric ,Lmf_Tar_105 numeric,
              Lmf_Subcon_106 numeric , Lmf_Des_107 numeric ,Lmf_Sob_108 numeric,
              Lmf_Ant_109 numeric ,Lmf_Mor_110 numeric,Lmf_Otraseo_111 numeric,
              Totalconsumo_Bio_112 numeric  ,Concepto_113 numeric ,Numcuo_114 numeric,
              Val_Cuo_115 numeric, Lmf_Tot_116 numeric,Idempresa_118 numeric ,
              Tipofactura_120 numeric,Periodofes_121 numeric ,Idmunicipio_123 numeric ,
              Idciclo_124 numeric, Idsuscriptorfes_127 numeric,Digitosmedidor_131 numeric,
              Consumo_Desa_134 numeric , Consumo_Desb_135 numeric,Fecha_Ean_136 character varying,
              Fecha_Maxrevqui_137 character varying,Fecha_Minrevqui_138 character varying, Fecha_Susrevqui_139 character varying,
              Resolucion_141 numeric ,Otrosconceptostarsub_156 numeric,Impuestotarsub_157 numeric ,
              Impuesto1Tarsub_158 numeric,Tfri_159 numeric ,Trti_160 numeric,
              Ttei_161 numeric ,Tbli_162 numeric,Tdti_163 numeric,
              Cuf_164 numeric
              ) AS
$BODY$
DECLARE
Factura_27 numeric;
SancionporMora_35 numeric;
refacturado_39  numeric;
IntereseMora_40 numeric ;
Servicios_41 numeric ;
Otrosconceptos_42 numeric ;
Impuesto_43 numeric ;
Impuesto1_44 numeric ;
Revqacu_45 numeric ;
revqmines_46 numeric ;
Cuota_amortizacion_g_49 numeric ;
Plazo_g_50 numeric ;
Cuotas_canceladas_g_51 numeric ;
Plazo_pendiente_g_52 numeric; 
Total_g_53 numeric; 
Deuda_anterior_g_54 numeric ;
Segvid_55 numeric ;
Cuotadeamortizacion_56 numeric ;
Refacturadocartera_57 numeric ;
Mora_c_58 numeric ;
Cp_c_59 numeric ;
Cuo_act_60 numeric ;
Otrosconceptoscartera_61 numeric ;
Totalcartera_lla_62 numeric ;
Vencimiento_63 numeric ;
Des_71 numeric ;
Ipli_72 numeric;
Io_73 numeric;
Irst_74 numeric;
Pdc_75 numeric;
Cc_C_76 numeric;
Interes_C_77 numeric;
Int_Eacarteragas_78 numeric;
Ftdl_Fnr_81 numeric;
Swt_Exc_82 numeric;
Nombrebarrio_85 numeric;
Mua_Cod_87 numeric;
Lmf_Fac_88 numeric;
Tipo_Aseo_89 character varying;
Interesesmoraseo_90 numeric;
Lmf_Fecven_91 varchar(20);
Mua_Cat_92 numeric;
Mua_Est_93  numeric;
Mts_Aseo_94  numeric;
Cse_Frerec_95 numeric ;
Cse_Frebar_96  numeric;
Subsidio_Aseo_97 numeric;
Contribucion_Aseo_98 numeric;
Lmf_Totant001_99 numeric ;
Lmf_Totant002_100 numeric ;
Lmf_Totant003_101 numeric ;
Lmf_Totant004_102 numeric ;
Lmf_Totant005_103 numeric ;
Lmf_Totant006_104 numeric ;
Lmf_Tar_105 numeric ;
Lmf_Subcon_106 numeric ;
Lmf_Des_107 numeric ;
Lmf_Sob_108 numeric ;
Lmf_Ant_109 numeric ;
Lmf_Mor_110 numeric ;
Lmf_Otraseo_111 numeric ;
Totalconsumo_Bio_112 numeric ;
Concepto_113 numeric ;
Numcuo_114 numeric ;
Val_Cuo_115 numeric ;
Lmf_Tot_116 numeric ;
Idempresa_118 numeric ;
Tipofactura_120 numeric ;
Periodofes_121 numeric ;
Idmunicipio_123 numeric ;
Idciclo_124 numeric ;
Idsuscriptorfes_127 numeric ;
Digitosmedidor_131 numeric ;
Consumo_Desa_134 numeric ;
Consumo_Desb_135 numeric ;
Fecha_Ean_136 character varying ;
Fecha_Maxrevqui_137 character varying ;
Fecha_Minrevqui_138 character varying ;
Fecha_Susrevqui_139 character varying ;
Resolucion_141 numeric ;
Otrosconceptostarsub_156 numeric ;
Impuestotarsub_157 numeric ;
Impuesto1Tarsub_158 numeric ;
Tfri_159 numeric ;
Trti_160 numeric ;
Ttei_161 numeric ;
Tbli_162 numeric ;
Tdti_163 numeric ;
Cuf_164 numeric ;

contador numeric ;



BEGIN
        contador := 0 ;   
        Factura_27  :=  (SELECT  0  );
        
        SancionporMora_35 := (SELECT sum(dfac.dfac_vlrtotal)  FROM fac_factura fac  
                              INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro 
				WHERE fac.fac_ideregistro = factura AND  fac.emp_ideregistro = empresa AND dfac.uni_concepto 
			        IN(95,96,97) ) ;    
        refacturado_39 :=(SELECT sum (fac.fac_sdoreal)  
                    FROM  fac_factura fac  
                        INNER JOIN doc_documento doc ON fac.uni_documento=doc.uni_documento 
                        WHERE  fac.fac_estado='A' AND  fac.fac_sdoreal > 0  AND doc.doc_tipo IN('DF','LI','SF')   
                        AND fac.fac_ideregistro = factura AND fac.emp_ideregistro= empresa ) ;
	interesesmora_40 := (SELECT sum (fac.fac_sdoreal)  
                    FROM  fac_factura fac  
                        INNER JOIN doc_documento doc ON fac.uni_documento=doc.uni_documento 
                        WHERE  fac.fac_estado='A' AND  fac.fac_sdoreal > 0  AND doc.doc_tipo ='IM'   
                        AND fac.fac_ideregistro = factura AND fac.emp_ideregistro= empresa);

       Servicios_41 :=(SELECT sum (fac.fac_sdoreal) 
                    FROM  fac_factura fac  
                        INNER JOIN doc_documento doc ON fac.uni_documento=doc.uni_documento 
                        WHERE  fac.fac_estado='A' AND  fac.fac_sdoreal > 0  AND doc.doc_tipo ='VE'   
                        AND fac.fac_ideregistro = factura AND fac.emp_ideregistro= empresa ) ; 

       Otrosconceptos_42 :=(SELECT 0  );                                          
       Impuesto_43 :=(SELECT 0  ); 
       Impuesto1_44 :=(SELECT 0  ); 
       Revqacu_45 :=(SELECT 0  );
       revqmines_46 :=(SELECT 0  ); 
       Cuota_amortizacion_g_49 :=(SELECT 0  ); 
       Plazo_g_50 :=(SELECT 0  ); 
       Cuotas_canceladas_g_51 :=(SELECT 0  ); 
       Plazo_pendiente_g_52 :=(SELECT 0  ); 
       Total_g_53 :=(SELECT 0  ); 
       Deuda_anterior_g_54  :=(SELECT 0  ); 
       Segvid_55  :=(SELECT 0  ); 
       Cuotadeamortizacion_56  :=(SELECT 0  ); 
       Refacturadocartera_57  :=(SELECT 0  ); 
       Mora_c_58  :=(SELECT 0  ); 
       Cp_c_59  :=(SELECT 0  ); 
       Cuo_act_60  :=(SELECT 0  ); 
       Otrosconceptoscartera_61  :=(SELECT 0  ); 
       Totalcartera_lla_62  :=(SELECT 0  ); 
       Vencimiento_63  :=(SELECT 0  ); 
       Des_71  :=(SELECT 0  ); 
       Ipli_72 :=(SELECT 0  ); 
       Io_73 :=(SELECT 0  ); 
       Irst_74 :=(SELECT 0  ); 
       Pdc_75 :=(SELECT 0  ); 
       Cc_C_76 :=(SELECT 0  ); 
       Interes_C_77 :=(SELECT 0  ); 
       Int_Eacarteragas_78 :=(SELECT 0  ); 
       Ftdl_Fnr_81 :=(SELECT 0  ); 
       Swt_Exc_82 :=(SELECT   sum(dfac.dfac_vlrtotal)  
                FROM fac_factura fac  
                  INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro 
                WHERE fac.fac_ideregistro = factura AND  fac.emp_ideregistro = empresa AND dfac.uni_concepto = 312 ); 
       Nombrebarrio_85 :=(SELECT 0  ); 
       Mua_Cod_87 :=(SELECT 0  ); 
       Lmf_Fac_88 :=(SELECT 0  ); 
       Tipo_Aseo_89 :=(SELECT ''  ); 
       Interesesmoraseo_90 :=(SELECT 0  ); 
       Lmf_Fecven_91 :=(SELECT ''  ); 
       Mua_Cat_92 :=(SELECT 0  ); 
       Mua_Est_93  :=(SELECT 0  ); 
       Mts_Aseo_94 :=(SELECT 0  ); 
       Cse_Frerec_95 :=(SELECT 0  ); 
       Cse_Frebar_96 :=(SELECT 0  ); 
       Subsidio_Aseo_97 :=(SELECT 0  ); 
       Contribucion_Aseo_98 :=(SELECT 0  ); 
       Lmf_Totant001_99  :=(SELECT 0  ); 
       Lmf_Totant002_100  :=(SELECT 0  ); 
       Lmf_Totant003_101  :=(SELECT 0  ); 
       Lmf_Totant004_102  :=(SELECT 0  ); 
       Lmf_Totant005_103  :=(SELECT 0  ); 
       Lmf_Totant006_104  :=(SELECT 0  ); 
       Lmf_Tar_105  :=(SELECT 0  ); 
       Lmf_Subcon_106 :=(SELECT 0  ); 
       Lmf_Des_107 :=(SELECT 0  ); 
       Lmf_Sob_108 :=(SELECT 0  ); 
       Lmf_Ant_109 :=(SELECT 0  ); 
       Lmf_Mor_110 :=(SELECT 0  ); 
       Lmf_Otraseo_111 :=(SELECT 0  ); 
       Totalconsumo_Bio_112 :=(SELECT 0  ); 
       Concepto_113 :=(SELECT 0  ); 
       Numcuo_114 :=(SELECT 0  ); 
       Val_Cuo_115 :=(SELECT 0  ); 
       Lmf_Tot_116 :=(SELECT 0  ); 
       Idempresa_118 :=(SELECT 0  ); 
       Tipofactura_120 :=(SELECT 0  ); 
       Periodofes_121 :=(SELECT 0  ); 
       Idmunicipio_123 :=(SELECT 0  ); 
       Idciclo_124 :=(SELECT 0  ); 
       Idsuscriptorfes_127 :=(SELECT 0  ); 
       Digitosmedidor_131 :=(SELECT 0  ); 
       Consumo_Desa_134 :=(SELECT 0  ); 
       Consumo_Desb_135 :=(SELECT 0  ); 
       Fecha_Ean_136 :=(SELECT 'q'  ); 
       Fecha_Maxrevqui_137 :=(SELECT ''  ); 
       Fecha_Minrevqui_138 :=(SELECT ''  ); 
       Fecha_Susrevqui_139 :=(SELECT ''  ); 
       Resolucion_141 := (SELECT 0  ); 
       Otrosconceptostarsub_156 :=(SELECT 0  ); 
       Impuestotarsub_157 :=(SELECT 0  ); 
       Impuesto1Tarsub_158 :=(SELECT 0  ); 
       Tfri_159 :=(SELECT 0  ); 
       Trti_160 :=(SELECT 0  ); 
       Ttei_161 :=(SELECT 0  ); 
       Tbli_162 :=(SELECT 0  ); 
       Tdti_163 :=(SELECT 0  ); 
       Cuf_164 :=(SELECT 0  ); 
       


                          
RETURN QUERY
 select Factura_27 , SancionporMora_35,refacturado_39 ,
	interesesmora_40,Servicios_41 ,Otrosconceptos_42,
	Impuesto_43, Impuesto1_44,Revqacu_45 ,
	revqmines_46 ,Cuota_amortizacion_g_49,Plazo_g_50 ,
	Cuotas_canceladas_g_51,Plazo_pendiente_g_52,Total_g_53,
        Deuda_anterior_g_54,Segvid_55,Cuotadeamortizacion_56,
        Refacturadocartera_57,Mora_c_58, Cp_c_59,
        Cuo_act_60, Otrosconceptoscartera_61,Totalcartera_lla_62,
        Vencimiento_63,Des_71,Ipli_72 ,
        Io_73, Irst_74,Pdc_75,
        Cc_C_76,Interes_C_77, Int_Eacarteragas_78,
        Ftdl_Fnr_81,Swt_Exc_82,Nombrebarrio_85,
        Mua_Cod_87,Lmf_Fac_88 ,Tipo_Aseo_89,Interesesmoraseo_90,
        Lmf_Fecven_91, Mua_Cat_92,Mua_Est_93,
        Mts_Aseo_94, Cse_Frerec_95,Cse_Frebar_96 ,
        Subsidio_Aseo_97,Contribucion_Aseo_98,Lmf_Totant001_99 ,
        Lmf_Totant002_100, Lmf_Totant003_101 ,Lmf_Totant004_102,
        Lmf_Totant005_103, Lmf_Totant006_104  ,Lmf_Tar_105,
        Lmf_Subcon_106, Lmf_Des_107,Lmf_Sob_108,
        Lmf_Ant_109, Lmf_Mor_110 ,Lmf_Otraseo_111,
        Totalconsumo_Bio_112, Concepto_113,Numcuo_114,
        Val_Cuo_115, Lmf_Tot_116 ,Idempresa_118,
        Tipofactura_120 , Periodofes_121, Idmunicipio_123,
        Idciclo_124, Idsuscriptorfes_127 ,Digitosmedidor_131,
        Consumo_Desa_134 ,Consumo_Desb_135 , Fecha_Ean_136 , 
        Fecha_Maxrevqui_137, Fecha_Minrevqui_138,Fecha_Susrevqui_139 ,
        Resolucion_141,  Otrosconceptostarsub_156,Impuestotarsub_157, 
        Impuesto1Tarsub_158 , Tfri_159,Trti_160,
        Ttei_161, Tbli_162,Tdti_163,
        Cuf_164;

END;
        $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1;
ALTER FUNCTION consultarfacturasconsaldo(integer, integer, integer)
  OWNER TO postgres;
