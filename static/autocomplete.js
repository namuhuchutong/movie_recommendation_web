var myTmpl = $.templates("<li><b>{{:title}}</b> ({{:release_date}})</li>");


var url = 'https://api.themoviedb.org/3/',
    mode = 'search/movie?query=',
    input,
    movieName,
    key = '&api_key=a0735a2be9600e8356b5d672781cb382';

   $("form").submit(function() {
    var input = $('#movie').val(),
      movieName = encodeURI(input);
    $.ajax({
      type: 'GET',
      url: url + mode + input + key,
      async: false,
      jsonpCallback: 'Callback',
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(data) {
        console.dir(data.results);

        var movies = data.results;

        var html = myTmpl.render(movies);

        $("#movieList").html(html);


      },
      error: function(e) {
        console.log(e.message);
      }
    });


    return false;

  });
