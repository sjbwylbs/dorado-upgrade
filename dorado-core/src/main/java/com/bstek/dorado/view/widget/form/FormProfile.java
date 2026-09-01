package com.bstek.dorado.view.widget.form;

import java.util.Properties;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.ComponentReference;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.Align;
import com.bstek.dorado.view.widget.Component;

@Widget(name = "FormProfile", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.FormProfile", shortTypeName = "FormProfile")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class FormProfile extends Component implements FormConfig {

	private String width;

	private String height;

	private String className;

	private String exClassName;

	private String ui;

	private FormElementType type = FormElementType.text;

	private String trigger;

	private String labelSeparator;

	private boolean showLabel = true;

	private int labelWidth;

	private int labelSpacing;

	private FormElementLabelPosition labelPosition = FormElementLabelPosition.left;

	private Align labelAlign = Align.left;

	private int editorWidth;

	private Properties editorConfig;

	private boolean showHint = true;

	private int hintWidth;

	private int hintSpacing;

	private boolean showHintMessage;

	private FormElementHintPosition hintPosition;

	private boolean readOnly;

	private String dataSet;

	private String dataPath;

	@Override
	public String getWidth() {
		return width;
	}

	@Override
	public void setWidth(String width) {
		this.width = width;
	}

	@Override
	public String getHeight() {
		return height;
	}

	@Override
	public void setHeight(String height) {
		this.height = height;
	}

	@Override
	public String getClassName() {
		return className;
	}

	@Override
	public void setClassName(String className) {
		this.className = className;
	}

	public String getExClassName() {
		return exClassName;
	}

	public void setExClassName(String exClassName) {
		this.exClassName = exClassName;
	}

	@Override
	public String getUi() {
		return ui;
	}

	@Override
	public void setUi(String ui) {
		this.ui = ui;
	}

	@ClientProperty(escapeValue = "text")
	public FormElementType getType() {
		return type;
	}

	public void setType(FormElementType type) {
		this.type = type;
	}

	@ComponentReference("Trigger")
	@IdeProperty(
			enumValues = "triggerClear,autoMappingDropDown1,autoMappingDropDown2,defaultDateDropDown,defaultDateTimeDropDown,defaultYearMonthDropDown,defaultYearDropDown,defaultMonthDropDown")
	public String getTrigger() {
		return trigger;
	}

	public void setTrigger(String trigger) {
		this.trigger = trigger;
	}

	@Override
	public String getLabelSeparator() {
		return labelSeparator;
	}

	@Override
	public void setLabelSeparator(String labelSeparator) {
		this.labelSeparator = labelSeparator;
	}

	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isShowLabel() {
		return showLabel;
	}

	@Override
	public void setShowLabel(boolean showLabel) {
		this.showLabel = showLabel;
	}

	@Override
	public int getLabelWidth() {
		return labelWidth;
	}

	@Override
	public void setLabelWidth(int labelWidth) {
		this.labelWidth = labelWidth;
	}

	@Override
	public int getLabelSpacing() {
		return labelSpacing;
	}

	@Override
	public void setLabelSpacing(int labelSpacing) {
		this.labelSpacing = labelSpacing;
	}

	@Override
	@ClientProperty(escapeValue = "left")
	public FormElementLabelPosition getLabelPosition() {
		return labelPosition;
	}

	@Override
	public void setLabelPosition(FormElementLabelPosition labelPosition) {
		this.labelPosition = labelPosition;
	}

	@Override
	@ClientProperty(escapeValue = "left")
	public Align getLabelAlign() {
		return labelAlign;
	}

	@Override
	public void setLabelAlign(Align labelAlign) {
		this.labelAlign = labelAlign;
	}

	@Override
	public int getEditorWidth() {
		return editorWidth;
	}

	@Override
	public void setEditorWidth(int editorWidth) {
		this.editorWidth = editorWidth;
	}

	public Properties getEditorConfig() {
		return editorConfig;
	}

	public void setEditorConfig(Properties editorConfig) {
		this.editorConfig = editorConfig;
	}

	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isShowHint() {
		return showHint;
	}

	@Override
	public void setShowHint(boolean showHint) {
		this.showHint = showHint;
	}

	@Override
	public int getHintWidth() {
		return hintWidth;
	}

	@Override
	public void setHintWidth(int hintWidth) {
		this.hintWidth = hintWidth;
	}

	@Override
	public int getHintSpacing() {
		return hintSpacing;
	}

	@Override
	public void setHintSpacing(int hintSpacing) {
		this.hintSpacing = hintSpacing;
	}

	@Override
	public boolean isShowHintMessage() {
		return showHintMessage;
	}

	@Override
	public void setShowHintMessage(boolean showHintMessage) {
		this.showHintMessage = showHintMessage;
	}

	@Override
	public FormElementHintPosition getHintPosition() {
		return hintPosition;
	}

	@Override
	public void setHintPosition(FormElementHintPosition hintPosition) {
		this.hintPosition = hintPosition;
	}

	@Override
	public boolean isReadOnly() {
		return readOnly;
	}

	@Override
	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	@ComponentReference("DataSet")
	@IdeProperty(highlight = 1)
	public String getDataSet() {
		return dataSet;
	}

	public void setDataSet(String dataSet) {
		this.dataSet = dataSet;
	}

	@IdeProperty(highlight = 1)
	public String getDataPath() {
		return dataPath;
	}

	public void setDataPath(String dataPath) {
		this.dataPath = dataPath;
	}

}
