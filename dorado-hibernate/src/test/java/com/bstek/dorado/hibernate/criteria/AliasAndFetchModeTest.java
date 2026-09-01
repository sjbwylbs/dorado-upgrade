package com.bstek.dorado.hibernate.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.hibernate.criteria.criterion.SingleCriterion;

class AliasAndFetchModeTest {

	// --- Alias tests ---

	@Test
	void should_defaultToAvailable_true_forAlias() {
		Alias alias = new Alias();
		assertThat(alias.isAvailable()).isTrue();
	}

	@Test
	void should_setAvailable_forAlias() {
		Alias alias = new Alias();
		alias.setAvailable(false);
		assertThat(alias.isAvailable()).isFalse();
	}

	@Test
	void should_setAndGetAssociationPath() {
		Alias alias = new Alias();
		alias.setAssociationPath("department.manager");
		assertThat(alias.getAssociationPath()).isEqualTo("department.manager");
	}

	@Test
	void should_setAndGetAliasName() {
		Alias alias = new Alias();
		alias.setAlias("mgr");
		assertThat(alias.getAlias()).isEqualTo("mgr");
	}

	@Test
	void should_setAndGetJoinType() {
		Alias alias = new Alias();
		alias.setJoinType(JoinType.LEFT_JOIN);
		assertThat(alias.getJoinType()).isEqualTo(JoinType.LEFT_JOIN);
	}

	@Test
	void should_returnNullJoinType_when_notSet() {
		Alias alias = new Alias();
		assertThat(alias.getJoinType()).isNull();
	}

	@Test
	void should_addCriterion_toAlias() {
		Alias alias = new Alias();
		SingleCriterion criterion = new SingleCriterion();
		alias.addCriterion(criterion);
		assertThat(alias.getCriterions()).hasSize(1);
		assertThat(alias.getCriterions()).containsExactly(criterion);
	}

	@Test
	void should_returnEmptyCriterions_when_noCriterionsAdded() {
		Alias alias = new Alias();
		assertThat(alias.getCriterions()).isNotNull().isEmpty();
	}

	// --- FetchMode tests ---

	@Test
	void should_defaultToAvailable_true_forFetchMode() {
		FetchMode fetchMode = new FetchMode();
		assertThat(fetchMode.isAvailable()).isTrue();
	}

	@Test
	void should_setAvailable_forFetchMode() {
		FetchMode fetchMode = new FetchMode();
		fetchMode.setAvailable(false);
		assertThat(fetchMode.isAvailable()).isFalse();
	}

	@Test
	void should_setAndGetAssociationPath_forFetchMode() {
		FetchMode fetchMode = new FetchMode();
		fetchMode.setAssociationPath("orders");
		assertThat(fetchMode.getAssociationPath()).isEqualTo("orders");
	}

	@Test
	void should_defaultToDefaultMode() {
		FetchMode fetchMode = new FetchMode();
		assertThat(fetchMode.getMode()).isEqualTo(FetchMode.Mode.DEFAULT);
	}

	@Test
	void should_setModeToJoin() {
		FetchMode fetchMode = new FetchMode();
		fetchMode.setMode(FetchMode.Mode.JOIN);
		assertThat(fetchMode.getMode()).isEqualTo(FetchMode.Mode.JOIN);
	}

	@Test
	void should_setModeToSelect() {
		FetchMode fetchMode = new FetchMode();
		fetchMode.setMode(FetchMode.Mode.SELECT);
		assertThat(fetchMode.getMode()).isEqualTo(FetchMode.Mode.SELECT);
	}

	@Test
	void should_haveThreeFetchModes() {
		assertThat(FetchMode.Mode.values()).hasSize(3);
	}
}
