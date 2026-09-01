package com.bstek.dorado.console.performance;

/**
 * View创建过程日志输出器
 *
 */
public class CreateViewLogOutputter extends ExecuteLogOutputter {

	@Override
	protected String doOutStartLog(String type, String serviceName, String message) {
		// TODO Auto-generated method stub
		return String.format(" Processing %s , request url=%s. [Start]", serviceName, message);
	}

	@Override
	protected String doOutEndLog(String type, String serviceName, String message) {
		// TODO Auto-generated method stub
		return String.format(" Successfully completed %s. [End]", serviceName);
	}

}
