package com.bstek.dorado.view.widget.tree;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "Tree", category = "Collection", dependsPackage = "tree")
@ClientObject(prototype = "dorado.widget.Tree", shortTypeName = "Tree")
public class Tree extends AbstractTree implements NodeHolder {

	private List<BaseNode> nodes;

	@Override
	@XmlSubNode
	@ClientProperty
	@IdeProperty(highlight = 1)
	public List<BaseNode> getNodes() {
		if (nodes == null) {
			nodes = new ArrayList<>();
		}
		return nodes;
	}

	@Override
	public void addNode(BaseNode node) {
		getNodes().add(node);
	}

}
