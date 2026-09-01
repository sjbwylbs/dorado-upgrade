package com.bstek.dorado.data.resolver;

import com.bstek.dorado.annotation.XmlNode;

@XmlNode(fixedProperties = "type=direct")
public class DirectDataResolver extends AbstractDataResolver {

	@Override
	protected Object internalResolve(DataItems dataItems, Object parameter) throws Exception {
		return null;
	}

}
