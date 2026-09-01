package com.bstek.dorado.hibernate.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class JoinTypeTest {

	@Test
	void should_returnInnerJoin_forInnerJoin() {
		assertThat(JoinType.INNER_JOIN.getJpaJoinType())
				.isEqualTo(jakarta.persistence.criteria.JoinType.INNER);
	}

	@Test
	void should_returnLeftJoin_forFullJoin() {
		assertThat(JoinType.FULL_JOIN.getJpaJoinType())
				.isEqualTo(jakarta.persistence.criteria.JoinType.LEFT);
	}

	@Test
	void should_returnLeftJoin_forLeftJoin() {
		assertThat(JoinType.LEFT_JOIN.getJpaJoinType())
				.isEqualTo(jakarta.persistence.criteria.JoinType.LEFT);
	}

	@Test
	void should_returnRightJoin_forRightJoin() {
		assertThat(JoinType.RIGHT_JOIN.getJpaJoinType())
				.isEqualTo(jakarta.persistence.criteria.JoinType.RIGHT);
	}

	@Test
	void should_haveFourValues() {
		assertThat(JoinType.values()).hasSize(4);
	}

	@Test
	void should_resolveByName() {
		assertThat(JoinType.valueOf("INNER_JOIN")).isEqualTo(JoinType.INNER_JOIN);
		assertThat(JoinType.valueOf("FULL_JOIN")).isEqualTo(JoinType.FULL_JOIN);
		assertThat(JoinType.valueOf("LEFT_JOIN")).isEqualTo(JoinType.LEFT_JOIN);
		assertThat(JoinType.valueOf("RIGHT_JOIN")).isEqualTo(JoinType.RIGHT_JOIN);
	}
}
