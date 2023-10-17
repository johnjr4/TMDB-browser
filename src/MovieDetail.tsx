import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {cachedMovies, NUM_PAGES, PAGE_SIZE, pageOptions} from './App';
import axios from 'axios';

// Must append with "original/abc123.jpg" or "w500/abc123.jpg" or something
const pre_poster_path = 'https://image.tmdb.org/t/p/'

interface RankedMovie {
  "rank": number,
  "movie": Movie
}

interface Movie {
  "adult": boolean,
  "backdrop_path": string,
  "genre_ids": Array<number>,
  "id": number,
  "original_language": string,
  "original_title": string,
  "overview": string,
  "popularity": number,
  "poster_path": string,
  "release_date": string,
  "title": string,
  "video": boolean,
  "vote_average": number,
  "vote_count": number
}

const defaultMovie: Movie = {
    "adult": false,
    "backdrop_path": "/79bJL9ydAMYVltuNTt4VhxORqIz.jpg",
    "genre_ids": [12, 878],
    "id": 329,
    "original_language": "en",
    "original_title": "Jurassic Park",
    "overview": "A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA. Before opening day, he invites a team of experts and his two eager grandchildren to experience the park and help calm anxious investors. However, the park is anything but amusing as the security systems go off-line and the dinosaurs escape.",
    "popularity": 29.589,
    "poster_path": "/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
    "release_date": "1993-06-11",
    "title": "Jurassic Park",
    "video": false,
    "vote_average": 7.941,
    "vote_count": 15185
}

interface CrewMember {
    adult: boolean,
    credit_id: string,
    department: string,
    gender: number,
    id: number,
    job: string,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string
}

function getOptions(id: number, path: string) {
    return {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}${path}`,
        params: {language: 'en-US'},
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTE4MGZlNzdkOTU1MWFhYjEyYzgyMDdiY2IwNzQ5NiIsInN1YiI6IjY1MmNjZThlNjYxMWI0MDBjNTBmNjRiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DCpgKfhEPgi_19YZ4SSW0g-f_VD6vncMo4tpJzYwG_k'
        }
    }
};

function nextPage(currPage: number) {
    const next = currPage + 1;
    if (next > 200) return 1;
    return next;
}

function prevPave(currPage: number) {
    const prev = currPage - 1;
    if (prev < 1) return 200;
    return prev;
}

function MovieDetail() {
    // console.log("Movie detail...");
    const { rank } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<Movie>(defaultMovie);
    const [failed, setFailed] = useState<boolean>(false);
    const [localCache, setLocalCache] = useState<Array<RankedMovie>>(cachedMovies);
    const [director, setDirector] = useState<string>("Steven Spielberg");

    useEffect(() => {
        if (localCache == null || localCache.length !== NUM_PAGES * PAGE_SIZE) {
            // console.log("Pulling movies");
            axios.all([
              axios.request(pageOptions(1)), 
              axios.request(pageOptions(2)), 
              axios.request(pageOptions(3)), 
              axios.request(pageOptions(4)), 
              axios.request(pageOptions(5)), 
              axios.request(pageOptions(6)), 
              axios.request(pageOptions(7)), 
              axios.request(pageOptions(8)), 
              axios.request(pageOptions(9)), 
              axios.request(pageOptions(10)), 
            ])
            .then(axios.spread((data1, data2, data3, data4, data5, data6, data7, data8, data9, data10) => {
              // output of req.
              const allMovies = [...data1.data.results, ...data2.data.results, 
                ...data3.data.results, ...data4.data.results, ...data5.data.results,
                ...data6.data.results, ...data7.data.results, ...data8.data.results,
                ...data9.data.results, ...data10.data.results];
              const allRanked = allMovies.map((movie, i) => ({rank: i + 1, movie: movie}));
              setLocalCache([...allRanked]);
              setLoading(false);
              }))
              .catch(function (error) {
                console.error(error);
                setFailed(true);
            });
          } else {
              const currMovie = localCache.find((rankedMovie) => rankedMovie.rank === Number(rank))!.movie;
              setMovie(currMovie);
              axios.request(getOptions(currMovie.id, '/credits'))
              .then(function(response) {
                  const newDirector = response.data.crew.find((crewMem: CrewMember) => crewMem.job === "Director");
                  if (newDirector) setDirector(newDirector.name);
                  setLoading(false);
                })
                .catch(function (error) {
                    console.error(error);
                    setFailed(true);
                });
          }
    }, [loading, localCache, rank, director]);

    if (failed) {
        return (
            <div>
                API request failed. Please try again later.
            </div>
        );
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div className='movie-details'>
            <img 
                className='backdrop'
                src={`${pre_poster_path}w1280${movie.backdrop_path}`}
                alt={`Backdrop for ${movie.title}`}
            />
            <div className='movie-details-text'>
                <div className='movie-details-header'>
                    <h2>{movie.title}</h2>
                    <p>{director}</p>
                </div>
                <p className='movie-synopsis'>{movie.overview}</p>
            </div>
            <Link to={`/detail/${prevPave(Number(rank))}`} id='left-button'><button>{'<'}</button></Link>
            <Link to={`/detail/${nextPage(Number(rank))}`} id='right-button'><button>{'>'}</button></Link>
        </div>
    );
}

export default MovieDetail;