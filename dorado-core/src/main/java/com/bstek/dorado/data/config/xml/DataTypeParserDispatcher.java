package com.bstek.dorado.data.config.xml;

import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.xml.XmlConstants;
import com.bstek.dorado.config.xml.XmlParseException;
import com.bstek.dorado.config.xml.XmlParser;
import com.bstek.dorado.config.xml.XmlParserHelper;
import com.bstek.dorado.data.Constants;
import com.bstek.dorado.data.config.definition.DataTypeDefinition;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.data.type.manager.DataTypeTypeRegisterInfo;
import com.bstek.dorado.data.type.manager.DataTypeTypeRegistry;

public class DataTypeParserDispatcher extends GenericParser {

	private DataTypeTypeRegistry dataTypeTypeRegistry;

	private XmlParserHelper xmlParserHelper;

	public void setDataTypeTypeRegistry(DataTypeTypeRegistry dataTypeTypeRegistry) {
		this.dataTypeTypeRegistry = dataTypeTypeRegistry;
	}

	public void setXmlParserHelper(XmlParserHelper xmlParserHelper) {
		this.xmlParserHelper = xmlParserHelper;
	}

	protected boolean shouldProcessImport() {
		return false;
	}

	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		Element element = (Element) node;
		DataParseContext dataContext = (DataParseContext) context;
		Set<Node> parsingNodes = dataContext.getParsingNodes();
		Map<String, DataTypeDefinition> parsedDataTypes = dataContext.getParsedDataTypes();

		String name = element.getAttribute(XmlConstants.ATTRIBUTE_NAME);
		if (StringUtils.isEmpty(name)) {
			throw new XmlParseException("DataType name undefined.", element, context);
		}

		NodeWrapper nodeWrapper = dataContext.getConfiguredDataTypes().get(name);
		boolean isGlobal = (nodeWrapper != null && nodeWrapper.getNode() == node);

		DataTypeDefinition dataType = parsedDataTypes.get(name);
		if (dataType != null) {
			return dataType;
		}

		XmlParser parser = null;
		String type = element.getAttribute(DataXmlConstants.ATTRIBUTE_DATATYPE_TYPE);
		DataTypeTypeRegisterInfo registryInfo = dataTypeTypeRegistry.getTypeRegistryInfo(type);
		if (registryInfo != null) {
			Class<? extends DataType> classType = registryInfo.getClassType();
			parser = xmlParserHelper.getXmlParser(classType);
		}
		else {
			throw new XmlParseException("Unrecognized DataType type[" + type + "].", element, context);
		}

		if (parser == null) {
			throw new XmlParseException("Can not get Parser for DataType of [" + type + "] type.", element, context);
		}

		if (isGlobal) {
			parsingNodes.add(element);
			dataContext.setPrivateObjectName(Constants.PRIVATE_DATA_OBJECT_PREFIX
					+ DataXmlConstants.PATH_DATE_TYPE_SHORT_NAME + Constants.PRIVATE_DATA_OBJECT_SUBFIX + name);

			dataType = (DataTypeDefinition) parser.parse(node, dataContext);

			dataContext.restorePrivateObjectName();
			parsingNodes.clear();
		}
		else {
			String privateNameSection = dataContext.getPrivateNameSection(node);
			if (privateNameSection != null) {
				dataContext.setPrivateObjectNameSection(privateNameSection);
			}
			name = dataContext.getPrivateObjectName();

			dataType = (DataTypeDefinition) parser.parse(node, dataContext);

			if (privateNameSection != null) {
				dataContext.restorePrivateObjectName();
			}
		}

		if (dataType != null) {
			dataType.setName(name);
			parsedDataTypes.put(name, dataType);
		}
		return dataType;
	}

}
