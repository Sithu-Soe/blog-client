import { useState, useEffect, createRef, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from 'highlight.js';
import "highlight.js/styles/monokai-sublime.css";

import {createImage} from "../../services/article-services"

import { Container } from "@mui/material";


hljs.configure({   // optionally configure hljs
	languages: ['javascript', 'ruby', 'python']
});

const Embed = Quill.import('blots/block/embed')

class ImageBlot extends Embed {
    static create(value) {
        let node = super.create();
        // node.setAttribute('alt', value);
        node.setAttribute('src', value);
        node.setAttribute('style', 'width: 100%');
        return node;
    }

    static value(node) {
        return {
            alt: node.getAttribute('alt'),
            url: node.getAttribute('src')
        };
    }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

Quill.register(ImageBlot);


function QuillEditor({content, handleChangeEditor, addImage}) {
	// const [content, setContent] = useState({ value: null });

	let reactQuillRef = null;
	const inputOpenImageRef = createRef();
    const inputOpenVideoRef = createRef();
    const linkVideoRef = createRef();
    let quillRef = useRef();

	useEffect(() => {
		const toolbars = document.getElementsByClassName("ql-toolbar ql-snow");
		if (toolbars.length > 1) {
			toolbars[0].remove();
		}
	}, []);

	// const insertImage = () => {
    //     const input = document.createElement("input");
    //     input.setAttribute("type", "file");
    //     input.setAttribute("accept", "image/*");
    //     input.click();
    //     const file = input.files[0];
    //     input.onchange = (e) => {
    //         console.log(e, file);
    //     }
	// };
    const clickInsertImage = (e) => {
        inputOpenImageRef.current.click();
    }
    const clickInsertVideo = (e) => {
        inputOpenVideoRef.current.click();
    }
    const clickLinkHandler = (e) => {
        linkVideoRef.current.click();
    }
    const insertImage = (e) => {
        const quill = quillRef.getEditor();
        quill.focus();
        let range = quill.getSelection();
        let position = range ? range.index : 0;
        // const url = "https://picsum.photos/200/300";


        let data = new FormData();
        data.append('image', e.target.files[0]);
        // console.log(e.target.files[0])

        createImage(data).then((result) => {
            const {fileUrl, fileName, fileId} = result;
            addImage({fileName, fileUrl, fileId});
            quill.insertEmbed(position, "image", fileUrl);
            quill.setSelection(position + 1, 0, "user");
        }).catch(function (error) {
          console.log(error);
        });

    }
    const insertVideo = (e) => {
        const quill = quillRef.getEditor();
        quill.focus();
        let range = quill.getSelection();
        let position = range ? range.index : 0;
        const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        quill.insertEmbed(position, "video", url);
        quill.setSelection(position + 1, 0, "user"); 
        // quill.insertEmbed(quill.getSelection().index, "image", e.target.files[0]);
        // quill.setSelection(quill.getSelection().index + 1, 0, "user");

    }
    function videoHandler(value) {
        const quill = quillRef.getEditor();
        let url = prompt("Enter Video URL: ");

        let videoUrl;

        if(url){
            videoUrl = getVideoUrl(url);
            if(videoUrl !== null && videoUrl) {
                const value = `<iframe width="100%" height="315" src="${videoUrl}"></iframe>`;
                quill.container.firstChild.innerHTML += value;
            } else {
                let range = quill.getSelection();
                let position = range ? range.index : 0;
                const text = url
                // const r = quill.getSelection(true)
                // quill.updateContents(new Delta().retain(r.index).delete(r.length).insert(text, {link}))
                quill.insertText(position, text, 'user');
                quill.setSelection(position, text.length);
                quill.theme.tooltip.edit('link', url);
                quill.theme.tooltip.save()

                // quill.insertEmbed(position, "a", url);
                // quill.setSelection(position + 1, 0, "user");

            }
        }

    }
    function getVideoUrl(url) {
        let match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
            url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/) ||
            url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
        if (match && match[2].length === 11) {
            return ('https') + '://www.youtube.com/embed/' + match[2] + '?showinfo=0';
        }
        if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) { // eslint-disable-line no-cond-assign
            return (match[1] || 'https') + '://player.vimeo.com/video/' + match[2] + '/';
        }
        return null;
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, false] }],
                [{ font: [] }],
                [{ color: [] }, { background: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                    { 'align': [] }
                ],
                ["link", "image", "code-block"],
            ],
            handlers: {
                image: () => clickInsertImage(),
                video: () => clickInsertVideo(),
                link: () => clickLinkHandler(),
            },
            clipboard: {
                matchVisual: false,
            }
        },
        syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
        }
        // syntax: {
        //     highlight: text => hljs.highlightAuto(text).value
        // }, 
    }), []);
    
    // Formats objects for setting up the Quill editor
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

	return (
		<Container>
			<ReactQuill
				ref={(el) => {
                    quillRef = el
                } }
				theme="snow"
				value={content}
                // v-model="content"
				onChange={handleChangeEditor}
				formats={formats}
				modules={modules}
                padding={0}
			/>
            <input type="file" accept="image/*" ref={inputOpenImageRef} style={{ display: "none" }} onChange={insertImage} />
            <input type="file" accept="video/*" ref={inputOpenVideoRef} style={{ display: "none" }} onChange={insertVideo} />
            <a ref={linkVideoRef} style={{ display: "none" }} onClick={videoHandler}/>
		</Container>
	);
}

export default QuillEditor;
