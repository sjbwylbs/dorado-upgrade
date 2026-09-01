package com.bstek.dorado.config.xml;

public interface ObjectParserInitializationAware {

	void postObjectParserInitialized(ObjectParser objectParser) throws Exception;

}
