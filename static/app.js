 $(function(){
    $('#search').autocomplete({
        source: function( request, response ) {
            $.ajax( {
                url: 'http://www.omdbapi.com?s='+ request.term +'&apikey=3cb88153',
                dataType: 'json',
                data: {
                    movie:request.term
                },
                success: function( data ) {
                    var movies = [];
                    jQuery.each(data.Search, function(index, item) {
                        var imdb = item.imdbID;
                        $.ajax({
                            url: 'http://www.omdbapi.com?i='+ imdb +'&apikey=3cb88153',
                            dataType: 'json',
                            data: {
                                movieDetail:imdb
                            },
                            success: function (data) {
                                movies.push(data);
                                response(movies.slice(0, 2));
                            }
                        });
                    });
                }
            });
        },
        open: function(event,ui){
            var len = $('.ui-autocomplete > li').length;
            $('#count').html( len + ' films');
        },
        minLength: 1
    });

    $('#search').data('ui-autocomplete')._renderItem = function( ul, item ){

        var re = new RegExp("^" + this.term, "gi");
        var t = item.Title.replace(re,"<span style='font-weight: bold;text-decoration: underline;text-transform: capitalize;'>" + this.term + "</span>");

        var $li = $('<li>');

        $li.html(
            '<img style="width: 200px; float: left;" src="' + item.Poster + '" />' +
            '<span class="username">' + t + '</span>' +
            '<div class="imdb">' + item.imdbRating + '</div>' +
            '<div class="language"> <b>Dil:</b> ' + item.Language + '</div>' +
            '<div class="actors"> <b>Oyuncular:</b> ' + item.Actors + '</div>' +
            '<span style="font-size:11px; color: #333; display: block;"  class="desc">' + item.Plot + '</span>'+
            '<div style="clear:both;"></div>'
        );
        return $li.appendTo(ul);
    };
});