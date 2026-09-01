package com.bstek.dorado.core.xml;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;

import com.bstek.dorado.core.Constants;
import com.bstek.dorado.core.io.Resource;

/**
 * XML读取工具类的默认实现。
 *
 */
public class XercesXmlDocumentBuilder implements XmlDocumentBuilder {

	private static final Log logger = LogFactory.getLog(XercesXmlDocumentBuilder.class);

	protected DocumentBuilder getDocumentBuilder() throws ParserConfigurationException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setIgnoringElementContentWhitespace(true);
		factory.setIgnoringComments(true);
		// 防止 Blind XXE 攻击
		try {
			factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
			factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
			factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
		} catch (ParserConfigurationException e) {
			// 某些解析器不支持这些特性，回退到基本保护
			factory.setExpandEntityReferences(false);
		}
		return factory.newDocumentBuilder();
	}

	@Override
	public Document newDocument() throws Exception {
		return getDocumentBuilder().newDocument();
	}

	@Override
	public Document loadDocument(Resource resource) throws Exception {
		if (logger.isDebugEnabled()) {
			logger.debug("Loading XML from " + resource);
		}

		InputStream in = resource.getInputStream();
		try {
			return getDocumentBuilder().parse(in);
		}
		finally {
			in.close();
		}
	}

	@Override
	public Document loadDocument(Resource resource, String charset) throws Exception {
		if (logger.isDebugEnabled()) {
			logger.debug("Loading XML from " + resource);
		}

		if (StringUtils.isEmpty(charset)) {
			charset = Constants.DEFAULT_CHARSET;
		}

		InputStream in = resource.getInputStream();
		Reader reader = new InputStreamReader(in, charset);
		try {
			return getDocumentBuilder().parse(new InputSource(reader));
		}
		finally {
			reader.close();
			in.close();
		}
	}

}
