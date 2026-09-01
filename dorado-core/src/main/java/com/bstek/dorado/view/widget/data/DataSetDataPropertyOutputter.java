package com.bstek.dorado.view.widget.data;

import com.bstek.dorado.view.output.DataOutputter;
import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.VirtualPropertyOutputter;

public class DataSetDataPropertyOutputter extends DataOutputter implements VirtualPropertyOutputter {

	@Override
	public void output(Object object, String property, OutputContext context) throws Exception {
		JsonBuilder jsonBuilder = context.getJsonBuilder();
		DataSet dataSet = (DataSet) object;
		LoadMode loadMode = dataSet.getLoadMode();
		if (LoadMode.preload.equals(loadMode)) {
			Object data = dataSet.getData();

			jsonBuilder.escapeableKey(property);
			outputData(data, context);
		}
		else if (LoadMode.manual.equals(loadMode)) {
			jsonBuilder.key(property).value(null);
		}
	}

}
