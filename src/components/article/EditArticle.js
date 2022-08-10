import { useEffect, createRef, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from 'highlight.js';
import "highlight.js/styles/monokai-sublime.css";

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


function EditArticle({article, handleChangeEditor}) {
	const inputOpenImageRef = createRef();
    const linkVideoRef = createRef();
    let quillRef = useRef();

    let content = article.content


	useEffect(() => {
		const toolbars = document.getElementsByClassName("ql-toolbar ql-snow");
		if (toolbars.length > 1) {
			toolbars[0].remove();
		}
	}, []);

    const clickInsertImage = (e) => {
        inputOpenImageRef.current.click();
    }
    const clickLinkHandler = (e) => {
        linkVideoRef.current.click();
    }
    const insertImage = (e) => {
        const quill = quillRef.getEditor();
        quill.focus();
        let range = quill.getSelection();
        let position = range ? range.index : 0;

        let data = new FormData();
        data.append('image', e.target.files[0]);

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

                quill.insertText(position, text, 'user');
                quill.setSelection(position, text.length);
                quill.theme.tooltip.edit('link', url);
                quill.theme.tooltip.save()

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
                link: () => clickLinkHandler(),
            },
            clipboard: {
                matchVisual: false,
            }
        },
        syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
        }
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
            {content && <>
                {content}
            </>}
			<ReactQuill
				ref={(el) => {
                    quillRef = el
                } }
				theme="snow"
				value={content}
                // value={article.content || ''}
                onChange={handleChangeEditor}
				formats={formats}
				modules={modules}
                padding={0}
			/>
            <input type="file" accept="image/*" ref={inputOpenImageRef} style={{ display: "none" }} onChange={insertImage} />
            <a ref={linkVideoRef} style={{ display: "none" }} onClick={videoHandler}/>
		</Container>
	);
}

export default EditArticle;
