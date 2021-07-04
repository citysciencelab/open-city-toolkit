/* eslint-disable no-undef */
const express = require('express'),
  app = express(),
  expressPort = 3000;

app.listen(expressPort, () => {
  console.log('Listening on ' + expressPort);
});

app.use('/', express.static(`${__dirname}/dist`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});
