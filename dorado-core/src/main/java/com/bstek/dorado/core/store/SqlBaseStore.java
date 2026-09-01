package com.bstek.dorado.core.store;

import java.sql.Connection;

public interface SqlBaseStore {

	Connection getConnection() throws Exception;

}
