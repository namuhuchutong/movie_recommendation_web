const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDczNWEyYmU5NjAwZTgzNTZiNWQ2NzI3ODFjYjM4MiIsInN1YiI6IjYxM2M4ZDMyNjBjNzUxMDA2MmQ5MWYyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aXpfu8cIAcjdIweok4fm-JlFxsv2rzRPnJUP1q8TNkY";

let baseURL = "https://api.themoviedb.org/4/"
let imgURL = "https://image.tmdb.org/t/p/w500/"

$(function (){
   $('.movie_button').on('click', function (){
       var api_key = API_KEY;
       var title = $('.movie_title').val();

       if(title == ""){
           // pass
       }

       else{
           load_details(api_key, title);
       }
   });
});

function load_details(api_key, title){

}