package com.bstek.dorado.common.proxy;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Iterator;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SortableMethodInterceptorSetTest {

	private SortableMethodInterceptorSet set;

	@BeforeEach
	void setUp() {
		set = new SortableMethodInterceptorSet();
	}

	@Test
	void should_be_empty_on_creation() {
		assertThat(set).isEmpty();
	}

	@Test
	void should_add_interceptor() {
		TestInterceptor interceptor = new TestInterceptor(100);
		set.add(interceptor);
		assertThat(set).hasSize(1);
	}

	@Test
	void should_sort_by_order_ascending() {
		TestInterceptor low = new TestInterceptor(10);
		TestInterceptor high = new TestInterceptor(500);
		TestInterceptor mid = new TestInterceptor(100);

		set.add(high);
		set.add(low);
		set.add(mid);

		Iterator<MethodInterceptor> it = set.iterator();
		assertThat(it.next()).isSameAs(low);
		assertThat(it.next()).isSameAs(mid);
		assertThat(it.next()).isSameAs(high);
	}

	@Test
	void should_use_default_order_for_non_pattern_interceptors() {
		MethodInterceptor plainInterceptor = new MethodInterceptor() {
			@Override
			public Object invoke(MethodInvocation invocation) throws Throwable {
				return invocation.proceed();
			}
		};
		TestInterceptor low = new TestInterceptor(10);

		set.add(plainInterceptor);
		set.add(low);

		Iterator<MethodInterceptor> it = set.iterator();
		// low (order=10) should come before plain (default order=999)
		assertThat(it.next()).isSameAs(low);
		assertThat(it.next()).isSameAs(plainInterceptor);
	}

	@Test
	void should_handle_same_order_interceptors() {
		TestInterceptor a = new TestInterceptor(100);
		TestInterceptor b = new TestInterceptor(100);

		set.add(a);
		set.add(b);

		// Both should be in the set (they are different objects with different hashCodes)
		assertThat(set).hasSize(2);
	}

	private static class TestInterceptor extends PatternMethodInterceptor {
		TestInterceptor(int order) {
			setOrder(order);
		}

		@Override
		public Object invoke(MethodInvocation invocation) throws Throwable {
			return invocation.proceed();
		}
	}
}
