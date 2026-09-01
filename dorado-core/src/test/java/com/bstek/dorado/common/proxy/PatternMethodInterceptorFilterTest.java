package com.bstek.dorado.common.proxy;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.junit.jupiter.api.Test;

class PatternMethodInterceptorFilterTest {

	private final MethodInvocation methodInvocation = mock(MethodInvocation.class);

	@Test
	void should_accept_when_interceptor_is_not_PatternMethodInterceptor() {
		MethodInterceptor plainInterceptor = mock(MethodInterceptor.class);
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service");

		assertThat(filter.filter(plainInterceptor, methodInvocation)).isTrue();
	}

	@Test
	void should_accept_when_pattern_matches() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		interceptor.setPattern("com.bstek.*");
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service");

		assertThat(filter.filter(interceptor, methodInvocation)).isTrue();
	}

	@Test
	void should_reject_when_pattern_does_not_match() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		interceptor.setPattern("com.other.*");
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service");

		assertThat(filter.filter(interceptor, methodInvocation)).isFalse();
	}

	@Test
	void should_accept_when_pattern_is_empty() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		interceptor.setPattern("");
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service");

		assertThat(filter.filter(interceptor, methodInvocation)).isTrue();
	}

	@Test
	void should_reject_when_exclude_pattern_matches() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		interceptor.setPattern("com.bstek.*");
		interceptor.setExcludePattern("com.bstek.internal.*");
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.internal.Foo");

		assertThat(filter.filter(interceptor, methodInvocation)).isFalse();
	}

	@Test
	void should_accept_when_pattern_matches_but_exclude_does_not() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		interceptor.setPattern("com.bstek.*");
		interceptor.setExcludePattern("com.bstek.internal.*");
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service.Bar");

		assertThat(filter.filter(interceptor, methodInvocation)).isTrue();
	}

	@Test
	void should_accept_when_exclude_pattern_is_empty() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		interceptor.setPattern("com.bstek.*");
		interceptor.setExcludePattern("");
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service");

		assertThat(filter.filter(interceptor, methodInvocation)).isTrue();
	}

	@Test
	void should_accept_when_pattern_is_null() {
		TestPatternInterceptor interceptor = new TestPatternInterceptor();
		// pattern is null by default
		PatternMethodInterceptorFilter filter = new PatternMethodInterceptorFilter("com.bstek.service");

		assertThat(filter.filter(interceptor, methodInvocation)).isTrue();
	}

	private static class TestPatternInterceptor extends PatternMethodInterceptor {
		@Override
		public Object invoke(MethodInvocation invocation) throws Throwable {
			return invocation.proceed();
		}
	}
}
