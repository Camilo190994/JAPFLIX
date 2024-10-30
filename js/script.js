// Función para cargar datos de películas
async function fetchMoviesData() {
    try {
        const response = await fetch("https://japceibal.github.io/japflix_api/movies-data.json");
        if (!response.ok) throw new Error("Error al obtener los datos de películas");
        const moviesData = await response.json();
        window.moviesData = moviesData;
        console.log("Datos de películas cargados, sin mostrarlos al usuario.");
    } catch (error) {
        console.error("Error al cargar los datos de películas:", error);
    }
}

// Cargar los datos de películas al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchMoviesData();
    document.getElementById("btnBuscar").addEventListener("click", searchMovies);
});

// Función de búsqueda
function searchMovies() {
    const query = document.getElementById("inputBuscar").value.toLowerCase();
    const resultsContainer = document.getElementById("lista");
    resultsContainer.innerHTML = ""; // Limpiar resultados previos

    if (query) {
        const filteredMovies = window.moviesData.filter(movie => 
            movie.title.toLowerCase().includes(query) ||
            (movie.genres && Array.isArray(movie.genres) && movie.genres.some(genre => typeof genre === "string" && genre.toLowerCase().includes(query))) ||
            (movie.tagline && movie.tagline.toLowerCase().includes(query)) ||
            (movie.overview && movie.overview.toLowerCase().includes(query))
        );

        // Mostrar resultados
        filteredMovies.forEach(movie => {
            const movieElement = document.createElement("li");
            movieElement.classList.add("movie-item"); // Aplicar clase de CSS
            movieElement.innerHTML = `
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-tagline">${movie.tagline}</p>
                <p class="movie-rating">${getStarRating(movie.vote_average)}</p>
            `;
            movieElement.addEventListener("click", () => showMovieDetails(movie)); // Añadir evento de clic
            resultsContainer.appendChild(movieElement);
        });
    }
}

// Función para mostrar estrellas basado en el voto promedio
function getStarRating(voteAverage) {
    const stars = Math.round(voteAverage / 2); // Dividir entre 2 para un rango de 0 a 5 estrellas
    const filledStars = `<span class="filled">${"★".repeat(stars)}</span>`;
    const emptyStars = `<span class="empty">${"☆".repeat(5 - stars)}</span>`;
    return `${filledStars}${emptyStars}`;
}

// Función para mostrar los detalles de la película en el Offcanvas
function showMovieDetails(movie) {
    // Seleccionar el contenedor de contenido del Offcanvas
    const movieDetailsContent = document.getElementById("movieDetailsContent");

    // Convertir los géneros en una cadena de texto separada por comas
    const genres = movie.genres.map(genre => genre.name).join(", ");

    // Extraer el año de la fecha de lanzamiento
    const releaseYear = new Date(movie.release_date).getFullYear();

    // Formatear el presupuesto y las ganancias como moneda (en dólares americanos como ejemplo)
    const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A";
    const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A";

    // Insertar el contenido de la película con el botón desplegable
    movieDetailsContent.innerHTML = `
        <h5>${movie.title}</h5>
        <p>${movie.overview}</p>
        <p><strong></strong> ${genres}</p>

        <!-- Botón desplegable -->
        <div class="dropdown mt-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="movieInfoDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                More
            </button>
            <ul class="dropdown-menu" aria-labelledby="movieInfoDropdown">
                <li><span class="dropdown-item"><strong>Año de lanzamiento:</strong> ${releaseYear}</span></li>
                <li><span class="dropdown-item"><strong>Duración:</strong> ${movie.runtime} minutos</span></li>
                <li><span class="dropdown-item"><strong>Presupuesto:</strong> ${budget}</span></li>
                <li><span class="dropdown-item"><strong>Ganancias:</strong> ${revenue}</span></li>
            </ul>
        </div>
    `;

    // Mostrar el Offcanvas usando Bootstrap
    const offcanvasElement = document.getElementById("movieDetails");
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
}




