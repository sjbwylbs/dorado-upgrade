package com.bstek.dorado.view.widget.blockview;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "BlockView", category = "Collection", dependsPackage = "block-view")
@ClientObject(prototype = "dorado.widget.BlockView", shortTypeName = "BlockView")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class BlockView extends AbstractBlockView {

	private List<?> items;

	@XmlProperty
	@ClientProperty
	@IdeProperty(editor = "collection[any]", highlight = 1)
	public List<?> getItems() {
		return items;
	}

	public void setItems(List<?> items) {
		this.items = items;
	}

}
