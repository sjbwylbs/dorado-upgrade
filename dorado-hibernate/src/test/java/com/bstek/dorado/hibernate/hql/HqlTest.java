package com.bstek.dorado.hibernate.hql;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class HqlTest {

	@Test
	void should_storeClause_when_constructed() {
		Hql hql = new Hql("SELECT e FROM Employee e");
		assertThat(hql.getClause()).isEqualTo("SELECT e FROM Employee e");
	}

	@Test
	void should_returnEmptyVarExprs_when_noVarsAdded() {
		Hql hql = new Hql("SELECT e FROM Employee e");
		assertThat(hql.getVarExprs()).isEmpty();
	}

	@Test
	void should_returnVarExprs_when_varsAdded() {
		Hql hql = new Hql("SELECT e FROM Employee e WHERE e.name = ?");
		HqlVarExpr var = new HqlVarExpr("name", 0);
		hql.addVarExpr(var);
		assertThat(hql.getVarExprs()).hasSize(1);
		assertThat(hql.getVarExprs().get(0).getVarName()).isEqualTo("name");
	}

	@Test
	void should_returnMultipleVarExprs_when_multipleVarsAdded() {
		Hql hql = new Hql("SELECT e FROM Employee e WHERE e.name = ? AND e.age > ?");
		hql.addVarExpr(new HqlVarExpr("name", 0));
		hql.addVarExpr(new HqlVarExpr("age", 1));
		assertThat(hql.getVarExprs()).hasSize(2);
	}

	@Test
	void should_returnSameInstance_when_getVarExprsCalledMultipleTimes() {
		Hql hql = new Hql("SELECT e FROM Employee e");
		hql.addVarExpr(new HqlVarExpr("name", 0));
		List<?> first = hql.getVarExprs();
		List<?> second = hql.getVarExprs();
		assertThat(first).isSameAs(second);
	}

	@Test
	void should_returnEmptyList_when_noVarExprs() {
		Hql hql = new Hql("SELECT e FROM Employee e");
		assertThat(hql.getVarExprs()).isNotNull().isEmpty();
	}
}
