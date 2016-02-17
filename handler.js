module.exports = function (handlers) {
  return function (event, context) {
    var cb = function (err, result) {
      if (err)  context.fail(err);
      else      context.succeed(result);
    };

    if (event.message) {
      if (event.message.text && handlers.onText) {
        var result;
        for (var h in handlers.onText) {
          result = handlers.onText[h].matches.exec(event.message.text);
          if (result) {
            handlers.onText[h].handler(event.message, cb, result);
            return;
          }
        }
      }

      // Fallback to the generic message handler
      handlers.onMessage(event.message, cb);
    } else if (event.inline_query && typeof(handlers.onInlineQuery) === 'function') {
      handlers.onInlineQuery(event.inline_query, cb);
    } else if (event.chosen_inline_result && typeof(handlers.onChosenInlineResult) === 'function') {
      handlers.onChosenInlineResult(event.chosen_inline_result, cb);
    } else {
      cb();
    }
  };
};
