# React Native Rich Text Editor with react-native-webview

> Visit [original repo](https://github.com/wix/react-native-zss-rich-text-editor) first

This resolves [#171](https://github.com/wix/react-native-zss-rich-text-editor/issues/171), [#174](https://github.com/wix/react-native-zss-rich-text-editor/issues/174), and [#178](https://github.com/wix/react-native-zss-rich-text-editor/issues/178) 

## Inspirations

For now, the original library has problems of using two deprecated modules, ListView and react-native-webview-bridge-updated. ListView problem is solved by [Ankit-96](https://github.com/Ankit-96) 's [PR](https://github.com/wix/react-native-zss-rich-text-editor/pull/179). So I focused on removing react-native-webview-bridge-updated and making use of react-native-webview. 

## What I did

* Did just like what [Ankit-96](https://github.com/Ankit-96) did; replaced ListView with FlatList
* Replaced react-native-webview-bridge-updated with react-native-webview
  * Instead of injecting `MessageHandler` into webpage(WebViewBridge) and sending message through `sendToBridge`, I directly inject `zss_editor`'s function calls through `injectJavaScript`. To achieve that, I fixed `WebViewMessageHandler.js` to be mapper function, translating functions of `RichTextEditor` to those of `zss_editor`.
  * In `editor.html`, replace `WebViewBridge.send` with `ReactNativeWebView.postMessage`
* Added `./newExample`. You should `$ cd newExample; yarn; cd ios; pod install; cd ..; react-native run-ios;`.

## How to use it

* `$ yarn add https://github.com/jb-/react-native-zss-rich-text-editor`
* `$ yarn add react-native-webview` (I'm not sure why I have to do this)
* `$ cd ios; pod install;`

## Limitations

* Tested on RN 0.61.5, iOS only.

* Since I worked it for my project only, I did not test it on other versions or on Android platform. If any of you are familiar with both Android and iOS natives, please refer to my project and collaborate.

## References

* https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native
  
  
---
  
  
A fully functional Rich Text Editor for both Android and iOS, based off the [ZSSRichTextEditor](https://github.com/nnhubbard/ZSSRichTextEditor/tree/master/ZSSRichTextEditor) project. 

## Installation

```
npm i --save react-native-zss-rich-text-editor
```

On Android, add the following to the end of your `android/app/build.gradle`

```groovy
project.afterEvaluate {
    apply from: '../../node_modules/react-native-zss-rich-text-editor/htmlCopy.gradle';
    copyEditorHtmlToAppAssets(file('../../node_modules/react-native-zss-rich-text-editor'))
}
```

Also, follow instructions [here](https://github.com/alinz/react-native-webview-bridge) to add the native `react-native-webview-bridge-updated` dependency.


## Usage

`react-native-zss-rich-text-editor` exports two Components and one const dictionary:

## `RichTextEditor`

The editor component. Simply place this component in your view hierarchy to receive a fully functional Rich text Editor.

`RichTextEditor` takes the following optional props:

* `initialTitleHTML`

	HTML that will be rendered in the title section as soon as the component loads.

* `hiddenTitle`

	Boolean indicater whether to hide the title section.

* `initialContentHTML`

	HTML that will be rendered in the content section on load.

* `titlePlaceholder`

	Text that will be used as a placeholder when no text is present in the title section.

* `contentPlaceholder `
	
	Text that will be used as a placeholder when no text is present in the content section.

* `enableOnChange `

	Boolean indicating whether to listen for content changes. Use in combination with `registerContentChangeListener` (see below).

* `customCSS `

	Any custom CSS styles that you want to inject to the editor.

* `editorInitializedCallback `

	A function that will be called when the editor has been initialized.

* `autoFocusLinkModal `

	Sets the `autoFocus` prop on the `Title` TextInput on the Link Modal.


`RichTextEditor` also has methods that can be used on its `ref` to  set styling at the current selection or cursor position:

*  `setBold() `
*  `setItalic()`
*  `setUnderline() `
*  `heading1() `
*  `heading2() `
*  `heading3() `
*  `heading4() `
*  `heading5() `
*  `heading6() `
*  `setParagraph() `
*  `removeFormat() `
*  `alignLeft() `
*  `alignCenter() `
*  `alignRight() `
*  `alignFull() `
*  `insertBulletsList() `
*  `insertOrderedList() `
*  `insertLink(url, title) `
*  `updateLink(url, title) `
*  `insertImage(attributes) `
*  `setSubscript() `
*  `setSuperscript()`
*  `setStrikethrough() `
*  `setHR() `
*  `setIndent()`
*  `setOutdent() `
*  `setBackgroundColor(color) `
*  `setTextColor(color) `

This method shows a dialog for setting a link title and url, that will be inserted at the current cursor location.

* `showLinkDialog(optionalTitle = '', optionalUrl = '')` 

To adjust content, placeholders or css, use these methods

*  `setTitlePlaceholder(placeholder) `
*  `setContentPlaceholder(placeholder)`
*  `setCustomCSS(css) `
*  `setTitleHTML(html)` 
*  `setContentHTML(html) `

These methods are used when adding content such as images or links that will intefere with the cursor position. `prepareInsert` saves  the current selection, and `restoreSelection` will replace it after the insertion is done. It is called implicitly by `insertImage` and `insertLink` so they should probably never be called directly.

*  `prepareInsert() `
*  `restoreSelection() `

To get the content or title HTML, use these **asynchronous** methods.

*  `async getTitleHtml() `
*  `async getTitleText()`
*  `async getContentHtml() `
*  `async getSelectedText() `

To focus or blur sections, use these methods

* `focusTitle()`
* `focusContent()` 
*  `blurTitleEditor() `
*  `blurContentEditor() `

To know when the title or content are in focus, use the following methods.

*  `setTitleFocusHandler(callbackHandler) `
*  `setContentFocusHandler(callbackHandler) `

This method registers a function that will get called whenver the cursor position changes or a change is made to the styling of the editor at the cursor's position., The callback will be called with an array of `actions` that are active at the cusor position, allowing a toolbar to respond to changes.

*  `registerToolbar(listener)` 

### Example Usage:

```javascript
<RichTextEditor
  ref={(r) => this.richtext = r}
  initialTitleHTML={'Title!!'}
  initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
  editorInitializedCallback={() => this.onEditorInitialized()}
/>
```

![RichTextEditor](readme/editor.png)

To listen for content changes, use `registerContentChangeListener` to register a listener function. For example:

```javascript
	state = {
		content: 'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>',
	};

	componentDidMount() {
		this.richtext.registerContentChangeListener(this.onContentChange);
	}

	onContentChange(content) {
		this.setState({
			content: content,
		});
	}

	render() {
		return (
			<RichTextEditor
				ref={(r) => this.richtext = r}
				initialContentHTML={this.state.content}
				enableOnChange={true}
			/>
		);
	}
```

## `RichTextToolbar`

This is a Component that provides a toolbar for easily controlling an editor. It is designed to be used together with a `RichTextEditor` component.

The `RichTextToolbar` has one required property: 

* `getEditor()`

Which must provide a **function** that returns a `ref` to a `RichTextEditor` component. 

This is because the `ref` is not created until after the first render, before which the toolbar is rendered. This means that any `ref` passed directly will inevitably be passed as `undefined`.

Other props supported by the `RichTextToolbar` component are:

* `actions`

	An `array` of `actions` to be provided by this toolbar. The default actions are: 
	* `actions.insertImage`
  	* `actions.setBold`
  	* `actions.setItalic`
  	* `actions.insertBulletsList`
  	* `actions.insertOrderedList`
  	* `actions.insertLink`
 
* `onPressAddLink`
* `onPressAddImage`

	Functions called when the `addLink` or `addImage `actions are tapped. 
	
* `selectedButtonStyle`
* `iconTint`
* `selectedIconTint`
* `unselectedButtonStyle`

	These provide options for styling action buttons.

* `renderAction`

	Altenatively, you can provide a render function that will be used instead of the default, so you can fully control the tollbar design.
	
	
* `iconMap` 

	`RichTextToolbar` comes with default icons for the default actions it renders. To override those, or to add icons for non-default actions, provide them in a dictionary to this prop.
	

### Example Usage:

```javascript
<RichTextToolbar
	getEditor={() => this.richtext}
/>
```

![RichTextEditor](readme/toolbar.png)

![RichTextEditor](readme/toolbar_selected.png)


## `actions`

This is a set of consts of all supported actions. These will be passed in arrays to all callbacks registered with the editor using  the `registerToolbar()` method.

	{
		setTitleHtml: 'SET_TITLE_HTML',
	  	setContentHtml: 'SET_CONTENT_HTML',
	  	getTitleHtml: 'GET_TITLE_HTML',
	  	getTitleText: 'GET_TITLE_TEXT',
	 	getContentHtml: 'GET_CONTENT_HTML',
	  	getSelectedText: 'GET_SELECTED_TEXT',
	  	blurTitleEditor: 'BLUR_TITLE_EDITOR',
	  	blurContentEditor: 'BLUR_CONTENT_EDITOR',
	  	focusTitle: 'FOCUS_TITLE',
	  	focusContent: 'FOCUS_CONTENT',
		
	  	setBold: 'bold',
	  	setItalic: 'italic',
	  	setUnderline: 'underline',
	  	heading1: 'h1',
	  	heading2: 'h2',
	  	heading3: 'h3',
	  	heading4: 'h4',
	  	heading5: 'h5',
	  	heading6: 'h6',
	  	setParagraph: 'SET_PARAGRAPH',
	  	removeFormat: 'REMOVE_FORMAT',
	  	alignLeft: 'justifyLeft',
	  	alignCenter: 'justifyCenter',
	  	alignRight: 'justifyRight',
	  	alignFull: 'justifyFull',
	  	insertBulletsList: 'unorderedList',
	  	insertOrderedList: 'orderedList',
	  	insertLink: 'INST_LINK',
	  	updateLink: 'UPDATE_LINK',
	  	insertImage: 'INST_IMAGE',
	  	setSubscript: 'subscript',
	  	setSuperscript: 'superscript',
	  	setStrikethrough: 'strikeThrough',
	  	setHR: 'horizontalRule',
	  	setIndent: 'indent',
	  	setOutdent: 'outdent',
	  	setTitlePlaceholder: 'SET_TITLE_PLACEHOLDER',
	  	setContentPlaceholder: 'SET_CONTENT_PLACEHOLDER',
	  	setTitleFocusHandler: 'SET_TITLE_FOCUS_HANDLER',
	  	setContentFocusHandler: 'SET_CONTENT_FOCUS_HANDLER',
	  	prepareInsert: 'PREPARE_INSERT',
	  	restoreSelection: 'RESTORE_SELECTION',
	  	setCustomCSS: 'SET_CUSTOM_CSS',
	  	setTextColor: 'SET_TEXT_COLOR',
	  	setBackgroundColor: 'SET_BACKGROUND_COLOR',
  	}


## Attribution

`react-native-zss-rich-text-editor` is a wrapper around the amazing [ZSSRichTextEditor](https://github.com/nnhubbard/ZSSRichTextEditor/tree/master/ZSSRichTextEditor) project. It also communicates with the editor using (a tiny fork) of the awesome [react-native-webview-bridge](https://github.com/alinz/react-native-webview-bridge) project.
