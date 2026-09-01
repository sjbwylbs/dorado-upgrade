package com.bstek.dorado.hibernate.criteria.projection;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlNodeWrapper;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Selection;

public class SqlProjection extends BaseProjection {

	private String clause;
	private String groupBy;
	private List<Column> columns = new ArrayList<>();

	public String getClause() {
		return clause;
	}

	public void setClause(String clause) {
		this.clause = clause;
	}

	public String getGroupBy() {
		return groupBy;
	}

	public void setGroupBy(String groupBy) {
		this.groupBy = groupBy;
	}

	@XmlSubNode(wrapper = @XmlNodeWrapper(nodeName = "Columns"))
	public List<Column> getColumns() {
		return columns;
	}

	public void addColumn(Column col) {
		columns.add(col);
	}

	@XmlNode
	public static class Column {
		private String columanAlias;
		private String hibernateType;

		public String getColumanAlias() {
			return columanAlias;
		}

		public void setColumanAlias(String alias) {
			this.columanAlias = alias;
		}

		@IdeProperty(enumValues = "integer,long,short,float,double,character,byte,boolean,yes_no,true_false,string,date,time,timestamp,calendar,calendar_date,big_decimal,big_integer")
		public String getHibernateType() {
			return hibernateType;
		}

		public void setHibernateType(String hibernateType) {
			this.hibernateType = hibernateType;
		}
	}

	@Override
	public Selection<?> toSelection(CriteriaContext context) {
		return null;
	}

	@Override
	public boolean isAggregation() {
		return StringUtils.isNotEmpty(groupBy);
	}
}
