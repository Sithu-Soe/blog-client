import { useEffect, useState } from "react"
import {Container, Typography, Grid } from '@mui/material';
import ArticleCard from "../components/ArticleCard";
import { getArticles } from "../services/article-services"

const Home = () => {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getArticles().then(function (articles) {
            setArticles(articles)
        }).catch(err => {
            console.log(err)
        })
    }, [])
    return (
        <Container>
            <Typography variant="h3" component="h2">
                Explore Articles
            </Typography>
            <Grid container spacing={3}>
                {articles.map((article) => <ArticleCard key={article._id} article={article} />)}
            </Grid>
        </Container>

    );
}

export default Home;