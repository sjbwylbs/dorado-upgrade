package com.bstek.dorado.view.widget.treegrid;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNodeWrapper;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.tree.BaseNode;

@Widget(name = "TreeGrid", category = "Collection", dependsPackage = "tree-grid")
@ClientObject(prototype = "dorado.widget.TreeGrid", shortTypeName = "TreeGrid")
public class TreeGrid extends AbstractTreeGrid {

	private List<BaseNode> nodes;

	@XmlSubNode(
			wrapper = @XmlNodeWrapper(nodeName = "Nodes", icon = "/com/bstek/dorado/view/widget/treegrid/Nodes.png"))
	@ClientProperty
	@IdeProperty(highlight = 1)
	public List<BaseNode> getNodes() {
		if (nodes == null) {
			nodes = new ArrayList<>();
		}
		return nodes;
	}

	public void addNode(BaseNode node) {
		getNodes().add(node);
	}

}
