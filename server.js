import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));




app.get('/ok', (req, res) => {
    res.status(200).json('ok');
});

app.get('/getok', (req, res) => {
    
    fetch('https://inf-portfolio-service.azurewebsites.net/api/portfolio/getok')
        .then(res => res.text())
        .then(text => console.log(text))
        .then(() => {
            res.status(200).json('got ok');
        });

});

app.get('/getstocks', (req, res) => {
    
    fetch('https://inf-portfolio-service.azurewebsites.net/api/portfolio/getstocks')
        .then(res => res.json())
        .then(obj => console.log(obj))
        .then(() => {
            res.status(200).json('got stocks');
        });

});
















// serve
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
});