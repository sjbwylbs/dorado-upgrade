package com.bstek.dorado.view.widget.list;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.view.annotation.ComponentReference;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.DataControl;

@Widget(name = "DataListBox", category = "Collection", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.DataListBox", shortTypeName = "DataListBox")
public class DataListBox extends AbstractListBox implements DataControl {

	private String dataSet;

	private String dataPath;

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

}
