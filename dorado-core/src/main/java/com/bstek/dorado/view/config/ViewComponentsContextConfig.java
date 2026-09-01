package com.bstek.dorado.view.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.data.type.validator.ValidatorTypeRegister;
import com.bstek.dorado.data.type.validator.ValidatorTypeRegistry;
import com.bstek.dorado.view.loader.PackagesConfigLoader;
import com.bstek.dorado.view.loader.PackagesConfigManager;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.registry.DefaultComponentTypeRegister;
import com.bstek.dorado.view.registry.LayoutTypeRegister;
import com.bstek.dorado.view.registry.LayoutTypeRegistry;

@Configuration
public class ViewComponentsContextConfig {

	// --- Helper methods ---

	private ValidatorTypeRegister validatorTypeRegister(ValidatorTypeRegistry registry, String type, String classType) {
		ValidatorTypeRegister register = new ValidatorTypeRegister();
		register.setValidatorTypeRegistry(registry);
		register.setType(type);
		register.setClassType(classType);
		return register;
	}

	private LayoutTypeRegister layoutTypeRegister(LayoutTypeRegistry registry, String type, String classType,
			String constraintClassType) {
		LayoutTypeRegister register = new LayoutTypeRegister();
		register.setLayoutTypeRegistry(registry);
		register.setType(type);
		register.setClassType(classType);
		register.setConstraintClassType(constraintClassType);
		return register;
	}

	private DefaultComponentTypeRegister componentTypeRegister(ComponentTypeRegistry registry, String componentClass) {
		DefaultComponentTypeRegister register = new DefaultComponentTypeRegister();
		register.setComponentTypeRegistry(registry);
		return register;
	}

	// --- Packages Config Loader ---

	@Bean
	public PackagesConfigLoader viewPackagesConfigLoader(
			@Qualifier("dorado.packagesConfigManager") PackagesConfigManager packagesConfigManager) {
		PackagesConfigLoader loader = new PackagesConfigLoader();
		loader.setPackagesConfigManager(packagesConfigManager);
		loader.setConfigLocation("com/bstek/dorado/view/packages-config.xml");
		return loader;
	}

	// --- Validator Type Registrations ---

