package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

@ExtendWith(MockitoExtension.class)
class DefaultMisValueStrategyTest {

	@Mock private CriteriaContext context;
	@Mock private CriteriaBuilder criteriaBuilder;
	@Mock private Path<?> path;
	@Mock private Predicate predicate;

	private DefaultMisValueStrategy strategy;

	@BeforeEach
	void setUp() {
		strategy = new DefaultMisValueStrategy();
	}

	@Test
	void should_returnNull_forIdEqCriterion() {
		IdEqCriterion criterion = new IdEqCriterion();
		assertThat(strategy.criterion(context, criterion)).isNull();
	}

	@Test
	void should_returnNull_forSingleCriterion() {
		SingleCriterion criterion = new SingleCriterion();
		assertThat(strategy.criterion(context, criterion)).isNull();
	}

	@Test
	void should_returnNull_forInCriterion() {
		InCriterion criterion = new InCriterion();
		assertThat(strategy.criterion(context, criterion)).isNull();
	}

	@Test
	void should_returnNull_forSizeCriterion() {
		SizeCriterion criterion = new SizeCriterion();
		assertThat(strategy.criterion(context, criterion)).isNull();
	}

	@Test
	void should_returnNull_forBetweenCriterion_when_bothValuesNull() {
		BetweenCriterion criterion = new BetweenCriterion();
		assertThat(strategy.criterion(context, criterion, null, null)).isNull();
	}

	@SuppressWarnings({"unchecked", "rawtypes"})
	@Test
	void should_returnGreaterThanOrEqualTo_forBetweenCriterion_when_onlyValue1NotNull() {
		BetweenCriterion criterion = new BetweenCriterion();
		criterion.setPropertyName("age");
		when(context.resolvePath("age")).thenReturn((Path) path);
		when(criteriaBuilder.greaterThanOrEqualTo(any(Path.class), any(Comparable.class)))
				.thenReturn(predicate);
		when(context.getCriteriaBuilder()).thenReturn(criteriaBuilder);

		Predicate result = strategy.criterion(context, criterion, 18, null);
		assertThat(result).isSameAs(predicate);
		verify(criteriaBuilder).greaterThanOrEqualTo(any(Path.class), eq((Comparable) 18));
	}

	@SuppressWarnings({"unchecked", "rawtypes"})
	@Test
	void should_returnLessThanOrEqualTo_forBetweenCriterion_when_onlyValue2NotNull() {
		BetweenCriterion criterion = new BetweenCriterion();
		criterion.setPropertyName("age");
		when(context.resolvePath("age")).thenReturn((Path) path);
		when(criteriaBuilder.lessThanOrEqualTo(any(Path.class), any(Comparable.class)))
				.thenReturn(predicate);
		when(context.getCriteriaBuilder()).thenReturn(criteriaBuilder);

		Predicate result = strategy.criterion(context, criterion, null, 65);
		assertThat(result).isSameAs(predicate);
		verify(criteriaBuilder).lessThanOrEqualTo(any(Path.class), eq((Comparable) 65));
	}
}
