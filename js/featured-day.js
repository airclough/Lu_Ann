
!function( window ) {
  app.views.count = {
    _year: 365,

    init: function() {
      this._el   = document.querySelector( '.number' );
      this._ms   = 1000 / ( this._year - app.first.day );

      this._render()
        ._bindEventListeners();
    },

    _render: function() {
      this._el.innerHTML = app.first.day;
      return this;
    },

    _bindEventListeners: function() {
      var that = this;

      window.addEventListener( 'scroll', function( e ) {
        that._scroll( e );
      });
    },

    _inViewport: function() {
      var client = window.innerHeight || document.documentElement.clientHeight
        , main   = document.querySelector( '.main' ).clientHeight
        , quote  = document.querySelector( '.feature-quote' ).clientHeight
        , y      = window.pageYOffset || document.documentElement.scrollTop;

      return client + y >= main + quote;
    },

    _countDown: function( year ) {
      if( year < app.first.day ) return;

      var that = this;

      setTimeout( function() {
        that.el.innerHTML = year--;
        that._countDown( year );
      }, this.ms );
    },

    _d3Arc: function() {
      var svg = d3.select( '.count' ).append( 'svg' );
      svg.attr({
        height: 200,
        width : 200
      });

      var scale = d3.scale.linear();
      scale.domain( [ 1, 365 ] )
        .range( [ 0, 2 * Math.PI ] );

      var arc = d3.svg.arc();
      arc.innerRadius( 80 )
        .outerRadius( 100 )
        .startAngle( scale( 1 ) );

      var dayArc = svg.append( 'path' );
      dayArc.datum( { endAngle: scale( 1 ) } )
        .attr( 'fill', '#ff6666' )
        .attr( 'd', arc )
        .attr( 'transform', 'translate(100,100)' )
        .transition()
        .duration( 2000 )
        .call( arcTween, scale( app.first.day ) );

      function arcTween( transition, newAngle ) {
        transition.attrTween( 'd', function( d ) {
          var interpolate = d3.interpolate( d.endAngle, newAngle );

          return function( t ) {
            d.endAngle = interpolate( t );
            return arc( d );
          }
        });
      }
    },

    _scroll: function( e ) {
      if( this._arcInitialized ) return;
      if( this._inViewport() ) { this._arcInitialized = true; this._d3Arc(); }
    }
  };

  app.views.first = {
    _elems: {},

    init: function() {
      this._elems.post  = document.querySelector( '.first .post' );
      this._elems.video = document.querySelector( '.first .video' );

      this._renderPost()
        ._renderVideo()
        ._bindEventListeners()
        ._player();
    },

    _renderPost: function() {
      this._elems.post.innerHTML = this._postTemplate();
      return this;
    },

    _postTemplate: function() {
      return '<div>' + app.first.post + '</div>';
    },

    _renderVideo: function() {
      this._elems.video.innerHTML = this._videoTemplate();
      return this;
    },

    _videoTemplate: function() {
      return '<div id="youtube">' + app.first.video + '</div>';
    },

    _bindEventListeners: function() {
      var that = this;

      window.addEventListener( 'scroll', function( e ) {
        that._scroll( e );
      });

      return this;
    },

    _player: function() {
      window.onYouTubeIframeAPIReady = function() {
        new YT.Player( 'youtube', {
          videoId: app.first.video
        });
      };
    },

    _inViewport: function() {
      var client = window.innerHeight || document.documentElement.clientHeight
        , main   = document.querySelector( '.main' ).clientHeight
        , quote  = document.querySelector( '.feature-quote' ).clientHeight
        , count  = document.querySelector( '.count' ).clientHeight
        , y      = window.pageYOffset || document.documentElement.scrollTop;

      return client + y >= main + quote + count;
    },

    _fadeIn: function() {
      var fade = new RegExp('(^|\\s+)' + 'fade' + '(\\s+|$)');

      this._elems.post.className  = this._elems.post.className.replace( fade, '' );
      this._elems.video.className = this._elems.video.className.replace( fade, '' );
    },

     _scroll: function( e ) {
      if( this._fadeInitialized ) return;
      if( this._inViewport() ) { this._fadeInitialized = true; this._fadeIn(); }
    }
  };
}( window );
