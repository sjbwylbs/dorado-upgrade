package com.bstek.dorado.view.output;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.bstek.dorado.data.type.DataType;

/**
 * 用于输出
 *
 */
public class IncludeDataTypesOutputter extends AbstractDataTypeOutputter {

	@Override
	@SuppressWarnings("unchecked")
	public void output(Object object, OutputContext context) throws Exception {
		Map<String, DataType> includeDataTypes = (Map<String, DataType>) object;
		Set<DataType> dataTypes = new HashSet<>();

		int includeDataTypeNum = includeDataTypes.size();
		for (Map.Entry<String, DataType> entry : includeDataTypes.entrySet()) {
			DataType dataType = entry.getValue();
			DataType outputDataType = getOutputDataType(dataType, context);
			if (outputDataType != null) {
				dataTypes.add(outputDataType);
			}
		}

		JsonBuilder json = context.getJsonBuilder();
		json.array();
		for (DataType dataType : dataTypes) {
			json.beginValue();
			outputObject(dataType, context);
			json.endValue();
		}

		while (includeDataTypeNum < includeDataTypes.size()) {
			dataTypes.clear();

			int i = 0;
			for (Map.Entry<String, DataType> entry : includeDataTypes.entrySet()) {
				i++;
				if (i <= includeDataTypeNum) {
					continue;
				}

				DataType dataType = entry.getValue();
				if (!dataTypes.contains(dataType)) {
					DataType outputDataType = getOutputDataType(dataType, context);
					if (outputDataType != null) {
						dataTypes.add(outputDataType);
					}
				}
			}
			includeDataTypeNum = includeDataTypes.size();

			for (DataType dataType : dataTypes) {
				json.beginValue();
				outputObject(dataType, context);
				json.endValue();
			}
		}

		includeDataTypes.clear();
		json.endArray();
	}

}
