package com.bstek.dorado.view.output;

import com.bstek.dorado.data.provider.DataProvider;

/**
 * 数据提供者的输出器。
 *
 */
public class DataProviderPropertyOutputter extends ObjectPropertyOutputter {

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		DataProvider dataProvider = (DataProvider) object;
		JsonBuilder json = context.getJsonBuilder();
		json.beginValue();
		context.getWriter().write("dorado.DataProvider.create(\"" + dataProvider.getId() + "\")");
		json.endValue();
	}

}
