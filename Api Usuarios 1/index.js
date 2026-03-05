import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "fha5HpDXSXSjKU0QCbdXiz1a") {
        return res.status(401).json({ message: "Acceso denegado" });
    }
    next();
};

const tokenMiddleware = (req, res, next) => {
    const reqHeader = req.headers.token;

    if (!reqHeader) {
        return res.status(401).json({ message: "Acceso denegado, token no encontrado" });
    }
    console.log("Token: ", reqHeader);
    next();
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authMiddleware);
const PORT = process.env.PORT || 3000;

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}



app.get("/", (req, res) => {
    res.send("Buenas");
});

app.get("/usuarios", (req, res) => {
    const data = readData();
    res.json(data.usuarios);
});

app.post("/crearUsuario", tokenMiddleware, (req, res) => {
    const data = readData();
    const body = req.body;
    const nuevoUsuario = {
        id: data.usuarios.length + 1,
        ...body,
    };
    data.usuarios.push(nuevoUsuario);
    writeData(data);
    res.json(nuevoUsuario);
});

app.put("/usuarios/:id", tokenMiddleware, (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const usuariosIndex = data.usuarios.findIndex((usuario) => usuario.id === id);
    data.usuarios[usuariosIndex] = {
        ...data.usuarios[usuariosIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Usuario se actualizó" });
});

app.delete("/usuarios/:id", tokenMiddleware, (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const usuariosIndex = data.usuarios.findIndex((usuario) => usuario.id === id);
    data.usuarios.splice(usuariosIndex, 1);
    writeData(data);
    res.json({ message: "Usuario se borró" });
});



app.listen(PORT, () => {
    console.log("Server is running baby!");
});