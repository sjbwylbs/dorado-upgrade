package com.bstek.dorado.view.service;

import java.io.Writer;
import java.util.List;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.data.JsonUtils;
import com.bstek.dorado.data.ParameterWrapper;
import com.bstek.dorado.data.variant.MetaData;
import com.bstek.dorado.util.Assert;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.resolver.ViewServiceResolver;
import com.bstek.dorado.web.DoradoContext;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class RemoteServiceProcessor extends AbstractRemoteServiceProcessor {

	public static final String SERVICE_NAME_ATTRIBUTE = ViewServiceResolver.class.getName() + ".serviceName";

	@Override
	protected void doExecute(Writer writer, ObjectNode objectNode, DoradoContext context) throws Exception {
		String serviceName = JsonUtils.getString(objectNode, "service");
		Assert.notEmpty(serviceName);
		context.setAttribute(SERVICE_NAME_ATTRIBUTE, serviceName);

		Object parameter = jsonToJavaObject(objectNode.get("parameter"), null, null, false);
		MetaData sysParameter = (MetaData) jsonToJavaObject(objectNode.get("sysParameter"), null, null, false);

		if (sysParameter != null && !sysParameter.isEmpty()) {
			parameter = new ParameterWrapper(parameter, sysParameter);
		}

		Object returnValue = invokeRemoteService(writer, context, serviceName, parameter, null, null, null);

		boolean supportsEntity = JsonUtils.getBoolean(objectNode, "supportsEntity");
		OutputContext outputContext = new OutputContext(writer);
		if (supportsEntity) {
			List<String> loadedDataTypes = JsonUtils.get(objectNode, "loadedDataTypes",
					new TypeReference<List<String>>() {
					});

			outputContext.setLoadedDataTypes(loadedDataTypes);
		}
		outputContext.setUsePrettyJson(Configure.getBoolean("view.outputPrettyJson"));
		outputContext.setShouldOutputDataTypes(supportsEntity);

		outputResult(returnValue, outputContext);
	}

}
