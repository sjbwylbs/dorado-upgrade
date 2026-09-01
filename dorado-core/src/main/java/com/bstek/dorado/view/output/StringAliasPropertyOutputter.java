package com.bstek.dorado.view.output;

import com.bstek.dorado.util.StringAliasUtils;

public class StringAliasPropertyOutputter implements PropertyOutputter {

	@Override
	public boolean isEscapeValue(Object value) {
		return OutputUtils.isEscapeValue(value);
	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		String s = (String) object;
		context.getJsonBuilder().value(StringAliasUtils.getUniqueAlias(s));
	}

}
