import { useState, forwardRef, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Container } from '@mui/system';
import { Box, Button, Grid, IconButton, ImageList, ImageListItem, Paper, TextField, Typography } from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { green } from '@mui/material/colors';
import "react-quill/dist/quill.snow.css";
import hljs from 'highlight.js';
import "highlight.js/styles/monokai-sublime.css";
// import "../App.css"

import { createArticle } from '../services/article-services'

hljs.configure({   // optionally configure hljs
	languages: ['javascript', 'ruby', 'python']
});

const color = green.A400;

const styles = {
    paperContainer: {
        // backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        // backgroundAttachment: "fixed",
        backgroundPosition: "center",
        width: "100%",
        height: "300px",
        backgroundSize: 'cover',
        maxWidth: 500, backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    },
    previewButton: {
        color: color,
        textTransform: 'unset',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        ':hover': {
            border: '1px solid ' + color,
        }
    },
	containerHtmlContent: {
		boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
		marginBottom: 15,

	}
};


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PreviewImages = ({setIsChangedPreview, images, changePreview}) => {
    return (
			<Box mt={3} mb={2}>
				<ImageList
					sx={{ width: "100%", maxHeight: 300, boxShadow: 1 }}
					cols={3}
				>
					{images.map((item) => (
						<ImageListItem
							key={item.fileId}
							onClick={(event) => changePreview(event, item)}
						>
							<img
								src={`${item.fileUrl}?w=164&h=164&fit=crop&auto=format`}
								srcSet={`${item.Url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
								alt={item.Url}
								loading="lazy"
								style={{ border: item.isPreview ? "2px solid " + color : null }}
							/>
						</ImageListItem>
					))}
				</ImageList>
				<Button
                    size="small"
					variant="contained"
					endIcon={<DoneIcon />}
                    onClick={() => setIsChangedPreview(false)}
					sx={{
						mt: 1,
						backgroundColor: color,
						":hover": {
							bgcolor: green.A700, // theme.palette.primary.main
						},
					}}
				>
					Done
				</Button>
			</Box>
		);

}

const PublishDialog = ({open, handleClose, publishData}) => {
  const [isChangedPreview, setIsChangedPreview] = useState(false);

  const [previewImages , setPreviewImages] = useState([])
  const [previewImage, setPreviewImage] = useState('');
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
	setPreviewImages(publishData.images)

  }, [])

  useEffect(() => {
	if (isChangedPreview) {
	  previewImages.forEach((item) => {
		if(item.isPreview) {
		  setPreviewImage(item.fileUrl)
		}
	  })
	}
  } , [previewImages])

  const handleChangePreview = (e, image) => {
        setPreviewImages(prevState => {
            return prevState.map(item => {
                if (item.fileId === image.fileId) {
                    return { ...item, isPreview: true }
                }
                return { ...item, isPreview: false }
            })
        })
  }
  const handleChangeTags = (e) => {
	const array = e.target.value.split(',').map((tag) => {
		return tag.trim();
	})
	setTags(array);

  }

  const handlePublish = async() => {
	const data = JSON.stringify({
		title: publishData.title,
		content: publishData.content,
		tags: tags,
		images: previewImages
	});

	createArticle(data).then((data) => {
		if(data){
			navigate('/')
		}
	}).catch((error) => {
		console.log(error, 'ERR')
	})
  }

  return (
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<IconButton aria-label="delete" sx={{display: 'flex', justifyContent: 'flex-end'}} onClick={handleClose}>
					<CloseIcon />
				</IconButton>
				<Container sx={{ marginTop: 5 }}>
					<Grid
						container
						spacing={4}
						alignItems="flex-start"
						direction="row-reverse"
					>
						<Grid item xs={6}>
							<Box>
								<Typography variant="h6" component="h3">
									Story Preview
								</Typography>
								{isChangedPreview ? (
									<PreviewImages setIsChangedPreview={setIsChangedPreview} images={previewImages} changePreview={handleChangePreview} />
								) : (
									<Paper style={styles.paperContainer} sx={{ mt: 3, mb: 2, backgroundImage: `url(${previewImages.length > 0 ? `${previewImage ? previewImage : previewImages[0].fileUrl }` : ""})`, }}>
										<Button
											variant="outlined"
											sx={styles.previewButton}
											onClick={() => setIsChangedPreview(true)}
										>
											{ previewImages.length > 0 ? "Change Preview image" : 'dsdsd' }
										</Button>
									</Paper>
								)}

								<Typography
									variant="subtitle1"
									component="div"
									sx={{ display: "flex", alignItems: "center" }}
								>
									Publishing To:
									<Typography
										variant="subtitle1"
										component="h3"
										fontWeight="fontWeightMedium"
										sx={{ paddingLeft: 1 }}
									>
										Sithu Soe
									</Typography>
								</Typography>
								<Box>
									<Typography variant="body2" component="p" mt={2} mb={2}>
										Add tags (up to 5) so readers know what your story is about
									</Typography>
									<TextField
										fullWidth
										label="Add Tags"
										id="fullWidth"
										sx={{ maxWidth: 500 }}
										onChange={handleChangeTags}
									/>
								</Box>
							</Box>
							<Button
								variant="contained"
								endIcon={<SaveTwoToneIcon />}
								onClick={handlePublish}
								sx={{
									mt: 3,
									backgroundColor: color,
									":hover": {
										bgcolor: green.A700, // theme.palette.primary.main
									},
								}}
							>
								Publish
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="h6" component="h3">
								Title
							</Typography>
							<Box>
								<TextField
									inputProps={{ style: { fontSize: 30, fontWeight: "bold"} }} // font size of input text
									InputLabelProps={{ style: { fontSize: 30 } }}
									fullWidth
									defaultValue={publishData.title}
									variant="standard"
									sx={{mt: 1, mb: 2}}
								/>
							</Box>
							<Container dangerouslySetInnerHTML={{ __html: publishData.content }} style={styles.containerHtmlContent}/>
						</Grid>
					</Grid>
				</Container>
			</Dialog>
	);
}

export default PublishDialog;