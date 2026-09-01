package com.bstek.dorado.hibernate.criteria;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

@ExtendWith(MockitoExtension.class)
class CriteriaContextTest {

	@Mock private EntityManager entityManager;
	@Mock private CriteriaBuilder criteriaBuilder;
	@Mock private CriteriaQuery<?> query;
	@Mock private Root<?> root;
	@Mock private Path<?> namePath;
	@Mock private Path<?> nestedPath;

	private CriteriaContext context;

	@BeforeEach
	void setUp() {
		context = new CriteriaContext(entityManager, criteriaBuilder, query, root);
	}

	@Test
	void should_returnEntityManager_when_getEntityManagerCalled() {
		assertThat(context.getEntityManager()).isSameAs(entityManager);
	}

	@Test
	void should_returnCriteriaBuilder_when_getCriteriaBuilderCalled() {
		assertThat(context.getCriteriaBuilder()).isSameAs(criteriaBuilder);
	}

	@Test
	void should_returnQuery_when_getQueryCalled() {
		assertThat(context.getQuery()).isSameAs(query);
	}

	@Test
	void should_returnRoot_when_getRootCalled() {
		assertThat(context.getRoot()).isSameAs(root);
	}

	@Test
	void should_returnRoot_when_resolvePathWithNull() {
		assertThat(context.resolvePath(null)).isSameAs(root);
	}

	@Test
	void should_resolveSimplePropertyPath() {
		when(root.get("name")).thenReturn((Path) namePath);
		Path<?> result = context.resolvePath("name");
		assertThat(result).isSameAs(namePath);
	}

	@Test
	void should_resolveNestedPropertyPath() {
		From<?, ?> fromMock = mock(From.class);
		when(fromMock.get("city")).thenReturn((Path) nestedPath);
		context.registerAlias("address", fromMock);

		Path<?> result = context.resolvePath("address.city");
		assertThat(result).isSameAs(nestedPath);
	}

	@Test
	void should_resolvePathViaRoot_when_aliasNotRegistered() {
		when(root.get("department")).thenReturn((Path) namePath);
		Path<?> result = context.resolvePath("department");
		assertThat(result).isSameAs(namePath);
	}

	@Test
	void should_registerAndGetAlias() {
		From<?, ?> fromMock = mock(From.class);
		context.registerAlias("dept", fromMock);
		assertThat(context.getAlias("dept")).isSameAs(fromMock);
	}

	@Test
	void should_returnNullAlias_when_aliasNotRegistered() {
		assertThat(context.getAlias("unknown")).isNull();
	}

	@Test
	void should_returnAliasMap() {
		assertThat(context.getAliasMap()).isNotNull();
		assertThat(context.getAliasMap()).isEmpty();
	}

	@Test
	void should_resolveMultiLevelNestedPath() {
		From<?, ?> fromMock = mock(From.class);
		Path<?> level1 = mock(Path.class);
		Path<?> level2 = mock(Path.class);
		when(fromMock.get("city")).thenReturn((Path) level1);
		when(level1.get("street")).thenReturn((Path) level2);
		context.registerAlias("address", fromMock);

		Path<?> result = context.resolvePath("address.city.street");
		assertThat(result).isSameAs(level2);
	}
}
