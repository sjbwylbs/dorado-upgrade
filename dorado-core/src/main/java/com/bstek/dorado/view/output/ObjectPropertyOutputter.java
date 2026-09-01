package com.bstek.dorado.view.output;

public abstract class ObjectPropertyOutputter extends ClientObjectOutputter implements PropertyOutputter {

	@Override
	public boolean isEscapeValue(Object value) {
		return OutputUtils.isEscapeValue(value);
	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		outputObject(object, context);
	}

}
