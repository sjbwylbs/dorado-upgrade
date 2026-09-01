package com.bstek.dorado.core;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.core.io.Resource;

class ContextTest {

	/**
	 * Minimal concrete implementation for testing attribute management logic.
	 */
	private static class TestContext extends Context {
		@Override
		public Object getServiceBean(String name) {
			return null;
		}

		@Override
		public Resource getResource(String resourceLocation) {
			return null;
		}

		@Override
		public Resource[] getResources(String locationPattern) throws IOException {
			return new Resource[0];
		}

		@Override
		public ClassLoader getClassLoader() {
			return Thread.currentThread().getContextClassLoader();
		}
	}

	private TestContext context;

	@BeforeEach
	void setUp() {
		context = new TestContext();
	}

	@Test
	void should_set_and_get_attribute_with_thread_scope() {
		context.setAttribute(Context.THREAD, "key1", "value1");

		assertThat(context.getAttribute(Context.THREAD, "key1")).isEqualTo("value1");
	}

	@Test
	void should_set_and_get_attribute_with_default_scope() {
		context.setAttribute("key1", "value1");

		assertThat(context.getAttribute("key1")).isEqualTo("value1");
	}

	@Test
	void should_return_null_for_missing_attribute() {
		assertThat(context.getAttribute("nonExistent")).isNull();
	}

	@Test
	void should_return_null_for_missing_attribute_with_scope() {
		assertThat(context.getAttribute(Context.THREAD, "nonExistent")).isNull();
	}

	@Test
	void should_remove_attribute_with_thread_scope() {
		context.setAttribute(Context.THREAD, "key1", "value1");
		assertThat(context.getAttribute(Context.THREAD, "key1")).isEqualTo("value1");

		context.removeAttribute(Context.THREAD, "key1");

		assertThat(context.getAttribute(Context.THREAD, "key1")).isNull();
	}

	@Test
	void should_remove_attribute_with_default_scope() {
		context.setAttribute("key1", "value1");
		assertThat(context.getAttribute("key1")).isEqualTo("value1");

		context.removeAttribute("key1");

		assertThat(context.getAttribute("key1")).isNull();
	}

	@Test
	void should_throw_exception_for_invalid_scope_on_get() {
		assertThatThrownBy(() -> context.getAttribute("invalidScope", "key"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Invalid scope [invalidScope]");
	}

	@Test
	void should_throw_exception_for_invalid_scope_on_set() {
		assertThatThrownBy(() -> context.setAttribute("invalidScope", "key", "value"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Invalid scope [invalidScope]");
	}

	@Test
	void should_throw_exception_for_invalid_scope_on_remove() {
		assertThatThrownBy(() -> context.removeAttribute("invalidScope", "key"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Invalid scope [invalidScope]");
	}

	@Test
	void should_overwrite_existing_attribute() {
		context.setAttribute("key1", "value1");
		context.setAttribute("key1", "value2");

		assertThat(context.getAttribute("key1")).isEqualTo("value2");
	}

	@Test
	void should_handle_null_attribute_value() {
		context.setAttribute("key1", null);

		assertThat(context.getAttribute("key1")).isNull();
	}

	@Test
	void should_support_multiple_attributes() {
		context.setAttribute("key1", "value1");
		context.setAttribute("key2", "value2");
		context.setAttribute("key3", "value3");

		assertThat(context.getAttribute("key1")).isEqualTo("value1");
		assertThat(context.getAttribute("key2")).isEqualTo("value2");
		assertThat(context.getAttribute("key3")).isEqualTo("value3");
	}

	@Test
	void should_not_fail_when_removing_from_empty_context() {
		// Should not throw
		context.removeAttribute("anyKey");
		assertThat(context.getAttribute("anyKey")).isNull();
	}

	@Test
	void should_have_thread_constant() {
		assertThat(Context.THREAD).isEqualTo("thread");
	}

	@Test
	void should_attach_and_detach_from_thread_local() {
		TestContext ctx = new TestContext();
		ctx.setAttribute("testKey", "testValue");

		Context.attachToThreadLocal(ctx);
		assertThat(Context.getCurrent()).isSameAs(ctx);

		Context detached = Context.dettachFromThreadLocal();
		assertThat(detached).isSameAs(ctx);
		assertThat(Context.getCurrent()).isNull();
	}

	@Test
	void should_return_fail_safe_context_when_no_thread_local() {
		Context.dettachFromThreadLocal();
		Context.setFailSafeContext(null);
		assertThat(Context.getCurrent()).isNull();

		TestContext failSafe = new TestContext();
		Context.setFailSafeContext(failSafe);
		assertThat(Context.getCurrent()).isSameAs(failSafe);

		// Cleanup
		Context.setFailSafeContext(null);
	}
}
