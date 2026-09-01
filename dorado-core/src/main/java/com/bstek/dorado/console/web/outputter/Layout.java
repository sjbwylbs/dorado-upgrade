package com.bstek.dorado.console.web.outputter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.bstek.dorado.view.registry.LayoutTypeRegisterInfo;
import com.bstek.dorado.view.registry.LayoutTypeRegistry;
import com.bstek.dorado.web.DoradoContext;

/**
 * Layout
 *
 */
public class Layout extends Category {

	private final static String CATEGORY_NAME = "Layout";

	public Layout() {
		super(CATEGORY_NAME);
		// TODO Auto-generated constructor stub
	}

	@Override
	public List<Node> initNodes() {
		LayoutTypeRegistry registry = (LayoutTypeRegistry) DoradoContext.getAttachedWebApplicationContext()
			.getBean("dorado.layoutTypeRegistry");
		Collection<LayoutTypeRegisterInfo> registerInfos = registry.getRegisterInfos();
		List<Node> nodes = new ArrayList<>();
		Node node;
		for (LayoutTypeRegisterInfo registerInfo : registerInfos) {
			node = new Node();
			node.setName(registerInfo.getType());
			node.setBeanName(registerInfo.getClassType().getName());
			node.initProperties();
			nodes.add(node);
		}
		return nodes;
	}

}
