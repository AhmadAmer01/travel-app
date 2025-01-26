let projectData = {};
const port = 3000;
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static('website'));


app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});


app.get('/all', (req, res) => {
  res.status(200).send(projectData);
});


app.post('/add', (req, res) => {
  const { date, temp, feel } = req.body;


  projectData = { ...projectData, date, temp, feel };

  res.status(201).send({
    status: 'success',
    message: 'Data added successfully',
    data: projectData,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 'error',
    message: 'Something went wrong!',
  });
});
