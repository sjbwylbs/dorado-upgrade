package com.bstek.dorado.web.loader;

import java.io.Writer;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.core.Configure;

public class RunModeConsoleStartedMessageOutputter extends ConsoleStartedMessageOutputter {

	@Override
	public void output(Writer writer) throws Exception {
		String runMode = Configure.getString("core.runMode");
		if (StringUtils.isNotEmpty(runMode) && !"production".equalsIgnoreCase(runMode)) {
			writer.append("WARN:\n")
				.append("Dorado is currently running in " + runMode
						+ " mode, you may need to change the setting for \"core.runMode\".");
		}
	}

}
