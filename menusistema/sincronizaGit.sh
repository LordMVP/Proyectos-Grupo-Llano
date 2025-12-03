#!/bin/bash
# Sincronización de Los repositorios de Menu  Y Sistema

# AUtor : Leonardo Malaver Rubio 
# Fecha : 2016-01-08
clear
echo "============== Log Ultima Actualización ================================================================" 
cat /var/www/html/achagua/logSincronizacion
echo "========================================================================================================"


echo "*************     MENU ACTUALIZACION MENU/Sistema *********"
echo "*        1. Actualizar Menú                               *"
echo "*        2. Actualizar Sistema                            *"
echo "*        3. Actualizar Menú y Sistema                     *"
echo "*        4. Actualizar Tercer/Facturacion Excel. Proveed. *"
#echo "*        5. Actualizar Tecsoft                            *"
echo "*        0. Salir                                         *"
echo "***********************************************************"
echo " Ingrese Opción de Actualización : "
read opcion

if (($opcion ==1)) || (($opcion==3)) || (($opcion==2)) || (($opcion==5))  || (($opcion==4))  
 then 
  echo $(date +%Y-%m-%d' '%H:%M:%S) ':: Inicio Proceso Actualización ' > /var/www/html/achagua/logSincronizacion
fi 

if (($opcion ==1)) || (($opcion==3)) 
      then   
	echo " **** SINCRONIZANDO MENU **** " >> /var/www/html/achagua/logSincronizacion 
        cd /var/www/html/achagua/
	git reset --hard
	git pull >>/var/www/html/achagua/logSincronizacion 
	echo 'Atualizando Parámetros de Conexion Menu'
	cat config_back.php>config.php
        echo " *** FIN SINCRONIZACION MENU ****"   
	 
fi 

if (($opcion ==2)) || (($opcion ==3))
        then
	echo " **** SINCRONIZANDO SISTEMA **** ">> /var/www/html/achagua/logSincronizacion 
	cd /var/www/html/achagua/sistema/
	git reset --hard 
	git pull >> /var/www/html/achagua/logSincronizacion 
	echo " Elminando DIrectorio de Cache de Symfony"  >> /var/www/html/achagua/logSincronizacion 
	cd /var/www/html/achagua/sistema/app/
	rm -rf cache >> /var/www/html/achagua/logSincronizacion 
	cd /var/www/html/achagua/
        echo " **** FIN SINCRONIZACIÓN SISTEMA **** "
fi

if (($opcion ==4))
        then
        echo " **** SINCRONIZANDO TERCERO/FACTURACION  **** ">> /var/www/html/achagua/logSincronizacion 
        cd /var/www/html/achagua/facturacion/
        git reset --hard 
        git pull >> /var/www/html/achagua/logSincronizacion 
        echo " Elminando DIrectorio de Cache de Symfony"  >> /var/www/html/achagua/logSincronizacion  
        cd /var/www/html/achagua/sistema/app/modelo
        touch jConf.php
        cat /var/www/html/achagua/facturacion/app/modelo/jConf_Muestra_Original.php > /var/www/html/achagua/facturacion/app/modelo/jConf.php
        cd /var/www/html/achagua/
        echo " **** FIN SINCRONIZACI ^ N TERCERO/FACTURACION  **** "
fi

# if (($opcion ==5)) 
#      then
#     	echo " **** SINCRONIZANDO TERCSOFT   **** ">> /var/www/html/achagua/logSincronizacion
#        cd /var/www/html/tecnico/
#        git reset --hard
#        git pull >> /var/www/html/achagua/logSincronizacion
#        echo " Elminando DIrectorio de Cache de Symfony"  >> /var/www/html/achagua/logSincronizacion
#        cd /var/www/html/achagua/
#        echo " **** FIN SINCRONIZACI ^ N TECSOFT  **** "   
#      
# fi

echo $(date +%Y-%m-%d' '%H:%M:%S) ':: Fin  Proceso Actualizacin' >> /var/www/html/achagua/logSincronizacion

if (($opcion != 0))
 then 
 . /var/www/html/achagua/sincronizaGit.sh 
fi 

