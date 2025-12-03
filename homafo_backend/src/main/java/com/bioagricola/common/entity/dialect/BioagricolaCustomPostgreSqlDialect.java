package com.bioagricola.common.entity.dialect;

import java.sql.Types;

import org.hibernate.dialect.PostgreSQL10Dialect;

public class BioagricolaCustomPostgreSqlDialect extends PostgreSQL10Dialect {

	public BioagricolaCustomPostgreSqlDialect() {
	        this.registerColumnType(Types.JAVA_OBJECT, "jsonb");
	    }
}
