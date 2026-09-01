package com.bstek.dorado.view.output;

import com.bstek.dorado.data.type.AggregationDataType;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.data.type.EntityDataType;

public class AbstractDataTypeOutputter extends ObjectOutputterDispatcher {

	protected DataType getOutputDataType(DataType dataType, OutputContext context) {
		if (dataType instanceof AggregationDataType) {
			DataType elementDataType = ((AggregationDataType) dataType).getElementDataType();
			if (elementDataType instanceof EntityDataType) {
				dataType = elementDataType;
			}
			else {
				dataType = null;
			}
		}
		else if (!(dataType instanceof EntityDataType)) {
			dataType = null;
		}
		return dataType;
	}

}