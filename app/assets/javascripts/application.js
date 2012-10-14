// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require mootools
//= require mootools_ujs

//= require web_console
//= require rails_console
//= require music_console

window.addEvent('domready', function() {
  var console = new RailsConsole($$('.web_console#rails')[0]).bindKeyEvents();
  //console.open();
  $$('p.tip i').addEvent('click', console.open.bind(console));

  new MusicConsole($$('.web_console#music')[0], {
    activate: function (e) {
      return (e.key == 'm');
    }
  }).bindKeyEvents();
});