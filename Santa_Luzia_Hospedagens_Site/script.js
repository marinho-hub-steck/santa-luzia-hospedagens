const botaoMenu = document.getElementById("menuMobile");
const linksMenu = document.getElementById("linksMenu");
const progresso = document.querySelector(".barra-progresso");

if (botaoMenu && linksMenu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = linksMenu.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    botaoMenu.textContent = aberto ? "×" : "☰";
  });

  linksMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      linksMenu.classList.remove("aberto");
      botaoMenu.textContent = "☰";
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });
}

// Barra de progresso de leitura
function atualizarProgresso() {
  if (!progresso) return;
  const altura = document.documentElement.scrollHeight - window.innerHeight;
  const percentual = altura > 0 ? (window.scrollY / altura) * 100 : 0;
  progresso.style.width = `${percentual}%`;
}
window.addEventListener("scroll", atualizarProgresso, { passive: true });
atualizarProgresso();

// Revela os blocos suavemente quando entram na tela.
const blocos = document.querySelectorAll(
  ".titulo-secao, .sobre-card, .funcionalidade, .tela-card, .passos article, .chamada, .qr-card"
);
blocos.forEach((bloco) => bloco.classList.add("revelar"));

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver((entradas, observer) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  blocos.forEach((bloco) => observador.observe(bloco));
} else {
  blocos.forEach((bloco) => bloco.classList.add("visivel"));
}

// Fecha o menu ao pressionar Escape.
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && linksMenu?.classList.contains("aberto")) {
    linksMenu.classList.remove("aberto");
    botaoMenu.textContent = "☰";
    botaoMenu.setAttribute("aria-expanded", "false");
  }
});


// Quiz de preferência: gera uma orientação informativa sem inventar disponibilidade.
const botoesPreferencia = document.querySelectorAll(".opcao");
let preferenciaSelecionada = "conforto";
botoesPreferencia.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoesPreferencia.forEach((item) => {
      item.classList.remove("selecionada");
      item.setAttribute("aria-pressed", "false");
    });
    botao.classList.add("selecionada");
    botao.setAttribute("aria-pressed", "true");
    preferenciaSelecionada = botao.dataset.value;
  });
});

