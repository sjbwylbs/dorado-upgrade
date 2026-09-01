package com.bstek.dorado.hibernate.criteria.projection;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ProjectionTest {

	// --- BaseProjection common behavior ---

	@Test
	void should_defaultToAvailable_true() {
		PropertyProjection proj = new PropertyProjection();
		assertThat(proj.isAvailable()).isTrue();
	}

	@Test
	void should_setAvailable() {
		PropertyProjection proj = new PropertyProjection();
		proj.setAvailable(false);
		assertThat(proj.isAvailable()).isFalse();
	}

	@Test
	void should_setAndGetAlias() {
		PropertyProjection proj = new PropertyProjection();
		proj.setAlias("myAlias");
		assertThat(proj.getAlias()).isEqualTo("myAlias");
	}

	@Test
	void should_returnNullAlias_when_notSet() {
		PropertyProjection proj = new PropertyProjection();
		assertThat(proj.getAlias()).isNull();
	}

	// --- SinglePropertyProjection ---

	@Test
	void should_setAndGetProperty() {
		CountProjection proj = new CountProjection();
		proj.setPropertyName("name");
		assertThat(proj.getPropertyName()).isEqualTo("name");
	}

	// --- PropertyProjection ---

	@Test
	void should_notBeAggregation_forPropertyProjection() {
		PropertyProjection proj = new PropertyProjection();
		assertThat(proj.isAggregation()).isFalse();
	}

	// --- CountProjection ---

	@Test
	void should_beAggregation_forCountProjection() {
		CountProjection proj = new CountProjection();
		assertThat(proj.isAggregation()).isTrue();
	}

	@Test
	void should_defaultToDistinctFalse_forCountProjection() {
		CountProjection proj = new CountProjection();
		assertThat(proj.isDistinct()).isFalse();
	}

	@Test
	void should_setDistinct_forCountProjection() {
		CountProjection proj = new CountProjection();
		proj.setDistinct(true);
		assertThat(proj.isDistinct()).isTrue();
	}

	// --- AvgProjection ---

	@Test
	void should_beAggregation_forAvgProjection() {
		AvgProjection proj = new AvgProjection();
		assertThat(proj.isAggregation()).isTrue();
	}

	// --- MaxProjection ---

	@Test
	void should_beAggregation_forMaxProjection() {
		MaxProjection proj = new MaxProjection();
		assertThat(proj.isAggregation()).isTrue();
	}

	// --- MinProjection ---

	@Test
	void should_beAggregation_forMinProjection() {
		MinProjection proj = new MinProjection();
		assertThat(proj.isAggregation()).isTrue();
	}

	// --- SumProjection ---

	@Test
	void should_beAggregation_forSumProjection() {
		SumProjection proj = new SumProjection();
		assertThat(proj.isAggregation()).isTrue();
	}

	// --- GroupByProjection ---

	@Test
	void should_notBeAggregation_forGroupByProjection() {
		GroupByProjection proj = new GroupByProjection();
		assertThat(proj.isAggregation()).isFalse();
	}

	// --- RowCountProjection ---

	@Test
	void should_beAggregation_forRowCountProjection() {
		RowCountProjection proj = new RowCountProjection();
		assertThat(proj.isAggregation()).isTrue();
	}

	// --- SqlProjection ---

	@Test
	void should_beAggregation_forSqlProjectionWithGroupBy() {
		SqlProjection proj = new SqlProjection();
		proj.setGroupBy("dept");
		assertThat(proj.isAggregation()).isTrue();
	}

	@Test
	void should_notBeAggregation_forSqlProjectionWithoutGroupBy() {
		SqlProjection proj = new SqlProjection();
		assertThat(proj.isAggregation()).isFalse();
	}

	@Test
	void should_setAndGetClause() {
		SqlProjection proj = new SqlProjection();
		proj.setClause("COUNT(*) as cnt");
		assertThat(proj.getClause()).isEqualTo("COUNT(*) as cnt");
	}

	@Test
	void should_setAndGetGroupBy() {
		SqlProjection proj = new SqlProjection();
		proj.setGroupBy("department");
		assertThat(proj.getGroupBy()).isEqualTo("department");
	}

	@Test
	void should_addColumn() {
		SqlProjection proj = new SqlProjection();
		SqlProjection.Column col = new SqlProjection.Column();
		col.setColumanAlias("cnt");
		col.setHibernateType("integer");
		proj.addColumn(col);
		assertThat(proj.getColumns()).hasSize(1);
		assertThat(proj.getColumns().get(0).getColumanAlias()).isEqualTo("cnt");
		assertThat(proj.getColumns().get(0).getHibernateType()).isEqualTo("integer");
	}

	@Test
	void should_returnEmptyColumns_when_noColumnsAdded() {
		SqlProjection proj = new SqlProjection();
		assertThat(proj.getColumns()).isNotNull().isEmpty();
	}

	// --- SqlProjection.Column ---

	@Test
	void should_setAndGetColumnAlias() {
		SqlProjection.Column col = new SqlProjection.Column();
		col.setColumanAlias("myAlias");
		assertThat(col.getColumanAlias()).isEqualTo("myAlias");
	}

	@Test
	void should_setAndGetHibernateType() {
		SqlProjection.Column col = new SqlProjection.Column();
		col.setHibernateType("string");
		assertThat(col.getHibernateType()).isEqualTo("string");
	}
}
