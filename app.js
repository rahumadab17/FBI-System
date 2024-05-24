const express = require('express')
const app = express()
const agentes = require('./data/agentes.js')
const jwt = require('jsonwebtoken');

const port = 3000

app.listen(port, () => console.log(`Servidor ON escuchando en el puerto ${port}`))

const secretKey = "nuncalodescubriran123"

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.get("/SignIn", (req, res) => {
    const { email, password } = req.query;

    const agente = agentes.find((u) => u.email === email && u.password === password);

    if (agente) {
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 120,
                data: agente,
            },
            secretKey,
        );
        res.send(`
        <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
        <body>
                <button type="button" class="btn btn-secondary mb-3"><a href="MaximaSeguridad?token=${token}"><p class="text-white">Ir al hiperenlace de máxima seguridad</p></a></button>

                Bienvenido, ${email}.
                
                <h1>&#128373;</h1>

            <script>
                sessionStorage.setItem('token', JSON.stringify("${token}"))
            </script>
            <style>
                * {
                margin: 0;
                padding: 0;
                }
                body {
                background: black;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: 60vh;
                }
            </style>
        </body>
        `);

    } else {
        res.send("Usuario o contraseña incorrecta.")
    };
});

app.get("/MaximaSeguridad", (req, res) => {
    const { token } = req.query;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err){
            res.status(401).send({
                error: "401 Unathorized - Usuario no autorizado.",
                message: err.message,
            })
        } else {
            res.send(`
        <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
        <body>
                <h4>Bienvenido agente especial <b><u>${decoded.data.email}</u></b></h4>
                
                <h1>&#128373;</h1>
            <style>
                * {
                margin: 0;
                padding: 0;
                }
                body {
                background: black;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: 60vh;
                }
            </style>
        </body>
        `);
        }
    })
})