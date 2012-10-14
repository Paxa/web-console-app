var WebConsole = new Class({
  state: 'closed',
  history: [],
  historyPosition: null,
  historyCookie: 'web_console_history',

  initialize: function (element) {
    this.element = document.id(element);
    this.log = this.element.getElement('.log');
    this.input = this.element.getElement('textarea');
    this.log.addEvent('click', this.input.focus.bind(this.input));
    this.input.addEvent('keydown', function(e) {
      if (e.key == 'enter') {
        if (Browser.Platform.mac && !e.meta || !Browser.Platform.mac && e.control) {
          this.sendCommand();
          e.stop();
        }
      } else if (e.key == 'tab') {
        this.autoComplete();
        e.stop();
      } else if (e.key == 'up') {
        this.historyBack();
      } else if (e.key == 'down') {
        this.historyForward();
      }
      //console.log(e.key);
    }.bind(this));

    try {
      this.history = (Cookie.read(this.historyCookie) || "").split("\n");
    } catch (e) { /* nothing */ }

    //console.log(this.history);
  },

  execute: function (value) {
    
  },

  autoComplete: function () {
    
  },

  sendCommand: function () {
    this.historyPosition = null;
    this.typedValue = null;

    var value = this.input.value;
    this.historyPush(value);
    this.appendLine(value, "command");
    this.execute(value);
    this.input.value = '';
  },

  appendLine: function(line, type) {
    var prefix = "";
    if (type == "result") prefix = "=> ";
    if (type == "command") prefix = ">> ";
    
    return new Element('div', {text: prefix + line, 'class': type}).addClass('line').inject(this.log);
  },

  historyPush: function (value) {
    if (this.history.getLast() == value) return;
    this.history.push(value);
    Cookie.write(this.historyCookie, this.history.join("\n"));
  },

  historyBack: function () {
    if (!this.historyPosition) {
      this.typedValue = this.input.value;
      this.historyPosition = this.history.length;
    }

    this.historyPosition -= 1;
    this.input.value = this.history[this.historyPosition];
  },

  historyForward: function () {
    if (!this.historyPosition && this.historyPosition !== 0) return;
    if (this.historyPosition == this.history.length - 1) {
      this.historyPosition = null;
      this.input.value = this.typedValue;
      this.typedValue = null;
    } else {
      this.historyPosition += 1;
      this.input.value = this.history[this.historyPosition];
    }
  },

  scrollDown: function () {
    this.element.scrollTo(0, parseInt(this.log.getStyle('height'), 10) + 100);
  },

  bindKeyEvents: function () {
    document.body.addEvent('keydown', function(e) {
      if (e.code == 192 && (e.event.keyIdentifier != "U+0060" || this.state == 'closed') || e.key == 'esc') {
        this.toggle();
        e.stop();
      }
    }.bind(this));
    return this;
  },

  toggle: function () {
    this[this.state == 'closed' ? 'open' : 'close']();
  },

  close: function () {
    this.input.blur();
    this.element.addClass('hidden');
    this.state = 'closed';
  },

  open: function () {
    this.input.focus();
    this.element.removeClass('hidden');
    this.state = 'open';
  }
});