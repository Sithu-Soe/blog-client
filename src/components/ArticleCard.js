import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Box, Paper } from '@mui/material';

const styles = {
    hoverContent: {
        cursor: 'pointer',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }
}

const ArticleCard = ({article}) => {
    const navigate = useNavigate();
    const handleRouteToArticle = () => {
        navigate(`/articles/${article._id}`);
        
    }
    return (
        <Grid item xs={4} marginTop={3} style={styles.hoverContent} onClick={handleRouteToArticle}>
            <Paper elevation={3} sx={{ display: 'flex' }}>
                <Box paddingX={1} sx={{height: 250, marginBottom: 2, paddingBottom: 2}} className="line-clamp-3">
                    <Typography variant="h6" component="h4">
                        {article.title}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        <a href={`/articles/${article._id}`} className="line-clamp-3" style={styles.link} dangerouslySetInnerHTML={{ __html: article.content }}/>
                            {/* {article.conetent}
                        </Typography> */}
                        {/* {article.images.length > 0 ? <img src={article.images[0].fileUrl} alt="" style={{ width: '100px' }} /> : null} */}
                    </Box>
                </Box>
            </Paper>
        </Grid>
    )
}

export default ArticleCard;