export function App(root) {
  // Application state
  let query = "";
  let movies = [];
  let isLoading = false;
  let error = "";
  let selectedId = null;
  let selectedMovie = null;
  let watched = JSON.parse(localStorage.getItem("watched")) || [];
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  // Utility functions
  function updateLocalStorage() {
    localStorage.setItem("watched", JSON.stringify(watched));
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }

  function renderFavourites() {
    const favouritesBox = document.querySelector(".favourites-box");
    favouritesBox.innerHTML = ""; // Clear previous content

    if (favourites.length === 0) {
      favouritesBox.innerHTML = "<p>No favourite movies added yet.</p>";
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "list list-favourites";
    favourites.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title} Poster" />
        <h3>${movie.Title}</h3>
        <p>🗓 ${movie.Year}</p>
        <button class="btn-remove-favourite" data-id="${movie.imdbID}">Remove from Favourites</button>
      `;
      li.querySelector(".btn-remove-favourite").addEventListener("click", () => removeFromFavourites(movie.imdbID));
      ul.appendChild(li);
    });

    favouritesBox.appendChild(ul);
  }

  function renderMovieDetails() {
    const detailsBox = document.querySelector(".details-box");
    detailsBox.innerHTML = ""; // Clear previous content

    if (!selectedMovie) return;

    const header = document.createElement("header");
    const backButton = document.createElement("button");
    backButton.className = "btn-back";
    backButton.innerHTML = "&larr;";
    backButton.addEventListener("click", () => {
      selectedId = null;
      selectedMovie = null;
      renderMovieDetails();
    });
    header.appendChild(backButton);

    const img = document.createElement("img");
    img.src = selectedMovie.Poster;
    img.alt = `Poster of ${selectedMovie.Title} movie`;
    header.appendChild(img);

    const overview = document.createElement("div");
    overview.className = "details-overview";
    overview.innerHTML = `
      <h2>${selectedMovie.Title}</h2>
      <p>${selectedMovie.Released} &bull; ${selectedMovie.Runtime}</p>
      <p>${selectedMovie.Genre}</p>
      <p><span>⭐️</span> ${selectedMovie.imdbRating} IMDb rating</p>
    `;
    header.appendChild(overview);

    const section = document.createElement("section");
    section.innerHTML = `
      <p><em>${selectedMovie.Plot}</em></p>
      <p>Starring ${selectedMovie.Actors}</p>
      <p>Directed by ${selectedMovie.Director}</p>
    `;

    const addToFavouritesButton = document.createElement("button");
    addToFavouritesButton.className = "btn-add-favourite";
    addToFavouritesButton.textContent = "Add to Favourites";
    addToFavouritesButton.addEventListener("click", () => addToFavourites(selectedMovie));

    section.appendChild(addToFavouritesButton);
    detailsBox.appendChild(header);
    detailsBox.appendChild(section);
  }


  function renderMovies() {
    const moviesBox = document.querySelector(".movies-box");
    moviesBox.innerHTML = ""; // Clear previous content
  
    if (isLoading) {
      moviesBox.innerHTML = '<p class="loader">Loading...</p>';
      return;
    }
  
    if (error) {
      moviesBox.innerHTML = `<p class="error">⛔ ${error}</p>`;
      window.updateNumResults(); // Update results count even if there's an error
      return;
    }
  
    if (movies.length === 0) {
      moviesBox.innerHTML = '<p class="error">No movies found.</p>';
      window.updateNumResults(); // Update results count when no movies are found
      return;
    }
  
    const ul = document.createElement("ul");
    ul.className = "list list-movies";
    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title} Poster" />
        <h3>${movie.Title}</h3>
        <p>🗓 ${movie.Year}</p>
      `;
      li.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
      ul.appendChild(li);
    });
  
    moviesBox.appendChild(ul);
    window.updateNumResults(); // Update results count after rendering movies
  }
  

  function renderNavBar() {
    const navBar = document.createElement("nav");
    navBar.className = "nav-bar";
  
    const logo = document.createElement("div");
    logo.className = "logo";
    logo.innerHTML = '<span>🍿</span><h1>IMDBClone</h1>';
    navBar.appendChild(logo);
  
    const searchInput = document.createElement("input");
    searchInput.className = "search";
    searchInput.type = "text";
    searchInput.placeholder = "Search movies...";
    searchInput.value = query;
  
    searchInput.addEventListener("input", (e) => {
      query = e.target.value;
    });
  
    searchInput.addEventListener("keydown", (e) => {
      if (e.code === "Enter") fetchMovies();
    });
  
    navBar.appendChild(searchInput);
  
    // Create numResults element
    const numResults = document.createElement("p");
    numResults.className = "num-results";
    navBar.appendChild(numResults);
  
    // Update numResults dynamically
    function updateNumResults() {
      numResults.innerHTML = `Found <strong>${movies.length}</strong> results`;
    }
  
    // Attach the update function to the window for easy calling
    window.updateNumResults = updateNumResults;
  
    return navBar;
  }

  function renderMainContent() {
    const main = document.createElement("main");
    main.className = "main";

    const moviesBox = document.createElement("div");
    moviesBox.className = "box movies-box"; // Added class for dynamic updates
    main.appendChild(moviesBox);

    const detailsBox = document.createElement("div");
    detailsBox.className = "box details-box"; // Added class for movie details
    main.appendChild(detailsBox);

    const favouritesBox = document.createElement("div");
    favouritesBox.className = "box favourites-box"; // Added class for favourites list
    main.appendChild(favouritesBox);

    return main;
  }

  function renderApp() {
    root.innerHTML = ""; // Clear previous content
    root.appendChild(renderNavBar());
    root.appendChild(renderMainContent());
    renderMovies(); // Dynamically render movies
    renderMovieDetails(); // Dynamically render details
    renderFavourites(); // Dynamically render favourites
  }

  // Fetch movies from API
 
async function fetchMovies() {
  if (query.length < 3) {
    movies = [];
    error = "";
    renderMovies();
    return;
  }

  try {
    isLoading = true;
    error = "";
    renderMovies();

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=69c6dd20&s=${query}`
    );
    if (!res.ok) throw new Error("Failed to fetch movies");

    const data = await res.json();
    if (data.Response === "False") throw new Error(data.Error);

    movies = data.Search;
  } catch (err) {
    error = err.message;
  } finally {
    isLoading = false;
    renderMovies(); // Ensure the UI is updated after fetching movies
  }
}
  // Fetch single movie details
  async function fetchMovieDetails(id) {
    try {
      isLoading = true;
      renderMovieDetails();

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=69c6dd20&i=${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch movie details");

      selectedMovie = await res.json();
    } catch (err) {
      console.error(err.message);
    } finally {
      isLoading = false;
      renderMovieDetails();
    }
  }

  // Add movie to favourites
  function addToFavourites(movie) {
    if (!favourites.find((fav) => fav.imdbID === movie.imdbID)) {
      favourites.push(movie);
      updateLocalStorage();
      renderFavourites();
    }
  }

  // Remove movie from favourites
  function removeFromFavourites(imdbID) {
    favourites = favourites.filter((movie) => movie.imdbID !== imdbID);
    updateLocalStorage();
    renderFavourites();
  }

  // Initial render
  renderApp();
}