	@Bean
	public ValidatorTypeRegister requiredValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "required",
				"com.bstek.dorado.view.type.property.validator.RequiredValidator");
	}

	@Bean
	public ValidatorTypeRegister lengthValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "length",
				"com.bstek.dorado.view.type.property.validator.LengthValidator");
	}

	@Bean
	public ValidatorTypeRegister charLengthValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "charLength",
				"com.bstek.dorado.view.type.property.validator.CharLengthValidator");
	}

	@Bean
	public ValidatorTypeRegister rangeValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "range",
				"com.bstek.dorado.view.type.property.validator.RangeValidator");
	}

	@Bean
	public ValidatorTypeRegister enumValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "enum",
				"com.bstek.dorado.view.type.property.validator.EnumValidator");
	}

	@Bean
	public ValidatorTypeRegister regExpValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "regExp",
				"com.bstek.dorado.view.type.property.validator.RegExpValidator");
	}

	@Bean
	public ValidatorTypeRegister ajaxValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "ajax",
				"com.bstek.dorado.view.type.property.validator.AjaxValidator");
	}

	@Bean
	public ValidatorTypeRegister customValidatorTypeRegister(
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry registry) {
		return validatorTypeRegister(registry, "custom",
				"com.bstek.dorado.view.type.property.validator.CustomValidator");
	}

	// --- Layout Type Registrations ---

	@Bean
	public LayoutTypeRegister anchorLayoutTypeRegister(
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry registry) {
		return layoutTypeRegister(registry, "anchor",
				"com.bstek.dorado.view.widget.layout.AnchorLayout",
				"com.bstek.dorado.view.widget.layout.AnchorLayoutConstraint");
	}

	@Bean
	public LayoutTypeRegister dockLayoutTypeRegister(
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry registry) {
		return layoutTypeRegister(registry, "dock",
				"com.bstek.dorado.view.widget.layout.DockLayout",
				"com.bstek.dorado.view.widget.layout.DockLayoutConstraint");
	}

	@Bean
	public LayoutTypeRegister hboxLayoutTypeRegister(
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry registry) {
		return layoutTypeRegister(registry, "hbox",
				"com.bstek.dorado.view.widget.layout.HBoxLayout",
				"com.bstek.dorado.view.widget.layout.HBoxLayoutConstraintSupport");
	}

	@Bean
	public LayoutTypeRegister vboxLayoutTypeRegister(
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry registry) {
		return layoutTypeRegister(registry, "vbox",
				"com.bstek.dorado.view.widget.layout.VBoxLayout",
				"com.bstek.dorado.view.widget.layout.VBoxLayoutConstraintSupport");
	}

	@Bean
	public LayoutTypeRegister formLayoutTypeRegister(
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry registry) {
		return layoutTypeRegister(registry, "form",
				"com.bstek.dorado.view.widget.layout.FormLayout",
				"com.bstek.dorado.view.widget.layout.FormLayoutConstraint");
	}

	@Bean
	public LayoutTypeRegister nativeLayoutTypeRegister(
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry registry) {
		return layoutTypeRegister(registry, "native",
				"com.bstek.dorado.view.widget.layout.NativeLayout",
				"com.bstek.dorado.view.widget.layout.CommonLayoutConstraint");
	}

	// --- Component Type Registrations ---

	@Bean("com.bstek.dorado.view.widget.data.DataSet")
	public DefaultComponentTypeRegister dataSetComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.data.DataSet");
	}

	@Bean("com.bstek.dorado.view.widget.DefaultControl")
	public DefaultComponentTypeRegister defaultControlComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.DefaultControl");
	}

	@Bean("com.bstek.dorado.view.widget.Container")
	public DefaultComponentTypeRegister containerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.Container");
	}

	@Bean("com.bstek.dorado.view.widget.HtmlContainer")
	public DefaultComponentTypeRegister htmlContainerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.HtmlContainer");
	}

	@Bean("com.bstek.dorado.view.widget.SubViewHolder")
	public DefaultComponentTypeRegister subViewHolderComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.SubViewHolder");
	}

	@Bean("com.bstek.dorado.view.widget.action.Action")
	public DefaultComponentTypeRegister actionComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.action.Action");
	}

	@Bean("com.bstek.dorado.view.widget.action.AjaxAction")
	public DefaultComponentTypeRegister ajaxActionComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.action.AjaxAction");
	}

	@Bean("com.bstek.dorado.view.widget.action.UpdateAction")
	public DefaultComponentTypeRegister updateActionComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.action.UpdateAction");
	}

	@Bean("com.bstek.dorado.view.widget.action.FormSubmitAction")
	public DefaultComponentTypeRegister formSubmitActionComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.action.FormSubmitAction");
	}

	@Bean("com.bstek.dorado.view.widget.action.LongTask")
	public DefaultComponentTypeRegister longTaskComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.action.LongTask");
	}

	@Bean("com.bstek.dorado.view.widget.base.Button")
	public DefaultComponentTypeRegister buttonComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.Button");
	}

	@Bean("com.bstek.dorado.view.widget.base.SimpleButton")
	public DefaultComponentTypeRegister simpleButtonComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.SimpleButton");
	}

	@Bean("com.bstek.dorado.view.widget.base.SimpleIconButton")
	public DefaultComponentTypeRegister simpleIconButtonComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.SimpleIconButton");
	}

	@Bean("com.bstek.dorado.view.widget.base.Panel")
	public DefaultComponentTypeRegister panelComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.Panel");
	}

	@Bean("com.bstek.dorado.view.widget.base.GroupBox")
	public DefaultComponentTypeRegister groupBoxComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.GroupBox");
	}

	@Bean("com.bstek.dorado.view.widget.base.FieldSet")
	public DefaultComponentTypeRegister fieldSetComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.FieldSet");
	}

	@Bean("com.bstek.dorado.view.widget.base.IFrame")
	public DefaultComponentTypeRegister iFrameComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.IFrame");
	}

	@Bean("com.bstek.dorado.view.widget.base.CardBook")
	public DefaultComponentTypeRegister cardBookComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.CardBook");
	}

	@Bean("com.bstek.dorado.view.widget.base.tab.TabControl")
	public DefaultComponentTypeRegister tabControlComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.tab.TabControl");
	}

	@Bean("com.bstek.dorado.view.widget.base.tab.VerticalTabControl")
	public DefaultComponentTypeRegister verticalTabControlComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.tab.VerticalTabControl");
	}

	@Bean("com.bstek.dorado.view.widget.base.tab.TabBar")
	public DefaultComponentTypeRegister tabBarComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.tab.TabBar");
	}

	@Bean("com.bstek.dorado.view.widget.base.tab.TabColumn")
	public DefaultComponentTypeRegister tabColumnComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.tab.TabColumn");
	}

	@Bean("com.bstek.dorado.view.widget.base.toolbar.ToolBar")
	public DefaultComponentTypeRegister toolBarComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.toolbar.ToolBar");
	}

	@Bean("com.bstek.dorado.view.widget.base.SplitPanel")
	public DefaultComponentTypeRegister splitPanelComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.SplitPanel");
	}

	@Bean("com.bstek.dorado.view.widget.base.accordion.Accordion")
	public DefaultComponentTypeRegister accordionComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.accordion.Accordion");
	}

	@Bean("com.bstek.dorado.view.widget.base.Slider")
	public DefaultComponentTypeRegister sliderComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.Slider");
	}

	@Bean("com.bstek.dorado.view.widget.base.ProgressBar")
	public DefaultComponentTypeRegister progressBarComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.ProgressBar");
	}

	@Bean("com.bstek.dorado.view.widget.base.Tip")
	public DefaultComponentTypeRegister tipComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.Tip");
	}

	@Bean("com.bstek.dorado.view.widget.base.FloatContainer")
	public DefaultComponentTypeRegister floatContainerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.FloatContainer");
	}

	@Bean("com.bstek.dorado.view.widget.base.FloatPanel")
	public DefaultComponentTypeRegister floatPanelComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.FloatPanel");
	}

	@Bean("com.bstek.dorado.view.widget.base.Dialog")
	public DefaultComponentTypeRegister dialogComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.Dialog");
	}

	@Bean("com.bstek.dorado.view.widget.base.menu.Menu")
	public DefaultComponentTypeRegister menuComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.menu.Menu");
	}

	@Bean("com.bstek.dorado.view.widget.base.DatePicker")
	public DefaultComponentTypeRegister datePickerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.DatePicker");
	}

	@Bean("com.bstek.dorado.view.widget.base.YearMonthPicker")
	public DefaultComponentTypeRegister yearMonthPickerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.base.YearMonthPicker");
	}

	@Bean("com.bstek.dorado.view.widget.form.Label")
	public DefaultComponentTypeRegister labelComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.Label");
	}

	@Bean("com.bstek.dorado.view.widget.form.DataLabel")
	public DefaultComponentTypeRegister dataLabelComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.DataLabel");
	}

	@Bean("com.bstek.dorado.view.widget.form.Link")
	public DefaultComponentTypeRegister linkComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.Link");
	}

	@Bean("com.bstek.dorado.view.widget.form.Image")
	public DefaultComponentTypeRegister imageComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.Image");
	}

	@Bean("com.bstek.dorado.view.widget.form.TemplateField")
	public DefaultComponentTypeRegister templateFieldComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.TemplateField");
	}

	@Bean("com.bstek.dorado.view.widget.form.TextEditor")
	public DefaultComponentTypeRegister textEditorComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.TextEditor");
	}

	@Bean("com.bstek.dorado.view.widget.form.PasswordEditor")
	public DefaultComponentTypeRegister passwordEditorComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.PasswordEditor");
	}

	@Bean("com.bstek.dorado.view.widget.form.TextArea")
	public DefaultComponentTypeRegister textAreaComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.TextArea");
	}

	@Bean("com.bstek.dorado.view.widget.form.CheckBox")
	public DefaultComponentTypeRegister checkBoxComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.CheckBox");
	}

	@Bean("com.bstek.dorado.view.widget.form.RadioGroup")
	public DefaultComponentTypeRegister radioGroupComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.RadioGroup");
	}

	@Bean("com.bstek.dorado.view.widget.form.DataMessage")
	public DefaultComponentTypeRegister dataMessageComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.DataMessage");
	}

	@Bean("com.bstek.dorado.view.widget.form.FormProfile")
	public DefaultComponentTypeRegister formProfileComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.FormProfile");
	}

	@Bean("com.bstek.dorado.view.widget.form.FormElement")
	public DefaultComponentTypeRegister formElementComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.FormElement");
	}

	@Bean("com.bstek.dorado.view.widget.form.autoform.AutoForm")
	public DefaultComponentTypeRegister autoFormComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.autoform.AutoForm");
	}

	@Bean("com.bstek.dorado.view.widget.form.NumberSpinner")
	public DefaultComponentTypeRegister numberSpinnerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.NumberSpinner");
	}

	@Bean("com.bstek.dorado.view.widget.form.DateTimeSpinner")
	public DefaultComponentTypeRegister dateTimeSpinnerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.DateTimeSpinner");
	}

	@Bean("com.bstek.dorado.view.widget.form.CustomSpinner")
	public DefaultComponentTypeRegister customSpinnerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.CustomSpinner");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.Trigger")
	public DefaultComponentTypeRegister triggerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.Trigger");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.ListDropDown")
	public DefaultComponentTypeRegister listDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.ListDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.DataSetDropDown")
	public DefaultComponentTypeRegister dataSetDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.DataSetDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.AutoMappingDropDown")
	public DefaultComponentTypeRegister autoMappingDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.AutoMappingDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.DateDropDown")
	public DefaultComponentTypeRegister dateDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.DateDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.YearMonthDropDown")
	public DefaultComponentTypeRegister yearMonthDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.YearMonthDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.YearDropDown")
	public DefaultComponentTypeRegister yearDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.YearDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.MonthDropDown")
	public DefaultComponentTypeRegister monthDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.MonthDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.form.trigger.CustomDropDown")
	public DefaultComponentTypeRegister customDropDownComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.form.trigger.CustomDropDown");
	}

	@Bean("com.bstek.dorado.view.widget.datacontrol.DataPilot")
	public DefaultComponentTypeRegister dataPilotComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.datacontrol.DataPilot");
	}

	@Bean("com.bstek.dorado.view.widget.list.ListBox")
	public DefaultComponentTypeRegister listBoxComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.list.ListBox");
	}

	@Bean("com.bstek.dorado.view.widget.list.DataListBox")
	public DefaultComponentTypeRegister dataListBoxComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.list.DataListBox");
	}

	@Bean("com.bstek.dorado.view.widget.grid.Grid")
	public DefaultComponentTypeRegister gridComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.grid.Grid");
	}

	@Bean("com.bstek.dorado.view.widget.grid.DataGrid")
	public DefaultComponentTypeRegister dataGridComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.grid.DataGrid");
	}

	@Bean("com.bstek.dorado.view.widget.tree.Tree")
	public DefaultComponentTypeRegister treeComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.tree.Tree");
	}

	@Bean("com.bstek.dorado.view.widget.tree.DataTree")
	public DefaultComponentTypeRegister dataTreeComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.tree.DataTree");
	}

	@Bean("com.bstek.dorado.view.widget.blockview.BlockView")
	public DefaultComponentTypeRegister blockViewComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.blockview.BlockView");
	}

	@Bean("com.bstek.dorado.view.widget.blockview.DataBlockView")
	public DefaultComponentTypeRegister dataBlockViewComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.blockview.DataBlockView");
	}

	@Bean("com.bstek.dorado.view.widget.treegrid.TreeGrid")
	public DefaultComponentTypeRegister treeGridComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.treegrid.TreeGrid");
	}

	@Bean("com.bstek.dorado.view.widget.treegrid.DataTreeGrid")
	public DefaultComponentTypeRegister dataTreeGridComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.treegrid.DataTreeGrid");
	}

	@Bean("com.bstek.dorado.view.widget.advance.TagEditor")
	public DefaultComponentTypeRegister tagEditorComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.advance.TagEditor");
	}

	@Bean("com.bstek.dorado.view.widget.advance.ColorPicker")
	public DefaultComponentTypeRegister colorPickerComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.advance.ColorPicker");
	}

	@Bean("com.bstek.dorado.view.widget.advance.ColorEditor")
	public DefaultComponentTypeRegister colorEditorComponentTypeRegister(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry registry) {
		return componentTypeRegister(registry, "com.bstek.dorado.view.widget.advance.ColorEditor");
	}
}
