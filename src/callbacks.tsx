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

function sortBy(property: string) {
    switch(property) {
      case "popularity":
        return (a: RankedMovie, b: RankedMovie) => b.movie.popularity - a.movie.popularity;
      case "title":
        return (a: RankedMovie, b: RankedMovie) => {
          const titleA = a.movie.title.replace('The ', '').replace('A ','');
          const titleB = b.movie.title.replace('The ', '').replace('A ','');
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        };
      default:
        return (a: RankedMovie, b: RankedMovie) => b.movie.vote_average - a.movie.vote_average;
    }
  }
  
function filterBy(property: string, query: string) {
    switch(property) {
        case 'even':
            return (m: RankedMovie) => (m.rank % 2 === 0);
        case 'search':
            return (m: RankedMovie) => {
                const title = m.movie.title.toUpperCase();
                return title.indexOf(query.toUpperCase()) > -1;
            };
        case 'genre':
            console.log(`filtering genre ${query}`)
            if (query === '') return (m:RankedMovie) => 1;
            return(m:RankedMovie) => {
                const genreID = Number(query);
                return m.movie.genre_ids.includes(genreID);
            };
        default: 
            return (m: RankedMovie) => 1;
    }
}

export {sortBy, filterBy} 