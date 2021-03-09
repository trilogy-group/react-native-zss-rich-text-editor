import React, { Component } from 'react';
import {
	Button,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import {
	RichTextEditor,
	RichTextToolbar,
} from 'react-native-zss-rich-text-editor';
import { actions as rteActions } from 'react-native-zss-rich-text-editor/src/const';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import MentionList from './components/MentionList';

const HTML = `<p> and this is extra HTML</p>`;
const CSS = `
	.my-custom-class { background-color: lightgreen; }
`;
const EXTERNAL_CSS =
	'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css';

export default class RichTextExample extends Component {
	state = {
		mentionListVisible: false,
		mentionSearchText: '',
		content:
			'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>',
		toggleToolbarActionPanelVisibile: false,
		actions: [
			{
				action: rteActions.startMention,
				visible: true,
			},
			{
				action: rteActions.insertImage,
				visible: true,
			},
			{
				action: rteActions.setBold,
				visible: true,
			},
			{
				action: rteActions.setItalic,
				visible: true,
			},
			{
				action: rteActions.insertBulletsList,
				visible: true,
			},
			{
				action: rteActions.insertOrderedList,
				visible: true,
			},
			{
				action: rteActions.insertLink,
				visible: true,
			},
		],
	};

	constructor(props) {
		super(props);
		this.getHTML = this.getHTML.bind(this);
		this.setFocusHandlers = this.setFocusHandlers.bind(this);
		this.onMentioning = this.onMentioning.bind(this);
		this.onFinishMention = this.onFinishMention.bind(this);
		this.onListItemPress = this.onListItemPress.bind(this);
		this.onContentChange = this.onContentChange.bind(this);
		this.toggleToolbarActionPanelVisibility = this.toggleToolbarActionPanelVisibility.bind(this);
		this.toggleActionVisibility = this.toggleActionVisibility.bind(this);
	}

	onMentioning(text) {
		this.setState({
			mentionListVisible: true,
			mentionSearchText: text,
		});
	}

	onFinishMention() {
		this.setState({
			mentionListVisible: false,
			mentionSearchText: '',
		});
	}

	onListItemPress(item, index, items) {
		//console.log('item', item);
		//console.log('index', index);
		//console.log('items', items);

		const { name, website } = item;
		this.richtext.insertMention(
			website,
			name,
			'my-custom-class',
		);
	}

	renderMentionList() {
		const { mentionListVisible, mentionSearchText } = this.state;
		if (!mentionListVisible) {
			return null;
		}

		return (
			<MentionList
				search={mentionSearchText}
				style={{ flex: 1 }}
				onItemPress={this.onListItemPress}
			/>
		);
	}

	getActions = (actions, selectedItems) => {
		return actions.map(action => {
			return { action, selected: selectedItems.includes(action) };
		});
	};

	toggleActionVisibility(action) {
		const updatedActions = [...this.state.actions];
		const actionIndex = updatedActions.findIndex(i => i.action === action);
		const actionToUpdate = updatedActions[actionIndex];
		updatedActions[actionIndex].visible = !actionToUpdate.visible;
		this.setState({
			actions: updatedActions,
		});
	}

	getActions = () => {
		return this.state.actions.filter(i => i.visible).map(i => i.action);
	};

	toggleToolbarActionPanelVisibility() {
		this.setState({
			toggleToolbarActionPanelVisibile: !this.state.toggleToolbarActionPanelVisibile,
		})
	}

	renderToolbarActionTogglePanel() {
		const { toggleToolbarActionPanelVisibile } = this.state;

		return (
			<View>
				<Button title={toggleToolbarActionPanelVisibile ? 'Hide toolbar action toggle panel' : 'Show toolbar action toggle panel'} onPress={this.toggleToolbarActionPanelVisibility}></Button>
				{toggleToolbarActionPanelVisibile && <ScrollView>
					{this.state.actions.map(i => {
						const { action, visible } = i;

						const onPress = () => {
							this.toggleActionVisibility(action);
						};

						return (
							<TouchableOpacity onPress={onPress} key={action} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
								<Text>{action}</Text>
								<Switch value={visible} onValueChange={onPress}></Switch>
							</TouchableOpacity>
						);
					})}
					
				</ScrollView>}
			</View>
		);
	}

	render() {
		const { content } = this.state;

		const actions = this.getActions();

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.container}>
					{false && this.renderInsertHTMLTest()}
					{false && this.renderInsertCSSTest()}
					{true && this.renderToolbarActionTogglePanel()}
					{this.renderMentionList()}
					<RichTextEditor
						ref={r => (this.richtext = r)}
						style={styles.richText}
						initialTitleHTML={'Title!!'}
						enableOnChange={true}
						initialContentHTML={content}
						editorInitializedCallback={() => this.onEditorInitialized()}
						customCSS={CSS}
						onMentioning={this.onMentioning}
						onFinishMention={this.onFinishMention}
					/>
					<RichTextToolbar getEditor={() => this.richtext} actions={actions} />
					{Platform.OS === 'ios' && <KeyboardSpacer />}
				</View>
			</SafeAreaView>
		);
	}

	onEditorInitialized() {
		this.setFocusHandlers();
		this.setContentChangeListener();
		this.getHTML();
		this.richtext.insertExternalCSS(EXTERNAL_CSS);
	}

	async getTitleHtml() {
		const titleHtml = await this.richtext.getTitleHtml();
		return titleHtml;
	}

	async getContentHtml() {
		const contentHtml = await this.richtext.getContentHtml();
		return contentHtml;
	}

	async getHTML() {
		const titleHtml = await this.getTitleHtml();
		const contentHtml = await this.getContentHtml();
		//alert(titleHtml + ' ' + contentHtml)
	}

	setFocusHandlers() {
		this.richtext.setTitleFocusHandler(() => {
			//alert('title focus');
			//console.log(`isTitleFocused: ${this.richtext.isTitleFocused()}`);
		});
		this.richtext.setTitleBlurHandler(() => {
			//alert('title blur');
			//console.log(`isTitleFocused: ${this.richtext.isTitleFocused()}`);
		});
		this.richtext.setContentFocusHandler(() => {
			//alert('content focus');
			//console.log(`isContentFocused: ${this.richtext.isContentFocused()}`);
		});
		this.richtext.setContentBlurHandler(() => {
			//alert('content blur');
			//console.log(`isContentFocused: ${this.richtext.isContentFocused()}`);
		});
	}

	setContentChangeListener() {
		this.richtext.registerContentChangeListener(this.onContentChange);
	}

	onContentChange(value) {
		//console.log('onContentChange', value);
		this.setState({
			content: value,
		});
	}

	renderInsertHTMLTest() {
		return (
			<Button
				title="Insert HTML"
				onPress={() => {
					this.richtext.insertHTML(HTML);
				}}
			></Button>
		);
	}

	renderInsertCSSTest() {
		return (
			<Button
				title="Insert CSS"
				onPress={() => {
					this.richtext.insertCSS(CSS);
				}}
			></Button>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#ffffff',
	},
	richText: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
});
