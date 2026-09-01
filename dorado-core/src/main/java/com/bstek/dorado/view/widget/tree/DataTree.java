package com.bstek.dorado.view.widget.tree;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNodeWrapper;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.ComponentReference;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.DataControl;

@Widget(name = "DataTree", category = "Collection", dependsPackage = "tree")
@ClientObject(prototype = "dorado.widget.DataTree", shortTypeName = "DataTree")
@ClientEvents({ @ClientEvent(name = "beforeDataNodeCreate"), @ClientEvent(name = "onDataNodeCreate") })
public class DataTree extends AbstractTree implements DataControl {

	private String dataSet;

	private String dataPath;

	private String currentNodeDataPath;

	private List<BindingConfig> bindingConfigs = new ArrayList<>();

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

	public String getCurrentNodeDataPath() {
		return currentNodeDataPath;
	}

	public void setCurrentNodeDataPath(String currentNodeDataPath) {
		this.currentNodeDataPath = currentNodeDataPath;
	}

	@XmlSubNode(wrapper = @XmlNodeWrapper(nodeName = "BindingConfigs",
			icon = "/com/bstek/dorado/view/widget/tree/BindingConfigs.png"))
	@ClientProperty
	public List<BindingConfig> getBindingConfigs() {
		return bindingConfigs;
	}

	public void addBindingConfig(BindingConfig bindingConfig) {
		bindingConfigs.add(bindingConfig);
	}

}
