package com.bstek.dorado.common.proxy;

import static org.assertj.core.api.Assertions.assertThat;

import org.aopalliance.intercept.MethodInvocation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PatternMethodInterceptorTest {

	// Concrete subclass for testing the abstract class
	private static class TestInterceptor extends PatternMethodInterceptor {
		@Override
		public Object invoke(MethodInvocation invocation) throws Throwable {
			return invocation.proceed();
		}
	}

	@Test
	void should_have_default_order_of_999() {
		TestInterceptor interceptor = new TestInterceptor();
		assertThat(interceptor.getOrder()).isEqualTo(999);
	}

	@Test
	void should_set_and_get_pattern() {
		TestInterceptor interceptor = new TestInterceptor();
		interceptor.setPattern("com.bstek.*");
		assertThat(interceptor.getPattern()).isEqualTo("com.bstek.*");
	}

	@Test
	void should_set_and_get_excludePattern() {
		TestInterceptor interceptor = new TestInterceptor();
		interceptor.setExcludePattern("com.bstek.internal.*");
		assertThat(interceptor.getExcludePattern()).isEqualTo("com.bstek.internal.*");
	}

	@Test
	void should_set_and_get_order() {
		TestInterceptor interceptor = new TestInterceptor();
		interceptor.setOrder(10);
		assertThat(interceptor.getOrder()).isEqualTo(10);
	}

	@Test
	void should_return_null_pattern_by_default() {
		TestInterceptor interceptor = new TestInterceptor();
		assertThat(interceptor.getPattern()).isNull();
	}

	@Test
	void should_return_null_excludePattern_by_default() {
		TestInterceptor interceptor = new TestInterceptor();
		assertThat(interceptor.getExcludePattern()).isNull();
	}
}
