var MusicConsole = new Class({
  Extends: WebConsole,

  commands: ['play', 'pause', 'current', 'volume', 'load'],

  execute: function (value) {
    var parts = value.split(" ");

    if (parts[0] == 'play') {
      this.appendLine("Playing " + AudioPlayer.mp3, 'output');
      AudioPlayer.play();
    } else if (parts[0] == 'pause') {
      this.appendLine("Paused", 'output');
      AudioPlayer.pause();
    } else if (parts[0] == 'volume') {
      this.volume(parts[1])
    } else if (parts[0] == 'load') {
      this.load(parts[1])
    } else if (parts[0] == 'current') {
      if (AudioPlayer.playing) {
        this.appendLine("Now is playing " + AudioPlayer.mp3, 'output');
      } else {
        this.appendLine("Now is silent", 'output');
      }
    } else {
      this.appendLine("Unknownn command '" + parts[0] + "'", 'error');
    }
  },

  autoComplete: function (value) {
    this.showAutoComplete(this.commands);
  },

  load: function (value) {
    if (value) {
      AudioPlayer.load(value);
      AudioPlayer.element.set('src', AudioPlayer.mp3);
      AudioPlayer.play();
      this.appendLine("Now is playing " + AudioPlayer.mp3, 'output');
    } else {
      this.appendLine("Example usage: load https://dl.dropbox.com/u/586048/bell-ringing-01.mp3", 'error');
    }
  },

  volume: function(value) {
    if (value) {
      value = parseFloat(value, 10);
      if (value > 1) value = (value % 100) / 100; // persents support
      AudioPlayer.setVolume(value);
      this.appendLine("Set volume to " + value * 100 + '%', 'output');
    } else {
      this.appendLine("Volume is " + AudioPlayer.element.volume * 100 + '%', 'output');
    }
  }
});