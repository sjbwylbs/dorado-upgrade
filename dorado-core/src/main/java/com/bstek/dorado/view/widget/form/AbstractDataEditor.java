package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.view.annotation.ComponentReference;
import com.bstek.dorado.view.widget.datacontrol.PropertyDataControl;

public abstract class AbstractDataEditor extends AbstractEditor implements PropertyDataControl {

	private String dataSet;

	private String dataPath;

	private String property;

	@Override
	@ComponentReference("DataSet")
	@IdeProperty(highlight = 1)
	public String getDataSet() {
		return dataSet;
	}

	@Override
	public void setDataSet(String dataSet) {
		this.dataSet = dataSet;
	}

	@Override
	@IdeProperty(highlight = 1)
	public String getDataPath() {
		return dataPath;
	}

	@Override
	public void setDataPath(String dataPath) {
		this.dataPath = dataPath;
	}

	@Override
	@IdeProperty(highlight = 1)
	public String getProperty() {
		return property;
	}

	@Override
	public void setProperty(String property) {
		this.property = property;
	}

}
