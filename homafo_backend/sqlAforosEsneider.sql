--creacion ode funcion para obtener los parametros de aforos
CREATE OR REPLACE FUNCTION aseo.fn_getparametrosaforossolo(empresa integer)
 RETURNS TABLE(llave text, valor text)
 LANGUAGE plpgsql
AS $function$
	BEGIN
     RETURN QUERY
     SELECT resultado.key as llave, resultado.value::TEXT as valor
     FROM par_parametro , json_each(par_parametro->'AFOROS_VARIOS') as resultado
     WHERE emp_ideregistro = empresa;     
	END
$function$
;
