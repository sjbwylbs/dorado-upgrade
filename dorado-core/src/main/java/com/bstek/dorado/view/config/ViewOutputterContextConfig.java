package com.bstek.dorado.view.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.bstek.dorado.core.resource.LocaleResolver;
import com.bstek.dorado.view.TopViewOutputter;
import com.bstek.dorado.view.ViewContextPropertyOutputter;
import com.bstek.dorado.view.ViewOutputter;
import com.bstek.dorado.view.config.attachment.AttachedResourceManager;
import com.bstek.dorado.view.manager.ViewConfigManager;
import com.bstek.dorado.view.output.AssembledComponentDefOutputter;
import com.bstek.dorado.view.output.ClientEventListenersOutputter;
import com.bstek.dorado.view.output.ClientObjectOutputter;
import com.bstek.dorado.view.output.ClientOutputHelper;
import com.bstek.dorado.view.output.DataOutputter;
import com.bstek.dorado.view.output.DataProviderPropertyOutputter;
import com.bstek.dorado.view.output.DataResolverPropertyOutputter;
import com.bstek.dorado.view.output.DefaultPropertyOutputter;
import com.bstek.dorado.view.output.DoradoMapOutputter;
import com.bstek.dorado.view.output.ObjectOutputterDispatcher;
import com.bstek.dorado.view.output.Outputter;
import com.bstek.dorado.view.output.PositiveViewDataTypesOutputter;
import com.bstek.dorado.view.output.ResourceCalloutOutputter;
import com.bstek.dorado.view.output.StringAliasPropertyOutputter;
import com.bstek.dorado.view.output.StylePropertyOutputter;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.resolver.PageFooterOutputter;
import com.bstek.dorado.view.resolver.PageHeaderOutputter;
import com.bstek.dorado.view.resolver.SkinResolver;
import com.bstek.dorado.view.resolver.SkinSettingManager;
import com.bstek.dorado.view.type.DataTypePropertyOutputter;
import com.bstek.dorado.view.type.DefaultValueOutputter;
import com.bstek.dorado.view.type.PropertyDefsOutputter;
import com.bstek.dorado.view.type.property.MappingPropertyOutputter;
import com.bstek.dorado.view.widget.ComponentOutputter;
import com.bstek.dorado.view.widget.ComponentOutputterDispatcher;
import com.bstek.dorado.view.widget.ComponentReferencePropertyOutputter;
import com.bstek.dorado.view.widget.ContainerOutputter;
import com.bstek.dorado.view.widget.ControlOutputter;
import com.bstek.dorado.view.widget.HtmlContainerOutputter;
import com.bstek.dorado.view.widget.SubViewNamePropertyOutputter;
import com.bstek.dorado.view.widget.SubViewPropertyOutputter;
import com.bstek.dorado.view.widget.data.DataSetDataPropertyOutputter;
import com.bstek.dorado.view.widget.layout.LayoutConstraintPropertyOutputter;

@Configuration
public class ViewOutputterContextConfig {

	// --- Helper methods for abstract/parent beans ---

	protected ClientObjectOutputter objectOutputter() {
		return new ClientObjectOutputter();
	}

	protected ObjectOutputterDispatcher abstractObjectOutputterDispatcher(ClientOutputHelper clientOutputHelper,
			Outputter objectOutputter) {
		ObjectOutputterDispatcher dispatcher = new ObjectOutputterDispatcher();
		dispatcher.setClientOutputHelper(clientOutputHelper);
		dispatcher.setDefaultObjectOutputter(objectOutputter);
		return dispatcher;
	}

	protected DataOutputter dataOutputter() {
		return new DataOutputter();
	}

	protected ComponentOutputterDispatcher abstractComponentOutputterDispatcher(ClientOutputHelper clientOutputHelper,
			Outputter objectOutputter, ComponentTypeRegistry componentTypeRegistry) {
		ComponentOutputterDispatcher dispatcher = new ComponentOutputterDispatcher();
		dispatcher.setClientOutputHelper(clientOutputHelper);
		dispatcher.setDefaultObjectOutputter(objectOutputter);
		dispatcher.setComponentTypeRegistry(componentTypeRegistry);
		return dispatcher;
	}

	// --- Basic Outputters ---

	@Bean("dorado.clientOutputHelper")
	public ClientOutputHelper clientOutputHelper() {
		return new ClientOutputHelper();
	}

	@Bean("dorado.objectOutputter")
	@Scope("prototype")
	public ClientObjectOutputter objectOutputterBean() {
		return objectOutputter();
	}

	@Bean("dorado.dataOutputter")
	public DataOutputter dataOutputterBean() {
		return dataOutputter();
	}

