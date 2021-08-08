const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const route = require('./routes');
const cors = require('cors');


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());


app.use(cors());
app.use('/user', route.userRouter);
app.use('/post', route.postsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, _req, res, _next) => {
  const { message, status } = error;

  res.status(500).send({ message });
});

app.listen(PORT, () => console.log(`listening at ${PORT}`));

module.exports = app;
