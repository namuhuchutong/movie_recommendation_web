$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

function getMovies(searchText){
    axios.get('http://www.omdbapi.com/?apikey=3cb88153&s='+searchText)
        .then((response) => {
           console.log(response);
           let movies = response.data.Search;
           let output = '';
           $.each(movies, (index, movie) => {
               output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}"
                        <h5>${movie.Title}</h5>
                        <br>
                        <a onclick="movieSelected('${movie.Title}')" class="btn btn-primary" href="#">Moive Details</a>
                    </div>
                </div>
               `;
           });
           $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });
}

function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location = '/movie';
    return false;
}

function getMovie(){
    let movieTitle = sessionStorage.getItem('movieId');
    axios.get('http://www.omdbapi.com/?apikey=3cb88153&t='+movieTitle)
        .then((response) => {
           console.log(response);
           let movie = response.data;
           let movieList = getContentRecommend(movie.Title);
           let output= `
            <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="/" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
           `;
           $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });

}

function getContentRecommend(title) {
    let movieList;
    axios.get('http://127.0.0.1:5000/movies/'+title)
        .then((response) => {
            console.log(response);
            let recommendData = response.data;
            movieList = recommendData.content;
            console.log(movieList);
        })
        .catch((err) => {
            console.log(err);
    });

    return movieList;
}