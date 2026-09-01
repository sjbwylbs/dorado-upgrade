package com.bstek.dorado.console.performance;

/**
 * 默认执行日志输出器
 *
 */
public class DefaultExecuteLogOutputter extends ExecuteLogOutputter {

	@Override
	protected String doOutStartLog(String type, String serviceName, String message) {
		// TODO Auto-generated method stub
		return String.format(" Executing %s : %s , %s. [Start]", type, serviceName, message);
	}

	@Override
	protected String doOutEndLog(String type, String serviceName, String message) {
		// TODO Auto-generated method stub
		return String.format(" Successfully completed %s : %s , %s. [End]", type, serviceName, message);
	}

}
