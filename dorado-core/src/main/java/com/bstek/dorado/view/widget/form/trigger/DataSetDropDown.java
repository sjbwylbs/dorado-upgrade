package com.bstek.dorado.view.widget.form.trigger;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.ComponentReference;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.PropertyDataControl;

@Widget(name = "DataSetDropDown", category = "Trigger", dependsPackage = "base-widget-desktop,grid",
		autoGenerateId = true)
@ClientObject(prototype = "dorado.widget.DataSetDropDown", shortTypeName = "DataSetDropDown")
@ClientEvents({ @ClientEvent(name = "onSetFilterParameter") })
@XmlNode(clientTypes = ClientType.DESKTOP)
public class DataSetDropDown extends RowListDropDown implements PropertyDataControl {

	private String dataSet;

	private String dataPath;

	private boolean useDataBinding = true;

	private FilterMode filterMode = FilterMode.serverSide;

	private boolean reloadDataOnOpen;

	public DataSetDropDown() {
		setFilterOnTyping(false);
	}

	@Override
	@ClientProperty(escapeValue = "false")
	public boolean isFilterOnTyping() {
		return super.isFilterOnTyping();
	}

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
		return super.getProperty();
	}

	@ClientProperty(escapeValue = "true")
	public boolean isUseDataBinding() {
		return useDataBinding;
	}

	public void setUseDataBinding(boolean useDataBinding) {
		this.useDataBinding = useDataBinding;
	}

	@ClientProperty(escapeValue = "serverSide")
	public FilterMode getFilterMode() {
		return filterMode;
	}

	public void setFilterMode(FilterMode filterMode) {
		this.filterMode = filterMode;
	}

	public boolean isReloadDataOnOpen() {
		return reloadDataOnOpen;
	}

	public void setReloadDataOnOpen(boolean reloadDataOnOpen) {
		this.reloadDataOnOpen = reloadDataOnOpen;
	}

}
