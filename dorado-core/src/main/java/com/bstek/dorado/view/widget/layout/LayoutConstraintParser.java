package com.bstek.dorado.view.widget.layout;

import java.util.Map;

import com.bstek.dorado.config.definition.ObjectDefinition;
import com.bstek.dorado.config.text.ConfigurableDispatchableTextParser;
import com.bstek.dorado.config.text.DispatchableTextParser;
import com.bstek.dorado.config.text.TextParseContext;

/**
 * 视图中布局条件的解析器的抽象类。
 *
 */
public class LayoutConstraintParser extends ConfigurableDispatchableTextParser {

	@Override
	public boolean supportsHeader() {
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object parse(char[] charArray, TextParseContext context) throws Exception {
		ObjectDefinition layoutDefinition = new ObjectDefinition();
		layoutDefinition.setImplType(CommonLayoutConstraint.class);

		Map<String, Object> attributes = (Map<String, Object>) super.parse(charArray, context);
		for (Map.Entry<String, Object> entry : attributes.entrySet()) {
			String key = entry.getKey();
			if (DispatchableTextParser.HEADER_ATTRIBUTE.equals(key)) {
				layoutDefinition.setProperty("type", entry.getValue());
			}
			else {
				layoutDefinition.setProperty(key, entry.getValue());
			}
		}
		return layoutDefinition;
	}

}
