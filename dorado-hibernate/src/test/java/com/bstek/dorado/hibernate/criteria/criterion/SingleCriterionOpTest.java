package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class SingleCriterionOpTest {

	@Test
	void should_returnEq_when_valueIsEquals() {
		assertThat(SingleCriterion.OP.value("=")).isEqualTo(SingleCriterion.OP.eq);
	}

	@Test
	void should_returnNe_when_valueIsNotEquals() {
		assertThat(SingleCriterion.OP.value("<>")).isEqualTo(SingleCriterion.OP.ne);
	}

	@Test
	void should_returnGt_when_valueIsGreaterThan() {
		assertThat(SingleCriterion.OP.value(">")).isEqualTo(SingleCriterion.OP.gt);
	}

	@Test
	void should_returnLt_when_valueIsLessThan() {
		assertThat(SingleCriterion.OP.value("<")).isEqualTo(SingleCriterion.OP.lt);
	}

	@Test
	void should_returnLe_when_valueIsLessOrEqual() {
		assertThat(SingleCriterion.OP.value("<=")).isEqualTo(SingleCriterion.OP.le);
	}

	@Test
	void should_returnGe_when_valueIsGreaterOrEqual() {
		assertThat(SingleCriterion.OP.value(">=")).isEqualTo(SingleCriterion.OP.ge);
	}

	@Test
	void should_returnLike_when_valueIsLike() {
		assertThat(SingleCriterion.OP.value("like")).isEqualTo(SingleCriterion.OP.like);
	}

	@Test
	void should_returnLikeStart_when_valueIsLikePercent() {
		assertThat(SingleCriterion.OP.value("like%")).isEqualTo(SingleCriterion.OP.likeStart);
	}

	@Test
	void should_returnLikeEnd_when_valueIsPercentLike() {
		assertThat(SingleCriterion.OP.value("%like")).isEqualTo(SingleCriterion.OP.likeEnd);
	}

	@Test
	void should_returnLikeAnyWhere_when_valueIsPercentLikePercent() {
		assertThat(SingleCriterion.OP.value("%like%")).isEqualTo(SingleCriterion.OP.likeAnyWhere);
	}

	@Test
	void should_returnIlike_when_valueIsIlike() {
		assertThat(SingleCriterion.OP.value("ilike")).isEqualTo(SingleCriterion.OP.ilike);
	}

	@Test
	void should_returnIlikeStart_when_valueIsIlikePercent() {
		assertThat(SingleCriterion.OP.value("ilike%")).isEqualTo(SingleCriterion.OP.ilikeStart);
	}

	@Test
	void should_returnIlikeEnd_when_valueIsPercentIlike() {
		assertThat(SingleCriterion.OP.value("%ilike")).isEqualTo(SingleCriterion.OP.ilikeEnd);
	}

	@Test
	void should_returnIlikeAnyWhere_when_valueIsPercentIlikePercent() {
		assertThat(SingleCriterion.OP.value("%ilike%")).isEqualTo(SingleCriterion.OP.ilikeAnyWhere);
	}

	@Test
	void should_returnNull_when_valueIsEmpty() {
		assertThat(SingleCriterion.OP.value("")).isNull();
	}

	@Test
	void should_returnNull_when_valueIsNull() {
		assertThat(SingleCriterion.OP.value(null)).isNull();
	}

	@Test
	void should_throwException_when_valueIsUnknown() {
		assertThatThrownBy(() -> SingleCriterion.OP.value("unknown"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("unknown op");
	}

	@Test
	void should_returnCorrectToString_forAllOps() {
		assertThat(SingleCriterion.OP.eq.toString()).isEqualTo("=");
		assertThat(SingleCriterion.OP.ne.toString()).isEqualTo("<>");
		assertThat(SingleCriterion.OP.gt.toString()).isEqualTo(">");
		assertThat(SingleCriterion.OP.lt.toString()).isEqualTo("<");
		assertThat(SingleCriterion.OP.le.toString()).isEqualTo("<=");
		assertThat(SingleCriterion.OP.ge.toString()).isEqualTo(">=");
		assertThat(SingleCriterion.OP.like.toString()).isEqualTo("like");
		assertThat(SingleCriterion.OP.likeStart.toString()).isEqualTo("like%");
		assertThat(SingleCriterion.OP.likeEnd.toString()).isEqualTo("%like");
		assertThat(SingleCriterion.OP.likeAnyWhere.toString()).isEqualTo("%like%");
		assertThat(SingleCriterion.OP.ilike.toString()).isEqualTo("ilike");
		assertThat(SingleCriterion.OP.ilikeStart.toString()).isEqualTo("ilike%");
		assertThat(SingleCriterion.OP.ilikeEnd.toString()).isEqualTo("%ilike");
		assertThat(SingleCriterion.OP.ilikeAnyWhere.toString()).isEqualTo("%ilike%");
	}
}
