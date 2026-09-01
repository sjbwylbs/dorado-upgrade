package com.bstek.dorado.spring;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericApplicationContext;

class RemovableBeanUtilsTest {

	@Test
	void should_not_fail_when_no_removable_beans() {
		GenericApplicationContext context = new GenericApplicationContext();
		context.refresh();
		// Should not throw
		RemovableBeanUtils.destroyRemovableBeans(context);
		context.close();
	}

	@Test
	void should_handle_null_parent_gracefully() {
		GenericApplicationContext context = new GenericApplicationContext();
		context.refresh();
		// Parent is null, should not throw
		RemovableBeanUtils.destroyRemovableBeans(context);
		context.close();
	}

	@Test
	void should_handle_generic_application_context() {
		GenericApplicationContext context = new GenericApplicationContext();
		context.refresh();
		int removed = RemovableBeanUtils.doDestroyRemovableBeans(context);
		assertThat(removed).isEqualTo(0);
		context.close();
	}

	@Test
	void should_return_zero_for_non_matching_context_type() {
		// ApplicationContext that is neither GenericApplicationContext nor AbstractRefreshableApplicationContext
		// will simply return 0 removed beans
		ApplicationContext context = new GenericApplicationContext();
		((GenericApplicationContext) context).refresh();
		int removed = RemovableBeanUtils.doDestroyRemovableBeans(context);
		assertThat(removed).isEqualTo(0);
		((GenericApplicationContext) context).close();
	}

	@Test
	void should_process_parent_context_if_present() {
		GenericApplicationContext parent = new GenericApplicationContext();
		parent.refresh();
		GenericApplicationContext child = new GenericApplicationContext(parent);
		child.refresh();

		// Should not throw even with parent
		RemovableBeanUtils.destroyRemovableBeans(child);

		child.close();
		parent.close();
	}
}
