const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, './public')));

const PORT = process.env.PORT;

const init = () => {

  app.listen(PORT, () => {
    console.log('Listening on port ', PORT);
  });
};

init();
