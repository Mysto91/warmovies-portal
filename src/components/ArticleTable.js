import React, { Component } from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { Fade, Pagination, Rating } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = {
    root: {
        height: "100%",
    },
    pagination: {
        '& ul': {
            marginLeft: "auto",
            marginRight: "auto",
            width: "75%",
            '& button': {
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                '&[aria-current=true]': {
                    background: 'linear-gradient(45deg, #2980B9 30%, #6DD5FA 90%)',
                }
            }
        }
    }
};

class ArticleTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            meta: [],
            isLoaded: false,
            currentPage: 1,
            error: null
        };
    }

    componentDidMount = () => {
        this.getArticles();
    }

    getArticles = (params = {}) => {
        const url = new URL(`${process.env.REACT_APP_API_HOST}/api/articles`);

        params.api_token = process.env.REACT_APP_API_TOKEN;
        params.perPage = 9;

        url.search = new URLSearchParams(params).toString();

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        articles: result.data,
                        currentPage: result.meta.current_page,
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
        if (this.state.currentPage != page) {
            this.setState({
                isLoaded: false
            });
            this.getArticles({ page: page })
        }
    }

    render() {
        const { isLoaded, articles, meta } = this.state;
        const { classes } = this.props;

        return (
            <Grid className={classes.root} container>
                <Grid item xs={12} height="900px" mt={10}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {(!isLoaded ? Array.from(new Array(9)) : articles).map((article, index) => (
                            <Grid key={index} item xs={4}>
                                <Box key={index} sx={{ mx: "auto", width: 300 }} >
                                    {article ? (
                                        <Fade
                                            in={isLoaded}
                                            timeout={1000}
                                        >
                                            <Box display={'flex'} justifyContent={'center'}>
                                                <img
                                                    style={{ height: 118 }}
                                                    alt={article.title}
                                                    src="/images/spool.jpg"
                                                />
                                            </Box>
                                        </Fade>
                                    ) : (
                                        <Skeleton variant="rectangular" width={210} height={118} />
                                    )}

                                    {article ? (
                                        <Fade
                                            in={isLoaded}
                                            timeout={1000}
                                        >
                                            <Box sx={{ pr: 2 }}>
                                                <Typography gutterBottom variant="body2" display={'flex'} justifyContent={'center'}>
                                                    {article.title}
                                                </Typography>
                                                <Typography display="block" variant="caption" color="text.secondary" justifyContent={'center'}>
                                                    {article.description}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display={'flex'} justifyContent={'center'}>
                                                    <Rating
                                                        name="simple-controlled"
                                                        value={Number(article.rate)}
                                                        precision={0.5}
                                                        readOnly
                                                        sx={{ color: 'black' }}
                                                    />
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display={'flex'} justifyContent={'center'}>
                                                    {`Date de sortie : ${article.releaseDate ?? 'N/A'}`}
                                                </Typography>
                                            </Box>
                                        </Fade>
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
                        className={classes.pagination}
                        count={meta ? meta.last_page : 0}
                        onChange={this.handlePaginationChange}
                        sx={{
                            mx: "auto",
                            width: 500
                        }}
                        color="primary"
                        size="large"
                    ></Pagination>
                </Grid>
            </Grid >
        )
    }
}

export default withStyles(styles)(ArticleTable);
