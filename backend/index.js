const express = require('express');
const route = require('./routes');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/user', route.usersRouter);


app.use((error, _req, res, _next) => {
  const { message, status } = error;

  res.status(500).send({ message });
});



app.listen(PORT, () => console.log(`listening at ${PORT}`));

module.exports = app;
