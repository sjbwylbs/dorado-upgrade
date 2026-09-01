package com.bstek.dorado.hibernate.hql;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HqlVarExprTest {

	@Test
	void should_setPercentStart_when_exprStartsWithPercent() {
		HqlVarExpr expr = new HqlVarExpr("%name", 0);
		assertThat(expr.percentStart).isTrue();
		assertThat(expr.percentEnd).isFalse();
	}

	@Test
	void should_setPercentEnd_when_exprEndsWithPercent() {
		HqlVarExpr expr = new HqlVarExpr("name%", 0);
		assertThat(expr.percentStart).isFalse();
		assertThat(expr.percentEnd).isTrue();
	}

	@Test
	void should_setBothPercents_when_exprStartsAndEndsWithPercent() {
		HqlVarExpr expr = new HqlVarExpr("%name%", 0);
		assertThat(expr.percentStart).isTrue();
		assertThat(expr.percentEnd).isTrue();
	}

	@Test
	void should_parseSimpleVarName_when_noPercentPrefix() {
		HqlVarExpr expr = new HqlVarExpr("name", 0);
		assertThat(expr.getVarName()).isEqualTo("name");
		assertThat(expr.getIndex()).isEqualTo(0);
		assertThat(expr.percentStart).isFalse();
		assertThat(expr.percentEnd).isFalse();
	}

	@Test
	void should_returnOriginalValue_when_noPercents() {
		HqlVarExpr expr = new HqlVarExpr("name", 0);
		assertThat(expr.translatValue("test")).isEqualTo("test");
	}

	@Test
	void returnPercentWrappedValue_when_bothPercents() {
		HqlVarExpr expr = new HqlVarExpr("%name%", 0);
		assertThat(expr.translatValue("test")).isEqualTo("%test%");
	}

	@Test
	void should_returnPercentPrefixValue_when_onlyPercentStart() {
		HqlVarExpr expr = new HqlVarExpr("%name", 0);
		assertThat(expr.translatValue("test")).isEqualTo("%test");
	}

	@Test
	void should_returnPercentSuffixValue_when_onlyPercentEnd() {
		HqlVarExpr expr = new HqlVarExpr("name%", 0);
		assertThat(expr.translatValue("test")).isEqualTo("test%");
	}

	@Test
	void should_returnPercent_when_valueIsNullAndPercentsSet() {
		HqlVarExpr expr = new HqlVarExpr("%name%", 0);
		assertThat(expr.translatValue(null)).isEqualTo("%");
	}

	@Test
	void should_returnNull_when_valueIsNullAndNoPercents() {
		HqlVarExpr expr = new HqlVarExpr("name", 0);
		assertThat(expr.translatValue(null)).isNull();
	}

	@Test
	void should_storeExpr_when_constructed() {
		HqlVarExpr expr = new HqlVarExpr("myVar", 3);
		assertThat(expr.getExpr()).isEqualTo("myVar");
		assertThat(expr.getIndex()).isEqualTo(3);
	}

	@Test
	void should_acceptJavaIdentifierChars_inAcceptByExpr() {
		assertThat(HqlVarExpr.acceptByExpr('a')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr('Z')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr('0')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr('_')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr('.')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr('(')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr(')')).isTrue();
		assertThat(HqlVarExpr.acceptByExpr('%')).isTrue();
	}

	@Test
	void should_notAcceptSpecialChars_inAcceptByExpr() {
		assertThat(HqlVarExpr.acceptByExpr(' ')).isFalse();
		assertThat(HqlVarExpr.acceptByExpr('=')).isFalse();
		assertThat(HqlVarExpr.acceptByExpr(',')).isFalse();
	}

	@Test
	void should_beEqual_when_sameFields() {
		HqlVarExpr expr1 = new HqlVarExpr("name", 0);
		HqlVarExpr expr2 = new HqlVarExpr("name", 0);
		assertThat(expr1).isEqualTo(expr2);
	}

	@Test
	void should_notBeEqual_when_differentIndex() {
		HqlVarExpr expr1 = new HqlVarExpr("name", 0);
		HqlVarExpr expr2 = new HqlVarExpr("name", 1);
		assertThat(expr1).isNotEqualTo(expr2);
	}

	@Test
	void should_notBeEqual_when_differentVarName() {
		HqlVarExpr expr1 = new HqlVarExpr("name", 0);
		HqlVarExpr expr2 = new HqlVarExpr("age", 0);
		assertThat(expr1).isNotEqualTo(expr2);
	}

	@Test
	void should_haveSameHashCode_when_equal() {
		HqlVarExpr expr1 = new HqlVarExpr("name", 0);
		HqlVarExpr expr2 = new HqlVarExpr("name", 0);
		assertThat(expr1.hashCode()).isEqualTo(expr2.hashCode());
	}

	@Test
	void should_notEqual_null() {
		HqlVarExpr expr = new HqlVarExpr("name", 0);
		assertThat(expr).isNotEqualTo(null);
	}

	@Test
	void should_equal_itself() {
		HqlVarExpr expr = new HqlVarExpr("name", 0);
		assertThat(expr).isEqualTo(expr);
	}
}
