package com.bstek.dorado.view.resolver;

import java.io.Writer;

import com.bstek.dorado.view.service.ServiceProcessor;
import com.bstek.dorado.web.DoradoContext;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.servlet.http.HttpServletResponse;

public class ViewServiceInvoker {

	public void invoke(String action, ServiceProcessor serviceProcessor, Writer writer, ObjectNode objectNode,
			DoradoContext context, HttpServletResponse response) throws Exception {
		serviceProcessor.execute(writer, objectNode, context, response);
	}

}
