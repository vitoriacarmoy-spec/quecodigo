const buscaInput = document.getElementById("busca");
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const resultados = document.getElementById("resultados");

async function buscar() {
  const texto = buscaInput.value;

  const filtros = Array.from(checkboxes)
    .filter(c => c.checked)
    .map(c => c.value);

  const response = await fetch("http://localhost:3000/buscar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ texto, filtros })
  });

  const data = await response.json();

  render(data);
}
function render(lista) {
  resultados.innerHTML = lista.map(item => `
    <div class="card">

      <div class="topo">
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
        <small>${item.linguagem} • ${item.tipo}</small>
      </div>

      <div class="carrossel">
        ${item.conteudo.map(c => {
          if (c.tipo === "texto") {
            return `<div class="slide">${c.valor}</div>`;
          }

          if (c.tipo === "imagem") {
            return `<div class="slide"><img src="${c.valor}"></div>`;
          }

          if (c.tipo === "quiz") {
            return `
              <div class="slide quiz">
                <p>${c.pergunta}</p>
                ${c.opcoes.map((op, i) => `
                  <button onclick="responder(this, ${i}, ${c.correta})">
                    ${op}
                  </button>
                `).join("")}
              </div>
            `;
          }
        }).join("")}
      </div>

    </div>
  `).join("");
}

function responder(btn, index, correta) {
  if (index === correta) {
    btn.style.background = "green";
  } else {
    btn.style.background = "red";
  }
}


console.log("JS carregou");


