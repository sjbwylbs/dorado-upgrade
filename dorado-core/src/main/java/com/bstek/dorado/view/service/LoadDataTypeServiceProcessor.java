package com.bstek.dorado.view.service;

import java.io.Writer;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.data.JsonUtils;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.web.DoradoContext;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class LoadDataTypeServiceProcessor extends DataServiceProcessorSupport {

	@Override
	protected void doExecute(Writer writer, ObjectNode objectNode, DoradoContext context) throws Exception {
		ArrayNode rudeDataTypeArray = (ArrayNode) objectNode.get("dataType");
		Collection<String> dataTypeArray = JsonUtils.getObjectMapper()
	.convertValue(rudeDataTypeArray, new TypeReference<List<String>>() {
		});
		Map<String, DataType> dataTypeMap = new HashMap<>();
		if (dataTypeMap != null) {
			for (String dataTypeName : dataTypeArray) {
				dataTypeMap.put(dataTypeName, getDataType(dataTypeName));
			}
		}

		OutputContext outputContext = new OutputContext(writer);
		outputContext.setUsePrettyJson(Configure.getBoolean("view.outputPrettyJson"));
		outputDataTypes(dataTypeMap, outputContext);
	}

}