	@Bean("dorado.defaultPropertyOutputter")
	public DefaultPropertyOutputter defaultPropertyOutputter(
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter) {
		DefaultPropertyOutputter bean = new DefaultPropertyOutputter();
		bean.setObjectOutputter(objectOutputter);
		return bean;
	}

	@Bean("dorado.objectOutputterDispatcher")
	public ObjectOutputterDispatcher objectOutputterDispatcher(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter) {
		return abstractObjectOutputterDispatcher(clientOutputHelper, objectOutputter);
	}

	@Bean("dorado.componentOutputterDispatcher")
	public ComponentOutputterDispatcher componentOutputterDispatcher(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry) {
		return abstractComponentOutputterDispatcher(clientOutputHelper, objectOutputter, componentTypeRegistry);
	}

	@Bean("dorado.resourceCalloutOutputter")
	public ResourceCalloutOutputter resourceCalloutOutputter() {
		return new ResourceCalloutOutputter();
	}

	// --- Property Outputters ---

	@Bean("dorado.stringAliasPropertyOutputter")
	public StringAliasPropertyOutputter stringAliasPropertyOutputter() {
		return new StringAliasPropertyOutputter();
	}

	@Bean("dorado.doradoMapPropertyOutputter")
	public DoradoMapOutputter doradoMapPropertyOutputter() {
		DoradoMapOutputter bean = new DoradoMapOutputter();
		bean.setEvaluateExpression(false);
		return bean;
	}

	@Bean("dorado.componentReferencePropertyOutputter")
	public ComponentReferencePropertyOutputter componentReferencePropertyOutputter() {
		return new ComponentReferencePropertyOutputter();
	}

	@Bean("dorado.clientEventListenersOutputter")
	public ClientEventListenersOutputter clientEventListenersOutputter() {
		return new ClientEventListenersOutputter();
	}

	@Bean("dorado.assembledComponentDefOutputter")
	public AssembledComponentDefOutputter assembledComponentDefOutputter() {
		return new AssembledComponentDefOutputter();
	}

	// --- Type-related Outputters ---

