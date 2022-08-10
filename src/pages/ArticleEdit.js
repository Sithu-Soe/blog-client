import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button } from "@mui/material";
import EditArticle from "../components/article/EditArticle";

import { getArticle, editArticle } from "../services/article-services";
import { Container } from "@mui/system";

let content = "";

function ArticleEdit() {
	const [article, setArticle] = useState(null);
	const params = useParams();
    const navigate = useNavigate();
	const { id } = params;
	useEffect(() => {
		getArticle(id)
			.then((data) => {
				if (data) {
                    console.log(data.content);
					setArticle(data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleChangeEditor = (htmlContent) => {
		content = htmlContent;
	};

    const handleSave = () => {
        const data = JSON.stringify({content});
        editArticle(data, id).then((result) => {
            if(result){
                navigate(`/articles/${id}`)
            }
        }).catch(err => {
            console.log(err)
        })
    }

	return (
		<Container>
			{article && (
				<Box>
					<EditArticle
						article={article}
						handleChangeEditor={handleChangeEditor}
					/>
					<Button variant="contained" endIcon={<SaveIcon />} onClick={handleSave} sx={{mt: 3}}>
						Save
					</Button>
				</Box>
			)}
		</Container>
	);
}

export default ArticleEdit;
