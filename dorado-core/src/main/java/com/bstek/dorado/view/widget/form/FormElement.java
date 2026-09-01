package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlNodeWrapper;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.ComponentReference;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.Align;
import com.bstek.dorado.view.widget.Control;
import com.bstek.dorado.view.widget.InnerElementReference;
import com.bstek.dorado.view.widget.datacontrol.PropertyDataControl;

@Widget(name = "FormElement", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.FormElement", shortTypeName = "FormElement")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class FormElement extends Control implements FormConfig, PropertyDataControl {

	@Deprecated
	private FormElementType type = FormElementType.text;

	@Deprecated
	private boolean editorTypeChanged;

	private String dataSet;

	private String dataPath;

	private String label;

	private String hint;

	private String property;

	private String trigger;

	private boolean editable = true;

	private String labelSeparator;

	private boolean showLabel = true;

	private int labelWidth;

	private int labelSpacing;

	private FormElementLabelPosition labelPosition = FormElementLabelPosition.left;

	private Align labelAlign = Align.left;

	private int editorWidth;

	private boolean showHint = true;

	private int hintWidth;

	private int hintSpacing;

	private boolean showHintMessage;

	private FormElementHintPosition hintPosition = FormElementHintPosition.right;

	private boolean readOnly;

	private String formProfile;

	private String editorType;

	private InnerElementReference<Control> editorRef = new InnerElementReference<>(this);

	@Deprecated
	@ClientProperty(ignored = true)
	@IdeProperty(visible = false)
	public FormElementType getType() {
		return type;
	}

	@Deprecated
	public void setType(FormElementType type) {
		this.type = type;
		if (!editorTypeChanged) {
			if (FormElementType.text.equals(type)) {
				editorType = "TextEditor";
			}
			else if (FormElementType.password.equals(type)) {
				editorType = "PasswordEditor";
			}
			else if (FormElementType.textArea.equals(type)) {
				editorType = "TextArea";
			}
			else if (FormElementType.checkBox.equals(type)) {
				editorType = "CheckBox";
			}
			else if (FormElementType.radioGroup.equals(type)) {
				editorType = "RadioGroup";
			}
			else if (type == null) {
				editorType = "TextEditor";
			}
		}
	}

	@Override
	@ComponentReference("DataSet")
	@IdeProperty(highlight = 1)
	public String getDataSet() {
		return dataSet;
	}

	@Override
	public void setDataSet(String dataSet) {
		this.dataSet = dataSet;
	}

	@Override
	@IdeProperty(highlight = 1)
	public String getDataPath() {
		return dataPath;
	}

	@Override
	public void setDataPath(String dataPath) {
		this.dataPath = dataPath;
	}

	@IdeProperty(highlight = 1)
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getHint() {
		return hint;
	}

	public void setHint(String hint) {
		this.hint = hint;
	}

	@Override
	@IdeProperty(highlight = 1)
	public String getProperty() {
		return property;
	}

	@Override
	public void setProperty(String property) {
		this.property = property;
	}

	@ComponentReference("Trigger")
	@IdeProperty(
			enumValues = "triggerClear,autoMappingDropDown1,autoMappingDropDown2,autoOpenMappingDropDown1,autoOpenMappingDropDown2,defaultDateDropDown,defaultDateTimeDropDown,defaultYearMonthDropDown,defaultYearDropDown,defaultMonthDropDown")
	public String getTrigger() {
		return trigger;
	}

	public void setTrigger(String trigger) {
		this.trigger = trigger;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
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
	@ClientProperty(escapeValue = "right")
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

	@ComponentReference("FormProfile")
	public String getFormProfile() {
		return formProfile;
	}

	public void setFormProfile(String formProfile) {
		this.formProfile = formProfile;
	}

	@IdeProperty(highlight = 1,
			enumValues = "TextEditor,PasswordEditor,TextArea,CheckBox,RadioGroup,Label,NumberSpinner")
	public String getEditorType() {
		return editorType;
	}

	public void setEditorType(String editorType) {
		this.editorType = editorType;
	}

	@XmlSubNode(wrapper = @XmlNodeWrapper(nodeName = "Editor", icon = "/com/bstek/dorado/view/widget/form/Editor.png"))
	@ClientProperty
	public Control getEditor() {
		return editorRef.get();
	}

	public void setEditor(Control editor) {
		editorRef.set(editor);
	}

}
