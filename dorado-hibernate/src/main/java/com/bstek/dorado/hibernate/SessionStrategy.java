package com.bstek.dorado.hibernate;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

public enum SessionStrategy {
	DEFAULT {

		@Override
		public <T> T doWork(EntityManagerFactory entityManagerFactory,
				EntityManagerWorker<T> worker) throws Exception {
			EntityManager em = entityManagerFactory.createEntityManager();
			try {
				T result = worker.doWork(em);
				return result;
			} finally {
				em.close();
			}
		}
	},
	CURRENT{

		@Override
		public <T> T doWork(EntityManagerFactory entityManagerFactory, EntityManagerWorker<T> worker) throws Exception {
			EntityManager em = entityManagerFactory.createEntityManager();
			return worker.doWork(em);
		}

	},
	OPEN{

		@Override
		public <T> T doWork(EntityManagerFactory entityManagerFactory,
				EntityManagerWorker<T> worker) throws Exception {
			EntityManager em = entityManagerFactory.createEntityManager();
			try {
				T result = worker.doWork(em);
				return result;
			} finally {
				em.close();
			}
		}
	};

	public abstract <T> T doWork(EntityManagerFactory entityManagerFactory, EntityManagerWorker<T> worker) throws Exception;

	public static abstract class EntityManagerWorker<T> {
		public abstract T doWork(EntityManager em) throws Exception;
	}
}
