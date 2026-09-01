package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CriterionModelTest {

	// --- BaseCriterion properties ---

	@Test
	void should_defaultToAvailable_true() {
		SingleCriterion criterion = new SingleCriterion();
		assertThat(criterion.isAvailable()).isTrue();
	}

	@Test
	void should_setAvailable_false() {
		SingleCriterion criterion = new SingleCriterion();
		criterion.setAvailable(false);
		assertThat(criterion.isAvailable()).isFalse();
	}

	@Test
	void should_defaultToNot_false() {
		SingleCriterion criterion = new SingleCriterion();
		assertThat(criterion.isNot()).isFalse();
	}

	@Test
	void should_setNot_true() {
		SingleCriterion criterion = new SingleCriterion();
		criterion.setNot(true);
		assertThat(criterion.isNot()).isTrue();
	}

	// --- SingleCriterion properties ---

	@Test
	void should_setAndGetValue() {
		SingleCriterion criterion = new SingleCriterion();
		criterion.setValue("testValue");
		assertThat(criterion.getValue()).isEqualTo("testValue");
	}

	@Test
	void should_setAndGetDataType() {
		SingleCriterion criterion = new SingleCriterion();
		criterion.setDataType("String");
		assertThat(criterion.getDataType()).isEqualTo("String");
	}

	@Test
	void should_setAndGetPropertyName() {
		SingleCriterion criterion = new SingleCriterion();
		criterion.setPropertyName("name");
		assertThat(criterion.getPropertyName()).isEqualTo("name");
	}

	@Test
	void should_setAndGetOp() {
		SingleCriterion criterion = new SingleCriterion();
		criterion.setOp(SingleCriterion.OP.like);
		assertThat(criterion.getOp()).isEqualTo(SingleCriterion.OP.like);
	}

	// --- DoublePropertyCriterion properties ---

	@Test
	void should_setAndGetPropertyNames() {
		DoublePropertyCriterion criterion = new DoublePropertyCriterion();
		criterion.setPropertyName1("field1");
		criterion.setPropertyName2("field2");
		assertThat(criterion.getPropertyName1()).isEqualTo("field1");
		assertThat(criterion.getPropertyName2()).isEqualTo("field2");
	}

	@Test
	void should_setAndGetOp_forDoubleProperty() {
		DoublePropertyCriterion criterion = new DoublePropertyCriterion();
		criterion.setOp(DoublePropertyCriterion.OP.gt);
		assertThat(criterion.getOp()).isEqualTo(DoublePropertyCriterion.OP.gt);
	}

	// --- BetweenCriterion properties ---

	@Test
	void should_setAndGetValues() {
		BetweenCriterion criterion = new BetweenCriterion();
		criterion.setValue1(10);
		criterion.setValue2(20);
		assertThat(criterion.getValue1()).isEqualTo(10);
		assertThat(criterion.getValue2()).isEqualTo(20);
	}

	@Test
	void should_setAndGetDataType_forBetween() {
		BetweenCriterion criterion = new BetweenCriterion();
		criterion.setDataType("int");
		assertThat(criterion.getDataType()).isEqualTo("int");
	}

	// --- InCriterion properties ---

	@Test
	void should_setAndGetValue_forIn() {
		InCriterion criterion = new InCriterion();
		criterion.setValue(new Object[]{1, 2, 3});
		assertThat(criterion.getValue()).isNotNull();
	}

	@Test
	void should_setAndGetDataType_forIn() {
		InCriterion criterion = new InCriterion();
		criterion.setDataType("int");
		assertThat(criterion.getDataType()).isEqualTo("int");
	}

	// --- IdEqCriterion properties ---

	@Test
	void should_setAndGetValue_forIdEq() {
		IdEqCriterion criterion = new IdEqCriterion();
		criterion.setValue(42L);
		assertThat(criterion.getValue()).isEqualTo(42L);
	}

	@Test
	void should_setAndGetDataType_forIdEq() {
		IdEqCriterion criterion = new IdEqCriterion();
		criterion.setDataType("long");
		assertThat(criterion.getDataType()).isEqualTo("long");
	}

	// --- NonValueCriterion properties ---

	@Test
	void should_setAndGetOp_forNonValue() {
		NonValueCriterion criterion = new NonValueCriterion();
		criterion.setOp(NonValueCriterion.OP.isNull);
		assertThat(criterion.getOp()).isEqualTo(NonValueCriterion.OP.isNull);
	}

	// --- SizeCriterion properties ---

	@Test
	void should_setAndGetValue_forSize() {
		SizeCriterion criterion = new SizeCriterion();
		criterion.setValue(5);
		assertThat(criterion.getValue()).isEqualTo(5);
	}

	@Test
	void should_setAndGetOp_forSize() {
		SizeCriterion criterion = new SizeCriterion();
		criterion.setOp(SizeCriterion.OP.ge);
		assertThat(criterion.getOp()).isEqualTo(SizeCriterion.OP.ge);
	}
}
