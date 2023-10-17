import {sortBy, filterBy} from './callbacks';
import {Link} from 'react-router-dom';

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

function FilteredGallery(props: {movies: Array<RankedMovie>, genre: string}) {
    const filtered = props.movies.filter(filterBy('genre', props.genre));
    filtered.sort(sortBy('none'));
    return(
      <div id='filtered-gallery'>
          {filtered.map(
            rankedMovie => <FilteredGalleryItem movie={rankedMovie.movie}
                rank={rankedMovie.rank}
                key={rankedMovie.rank}/>
            )}
      </div>
    );
}

function FilteredGalleryItem(props: {movie: Movie, rank: number}) {
    return (
        <div className="gallery-card">
            <Link to={`/detail/${props.rank}`}>
                <img className="gallery-poster"
                src={`${pre_poster_path}w342${props.movie.poster_path}`}
                alt={`Poster for: ${props.movie.title}`}/>
            </Link>
            <p>{props.rank}</p>
        </div>
    );
}

export default FilteredGallery;