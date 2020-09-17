import React, { Component } from 'react';
import { Button, StyleSheet, View, Platform } from 'react-native';
import {
	RichTextEditor,
	RichTextToolbar,
} from 'react-native-zss-rich-text-editor';
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
	};

	constructor(props) {
		super(props);
		this.getHTML = this.getHTML.bind(this);
		this.setFocusHandlers = this.setFocusHandlers.bind(this);
		this.onMentioning = this.onMentioning.bind(this);
		this.onFinishMention = this.onFinishMention.bind(this);
		this.onListItemPress = this.onListItemPress.bind(this);
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
		console.log('item', item);
		console.log('index', index);
		console.log('items', items);

		const { name } = item;
		this.richtext.insertMention(
			`https://www.google.com/${index++}`,
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

	render() {
		return (
			<View style={styles.container}>
				{false && this.renderInsertHTMLTest()}
				{false && this.renderInsertCSSTest()}
				{this.renderMentionList()}
				<RichTextEditor
					ref={r => (this.richtext = r)}
					style={styles.richText}
					initialTitleHTML={'Title!!'}
					initialContentHTML={
						'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'
					}
					editorInitializedCallback={() => this.onEditorInitialized()}
					customCSS={CSS}
					onMentioning={this.onMentioning}
					onFinishMention={this.onFinishMention}
				/>
				<RichTextToolbar getEditor={() => this.richtext} />
				{Platform.OS === 'ios' && <KeyboardSpacer />}
			</View>
		);
	}

	onEditorInitialized() {
		this.setFocusHandlers();
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
		paddingTop: 40,
	},
	richText: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
});
