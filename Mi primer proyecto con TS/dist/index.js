"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
// custom typed Express middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "fha5HpDXSXSjKU0QCbdXiz1a") {
        res.status(401).json({ message: "Acceso denegado" });
        return;
    }
    next();
};
const tokenMiddleware = (req, res, next) => {
    const reqHeader = req.headers.token;
    if (!reqHeader) {
        res.status(401).json({ message: "Acceso denegado, token no encontrado" });
        return;
    }
    console.log("Token: ", reqHeader);
    next();
};
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(authMiddleware);
const PORT = process.env.PORT || 3000;
const readData = () => {
    try {
        const raw = fs_1.default.readFileSync("./db.json", "utf-8");
        return JSON.parse(raw);
    }
    catch (error) {
        console.log(error);
        return undefined;
    }
};
const writeData = (data) => {
    try {
        fs_1.default.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    }
    catch (err) {
        console.log(err);
    }
};
app.get("/", (req, res) => {
    res.send("Buenas");
});
app.get("/usuarios", (req, res) => {
    const data = readData();
    res.json(data?.usuarios ?? []);
});
app.post("/crearUsuario", tokenMiddleware, (req, res) => {
    const data = readData();
    if (!data) {
        res.status(500).json({ message: "Error leyendo la base de datos" });
        return;
    }
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
    if (!data) {
        res.status(500).json({ message: "Error leyendo la base de datos" });
        return;
    }
    const body = req.body;
    const idStr = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(idStr);
    const usuariosIndex = data.usuarios.findIndex((usuario) => usuario.id === id);
    if (usuariosIndex === -1) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }
    data.usuarios[usuariosIndex] = {
        ...data.usuarios[usuariosIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Usuario se actualizó" });
});
app.delete("/usuarios/:id", tokenMiddleware, (req, res) => {
    const data = readData();
    if (!data) {
        res.status(500).json({ message: "Error leyendo la base de datos" });
        return;
    }
    const idStr = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(idStr);
    const usuariosIndex = data.usuarios.findIndex((usuario) => usuario.id === id);
    if (usuariosIndex === -1) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }
    data.usuarios.splice(usuariosIndex, 1);
    writeData(data);
    res.json({ message: "Usuario se borró" });
});
app.listen(PORT, () => {
    console.log("Server is running baby!");
});
