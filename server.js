import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const dataServiceUrl = 'https://inf-portfolio-service.azurewebsites.net/api/portfolio/';
const dataServiceUrlLocal = 'https://localhost:44394/api/portfolio/';


app.get('/ok', (req, res) => {
    res.status(200).json('ok');
});

app.get('/getok', (req, res) => {
    
    fetch(dataServiceUrl.concat('getok'))
        .then(res => res.text())
        .then(text => console.log(text))
        .then(() => {
            res.status(200).json('got ok');
        })
        .catch(() => {res.status(500).json('data service server returned an error')});
});

app.get('/GetStocks', (req, res) => {
    
    fetch(dataServiceUrl.concat('GetStocks'))
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch(() => {res.status(500).json('data service server returned an error')});
});

// portfolios
app.get('/GetPortfolios', (req, res) => {
    
    fetch(dataServiceUrl.concat('GetPortfolios'))
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch(() => {res.status(500).json('data service server returned an error')});
});

app.get('/GetPortfolioById/:id', (req, res) => {
    
    fetch(dataServiceUrl.concat('GetPortfolioById/'.concat(req.params.id)))
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch(() => {res.status(500).json('data service server returned an error')});
});

app.post('/CreatePortfolio', (req, res) => {
    
    const obj = {
        name: req.body.name,
        code: req.body.code
    };

    fetch(dataServiceUrl.concat('CreatePortfolio'), {
            method: 'POST',
            rejectUnhauthorized : false,
            body: JSON.stringify(JSON.stringify(obj)),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch((err) => {res.status(500).json(err)});
});

app.put('/UpdatePortfolio', (req, res) => {
    
    const obj = {
        id: req.body.id,
        guid: req.body.guid,
        name: req.body.name,
        code: req.body.code
    };

    fetch(dataServiceUrl.concat('UpdatePortfolio'), {
            method: 'PUT',
            rejectUnhauthorized : false,
            body: JSON.stringify(JSON.stringify(obj)),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch((err) => {res.status(500).json(err)});
});



// stocks
app.post('/CreateStock', (req, res) => {
    
    fetch(dataServiceUrl.concat('GetPortfolioById/'.concat(req.body.portfolioid)))
        .then(res => res.json())
        .then(obj => {

            const portfolioStocks = obj.stocks;

            var stock = portfolioStocks.find(s => s.symbol === req.body.symbol);

            if(stock) {
                stock.price = req.body.price;
                stock.quantity++;
                stock.bought++;
                stock.current = req.body.price;
                stock.yield = calculateYield(req.body.price);

                fetch(dataServiceUrl.concat('UpdateStock'), {
                    method: 'PUT',
                    rejectUnhauthorized : false,
                    body: JSON.stringify(JSON.stringify(stock)),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => res.json())
                .then(obj => {
                    res.status(200).json(obj);
                })
                .catch((err) => {res.status(500).json(err)});


            } else {

                const newStock = {
                    symbol: req.body.symbol,
                    name: req.body.name,
                    price: req.body.price,
                    quantity: 1,
                    bought: 1,
                    current: req.body.price,
                    yield: 0,
                    portfolioid: obj.guid
                }

                fetch(dataServiceUrl.concat('CreateStock'), {
                    method: 'POST',
                    rejectUnhauthorized : false,
                    body: JSON.stringify(JSON.stringify(newStock)),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => res.json())
                .then(obj => {
                    res.status(200).json(obj);
                })
                .catch((err) => {res.status(500).json(err)});
            }
        })
        .catch(() => {res.status(500).json('data service server returned an error')});
});

app.put('/UpdateStock', (req, res) => {
    
    const obj = {
        id: req.body.id,
        guid: req.body.guid,
        symbol: req.body.symbol,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        bought: req.body.bought,
        current: req.body.current,
        yield: req.body.yield,
        portfolioid: req.body.portfolioid
    };

    fetch(dataServiceUrl.concat('UpdateStock'), {
            method: 'PUT',
            rejectUnhauthorized : false,
            body: JSON.stringify(JSON.stringify(obj)),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch((err) => {res.status(500).json(err)});
});

app.delete('/DeleteStock', (req, res) => {
    
    const obj = {
        id: req.body.id,
        guid: req.body.guid,
        symbol: req.body.symbol,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        bought: req.body.bought,
        current: req.body.current,
        yield: req.body.yield,
        portfolioid: req.body.portfolioid
    };

    fetch(dataServiceUrl.concat('DeleteStock'), {
            method: 'DELETE',
            rejectUnhauthorized : false,
            body: JSON.stringify(JSON.stringify(obj)),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(obj => {
            res.status(200).json(obj);
        })
        .catch((err) => {res.status(500).json(err)});
});


// privates

const calculateYield = (newPrice) => {

    const value = 10 / newPrice * 100;

    return Math.round( value * 100 + Number.EPSILON ) / 100;
}


// serve
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`);
});