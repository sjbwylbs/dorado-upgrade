package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FloatControlAnimateTest {

	private FloatControlAnimate animate;

	@Test
	void should_have_default_animate_type_zoom() {
		animate = new FloatControlAnimate();
		assertThat(animate.getAnimateType()).isEqualTo(FloatControlAnimateType.zoom);
	}

	@Test
	void should_have_null_show_animate_type_by_default() {
		animate = new FloatControlAnimate();
		assertThat(animate.getShowAnimateType()).isNull();
	}

	@Test
	void should_have_null_hide_animate_type_by_default() {
		animate = new FloatControlAnimate();
		assertThat(animate.getHideAnimateType()).isNull();
	}

	@Test
	void should_have_null_animate_target_by_default() {
		animate = new FloatControlAnimate();
		assertThat(animate.getAnimateTarget()).isNull();
	}

	@Test
	void should_set_and_get_animate_type() {
		animate = new FloatControlAnimate();
		animate.setAnimateType(FloatControlAnimateType.fade);
		assertThat(animate.getAnimateType()).isEqualTo(FloatControlAnimateType.fade);
	}

	@Test
	void should_set_and_get_show_animate_type() {
		animate = new FloatControlAnimate();
		animate.setShowAnimateType(FloatControlAnimateType.slide);
		assertThat(animate.getShowAnimateType()).isEqualTo(FloatControlAnimateType.slide);
	}

	@Test
	void should_set_and_get_hide_animate_type() {
		animate = new FloatControlAnimate();
		animate.setHideAnimateType(FloatControlAnimateType.flip);
		assertThat(animate.getHideAnimateType()).isEqualTo(FloatControlAnimateType.flip);
	}

	@Test
	void should_set_and_get_animate_target() {
		animate = new FloatControlAnimate();
		animate.setAnimateTarget("myTarget");
		assertThat(animate.getAnimateTarget()).isEqualTo("myTarget");
	}
}
