package com.bstek.dorado.view.resolver;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.StringEscapeUtils;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.web.DoradoContext;

public class DefaultClientSettingsOutputter extends ClientSettingsOutputter {

	@Override
	public void output(Writer writer) throws IOException {
		DoradoContext context = DoradoContext.getCurrent();

		String contextPath = Configure.getString("web.contextPath");
		if (StringUtils.isEmpty(contextPath)) {
			contextPath = context.getRequest().getContextPath();
		}
		writer.append("\"common.contextPath\":\"").append(StringEscapeUtils.escapeEcmaScript(contextPath)).append("\"");

		if (Configure.getBoolean("view.debugEnabled")) {
			writeSetting(writer, "common.debugEnabled", true, false);
		}
		if (Configure.getBoolean("view.showExceptionStackTrace")) {
			writeSetting(writer, "common.showExceptionStackTrace", true, false);
		}
		if (Configure.getBoolean("view.enterAsTab")) {
			writeSetting(writer, "common.enterAsTab", true, false);
		}
		if (Configure.getBoolean("view.preventBackspace")) {
			writeSetting(writer, "common.preventBackspace", true, true);
		}
		if (Configure.getBoolean("view.abortAsyncLoadingOnSyncLoading")) {
			writeSetting(writer, "common.abortAsyncLoadingOnSyncLoading", true, false);
		}

		writeSetting(writer, "widget.skinRoot", ">dorado/client/skins/", true);
		writeSetting(writer, "widget.skin", context.getAttribute("view.skin"), true);

		if (Configure.getBoolean("view.lazyInitFloatControl")) {
			writeSetting(writer, "widget.lazyInitFloatControl", true, false);
		}
		if (Configure.getBoolean("view.javaScript.bindAfterChildrenCreate")) {
			writeSetting(writer, "widget.bindControllerAfterChildrenCreate", true, false);
		}
		if (Configure.getBoolean("view.javaScript.fireViewOnCreateForOldController")) {
			writeSetting(writer, "widget.fireViewOnCreateForOldController", true, false);
		}
	}

}
