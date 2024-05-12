import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';
import { FaArrowUpWideShort, FaArrowDownShortWide } from "react-icons/fa6";


const App = props => {
  const [movies, setMovies] = useState([]),
    [ascRecent, setAscRecent] = useState(true),
    [ascRating, setAscRating] = useState(true),
    [genres, setGenres] = useState([]),
    [loading, setLoading] = useState(true);

  const fetchMovies = () => {
    setLoading(true);

    return fetch('http://localhost:8000/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }

  const fetchGenres = () => {
    setLoading(true);

    return fetch('http://localhost:8000/genres')
      .then(response => response.json())
      .then(data => {
        setGenres(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchGenres();
  }, []);

  const filterByGenre = (e) => {
    let genreId = e.target.value;

    setLoading(true);

    return fetch(`http://localhost:8000/movies/genre/${genreId}`)
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }

  return (
    <Layout>
      <Heading />

      <GenresSelect {...{ genres, filterByGenre }} />

      <FilterButtons {...{ movies, setMovies, setLoading, ascRecent, setAscRecent, ascRating, setAscRating }} />

      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
              <span>{props.year}</span>

              {props.rating
                ? <Rating>
                  <Rating.Star />

                  <span className="ml-0.5">
                    {props.rating}
                  </span>
                </Rating>
                : null
              }
            </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
            color="light"
            size="xs"
            className="w-full"
            onClick={() => window.open(props.wikipediaUrl, '_blank')}
          >
            More
          </Button>
          : null
        }
      </div>
    </div>
  );
};

const FilterButtons = props => {
  const filterMovie = function (e) {
    let type = e.target.id,
      array = [...props.movies];

    props.setLoading(true);

    if (type == 'btn-recent') array.sort((a, b) => {
      let result = (a.releaseDate < b.releaseDate) ? 1 : -1;
      if (props.ascRecent) result = (a.releaseDate > b.releaseDate) ? 1 : -1;

      props.setAscRecent(!props.ascRecent);

      return result;
    });
    else array.sort((a, b) => {
      let result = (a.rating < b.rating) ? 1 : -1
      if (props.ascRating) result = (a.rating > b.rating) ? 1 : -1

      props.setAscRating(!props.ascRating);

      return result;
    });

    props.setMovies(array);
    props.setLoading(false);
  };

  return (
    <div className='mb-10'>
      <p className="font-light text-gray-500 mb-5">
        Order the collection of movies by rating or most recent
      </p>


      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button type='button' onClick={filterMovie} id="btn-recent" className="rounded-s-lg text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 flex items-center gap-5">Most recent {props.ascRecent ? <FaArrowUpWideShort /> : < FaArrowDownShortWide />}</button>
        <button type='button' onClick={filterMovie} id="btn-rating" className="rounded-r-lg text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 flex items-center gap-5">Rating {props.ascRating ? <FaArrowUpWideShort /> : < FaArrowDownShortWide />}</button>
      </div>

    </div>
  );
}

const GenresSelect = props => {
  return (
    <div className='mb-10'>
      <p className="font-light text-gray-500 mb-5">
        Filter the collection of movies by genre
      </p>
      <select defaultValue="" onChange={props.filterByGenre} className="bg-gray-50 border border-gray-800 focus:border-gray-800 text-gray-900 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="" disabled>Select your option</option>
        {props.genres.map((genre) =>
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        )}
      </select>
    </div>

  )
}

export default App;
