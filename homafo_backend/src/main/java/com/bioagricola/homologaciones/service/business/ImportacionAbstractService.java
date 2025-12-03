package com.bioagricola.homologaciones.service.business;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.common.util.ImcolTipoProcesoResolucionUtil;
import com.bioagricola.common.util.SQLBuilderUtil;
import com.bioagricola.common.util.SpreadsheetUtil;
import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;
import com.google.gson.Gson;

public abstract class ImportacionAbstractService {

	@Autowired
	protected ImcolTipoProcesoResolucionUtil resolucionUtil;
	@Autowired
	protected SQLBuilderUtil sqlBuilderUtil;
	@Autowired
	protected GenericSQLRepository genericSqlRepository;
	@Autowired
	protected Gson gson;
	@Autowired
	protected AuthenticationFacade authenticationFacade;
	protected SpreadsheetUtil spreadsheetUtil;
	protected HashMap<String, String> columnsSwap;
	protected ImarcArchivosImportacion imarc;
}
