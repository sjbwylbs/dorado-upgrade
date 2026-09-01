package com.bstek.dorado.data;

import com.fasterxml.jackson.databind.JsonNode;

public interface JsonConvertor {

	Object fromJSON(JsonNode jsonNode, JsonConvertContext jsonConvertContext) throws Exception;

}
