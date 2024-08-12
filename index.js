const express = require('express');
const cors = require('cors');
const connectDB = require('./db/index');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/login.route'));

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    }
    ).catch((err) => {
        console.log(err);
    }
);
