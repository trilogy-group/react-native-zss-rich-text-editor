import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
	FlatList,
	View,
	TouchableOpacity,
	Image,
	StyleSheet,
} from 'react-native';

import { actions as rteActions } from './const';

const defaultActions = [
	rteActions.startMention,
	rteActions.insertImage,
	rteActions.setBold,
	rteActions.setItalic,
	rteActions.insertBulletsList,
	rteActions.insertOrderedList,
	rteActions.insertLink,
];

function getDefaultIcon() {
	const texts = {};
	texts[rteActions.startMention] = require('../img/icon_mention.png');
	texts[rteActions.insertImage] = require('../img/icon_format_media.png');
	texts[rteActions.setBold] = require('../img/icon_format_bold.png');
	texts[rteActions.setItalic] = require('../img/icon_format_italic.png');
	texts[rteActions.insertBulletsList] = require('../img/icon_format_ul.png');
	texts[rteActions.insertOrderedList] = require('../img/icon_format_ol.png');
	texts[rteActions.insertLink] = require('../img/icon_format_link.png');
	return texts;
}

export default class RichTextToolbar extends Component {
	static propTypes = {
		getEditor: PropTypes.func.isRequired,
		actions: PropTypes.array,
		onPressAddLink: PropTypes.func,
		onPressAddImage: PropTypes.func,
		selectedButtonStyle: PropTypes.object,
		iconTint: PropTypes.any,
		selectedIconTint: PropTypes.any,
		unselectedButtonStyle: PropTypes.object,
		renderAction: PropTypes.func,
		iconMap: PropTypes.object,
	};

	getData = (actions, selectedItems) => {
		return actions.map(action => {
			return { action, selected: selectedItems.includes(action) };
		});
	};

	constructor(props) {
		super(props);
		this.state = {
			editor: undefined,
			selectedItems: [],
		};
	}

	getRows(actions, selectedItems) {
		return actions.map(action => {
			return { action, selected: selectedItems.includes(action) };
		});
	}

	componentDidMount() {
		const editor = this.props.getEditor();
		if (!editor) {
			throw new Error('Toolbar has no editor!');
		} else {
			editor.registerToolbar(selectedItems =>
				this.setSelectedItems(selectedItems),
			);
			this.setState({ editor });
		}
	}

	setSelectedItems(selectedItems) {
		if (selectedItems !== this.state.selectedItems) {
			this.setState({
				selectedItems,
			});
		}
	}

	_getButtonSelectedStyle() {
		return this.props.selectedButtonStyle
			? this.props.selectedButtonStyle
			: styles.defaultSelectedButton;
	}

	_getButtonUnselectedStyle() {
		return this.props.unselectedButtonStyle
			? this.props.unselectedButtonStyle
			: styles.defaultUnselectedButton;
	}

	_getButtonIcon(action) {
		if (this.props.iconMap && this.props.iconMap[action]) {
			return this.props.iconMap[action];
		} else if (getDefaultIcon()[action]) {
			return getDefaultIcon()[action];
		} else {
			return undefined;
		}
	}

	_defaultRenderAction(action, selected) {
		const icon = this._getButtonIcon(action);
		return (
			<TouchableOpacity
				key={action}
				style={[
					{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' },
					selected
						? this._getButtonSelectedStyle()
						: this._getButtonUnselectedStyle(),
				]}
				onPress={() => this._onPress(action)}
			>
				{icon ? (
					<Image
						source={icon}
						style={{
							tintColor: selected
								? this.props.selectedIconTint
								: this.props.iconTint,
						}}
					/>
				) : null}
			</TouchableOpacity>
		);
	}

	_renderAction(action, selected) {
		return this.props.renderAction
			? this.props.renderAction(action, selected)
			: this._defaultRenderAction(action, selected);
	}

	render() {
		const data = this.getData(this.props.actions || defaultActions, this.state.selectedItems);

		return (
			<View
				style={[
					{
						height: 50,
						backgroundColor: '#D3D3D3',
						alignItems: 'center',
					},
					this.props.style,
				]}
			>
				<FlatList
					data={data}
					horizontal
					renderItem={item =>
						this._renderAction(item.item.action, item.item.selected)
					}
					keyExtractor={(item, index) => `key-${index}`}
				/>
			</View>
		);
	}

	_onPress(action) {
		switch (action) {
			case rteActions.setBold:
			case rteActions.setItalic:
			case rteActions.insertBulletsList:
			case rteActions.insertOrderedList:
			case rteActions.setUnderline:
			case rteActions.heading1:
			case rteActions.heading2:
			case rteActions.heading3:
			case rteActions.heading4:
			case rteActions.heading5:
			case rteActions.heading6:
			case rteActions.setParagraph:
			case rteActions.removeFormat:
			case rteActions.alignLeft:
			case rteActions.alignCenter:
			case rteActions.alignRight:
			case rteActions.alignFull:
			case rteActions.setSubscript:
			case rteActions.setSuperscript:
			case rteActions.setStrikethrough:
			case rteActions.setHR:
			case rteActions.setIndent:
			case rteActions.setOutdent:
			case rteActions.startMention:
				this.state.editor._sendAction(action);
				break;
			case rteActions.insertLink:
				this.state.editor.prepareInsert();
				if (this.props.onPressAddLink) {
					this.props.onPressAddLink();
				} else {
					this.state.editor.getSelectedText().then(selectedText => {
						this.state.editor.showLinkDialog(selectedText);
					});
				}
				break;
			case rteActions.insertImage:
				this.state.editor.prepareInsert();
				if (this.props.onPressAddImage) {
					this.props.onPressAddImage();
				}
				break;
		}
	}
}

const styles = StyleSheet.create({
	defaultSelectedButton: {
		backgroundColor: 'red',
	},
	defaultUnselectedButton: {},
});
