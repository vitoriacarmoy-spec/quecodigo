const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "biblioteca"
});

db.connect(err => {
  if (err) {
    console.log("Erro MySQL:", err);
  } else {
    console.log("MySQL conectado");
  }
});

app.post("/buscar", (req, res) => {
  const { texto, filtros } = req.body;

  let query = `
    SELECT c.id, c.titulo, c.descricao, c.tipo, l.nome AS linguagem
    FROM conteudo c
    JOIN linguagens l ON c.linguagem_id = l.id
    WHERE (c.titulo LIKE ? OR c.descricao LIKE ?)
  `;

  let params = [`%${texto}%`, `%${texto}%`];

  const tipos = filtros.filter(f => f === "funcao" || f === "codigo");

  if (tipos.length > 0) {
    query += " AND c.tipo IN (?)";
    params.push(tipos);
  }

  const linguagens = filtros.filter(f =>
    !["funcao", "codigo"].includes(f)
  );

  if (linguagens.length > 0) {
    query += " AND l.nome IN (?)";
    params.push(linguagens);
  }

  db.query(query, params, (err, conteudos) => {
    if (err) return res.status(500).json(err);

    const ids = conteudos.map(c => c.id);
    if (ids.length === 0) return res.json([]);

    db.query(
      "SELECT * FROM blocos WHERE conteudo_id IN (?)",
      [ids],
      (err, blocos) => {
        if (err) return res.status(500).json(err);

        db.query("SELECT * FROM quiz", (err, quizzes) => {
          if (err) return res.status(500).json(err);

          db.query("SELECT * FROM opcoes", (err, opcoes) => {
            if (err) return res.status(500).json(err);

            const resultado = conteudos.map(c => {
              const blocosDoConteudo = blocos
                .filter(b => b.conteudo_id === c.id)
                .map(b => {
                  if (b.tipo === "quiz") {
                    const quiz = quizzes.find(q => q.bloco_id === b.id);
                    if (!quiz) return { tipo: "texto", valor: "Erro no quiz" };

                    const op = opcoes.filter(o => o.quiz_id === quiz.id);

                    return {
                      tipo: "quiz",
                      pergunta: quiz.pergunta,
                      correta: quiz.correta,
                      opcoes: op.map(o => o.texto)
                    };
                  }

                  return {
                    tipo: b.tipo,
                    valor: b.valor
                  };
                });

              return {
                ...c,
                conteudo: blocosDoConteudo
              };
            });

            res.json(resultado);
          });
        });
      }
    );
  });
});

app.listen(3000, () => console.log("Servidor rodando"));