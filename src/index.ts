import express from 'express';
import electricity from './electricity';
import { ServerPort } from './env';
import gas from './gas';

const app = express();

app.get('/', (_, res) => res.send('Hello'));
app.get('/electricity', electricity);
app.get('/gas', gas);

app.listen(ServerPort, () => {
  console.log('Server is on! http://localhost:3000/');
})