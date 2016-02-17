lambda-telegram-bot-handler
===========================

Library to build and run Telegram bots in AWS Lambda platform. It works using the webhook option of the Telegram bot API (https://core.telegram.org/bots/api#getting-updates), and the AWS API Gateway.

## Usage

The library exports a method to easily handle Lambda invocations from Telegram acording to your specified filters.

```js
var telegramHandler = require('lambda-telegram-bot-handler');

exports.handler = telegramHandler({
  onText: [
    {
      matches: /^\/pattern$/,
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

Only one message handler function will be called for each invocation, so `onText` handlers take precedence over `onMessage`, and among `onText` handlers, the first that matches the message text (in declaration order) will be called.
In the example above, if a user sends the message `/pattern`, the first handler in the `onText` array will be called. If the user sends `/pattern2 hello`, the second handler will be called. And finally if the user sends `/no_match`, the `onMessage` handler will be called.

## Reference

### Lambda handler

`telegramHandler(opts)`

Returns a Lambda handler function: `function (event, context) { ... }`

`opts` is an object where you define the message handlers. It has the following properties:

- `onText` (array of objects - optional): array of text message handlers. Handlers defined in this array will only process text messages (see https://core.telegram.org/bots/api#message) that match the defined regex. They are defined as an object with the following attributes:
  - `matches` (regex - mandatory): the regular expression that the message has to match
  - `handler` (function - mandatory): the actual message handler
- `onLocation` (function - optional): location message handler.
- `onMessage` (function - optional): fallback message handler. This function will be called for each message received that hasn't been handled by any other defined handlers.
- `onInlineQuery` (function - optional): handler for inline queries (https://core.telegram.org/bots/api#inlinequery)
- `onChosenInlineResult` (function - optional): handler for choosen inline query results (https://core.telegram.org/bots/api#choseninlineresult)

### Message handler function

These are your defined functions to handle Telegram messages. They receive the following arguments:

- `msg`: the actual telegram message
- `callback`: function to be called when the handler has finished processing the message. **NOTE:** This callback ends the execution of the Lambda function, so make sure to always call it to avoid unnecessary extra running time.
- `matches`: the result of executing regexp.exec on the message text. Will only be present for `onText` handlers as they run against a regexp.

## Setup

To run a bot on AWS Lambda you just need 3 things:

- A Lambda function with your bot's code (I use Grunt and [grunt-aws-lambda](https://github.com/Tim-B/grunt-aws-lambda) to deploy code easily)
- An API gateway POST endpoint attached to your Lambda function
- A Telegram bot with its webhook configured to point to your API gateway endpoint (it'll look something like `https://123456abc.execute-api.eu-west-1.amazonaws.com/prod/`)

## License

MIT
