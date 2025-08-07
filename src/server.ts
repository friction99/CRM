const express = require('express');

const app = express();
const port = process.env.PORT ||  3000;

app.use(express.json());

const userRoutes = require('./routes/index.ts');

app.use('/api/users',userRoutes);

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})

