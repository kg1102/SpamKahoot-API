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

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP
        return res.redirect(`https://${req.hostname}${req.url}`); //Redireciona pra HTTPS
    //Se a requisição já é HTTPS
    return next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
});

app.get('/', (req, res)=>{
    return res.status(200).send(JSON.stringify({status:"success", code: 200, message: "Hello World"}, null, 4));
});

app.post('/send', (req, res) => {
    try {
        const { id, nick, amount } = req.body;
        
        if(!isNaN(id,amount)){
            if(id == '' || nick == '' || amount == ''){
                return res.status(400).send(JSON.stringify({status:"error", reason: "Some field is empty!"}, null, 4));
            }else{
                api.spam(id, `${nick}`, amount);
                return res.status(201).send(JSON.stringify({status:"success", bots_sended: amount, nickname: nick, amount: amount}, null, 4));
            }
        } else {
            return res.status(400).send(JSON.stringify({status:"error", reason: "The amount number or id are not numbers!"}, null, 4));
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'undefined' });
    };
});

app.use((req, res) => {
    return res.status(404).end(res.send(JSON.stringify({status:"error", reason: "Page Not Found"}, null, 4)));
});

app.listen(port, ()=>{
    console.log(`[1] Servidor iniciado com sucesso na porta @ `, port);
});
