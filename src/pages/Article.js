import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Container, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";

import { getArticle, deleteArticle } from "../services/article-services";
import { getCurrentUser } from "../services/auth-services";

const Article = () => {
	const [article, setArticle] = useState(null);
	const navigate = useNavigate();
	const params = useParams();
	const { id } = params;

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const user = getCurrentUser();
		if (user) {
			setIsLoggedIn(true);
		}
		getArticle(id)
			.then((data) => {
				if (data) {
					setArticle(data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleEdit = () => {
		navigate(`/articles/${id}/edit`);
	};

	const handleDelete = () => {
		deleteArticle(id)
			.then((result) => {
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Container>
			{article && (
				<>
					<Box sx={{ mb: 2 }}>
						<Typography variant="h2" component="h1">
							{article.title}
						</Typography>
						<div dangerouslySetInnerHTML={{ __html: article.content }} />
					</Box>
					{isLoggedIn && (
						<Stack direction="row" spacing={2} mb={5}>
							<Button
								variant="outlined"
								startIcon={<DeleteIcon />}
								onClick={handleDelete}
							>
								Delete
							</Button>
							<Button
								variant="contained"
								endIcon={<EditIcon />}
								onClick={handleEdit}
							>
								Edit
							</Button>
						</Stack>
					)}
				</>
			)}
		</Container>
	);
};

export default Article;
