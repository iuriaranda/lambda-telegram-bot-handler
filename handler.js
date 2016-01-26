module.exports = function (handlers) {
  return function (event, context) {
    var cb = function (err, result) {
      if (err)  context.fail(err);
      else      context.succeed(result);
    };

    if (event.message && typeof(handlers.onMessage) === 'function') {
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
