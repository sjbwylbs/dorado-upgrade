package com.bstek.dorado.data.config.xml;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.core.el.AbstractExpression;
import com.bstek.dorado.core.el.EvaluateMode;
import com.bstek.dorado.core.el.Expression;
import com.bstek.dorado.util.xml.DomUtils;

public class MapValuesParser extends DataElementParser {

	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		String text;
		if (node instanceof Element) {
			text = DomUtils.getTextContent((Element) node);
		}
		else {
			text = node.getNodeValue();
		}

		if (StringUtils.isNotEmpty(text)) {
			Expression expression = getExpressionHandler().compile(text);
			if (expression != null) {
				if (expression.getEvaluateMode() == EvaluateMode.onInstantiate
						&& expression instanceof AbstractExpression) {
					((AbstractExpression) expression).setEvaluateMode(EvaluateMode.onFirstRead);
				}
				return expression;
			}
		}

		return super.doParse(node, context);
	}

}
