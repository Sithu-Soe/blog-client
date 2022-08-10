import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import AvatarDropdown from "./AvatarDropdown";
import SearchBar from "./SearchBar";
import CreateArticleIcon from "./CreateArticleIcon";
import { useNavigate } from 'react-router-dom';

import { getCurrentUser } from '../services/auth-services';

// const isLoggedIn = true;

function Avatar() {
	return <AvatarDropdown />;
}

function SingIn() {
	const navigate = useNavigate()
	return (
		<Button variant="outlined" size="small" onClick={ e => navigate("/login")}>
			Sign In
		</Button>
	);
}

function Header(props) {
	const { sections, title } = props;

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
	  const user = getCurrentUser()
	  if (user){
		setIsLoggedIn(true);
	  }
  
	},[])

	return (
		<>
			<Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
				{/* <Button size="small">Subscribe</Button> */}
				{isLoggedIn && <CreateArticleIcon />}
				<Typography
					component="h2"
					variant="h5"
					color="inherit"
					align="center"
					noWrap
					sx={{ flex: 1 }}
				>
					<Link
						color="inherit"
						underline="none"
						href="/"
					>
						{title}
					</Link>
				</Typography>
				{/* <IconButton sx={{ marginRight: 3 }}>
					<SearchIcon />
				</IconButton> */}
				<SearchBar />
				<Box marginLeft={3}>
				{/* {isLoggedIn ? <Avatar /> : <SingIn />} */}
				</Box>
			</Toolbar>
			<Toolbar
				component="nav"
				variant="dense"
				sx={{ justifyContent: "center", overflowX: "auto"}}
			>
				{sections.map((section) => (
					<Link
						color="inherit"
						noWrap
						key={section.title}
						variant="body2"
						href={section.url}
						sx={{ p: 1, flexShrink: 0 }}
					>
						{section.title}
					</Link>
				))}
			</Toolbar>
		</>
	);
}

Header.propTypes = {
	sections: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
		})
	).isRequired,
	title: PropTypes.string.isRequired,
};

export default Header;
