const express        = require('express');
const cors           = require('cors');
const app            = express();
const KahootSpam     = require('kahoot-spam');
const port           = process.env.PORT || 443;
var api              = KahootSpam;

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/', (req,res)=>{
    res.send(JSON.stringify({status:"success", code: 200, message: "Hello World"}, null, 4));
});

app.post('/send', (req,res) => {
    var { id, nick, amount } = req.body;
    if(!isNaN(id,amount)){
        if(id == '' || nick == '' || amount == ''){
            res.status(400);
            res.send(JSON.stringify({status:"error", reason: "Some field is empty!"}, null, 4));
        }else{
            api.spam(id, `${nick}`, amount);
            res.status(201);
            res.send(JSON.stringify({status:"success", bots_sended: amount, nickname: nick, amount: amount}, null, 4));
        }
    }else{
        res.status(400);
        res.send(JSON.stringify({status:"error", reason: "The amount number or id are not numbers!"}, null, 4));
    }
});

app.listen(port, ()=>{
    console.log(`[1] Servidor iniciado com sucesso na porta @ `, port);
});