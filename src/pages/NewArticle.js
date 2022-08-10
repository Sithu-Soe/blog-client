import { useState, useRef } from "react";

import { Box, Container, TextField, Typography, Button } from "@mui/material";
// import DocumentEditor from "../components/DocumentEditor";
import QuillEditor from "../components/editor/QuillEditor";
import PublishIcon from "@mui/icons-material/Publish";
import PublishDialog from "../components/PublishDialog";
import { deleteTemporaryImages } from "../services/article-services";

const paddingStyle = {
	paddingRight: "24px",
	paddingLeft: "24px",
};

let htmlContent = "";
let images = [];

const deleteImagesInServer = (ids) => {
	const data = JSON.stringify({"ids":ids});
	// var data = JSON.stringify({"ids":["62e7653e4fcf427751f432cb","62e7653e4fcf427751f432bn"]});

	deleteTemporaryImages(data).then((result) => {
	}).catch(err => {
		console.log(err)
	})
};

const findLinks = (imageTags) => {
	let links = [];
	imageTags.forEach((tag) => {
		const searchPattern = /(https?:\/\/.*\.(?:png|jpg))/g;
		links.push(tag.match(searchPattern)[0]);
	});
	return links;
};

const getImageName = (imageUrls) => {
	let fileNames = [];
	imageUrls.forEach((url) => {
		let path = new URL(url).pathname;
		fileNames.push(path.split("/").pop());
	});
	return fileNames;
};

const NewArticle = () => {

	const [publishData, setPublishData] = useState({
		title: '',
		content: '',
		images: []
	})

	const titleRef = useRef();
	// const [content, setContent] = useState('');

	// const [title, setTitle] = useState('');

	const [open, setOpen] = useState(false);

	// const handleClickOpen = () => {
	//   setOpen(true);
	// };
  
	const handleClose = () => {
	  setOpen(false);
	};

	const handleChangeEditor = (value) => {
		htmlContent = value;
	};

	const addImage = (value) => {
		images.push(value);
	};

	const publishContent = () => {

		images.map((image, index) => {
			index === 0 ? image.isPreview = true : image.isPreview = false
			return image
		})
		
		if(images.length > 0) {
			deleteUnusedImages(images);
		}
		setPublishData((prev) => {
			return {
				title: titleRef.current.value,
				content: htmlContent,
				images: images,
			}
		})
		setOpen(true);
	};
	const deleteUnusedImages = () => {
		const pattern = /<img\s+[^>]*src="([^"]*)"[^>]*>/g;
		const imageTags = htmlContent.match(pattern);
        if(imageTags){
            const imageUrls = findLinks(imageTags);
            const fileNames = getImageName(imageUrls);
            const deleteImages = images.filter((image) => {
                return !fileNames.includes(image.fileName);
            });
    
            const ids = deleteImages.map((image) => image.fileId);

			if(ids.length > 0){
				deleteImagesInServer(ids);
				images = images.filter((image) => {
					return !ids.includes(image.fileId);
				})
			}
        }
        // if user add and remove image in editor before uploading
        else if(!imageTags && images){
            const ids = images.map((image) => image.fileId);
            deleteImagesInServer(ids);
			images = []
        }
	};

	return (
		<Container>
			{open && <PublishDialog open={open} handleClose={handleClose} publishData={publishData}/> }
			<Typography variant="h3" component={"h2"}>
				Write Story
			</Typography>
			<Box
				sx={{
					border: "1px solid grey",
					paddingX: 3,
					paddingY: 2,
					marginBottom: 2,
				}}
			>
				<Typography variant="h4" component={"h3"} sx={paddingStyle}>
					Title
				</Typography>
				<TextField
					fullWidth
					label="Title"
					id="fullWidth"
					inputRef={titleRef}z
					// onChange={(e) => handleChangeTitle(e)}	
					sx={{ marginBottom: 2 }}
				/>
				<QuillEditor
					content={publishData.content}
					handleChangeEditor={handleChangeEditor}
					addImage={addImage}
				/>
			</Box>
			<Button
				onClick={publishContent}
				variant="contained"
				color="success"
				endIcon={<PublishIcon />}
			>
				Send
			</Button>
		</Container>
	);
};

export default NewArticle;
