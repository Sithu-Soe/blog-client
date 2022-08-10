import {useNavigate} from 'react-router-dom';

import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { lightGreen } from "@mui/material/colors";

const greenlight = lightGreen["50"]; // #f1f8e9

const CreateArticleIcon = () => {
    const navigate = useNavigate()
	const handleClick = (event) => {
		navigate('/new-article')
	};

	return (
		<Fab
			size="small"
			aria-label="edit"
			sx={{ backgroundColor: greenlight }}
			onClick={handleClick}
		>
			<EditIcon />
		</Fab>
	);
};

export default CreateArticleIcon;