const btnRecomendacao = document.getElementById("btnRecomendacao");
if (btnRecomendacao) {
  btnRecomendacao.addEventListener("click", () => {
    const companhia = document.getElementById("companhia").value;
    const resultado = document.getElementById("resultadoQuiz");
    const titulo = document.getElementById("tituloResultado");
    const texto = document.getElementById("textoResultado");
    // A cada clique, sorteia uma hospedagem diferente entre as opções cadastradas no projeto.
    // O quiz não afirma preços, conforto ou disponibilidade: orienta o usuário a conferir os detalhes.
    const hospedagens = [
      "Pousada Asa Branca",
      "Pousada Alvorada",
      "Pousada Yayú",
      "Pousada Yayú Rural",
      "Hotel Santa Luzia",
      "Pousada Recanto da Serra",
      "Pousada Santa Francisca",
      "Pop Mix",
      "Pousada Sabugy",
      "Pousada Dedé Jaime",
      "Pousada Bahia"
    ];
    const orientacoes = {
      conforto: "Você selecionou conforto. Confira as fotos e entre em contato para saber quais comodidades estão disponíveis.",
      localizacao: "Você selecionou praticidade. Confira o endereço e veja se a localização atende ao que você precisa.",
      economia: "Você selecionou economia. Compare os preços com outras opções e confirme os valores diretamente com o estabelecimento."
    };
    // Evita repetir a mesma pousada em resultados consecutivos.
    let disponiveis = hospedagens.filter((nome) => nome !== window.ultimaHospedagemSugerida);
    if (disponiveis.length === 0) disponiveis = hospedagens;
    const sugestao = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    window.ultimaHospedagemSugerida = sugestao;
    const grupo = {
      sozinho: "Como você vai viajar sozinho(a), uma lista organizada pode ajudar a comparar as opções com calma.",
      casal: "Para uma viagem a dois, vale conferir as imagens e os detalhes de cada lugar antes de entrar em contato.",
      familia: "Para viajar com a família, confira diretamente com o estabelecimento a capacidade, as comodidades e as condições de hospedagem.",
      amigos: "Se for com amigos, confirme com a hospedagem a quantidade de pessoas e as condições para o grupo."
    };
    titulo.textContent = sugestao;
    texto.textContent = orientacoes[preferenciaSelecionada] + " " + grupo[companhia] + " A sugestão é apenas um ponto de partida: confirme as informações diretamente com a hospedagem.";
    const linkResultado = resultado.querySelector(".link-resultado");
    if (linkResultado) {
      linkResultado.textContent = "Conhecer as telas do aplicativo ↓";
      linkResultado.setAttribute("href", "#telas");
    }
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}



// Tema claro/escuro para personalizar a experiência.
const alternarTema = document.getElementById("alternarTema");
if (alternarTema) {
  try {
    const temaSalvo = localStorage.getItem("slh-tema");
    if (temaSalvo === "escuro") {
      document.body.classList.add("tema-escuro");
      alternarTema.setAttribute("aria-pressed", "true");
      alternarTema.innerHTML = '☀ <span class="texto-tema">Modo claro</span>';
    }
  } catch (erro) { /* O site continua funcionando sem armazenamento local. */ }
  alternarTema.addEventListener("click", () => {
    const escuro = document.body.classList.toggle("tema-escuro");
    alternarTema.setAttribute("aria-pressed", String(escuro));
    try { localStorage.setItem("slh-tema", escuro ? "escuro" : "claro"); } catch (erro) { /* Preferência temporária nesta sessão. */ }
    alternarTema.innerHTML = escuro ? '☀ <span class="texto-tema">Modo claro</span>' : '☾ <span class="texto-tema">Modo escuro</span>';
  });
}


const voltarTopo = document.getElementById("voltarTopo");
if (voltarTopo) {
  const atualizarBotaoTopo = () => voltarTopo.classList.toggle("aparecer", window.scrollY > 450);
  window.addEventListener("scroll", atualizarBotaoTopo, {passive:true});
  atualizarBotaoTopo();
  voltarTopo.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
}



// Lista pessoal de hospedagens: guarda escolhas neste navegador, sem enviar dados a terceiros.
const botoesSalvarHospedagem = document.querySelectorAll(".salvar-hospedagem");
const favoritosContador = document.getElementById("favoritosContador");
const favoritosMensagem = document.getElementById("favoritosMensagem");
const limparFavoritos = document.getElementById("limparFavoritos");
let hospedagensSalvas = [];
try { hospedagensSalvas = JSON.parse(localStorage.getItem("slh-hospedagens-salvas") || "[]"); } catch (erro) { hospedagensSalvas = []; }
if (!Array.isArray(hospedagensSalvas)) hospedagensSalvas = [];
function atualizarHospedagensSalvas() {
  botoesSalvarHospedagem.forEach(botao => {
    const salvo = hospedagensSalvas.includes(botao.dataset.hospedagem);
    botao.classList.toggle("salvo", salvo);
    botao.setAttribute("aria-pressed", String(salvo));
    botao.textContent = salvo ? "♥ Salvo" : "♡ Salvar";
  });
  if (favoritosContador) favoritosContador.textContent = `${hospedagensSalvas.length} ${hospedagensSalvas.length === 1 ? "salva" : "salvas"}`;
  if (favoritosMensagem) favoritosMensagem.textContent = hospedagensSalvas.length ? "Sua lista está guardada neste navegador. Confira preços, endereço e disponibilidade diretamente com cada estabelecimento." : "Sua lista está vazia. Toque em “Salvar” nas opções que deseja pesquisar depois.";
}
botoesSalvarHospedagem.forEach(botao => botao.addEventListener("click", () => {
  const nome = botao.dataset.hospedagem;
  hospedagensSalvas = hospedagensSalvas.includes(nome) ? hospedagensSalvas.filter(item => item !== nome) : [...hospedagensSalvas, nome];
  try { localStorage.setItem("slh-hospedagens-salvas", JSON.stringify(hospedagensSalvas)); } catch (erro) { if (favoritosMensagem) favoritosMensagem.textContent = "O navegador não permitiu salvar permanentemente; sua seleção ficará disponível enquanto esta página estiver aberta."; }
  atualizarHospedagensSalvas();
}));
if (limparFavoritos) limparFavoritos.addEventListener("click", () => {
  hospedagensSalvas = [];
  try { localStorage.removeItem("slh-hospedagens-salvas"); } catch (erro) {}
  atualizarHospedagensSalvas();
});
atualizarHospedagensSalvas();
