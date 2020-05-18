import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser());

let collab = {};

const reset = () => {
  collab = {};
};

// cleanup afte 2 sec inactivity
let timer = setInterval(reset, 2000);
let theValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

app.get('/collab', (req, res) => {
  res.send({ ...collab, value: theValue });
});

app.delete('/collab', (req, res) => {
  collab = {};
  res.sendStatus(200);
});

app.post('/collab', (req, res) => {
  const { id, value } = req.body;
  if (!collab.id || collab.id === id) {
    collab = { id };
    theValue = value;
    // reset timer
    clearInterval(timer);
    timer = setInterval(reset, 4000);
  }
  res.sendStatus(200);
});

app.listen(3001, () => console.log(`Started`));
