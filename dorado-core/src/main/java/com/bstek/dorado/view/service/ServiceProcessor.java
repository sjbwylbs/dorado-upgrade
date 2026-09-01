package com.bstek.dorado.view.service;

import java.io.Writer;

import com.bstek.dorado.web.DoradoContext;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.servlet.http.HttpServletResponse;

/**
 * 用于为客户端提供Ajax服务的处理器。
 *
 */
public interface ServiceProcessor {

	/**
	 * 执行服务处理。
	 * @param writer 面向客户端Response输出流的输出器。
	 * @param jsonNode 客户端提交的信息。
	 * @param context Dorado上下文对象。
	 * @throws Exception
	 */
	void execute(Writer writer, ObjectNode objectNode, DoradoContext context, HttpServletResponse response)
			throws Exception;

}