	@Bean("dorado.dataTypePropertyOutputter")
	public DataTypePropertyOutputter dataTypePropertyOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter) {
		DataTypePropertyOutputter bean = new DataTypePropertyOutputter();
		bean.setClientOutputHelper(clientOutputHelper);
		bean.setDefaultObjectOutputter(objectOutputter);
		return bean;
	}

	@Bean("dorado.mappingPropertyOutputter")
	public MappingPropertyOutputter mappingPropertyOutputter() {
		return new MappingPropertyOutputter();
	}

	@Bean("dorado.propertyDefsOutputter")
	public PropertyDefsOutputter propertyDefsOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter) {
		PropertyDefsOutputter bean = new PropertyDefsOutputter();
		bean.setClientOutputHelper(clientOutputHelper);
		bean.setDefaultObjectOutputter(objectOutputter);
		return bean;
	}

	@Bean("dorado.defaultValueOutputter")
	public DefaultValueOutputter defaultValueOutputter() {
		return new DefaultValueOutputter();
	}

	@Bean("dorado.dataProviderPropertyOutputter")
	public DataProviderPropertyOutputter dataProviderPropertyOutputter() {
		return new DataProviderPropertyOutputter();
	}

	@Bean("dorado.dataResolverPropertyOutputter")
	public DataResolverPropertyOutputter dataResolverPropertyOutputter() {
		return new DataResolverPropertyOutputter();
	}

	@Bean("dorado.stylePropertyOutputter")
	public StylePropertyOutputter stylePropertyOutputter() {
		return new StylePropertyOutputter();
	}

	@Bean("dorado.viewContextPropertyOutputter")
	public ViewContextPropertyOutputter viewContextPropertyOutputter() {
		return new ViewContextPropertyOutputter();
	}

	// --- Component Outputter Chain (prototype) ---

	@Bean("dorado.componentOutputter")
	@Scope("prototype")
	public ComponentOutputter componentOutputter() {
		return new ComponentOutputter();
	}

	@Bean("dorado.controlOutputter")
	@Scope("prototype")
	public ControlOutputter controlOutputter() {
		return new ControlOutputter();
	}

	@Bean("dorado.containerOutputter")
	@Scope("prototype")
	public ContainerOutputter containerOutputter() {
		return new ContainerOutputter();
	}

	@Bean("dorado.viewOutputter")
	@Scope("prototype")
	public ViewOutputter viewOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry,
			@Qualifier("dorado.viewJavaScriptResourceManager") AttachedResourceManager javaScriptResourceManager,
			@Qualifier("dorado.viewStyleSheetResourceManager") AttachedResourceManager styleSheetResourceManager) {
		ViewOutputter bean = new ViewOutputter();
		bean.setUsePrototype(true);

		// childrenComponentOutputter: anonymous bean with parent=componentOutputterDispatcher, escapeable=false
		ComponentOutputterDispatcher childrenOutputter = new ComponentOutputterDispatcher();
		childrenOutputter.setClientOutputHelper(clientOutputHelper);
		childrenOutputter.setDefaultObjectOutputter(objectOutputter);
		childrenOutputter.setComponentTypeRegistry(componentTypeRegistry);
		childrenOutputter.setEscapeable(false);
		bean.setChildrenComponentOutputter(childrenOutputter);

		// viewDataTypesOutputter: anonymous bean with parent=objectOutputterDispatcher
		PositiveViewDataTypesOutputter viewDataTypesOutputter = new PositiveViewDataTypesOutputter();
		viewDataTypesOutputter.setClientOutputHelper(clientOutputHelper);
		viewDataTypesOutputter.setDefaultObjectOutputter(objectOutputter);
		bean.setViewDataTypesOutputter(viewDataTypesOutputter);

		bean.setJavaScriptResourceManager(javaScriptResourceManager);
		bean.setStyleSheetResourceManager(styleSheetResourceManager);
		return bean;
	}

	@Bean("dorado.topViewOutputter")
	public TopViewOutputter topViewOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper) {
		TopViewOutputter bean = new TopViewOutputter();
		bean.setClientOutputHelper(clientOutputHelper);
		return bean;
	}

	// --- Additional Property Outputters ---

	@Bean("dorado.layoutConstraintPropertyOutputter")
	public LayoutConstraintPropertyOutputter layoutConstraintPropertyOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter) {
		LayoutConstraintPropertyOutputter bean = new LayoutConstraintPropertyOutputter();
		bean.setClientOutputHelper(clientOutputHelper);
		bean.setDefaultObjectOutputter(objectOutputter);
		return bean;
	}

	@Bean("dorado.dataSetDataPropertyOutputter")
	public DataSetDataPropertyOutputter dataSetDataPropertyOutputter() {
		return new DataSetDataPropertyOutputter();
	}

	@Bean("dorado.htmlContainerOutputter")
	@Scope("prototype")
	public HtmlContainerOutputter htmlContainerOutputter(
			@Qualifier("dorado.resourceCalloutOutputter") ResourceCalloutOutputter resourceCalloutOutputter) {
		HtmlContainerOutputter bean = new HtmlContainerOutputter();
		bean.setContentFileOutputter(resourceCalloutOutputter);
		return bean;
	}

	@Bean("dorado.subViewNamePropertyOutputter")
	public SubViewNamePropertyOutputter subViewNamePropertyOutputter() {
		return new SubViewNamePropertyOutputter();
	}

	@Bean("dorado.subViewPropertyOutputter")
	public SubViewPropertyOutputter subViewPropertyOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager) {
		SubViewPropertyOutputter bean = new SubViewPropertyOutputter();
		bean.setClientOutputHelper(clientOutputHelper);
		bean.setDefaultObjectOutputter(objectOutputter);
		bean.setViewConfigManager(viewConfigManager);
		return bean;
	}

	// --- Page Header/Footer ---

	@Bean("dorado.pageHeaderOutputter")
	public PageHeaderOutputter pageHeaderOutputter(
			@Qualifier("dorado.topViewOutputter") TopViewOutputter topViewOutputter,
			@Qualifier("dorado.localeResolver") LocaleResolver localeResolver,
			@Qualifier("dorado.viewJavaScriptResourceManager") AttachedResourceManager javaScriptResourceManager,
			@Qualifier("dorado.viewStyleSheetResourceManager") AttachedResourceManager styleSheetResourceManager,
			@Qualifier("dorado.skinSettingManager") SkinSettingManager skinSettingManager,
			@Qualifier("dorado.skinResolver") SkinResolver skinResolver) {
		PageHeaderOutputter bean = new PageHeaderOutputter();
		bean.setTopViewOutputter(topViewOutputter);
		bean.setLocaleResolver(localeResolver);
		bean.setJavaScriptResourceManager(javaScriptResourceManager);
		bean.setStyleSheetResourceManager(styleSheetResourceManager);
		bean.setSkinSettingManager(skinSettingManager);
		bean.setSkinResolver(skinResolver);
		return bean;
	}

	@Bean("dorado.pageFooterOutputter")
	public PageFooterOutputter pageFooterOutputter() {
		return new PageFooterOutputter();
	}
}
