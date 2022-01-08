import React, { Component } from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { Pagination, Rating } from '@mui/material';

export default class ArticleTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            isLoaded: false,
            error: null
        };
    }

    componentDidMount = () => {
        const url = new URL(`${process.env.REACT_APP_API_HOST}/api/articles`);

        const params = {
            'api_token': process.env.REACT_APP_API_TOKEN
        }

        url.search = new URLSearchParams(params).toString();

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        articles: result.data
                    });
                },
                // Remarque : il est important de traiter les erreurs ici
                // au lieu d'utiliser un bloc catch(), pour ne pas passer à la trappe
                // des exceptions provenant de réels bugs du composant.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { isLoaded, articles } = this.state;

        return (
            <Grid container >
                {(!isLoaded ? Array.from(new Array(10)) : articles).map((article, index) => (
                    <Box key={index} sx={{ width: 210, margin: 5, my: 5 }}>
                        {article ? (
                            <img
                                style={{ width: 210, height: 118 }}
                                alt={article.title}
                                src="https://fakeimg.pl/300"
                            />
                        ) : (
                            <Skeleton variant="rectangular" width={210} height={118} />
                        )}

                        {article ? (
                            <Box sx={{ pr: 2 }}>
                                <Typography gutterBottom variant="body2">
                                    {article.title}
                                </Typography>
                                <Typography display="block" variant="caption" color="text.secondary">
                                    {article.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    <Rating
                                        name="simple-controlled"
                                        value={Number(article.rate)}
                                        precision={0.1}
                                        readOnly
                                    />
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {`Date de sortie ${article.releaseDate ?? 'N/A'}`}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ pt: 0.5 }}>
                                <Skeleton />
                                <Skeleton width="60%" />
                            </Box>
                        )}
                    </Box>
                ))}
                <Pagination count={10}></Pagination>
            </Grid>
        )
    }
}
