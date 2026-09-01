package com.bstek.dorado.data;

import com.bstek.dorado.data.type.DataType;

public interface DataTypeResolver {

	DataType getDataType(String dataTypeName) throws Exception;

}
