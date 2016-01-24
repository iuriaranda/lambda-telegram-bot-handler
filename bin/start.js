#!/usr/bin/env node

var args = require('yargs').argv;

if (!Boolean(args.bot_token)) {
  console.log('Missing bot_token argument');
  process.exit(1);
}

if (!Boolean(args.handler)) {
  console.log('Missing handler argument');
  process.exit(1);
}

var path = require('path');
var TelegramBot = require('node-telegram-bot-api');

var handlerParts = args.handler.split('.');
var handler = require(path.resolve(handlerParts[0], process.cwd()))[handlerParts[1]];

var bot = new TelegramBot(args.bot_token, { polling: true });

// Simulating Lambda context object
var context = {
  fail: function (error) {
    console.error('failed', error);
  },
  succeed: function (result) {
    console.log('processed message successfully', result);
  }
};

bot.on('message', function (msg) {
  handler({
    update_id: '23234234', // Useless
    message: msg
  }, context);
});

bot.on('inline_query', function (msg) {
  handler({
    update_id: '233456345', // Useless
    inline_query: msg
  }, context);
});

bot.on('choosen_inline_result', function (msg) {
  handler({
    update_id: '233456345', // Useless
    choosen_inline_result: msg
  });
});
