lambda-telegram-bot-handler
===========================

Library to build and run Telegram bots in AWS Lambda platform.

## Usage

The library exports a method to easily handle Lambda invocations from Telegram acording to your specified filters.

```js
var telegramHandler = require('lambda-telegram-bot-handler');

exports.handler = telegramHandler({
  onText: [
    {
      matches: /^\/pattern/,
      handler: function (msg, cb) {
        // process and answer message here
        cb();
      }
    },
    {
      matches: /^\/pattern2 (.+)$/,
      handler: function (msg, cb, matches) {
        // process and answer message here
        // `matches` will have the result of "message".match(/^\/pattern2 (.+)$/)
        cb();
      }
    }
  ],
  onMessage: function (msg, cb) {
    // process and answer message here
    cb();
  }
});
```

`exports.handler` is the handler you specify in your Lambda function configuration. So it's the method that will be called on each Lambda invocation.

Only one handler function will be called for each message, so `onText` handlers take precedence over `onMessage`, and among `onText` handlers, the first that matches the message text (in declaration order) will be called.

## Reference

### Lambda handler

`telegramHandler(opts)`

Returns a Lambda handler function: `function (event, context) {}`

### Message handler

These are your defined methods to handle Telegram messages

## Setup