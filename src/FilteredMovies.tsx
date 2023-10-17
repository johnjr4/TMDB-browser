// import React from 'react';
import {sortBy, filterBy} from "./callbacks"
import { Link } from 'react-router-dom';

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

function sortOptions(filtered: Array<RankedMovie>, sortVerbose: string) {
  const descending = sortVerbose.includes('_descending');
  const sort = sortVerbose.replace('_descending', '');
  filtered.sort(sortBy(sort));
  if (descending) filtered.reverse();
}

function FilteredMovies(props: {movies: Array<RankedMovie>, search: string, sort: string}) {
  const filtered = props.movies.filter(filterBy('search', props.search));
  sortOptions(filtered, props.sort);
    return(
      <div>
        {/* These are your filtered movies! */}
        <ol>
          {filtered.map(rankedMovie => <FilteredMovieItem movie={rankedMovie.movie} 
            idx={rankedMovie.rank} 
            key={rankedMovie.rank}/>)}
        </ol>
      </div>
    );
}
  
  function FilteredMovieItem(props: {movie: Movie, idx: number}) {
    return (
      <li key={props.idx - 1}>
        <span className="list-left">
          <span className="list-idx">{props.idx}</span>
          <img className="thumbnail" 
          alt={`Poster for: ${props.movie.title}`}
          src={`${pre_poster_path}w154${props.movie.poster_path}`}/>
          <Link className="list-title detail-link" to={`/detail/${props.idx}`}>{props.movie.title}</Link>
        </span>
        {/* <span className="list-middle">
          <Link className='detail-link' to="/detail">Detail view</Link>
        </span> */}
        <span className="list-right">
          <span>{props.movie.vote_average} / 10</span>
        </span>
      </li>
    );
}

export default FilteredMovies;