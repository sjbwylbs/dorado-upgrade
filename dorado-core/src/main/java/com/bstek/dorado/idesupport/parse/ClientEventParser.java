package com.bstek.dorado.idesupport.parse;

import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.xml.ConfigurableDispatchableXmlParser;
import com.bstek.dorado.idesupport.model.ClientEvent;

public class ClientEventParser extends ConfigurableDispatchableXmlParser {

	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		Element element = (Element) node;
		ClientEvent event = new ClientEvent();
		Map<String, Object> properties = this.parseProperties(element, context);

		String clientTypesText = (String) properties.remove("clientTypes");
		int clientTypes = ClientType.parseClientTypes(clientTypesText);
		if (clientTypes > 0) {
			event.setClientTypes(clientTypes);
		}

		BeanUtils.copyProperties(event, properties);
		return event;
	}

}
