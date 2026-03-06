import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import bodyParser from "body-parser";

// interfaces for our data structures
interface Usuario {
  id: number;
  [key: string]: any; // allow additional properties
}

interface DB {
  usuarios: Usuario[];
}

// custom typed Express middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "fha5HpDXSXSjKU0QCbdXiz1a") {
        res.status(401).json({ message: "Acceso denegado" });
        return;
    }
    next();
};

const tokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const reqHeader = req.headers.token as string | undefined;

    if (!reqHeader) {
        res.status(401).json({ message: "Acceso denegado, token no encontrado" });
        return;
    }
    console.log("Token: ", reqHeader);
    next();
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authMiddleware);
const PORT = process.env.PORT || 3000;

const readData = (): DB | undefined => {
    try {
        const raw = fs.readFileSync("./db.json", "utf-8");
        return JSON.parse(raw) as DB;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

const writeData = (data: DB): void => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    } catch (err) {
        console.log(err);
    }
};



app.get("/", (req: Request, res: Response) => {
    res.send("Buenas");
});

app.get("/usuarios", (req: Request, res: Response) => {
    const data = readData();
    res.json(data?.usuarios ?? []);
});

app.post("/crearUsuario", tokenMiddleware, (req: Request, res: Response) => {
    const data = readData();
    if (!data) {
        res.status(500).json({ message: "Error leyendo la base de datos" });
        return;
    }
    const body = req.body as Partial<Usuario>;
    const nuevoUsuario: Usuario = {
        id: data.usuarios.length + 1,
        ...body,
    };
    data.usuarios.push(nuevoUsuario);
    writeData(data);
    res.json(nuevoUsuario);
});

app.put("/usuarios/:id", tokenMiddleware, (req: Request, res: Response) => {
    const data = readData();
    if (!data) {
        res.status(500).json({ message: "Error leyendo la base de datos" });
        return;
    }
    const body = req.body as Partial<Usuario>;
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

app.delete("/usuarios/:id", tokenMiddleware, (req: Request, res: Response) => {
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