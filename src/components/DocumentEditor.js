import hljs from 'highlight.js';
import "highlight.js/styles/monokai-sublime.css";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
// import "../styles/styles.css";
// import "../styles/quill.css"
// node_modules/highlight.js/styles/monokai-sublime.css



import ReactQuill from "react-quill";
import { Quill } from "react-quill";
import { Box } from "@mui/material";


hljs.configure({   // optionally configure hljs
	languages: ['javascript', 'ruby', 'python']
});
  
const modules = {
	toolbar: [
		[{ header: [1,2, 3, 4, false] }],
		[{ 'font': [] }],
		[{ color: [] }, { background: [] }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "1" },
			{ indent: "+1" },
		],
		["link", "image", "code-block"],
		["clean"],
		
	],
	syntax: {
		highlight: text => hljs.highlightAuto(text).value
	},    // enable syntax highlighting
};



// Undo and redo functions for Custom Toolbar
// function undoChange() {
// 	this.quill.history.undo();
// }
// function redoChange() {
// 	this.quill.history.redo();
// }

const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"align",
	"strike",
	"script",
	"blockquote",
	"background",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"color",
	"code-block",
];

const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Block.className = 'pre';
Quill.register(Block, true);


const DocumentEditor = () => {
	useEffect(()=> {
		const toolbars = document.getElementsByClassName('ql-toolbar ql-snow')
		console.log(toolbars);
		if(toolbars.length > 1){
			toolbars[0].remove()
			console.log('removed', toolbars);
		}
		console.log(toolbars);
	}, [])
	const [text, setText] = useState({ value: null });
	const handleChange = (value) => {
		console.log(value)
		setText({ value });
	};

	return (
		<Box>
			<ReactQuill
				value={text.value}
				onChange={handleChange}
				placeholder={"Write something awesome..."}
				modules={modules}
				formats={formats}
			/>
		</Box>
	);
};

export default DocumentEditor;
