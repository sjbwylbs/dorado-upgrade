package com.bstek.dorado.data;

import com.bstek.dorado.common.MetaDataSupport;

public interface DataModelObject extends MetaDataSupport {

	String getName();

	String getId();

	void setId(String id);

}
