package com.bstek.dorado.hibernate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@ExtendWith(MockitoExtension.class)
class CriteriaImplHelperTest {

	@Mock private EntityManager entityManager;
	@Mock private CriteriaBuilder criteriaBuilder;
	@Mock private CriteriaQuery<?> query;
	@Mock private Root<?> root;
	@Mock private Path<?> path;
	@Mock private Predicate predicate1;
	@Mock private Predicate predicate2;
	@Mock private Predicate existingPredicate;

	private CriteriaImplHelper helper;
	private CriteriaContext context;

	@BeforeEach
	void setUp() {
		context = new CriteriaContext(entityManager, criteriaBuilder, query, root);
		helper = new CriteriaImplHelper(context);
	}

	@Test
	void should_returnContext() {
		assertThat(helper.getContext()).isSameAs(context);
	}

	@Test
	void should_resolvePath_fromContext() {
		when(root.get("name")).thenReturn((Path) path);
		assertThat(helper.getPath("name")).isSameAs(path);
	}

	@Test
	void should_setWhereClause_when_addPredicateCalled() {
		helper.addPredicate(predicate1);
		verify(query).where(predicate1);
	}

	@Test
	void should_doNothing_when_addPredicateWithNull() {
		helper.addPredicate(null);
		verify(query, never()).where(any(Predicate.class));
	}

	@SuppressWarnings("unchecked")
	@Test
	void should_mergeWithExistingPredicate_when_addPredicateCalledTwice() {
		when(query.getRestriction()).thenReturn(existingPredicate);
		when(criteriaBuilder.and(existingPredicate, predicate1)).thenReturn(predicate2);

		helper.addPredicate(predicate1);

		verify(criteriaBuilder).and(existingPredicate, predicate1);
		verify(query).where(predicate2);
	}

	@Test
	void should_doNothing_when_andPredicatesCalledWithEmptyList() {
		helper.andPredicates(Collections.emptyList());
		verify(query, never()).where(any(Predicate.class));
	}

	@Test
	void should_doNothing_when_andPredicatesCalledWithNull() {
		helper.andPredicates(null);
		verify(query, never()).where(any(Predicate.class));
	}

	@SuppressWarnings("unchecked")
	@Test
	void should_setWhereClause_when_andPredicatesCalledWithSinglePredicate() {
		when(criteriaBuilder.and(predicate1)).thenReturn(predicate1);
		List<Predicate> predicates = Arrays.asList(predicate1);
		helper.andPredicates(predicates);
		verify(query).where(predicate1);
	}

	@SuppressWarnings("unchecked")
	@Test
	void should_mergeExistingWithNewPredicates_when_existingRestrictionPresent() {
		when(query.getRestriction()).thenReturn(existingPredicate);
		when(criteriaBuilder.and(existingPredicate, predicate1, predicate2)).thenReturn(predicate1);

		List<Predicate> predicates = Arrays.asList(predicate1, predicate2);
		helper.andPredicates(predicates);

		verify(criteriaBuilder).and(existingPredicate, predicate1, predicate2);
	}

	@Test
	void should_doNothing_when_orPredicatesCalledWithEmptyList() {
		helper.orPredicates(Collections.emptyList());
		verify(query, never()).where(any(Predicate.class));
	}

	@Test
	void should_doNothing_when_orPredicatesCalledWithNull() {
		helper.orPredicates(null);
		verify(query, never()).where(any(Predicate.class));
	}

	@SuppressWarnings("unchecked")
	@Test
	void should_setWhereClause_when_orPredicatesCalledWithSinglePredicate() {
		when(criteriaBuilder.or(predicate1)).thenReturn(predicate1);
		List<Predicate> predicates = Arrays.asList(predicate1);
		helper.orPredicates(predicates);
		verify(query).where(predicate1);
	}
}
