package com.bstek.dorado.hibernate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

@ExtendWith(MockitoExtension.class)
class SessionStrategyTest {

	@Mock private EntityManagerFactory entityManagerFactory;
	@Mock private EntityManager entityManager;

	@Test
	void should_haveThreeValues() {
		assertThat(SessionStrategy.values()).hasSize(3);
	}

	@Test
	void should_resolveByName() {
		assertThat(SessionStrategy.valueOf("DEFAULT")).isEqualTo(SessionStrategy.DEFAULT);
		assertThat(SessionStrategy.valueOf("CURRENT")).isEqualTo(SessionStrategy.CURRENT);
		assertThat(SessionStrategy.valueOf("OPEN")).isEqualTo(SessionStrategy.OPEN);
	}

	@Test
	void should_createAndCloseEntityManager_forDefaultStrategy() throws Exception {
		when(entityManagerFactory.createEntityManager()).thenReturn(entityManager);

		SessionStrategy.EntityManagerWorker<String> worker = mock(SessionStrategy.EntityManagerWorker.class);
		when(worker.doWork(entityManager)).thenReturn("result");

		String result = SessionStrategy.DEFAULT.doWork(entityManagerFactory, worker);

		assertThat(result).isEqualTo("result");
		verify(entityManagerFactory).createEntityManager();
		verify(entityManager).close();
	}

	@Test
	void should_createEntityManager_withoutClose_forCurrentStrategy() throws Exception {
		when(entityManagerFactory.createEntityManager()).thenReturn(entityManager);

		SessionStrategy.EntityManagerWorker<String> worker = mock(SessionStrategy.EntityManagerWorker.class);
		when(worker.doWork(entityManager)).thenReturn("result");

		String result = SessionStrategy.CURRENT.doWork(entityManagerFactory, worker);

		assertThat(result).isEqualTo("result");
		verify(entityManagerFactory).createEntityManager();
		verify(entityManager, never()).close();
	}

	@Test
	void should_createAndCloseEntityManager_forOpenStrategy() throws Exception {
		when(entityManagerFactory.createEntityManager()).thenReturn(entityManager);

		SessionStrategy.EntityManagerWorker<String> worker = mock(SessionStrategy.EntityManagerWorker.class);
		when(worker.doWork(entityManager)).thenReturn("result");

		String result = SessionStrategy.OPEN.doWork(entityManagerFactory, worker);

		assertThat(result).isEqualTo("result");
		verify(entityManagerFactory).createEntityManager();
		verify(entityManager).close();
	}

	@Test
	void should_closeEntityManager_evenWhenWorkerThrows_forDefaultStrategy() throws Exception {
		when(entityManagerFactory.createEntityManager()).thenReturn(entityManager);

		SessionStrategy.EntityManagerWorker<String> worker = mock(SessionStrategy.EntityManagerWorker.class);
		when(worker.doWork(entityManager)).thenThrow(new RuntimeException("test error"));

		assertThatThrownBy(() -> SessionStrategy.DEFAULT.doWork(entityManagerFactory, worker))
				.isInstanceOf(RuntimeException.class)
				.hasMessage("test error");

		verify(entityManager).close();
	}

	@Test
	void should_closeEntityManager_evenWhenWorkerThrows_forOpenStrategy() throws Exception {
		when(entityManagerFactory.createEntityManager()).thenReturn(entityManager);

		SessionStrategy.EntityManagerWorker<String> worker = mock(SessionStrategy.EntityManagerWorker.class);
		when(worker.doWork(entityManager)).thenThrow(new RuntimeException("test error"));

		assertThatThrownBy(() -> SessionStrategy.OPEN.doWork(entityManagerFactory, worker))
				.isInstanceOf(RuntimeException.class)
				.hasMessage("test error");

		verify(entityManager).close();
	}
}
