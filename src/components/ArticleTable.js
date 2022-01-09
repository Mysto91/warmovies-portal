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
            meta: [],
            isLoaded: false,
            error: null
        };
    }

    componentDidMount = () => {
        this.setData();
    }

    setData = (params = {}) => {
        const url = new URL(`${process.env.REACT_APP_API_HOST}/api/articles`);

        params.api_token = process.env.REACT_APP_API_TOKEN;

        url.search = new URLSearchParams(params).toString();

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        articles: result.data,
                        meta: result.meta,
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
    };

    handlePaginationChange = (e, page) => {
        this.setData({ page: page })
    }

    render() {
        const { isLoaded, articles, meta } = this.state;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Grid container>
                        {(!isLoaded ? Array.from(new Array(10)) : articles).map((article, index) => (
                            <Grid key={index} item xs={3}>
                                <Box key={index} sx={{ width: 210 }}>
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
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Pagination
                        count={meta ? meta.last_page : 0}
                        onChange={this.handlePaginationChange}
                        sx={{ mx: "auto", width: 200 }}
                    ></Pagination>
                </Grid>
            </Grid>
        )
    }
}
