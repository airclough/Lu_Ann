
!function( window ) {
  var parallax = {
    init: function() {
      this.el = document.querySelector( '.main' );
      this.bindEventListeners();
    },

    bindEventListeners: function() {
      var that = this;

      window.addEventListener( 'scroll', function( e ) {
        that.scroll( e );
      })
    },

    scroll: function( e ) {
      var y = window.pageYOffset || document.documentElement.scrollTop
        , v = 0.5;

      this.el.style.backgroundPosition = '0px ' + ( y * v ) + 'px';
    }
  }

  parallax.init();
}( window );
