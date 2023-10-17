import React, {useState, useEffect} from 'react';
import './App.scss';
import axios from 'axios';
import { Routes, Route, Link, Outlet} from 'react-router-dom';
import FilteredMovies from './FilteredMovies';
import FilteredGallery from './FilteredGallery';
import MovieDetail from './MovieDetail';
// import FilteredMovies from "./FilteredMovies";

// Must append with "original/abc123.jpg" or "w500/abc123.jpg" or something
// const pre_poster_path = 'https://image.tmdb.org/t/p/'
const NUM_PAGES = 10;
const PAGE_SIZE = 20;

// const options = {
//   method: 'GET',
//   url: 'https://api.themoviedb.org/3/movie/top_rated',
//   params: {language: 'en-US', page: '1'},
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTE4MGZlNzdkOTU1MWFhYjEyYzgyMDdiY2IwNzQ5NiIsInN1YiI6IjY1MmNjZThlNjYxMWI0MDBjNTBmNjRiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DCpgKfhEPgi_19YZ4SSW0g-f_VD6vncMo4tpJzYwG_k'
//   }
// };

function pageOptions(page: number) {
  return {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/top_rated',
    params: {language: 'en-US', page: page.toString()},
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTE4MGZlNzdkOTU1MWFhYjEyYzgyMDdiY2IwNzQ5NiIsInN1YiI6IjY1MmNjZThlNjYxMWI0MDBjNTBmNjRiZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DCpgKfhEPgi_19YZ4SSW0g-f_VD6vncMo4tpJzYwG_k'  
    }
  };
}

// interface MovieList {
//   "page": number,
//   "results": Array<Movie>,
//   "total_pages": number,
//   "total_results": number
// };

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

interface RankedMovie {
  "rank": number,
  "movie": Movie
}

enum Genres {
Action          = 28,
Adventure       = 12,
Animation       = 16,
Comedy          = 35,
Crime           = 80,
Documentary     = 99,
Drama           = 18,
Family          = 10751,
Fantasy         = 14,
History         = 36,
Horror          = 27,
Music           = 10402,
Mystery         = 9648,
Romance         = 10749,
Scifi           = 878,
TV              = 10770,
Thriller        = 53,
War             = 10752,
Western         = 37,
}

// const errorList: MovieList = {
//   page: -1,
//   results: [],
//   total_pages: -1,
//   total_results: -1
// };

let cachedMovies: Array<RankedMovie>;

function App() {
  return (
    <div className="App">
      {/* <h1>Top TMDB Movies!</h1> */}
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<List/>}/>
          <Route path="gallery" element={<Gallery/>}/>
          <Route path="detail/:rank" element={<MovieDetail/>}/>
        </Route>
      </Routes>
    </div>
  );
}


function Layout() {
  return (
    <div id='layout'>
      <nav id="navbar">
        <ul>
          <li><Link to="/">List</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

// LIST PAGE
function List() {

  const [isLoading, setLoading] = useState<boolean>(true);
  const [displayMovies, setDisplayMovies] = useState<Array<RankedMovie>>([]);
  const [failed, setFailed] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<string>('rating');

  // console.log("Here's the list");
  // console.log(`topMovies are`);
  // console.log(topMovies)

  useEffect(() => {
    if (cachedMovies == null || cachedMovies.length !== NUM_PAGES * PAGE_SIZE) {
      console.log("Pulling movies");
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
        setDisplayMovies(allRanked);
        cachedMovies = [...allRanked];
        setLoading(false);
        }))
        .catch(function (error) {
          console.error(error);
          setFailed(true);
      });
    } else {
      setDisplayMovies(cachedMovies);
      setLoading(false);
    }
  }, []);
      
  if (failed) {
    return <div>Encountered an API error. Please try again later.</div>;
  }

  if (isLoading) {
    console.log("Loading mode...");
    return <div>LOADING!</div>;
  }

  // console.log(displayMovies);
  return(
    <div>
      {/* Welcome to list view. */}
      {/* <ListHeader/> */}
      <input 
        type='text' 
        id='search-bar'
        placeholder='Filter movies...'
        // value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        <label htmlFor="sort-bar">Sort by: </label>
        <select onChange={(e) => setSort(e.target.value)} name="sort-bar" id="sort-bar">
          <option value="rating">Rating (Highest first)</option>
          <option value="rating_descending">Rating (Lowest first)</option>
          <option value="title">Title (A to Z)</option>
          <option value="title_descending">Title (Z to A)</option>
          <option value="popularity">Popularity (Most popular first)</option>
          <option value="popularity_descending">Popularity (Least popular first)</option>
        </select>
      </div>
      <div>
        <FilteredMovies movies={displayMovies!} search={query} sort={sort}/>
      </div>
    </div>
  );
}

// GALLERY PAGE
function Gallery() {
  // console.log("Gallery...");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [displayMovies, setDisplayMovies] = useState<Array<RankedMovie>>([]);
  const [failed, setFailed] = useState<boolean>(false);
  const [genre, setGenre] = useState<string>('');

  useEffect(() => {
    if (cachedMovies == null || cachedMovies.length !== NUM_PAGES * PAGE_SIZE) {
      console.log("Pulling movies");
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
        let allRanked = allMovies.map((movie, i) => ({rank: i + 1, movie: movie}));
        setDisplayMovies(allRanked);
        cachedMovies = [...allRanked];
        setLoading(false);
        }))
        .catch(function (error) {
          console.error(error);
          setFailed(true);
      });
    } else {
      setDisplayMovies(cachedMovies);
      setLoading(false);
    }
  }, []);

  if (failed) {
    return <div>Encountered an API error. Please try again later.</div>;
  }

  if (isLoading) {
    console.log("Loading mode...");
    return <div>LOADING!</div>;
  }

  return(
    <div>
      <button className='genre-button' onClick={(e) => {setGenre('')}}>All Genres</button>
      <button className='genre-button' onClick={(e) => {setGenre(Genres.Action.toString())}}>Action</button>
      <button className='genre-button' onClick={(e) => {setGenre(Genres.Comedy.toString())}}>Comedy</button>
      <button className='genre-button' onClick={(e) => {setGenre(Genres.Thriller.toString())}}>Thriller</button>
      <div className='gradient'>
        {/* It's the gallery view */}
        <FilteredGallery movies={displayMovies!} genre={genre}/>
      </div>
    </div>
  );
}


export default App;
export {cachedMovies, NUM_PAGES, PAGE_SIZE, pageOptions};
