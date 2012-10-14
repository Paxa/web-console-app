var WebConsole = new Class({
  Implements: Options,
  options: {
    historyCookie: 'web_console_history',
    activate: function (e) {
      if (e.code == 192 && ((e.event.keyIdentifier != "U+0060" && e.event.keyIdentifier != "U+007E") || this.state == 'closed')) return true;
      if (e.key == 'esc') return true;
      return false;
    }
  },

  state: 'closed',
  history: [],
  historyPosition: null,

  initialize: function (element, options) {
    this.setOptions(options);
    this.element = document.id(element);
    this.log = this.element.getElement('.log');
    this.input = this.element.getElement('textarea');
    this.autoCompleteContainer = this.element.getElement('.command_line .autocomplete');

    this.log.addEvent('click', this.input.focus.bind(this.input));
    this.element.getElement('a.close').addEvent('click', this.close.bind(this));

    this.input.addEvent('keydown', function(e) {
      if (e.key != 'tab') this.clearAutoComplete();
      if (e.key == 'enter') {
        if (Browser.Platform.mac && !e.meta || !Browser.Platform.mac && e.control) {
          this.sendCommand();
          e.stop();
        }
      } else if (e.key == 'tab') {
        this.autoComplete(this.input.value);
        e.stop();
      } else if (e.key == 'up') {
        this.historyBack();
      } else if (e.key == 'down') {
        this.historyForward();
      }
      //console.log(e);
    }.bind(this));

    try {
      this.history = (Cookie.read(this.options.historyCookie) || "").split("\n");
    } catch (e) { /* nothing */ }

    //console.log(this.history);
  },

  // this 2 methods is for extending
  execute: function (value) {
    
  },

  autoComplete: function (value) {
    
  },

  showAutoComplete: function (values) {
    var html = '';
    values.each(function(i) { html += '<li>' + i + '</li>'; });
    this.autoCompleteContainer.set('html', '<ul>' + html + '</ul>');
    this.autoCompleteContainer.getElements('li').addEvent('click', this.applyFromAutoComplete.bind(this));
    this.autoCompleteContainer.addClass('shown');
    this.scrollDown();
    this.autoCompleteOpen = true;
  },

  clearAutoComplete: function () {
    if (!this.autoCompleteOpen) return;
    this.autoCompleteContainer.empty();
    this.autoCompleteContainer.removeClass('shown');
    this.autoCompleteOpen = false;
  },

  applyFromAutoComplete: function (e) {
    var value = e.target.get('text');
    this.input.value = value;
    this.input.focus();
    this.clearAutoComplete();
  },

  sendCommand: function () {
    this.historyPosition = null;
    this.typedValue = null;

    var value = this.input.value;
    this.historyPush(value);
    this.appendLine(value, "command");
    try {
      this.execute(value);
    } catch (e) { console.error(e); }
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
    Cookie.write(this.options.historyCookie, this.history.join("\n"));
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
      if (this.options.activate.call(this, e)) {
        this.toggle();
        e.stop();
      }
    }.bind(this));
    return this;
  },

  toggle: function () {
    // make it looks nice with rumble2012 button
    if (document.body.getElement('#rumble2012')) {
      this.element.addClass('with_rumble');
    } else {
      this.element.removeClass('with_rumble');
    }

    this[this.state == 'closed' ? 'open' : 'close']();
  },

  close: function (e) {
    if (e) e.stop();
    this.input.blur();
    this.element.addClass('hidden');
    this.state = 'closed';
  },

  open: function (e) {
    if (e) e.stop();
    this.input.focus();
    this.element.removeClass('hidden');
    this.state = 'open';
  }
});