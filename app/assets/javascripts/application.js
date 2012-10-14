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

//= require audio

audiojs.events.ready(function() {
  var as = audiojs.createAll({
    preload: false
  });
  AudioPlayer = as[0];
});

window.addEvent('domready', function() {
  var railsConsole = new RailsConsole($$('.web_console#rails')[0]);
  //console.open();
  $$('p.tip i').addEvent('click', railsConsole.toggle.bind(railsConsole));

  var musicConsole = new MusicConsole($$('.web_console#music')[0], {
    historyCookie: 'music_console_history',
    activate: function (e) {
      if (railsConsole.state == 'closed') {
        if (e.key == 'm' && this.state == 'closed') {
          return true;
        }
      }
      if (this.state == 'open' && e.key == 'esc') {
        e.stop();
        return true;
      }
    }
  }).bindKeyEvents();

  $$('.music_console').addEvent('click', musicConsole.toggle.bind(musicConsole));

  railsConsole.bindKeyEvents();
});