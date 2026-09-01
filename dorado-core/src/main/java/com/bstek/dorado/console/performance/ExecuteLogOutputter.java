package com.bstek.dorado.console.performance;

import com.bstek.dorado.console.Logger;

/**
 * 执行日志输出器抽象类
 *
 */
public abstract class ExecuteLogOutputter {

	private static final Logger logger = Logger.getLog(ExecuteLogOutputter.class);

	/**
	 * 输出开始日志
	 * @param type 服务类型
	 * @param serviceName 服务名称
	 * @param message 日志消息
	 * @return
	 */
	public void outStartLog(String type, String serviceName, String message) {
		logger.info(doOutStartLog(type, serviceName, message));
	}

	/**
	 * 输出结束日志
	 * @param type 服务类型
	 * @param serviceName 服务名称
	 * @param message 日志消息
	 * @return
	 */

	public void outEndLog(String type, String serviceName, String message) {
		logger.info(doOutEndLog(type, serviceName, message));
	}

	/**
	 * @param type
	 * @param serviceName
	 * @param message
	 * @return
	 */
	protected abstract String doOutStartLog(String type, String serviceName, String message);

	/**
	 * @param type
	 * @param serviceName
	 * @param message
	 * @return
	 */
	protected abstract String doOutEndLog(String type, String serviceName, String message);

}
