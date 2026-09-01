package com.bstek.dorado.console;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.console.addon.AddonController;
import com.bstek.dorado.console.jdbc.BaseDao;
import com.bstek.dorado.console.parser.ParserTree;
import com.bstek.dorado.console.performance.CreateViewLogOutputter;
import com.bstek.dorado.console.performance.DefaultExecuteLogOutputter;
import com.bstek.dorado.console.performance.PerformanceController;
import com.bstek.dorado.console.performance.dao.PerformanceDao;
import com.bstek.dorado.console.runtime.DoradoConfigController;
import com.bstek.dorado.console.runtime.SystemPropertyController;
import com.bstek.dorado.console.system.log.console.SystemOutMonitor;
import com.bstek.dorado.console.system.log.file.FileReaderController;
import com.bstek.dorado.console.system.log.file.FileReaderManager;
import com.bstek.dorado.console.web.DoradoObjectController;
import com.bstek.dorado.console.web.OutputterController;
import com.bstek.dorado.console.web.PackageController;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.core.store.H2BaseStore;
import com.bstek.dorado.view.output.ClientOutputHelper;
import com.bstek.dorado.web.loader.ConsoleStartedMessagesOutputter;

@Configuration
public class ConsoleContextConfig {

	@Bean("dorado.sqlBaseStore.doradoConsole")
	public H2BaseStore sqlBaseStoreDoradoConsole() {
		H2BaseStore bean = new H2BaseStore();
		bean.setDriverClassName("org.h2.Driver");
		bean.setUsername("dorado");
		bean.setPassword("www.bstek.com");
		bean.setVersion(1);
		bean.setInitScriptFiles(List.of("classpath:com/bstek/dorado/console/dorado-console-store.sql"));
		return bean;
	}

	@Bean("dorado.console.baseDao")
	public BaseDao baseDao(
			@Qualifier("dorado.sqlBaseStore.doradoConsole") H2BaseStore sqlBaseStoreDoradoConsole) {
		BaseDao bean = new BaseDao();
		bean.setBaseStoreSupport(sqlBaseStoreDoradoConsole);
		return bean;
	}

	@Bean("dorado.console.performanceDao")
	public PerformanceDao performanceDao(
			@Qualifier("dorado.sqlBaseStore.doradoConsole") H2BaseStore sqlBaseStoreDoradoConsole) {
		PerformanceDao bean = new PerformanceDao();
		bean.setBaseStoreSupport(sqlBaseStoreDoradoConsole);
		return bean;
	}

	@Bean("dorado.console.addonController")
	public AddonController addonController() {
		return new AddonController();
	}

	@Bean("dorado.console.Starter")
	public Starter starter(
			@Qualifier("dorado.consoleStartedMessagesOutputter") ConsoleStartedMessagesOutputter consoleStartedMessagesOutputter) {
		Starter bean = new Starter();
		bean.setOrder(10);
		bean.setConsoleStartedMessagesOutputter(consoleStartedMessagesOutputter);
		return bean;
	}

	@Bean("dorado.console.main")
	public Main main(
			@Qualifier("dorado.console.addonController") AddonController addonController,
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		Main bean = new Main();
		bean.setAddonController(addonController);
		bean.setExpressionHandler(expressionHandler);
		return bean;
	}

	@Bean("dorado.console.login")
	public Login login() {
		return new Login();
	}

	@Bean("dorado.console.systemPropertyController")
	public SystemPropertyController systemPropertyController() {
		return new SystemPropertyController();
	}

	@Bean("dorado.console.doradoConfigController")
	public DoradoConfigController doradoConfigController() {
		return new DoradoConfigController();
	}

	@Bean("dorado.console.parserTree")
	public ParserTree parserTree() {
		return new ParserTree();
	}

	@Bean("dorado.console.systemOutMonitor")
	public SystemOutMonitor systemOutMonitor() {
		return new SystemOutMonitor();
	}

	@Bean("dorado.console.fileReaderManager")
	public FileReaderManager fileReaderManager() {
		return new FileReaderManager();
	}

	@Bean("dorado.console.fileReaderController")
	public FileReaderController fileReaderController(
			@Qualifier("dorado.console.fileReaderManager") FileReaderManager fileReaderManager) {
		FileReaderController bean = new FileReaderController();
		bean.setFileReaderManager(fileReaderManager);
		return bean;
	}

	@Bean("dorado.console.doradoObjectController")
	public DoradoObjectController doradoObjectController() {
		return new DoradoObjectController();
	}

	@Bean("dorado.console.performanceController")
	public PerformanceController performanceController(
			@Qualifier("dorado.console.performanceDao") PerformanceDao performanceDao) {
		PerformanceController bean = new PerformanceController();
		bean.setPerformanceDao(performanceDao);
		return bean;
	}

	@Bean("dorado.console.outputterController")
	public OutputterController outputterController(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper) {
		OutputterController bean = new OutputterController();
		bean.setClientOutputHelper(clientOutputHelper);
		return bean;
	}

	@Bean("dorado.console.packageController")
	public PackageController packageController() {
		return new PackageController();
	}

	@Bean("dorado.console.DefaultExecuteLogOutputter")
	public DefaultExecuteLogOutputter defaultExecuteLogOutputter() {
		return new DefaultExecuteLogOutputter();
	}

	@Bean("dorado.console.CreateViewLogOutputter")
	public CreateViewLogOutputter createViewLogOutputter() {
		return new CreateViewLogOutputter();
	}

}
