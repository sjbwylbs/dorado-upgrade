package com.bstek.dorado.console.jdbc;

import static org.assertj.core.api.Assertions.assertThatNoException;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.jupiter.api.Test;

class JdbcUtilsTest {

	@Test
	void should_close_connection_without_error() {
		Connection con = createProxy(Connection.class, (proxy, method, args) -> null);
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeConnection(con));
	}

	@Test
	void should_handle_null_connection() {
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeConnection(null));
	}

	@Test
	void should_handle_sql_exception_on_close_connection() {
		Connection con = createProxy(Connection.class, (proxy, method, args) -> {
			if ("close".equals(method.getName())) {
				throw new SQLException("close error");
			}
			return null;
		});
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeConnection(con));
	}

	@Test
	void should_close_statement_without_error() {
		Statement stmt = createProxy(Statement.class, (proxy, method, args) -> null);
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeStatement(stmt));
	}

	@Test
	void should_handle_null_statement() {
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeStatement(null));
	}

	@Test
	void should_handle_sql_exception_on_close_statement() {
		Statement stmt = createProxy(Statement.class, (proxy, method, args) -> {
			if ("close".equals(method.getName())) {
				throw new SQLException("close error");
			}
			return null;
		});
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeStatement(stmt));
	}

	@Test
	void should_close_resultSet_without_error() {
		ResultSet rs = createProxy(ResultSet.class, (proxy, method, args) -> null);
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeResultSet(rs));
	}

	@Test
	void should_handle_null_resultSet() {
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeResultSet(null));
	}

	@Test
	void should_handle_sql_exception_on_close_resultSet() {
		ResultSet rs = createProxy(ResultSet.class, (proxy, method, args) -> {
			if ("close".equals(method.getName())) {
				throw new SQLException("close error");
			}
			return null;
		});
		assertThatNoException().isThrownBy(() -> JdbcUtils.closeResultSet(rs));
	}

	@SuppressWarnings("unchecked")
	private static <T> T createProxy(Class<T> iface, InvocationHandler handler) {
		return (T) Proxy.newProxyInstance(JdbcUtilsTest.class.getClassLoader(), new Class<?>[] { iface }, handler);
	}
}
