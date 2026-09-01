package com.bstek.dorado.console.web.outputter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.bstek.dorado.data.type.validator.ValidatorTypeRegisterInfo;
import com.bstek.dorado.data.type.validator.ValidatorTypeRegistry;
import com.bstek.dorado.web.DoradoContext;

public class Validator extends Category {

	private final static String CATEGORY_NAME = "Validator";

	public Validator() {
		super(CATEGORY_NAME);
		// TODO Auto-generated constructor stub
	}

	@Override
	public List<Node> initNodes() {
		ValidatorTypeRegistry registry = (ValidatorTypeRegistry) DoradoContext.getAttachedWebApplicationContext()
			.getBean("dorado.validatorTypeRegistry");
		Collection<ValidatorTypeRegisterInfo> registerInfos = registry.getTypes();
		List<Node> nodes = new ArrayList<>();
		Node node;
		for (ValidatorTypeRegisterInfo registerInfo : registerInfos) {
			node = new Node();
			node.setName(registerInfo.getType());
			node.setBeanName(registerInfo.getClassType().getName());
			node.initProperties();
			nodes.add(node);
		}
		return nodes;
	}

}