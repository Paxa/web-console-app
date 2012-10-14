var MusicConsole = new Class({
  Extends: WebConsole,

  execute: function (value) {
    var loading = this.appendLine('loading ...', 'loading');

    new Request.JSON({
      url: '/console_execute',
      data: {value: value },
      onComplete: function (data) {
        if (data.error) this.appendLine(data.error, 'error');
        if (data.output) this.appendLine(data.output, 'output');

        this.appendLine(data.result, "result");
        loading.remove();
        this.scrollDown();
      }.bind(this)
    }).GET();
  },

  autoComplete: function (value) {
    
  }
});