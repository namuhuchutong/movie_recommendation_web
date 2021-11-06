$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

async function getMyLists(){
    let movies;
    let titleNum;
    await axios.get('http://127.0.0.1:8000/list')
        .then((response) => {
            console.log(response.data);
            movies = response.data;
            let max = Object.keys(movies).length;
            titleNum = Math.floor(Math.random()*(max));
            console.log(titleNum);
        })
        .catch((err) => {
            console.log(err);
        });
    let output = ``;
    console.log(movies);

    $.each(movies, async (key, item) => {
       await axios.get('http://www.omdbapi.com/?apikey=d1b58e76&i='+item.imdbId)
           .then((response) => {
              let movie = response.data;
              console.log(movie)
              output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}" onerror="this.src='/media/noimage.png'">
                        <h5><a onclick="movieSelected('${movie.Title}', '${movie.imdbID}')">${movie.Title}</a></h5>
                    </div>
                </div>
               `;
              $('#MyList').html(output);
           })
           .catch((err) => {
               console.log(err);
           });
    });

    let recommendData;
    let title = movies[titleNum].title;
    console.log(title);
    await axios.get('http://127.0.0.1:5000/api/userId/'+title+"?id=16")
        .then((response) => {
            console.log(response);
            recommendData = response.data;
            console.log(recommendData)
        })
        .catch((err) => {
            console.log(err);
    });

    let output2 = '';
   $.each(recommendData, async (index, item) => {
       await axios.get('http://www.omdbapi.com/?apikey=d1b58e76&t='+item.title)
           .then((response) => {
              let movie = response.data;
              console.log(movie)
              output2 += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}" onerror="this.src='/media/noimage.png'">
                        <h5><a onclick="movieSelected('${movie.Title}', '${movie.imdbID}')">${movie.Title}</a></h5>
                    </div>
                </div>
               `;
              $('#MyRecommedation').html(output2);
           })

           .catch((err) => {
               console.log(err);
           });
   });
   return false;
}

function getMovies(searchText){
    axios.get('http://www.omdbapi.com/?apikey=d1b58e76&s='+searchText)
        .then((response) => {
           console.log(response);
           let movies = response.data.Search;
           let output = '';
           $.each(movies, (index, movie) => {
               output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}">
                        <h5>${movie.Title}</h5>
                        <a onclick="movieSelected('${movie.Title}', '${movie.imdbID}')" class="btn btn-primary" href="#">Moive Details</a>
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

function movieSelected(id, imdbid){
    sessionStorage.setItem('movieId', id);
    sessionStorage.setItem('imdbId', imdbid);
    window.location = '/movie';
    return false;
}

function getMovie(){
    let movieTitle = sessionStorage.getItem('movieId');
    axios.get('http://www.omdbapi.com/?apikey=d1b58e76&t='+movieTitle)
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
                    
                    <div class="well mt-3">
                        <h3>Plot</h3>
                        ${movie.Plot}
                        <hr>
                        <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
                        <a href="/home" class="btn btn-default">Go Back To Search</a>
                    </div>
                 </div>
            </div>
           `;
           $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });

}

async function getContentRecommend(title) {
    let movieList;
    await axios.get('http://127.0.0.1:5000/api/movies/'+title)
        .then((response) => {
            console.log(response);
            let recommendData = response.data;
            movieList = recommendData.content;
        })
        .catch((err) => {
            console.log(err);
    });
    let output = '';
   $.each(movieList, async (index, title) => {

       await axios.get('http://www.omdbapi.com/?apikey=d1b58e76&t='+title)
           .then((response) => {
              let movie = response.data;
              console.log(movie)
              output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}" onerror="this.src='/media/noimage.png'"/>
                        <h5><a onclick="movieSelected('${movie.Title}', '${movie.imdbID}')">${movie.Title}</a></h5>
                    </div>
                </div>
               `;
              $('#recommendations').html(output);
           })

           .catch((err) => {
               console.log(err);
           });

   });
   return false;

}

function getMyMoives(movies){
    let output = '';
    $.each(movies, async (index, movie) => {
        let title = movie.title;
        let est = movie.est;
        let percent = parseInt(est/5*100);
        console.log(percent);
        await axios.get('http://www.omdbapi.com/?apikey=d1b58e76&t='+title)
            .then((response) => {
                let data = response.data;
                console.log(data);
                output += `
                    <div class="col">
                        <div class="well text-center">
                            <img src="${data.Poster}" onerror="this.src='/media/noimage.png'"/>
                            <h5><a onclick="movieSelected('${data.Title}', '${data.imdbID}')">${data.Title} - (${percent}%)</a></h5>
                        </div>
                    </div>
                `;
                $('#UserRecommendation').html(output);
            })
            .catch((err) => {
               console.log(err);
            });
    });
    return false;
}

$(':radio').change(function() {
    let rating = this.value;
    let title = sessionStorage.getItem('movieId');
    let imdbid = sessionStorage.getItem('imdbId');

    let payload = { title: title, imdbid: imdbid, rating: rating };
    console.log(payload);

    axios.post('http://127.0.0.1:8000/rating', payload);
});