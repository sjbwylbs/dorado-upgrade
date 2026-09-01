package com.bstek.dorado.view.type;

import java.io.Writer;

import com.bstek.dorado.data.type.AggregationDataType;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.ObjectOutputterDispatcher;
import com.bstek.dorado.view.output.OutputContext;

public class DataTypePropertyOutputter extends ObjectOutputterDispatcher {

	private boolean useLazyDataType;

	/**
	 * @param useLazyDataType the useLazyDataType to set
	 */
	public void setUseLazyDataType(boolean useLazyDataType) {
		this.useLazyDataType = useLazyDataType;
	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		DataType dataType = (DataType) object;
		JsonBuilder json = context.getJsonBuilder();
		json.beginValue();
		Writer writer = context.getWriter();

		// if (BeanExtender.getExProperty(dataType, "dorado.dynamicDataType") !=
		// null) {
		// writer.append("dorado.DataTypeRepository.parseSingleDataType(");
		// outputObject(dataType, context);
		// writer.append(")");
		// } else {
		if (useLazyDataType) {
			writer.append("dorado.LazyLoadDataType.create(v.dataTypeRepository,");
		}

		writer.append('"').append(dataType.getId()).append('"');

		if (useLazyDataType) {
			writer.append(")");
		}
		else {
			if (context.isShouldOutputDataTypes()) {
				if (dataType instanceof AggregationDataType) {
					dataType = ((AggregationDataType) dataType).getElementDataType();
				}
				if (dataType != null) {
					context.markIncludeDataType(dataType);
				}
			}
		}
		// }
		json.endValue();
	}

}
