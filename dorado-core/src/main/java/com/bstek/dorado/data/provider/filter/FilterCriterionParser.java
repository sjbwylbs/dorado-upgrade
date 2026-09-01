package com.bstek.dorado.data.provider.filter;

import com.bstek.dorado.data.provider.Criterion;
import com.bstek.dorado.data.type.DataType;

public interface FilterCriterionParser {

	Criterion createFilterCriterion(String property, DataType dataType, String expression) throws Exception;

}
