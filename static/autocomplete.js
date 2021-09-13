var tmpl = $.template("<li><b>{{:title}}</b>({{:release_date}}</li>")
var url = 'https://api.themoviedb.org/3/',
    mode = 'search/movie?query=',
    api = 'api_key=a0735a2be9600e8356b5d672781cb382',
    input,
    movieTitle;

$("form").submit(function() {
    var input = $('#movie').val(),
})
