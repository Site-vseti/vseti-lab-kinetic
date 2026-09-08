let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
} 
/* Pagina - Quarto */

let modal = document.getElementById("modal-produto");
let modalNome = document.getElementById("modal-nome");
let modalImg = document.getElementById("modal-img");
let modalDesc = document.getElementById("modal-desc");
let tabela = document.getElementById("modal-tabela");
let closeBtn = document.querySelector(".modal .close");

let btnWhatsapp = document.getElementById("btn-whatsapp");

document.querySelectorAll(".btn-ver").forEach(btn => {
    btn.addEventListener("click", () => {
        let nome = btn.getAttribute("data-nome");
        let img = btn.getAttribute("data-img");
        let desc = btn.getAttribute("data-desc");
        let tecnicos = btn.getAttribute("data-tecnicos");

        modalNome.textContent = nome;
        modalImg.src = img;
        modalDesc.textContent = desc;
      
 let linkWhatsApp = `https://wa.me/5521996046875?text=Olá! Tenho interesse neste produto: ${encodeURIComponent(nome)}\n ${encodeURIComponent(desc)}`;
      btnWhatsapp.href = linkWhatsApp; 
      
        tabela.innerHTML = "";

        if (tecnicos) {
            let dados = JSON.parse(tecnicos);
            for (let chave in dados) {
                let tr = document.createElement("tr");

                let td1 = document.createElement("td");
                td1.textContent = chave;

                let td2 = document.createElement("td");
                td2.textContent = dados[chave];

                tr.appendChild(td1);
                tr.appendChild(td2);
                tabela.appendChild(tr);
            }
        }

        modal.style.display = "block";
    });
});

closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", function () {
  const produtosPorPagina = 8;
  const containerProdutos = document.querySelector(".produtos .box-container");
  const listaProdutos = containerProdutos.querySelectorAll(".box");
  const paginacao = document.createElement("div");

  paginacao.classList.add("paginacao");
  containerProdutos.after(paginacao); 


  listaProdutos.forEach((produto, i) => {
    produto.setAttribute("data-index", i);
  });

  const totalPaginas = Math.ceil(listaProdutos.length / produtosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const botao = document.createElement("button");
    botao.classList.add("btn-pagina");
    botao.setAttribute("data-pagina", i);
    botao.textContent = i;
    paginacao.appendChild(botao);
  }

  const botoes = paginacao.querySelectorAll(".btn-pagina");

  function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;

    listaProdutos.forEach((box, index) => {
      box.style.display = index >= inicio && index < fim ? "block" : "none";
    });

    // Destaca botão ativo
    botoes.forEach(btn => btn.classList.remove("ativo"));
    const ativo = paginacao.querySelector(`.btn-pagina[data-pagina="${pagina}"]`);
    if (ativo) ativo.classList.add("ativo");
  }

  // Eventos nos botões
  botoes.forEach(btn => {
    btn.addEventListener("click", () => {
      const pagina = parseInt(btn.getAttribute("data-pagina"));
      mostrarPagina(pagina);
    });
  });

  // Mostra a primeira página ao carregar
  mostrarPagina(1);
});

let mensagemWhatsApp = "Olá! Visitei o seu site e fiquei com interesse em um dos seus produtos.";
let numeroWhatsApp = "5521996046875";

// Monta o link pronto
let linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;

// Seleciona todos os ícones de carrinho
let botoesCarrinho = document.querySelectorAll('.fa-shopping-cart');
// Aplica o link em todos
botoesCarrinho.forEach(botao => {
  botao.href = linkWhatsApp;
  botao.target = "_blank";
});
 


let botoessubmit = document.querySelectorAll('.enviar_mensagem');

botoessubmit.forEach(botao => {
    botao.addEventListener('click', function(e) {
        // Opcional: valide os campos do formulário primeiro
        
        let mensagemWhatsApp = "Olá! Visitei o seu site e fiquei com interesse em um dos seus produtos.";
        let numeroWhatsApp = "5521996046875";
        let linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
        
        // Abre WhatsApp mas não previne o envio do formulário
        window.open(linkWhatsApp, '_blank');
        
        // Se quiser prevenir o envio do formulário, descomente:
        // e.preventDefault();
    });
});

// Seleciona o ícone do olhinho e adiciona o mesmo comportamento
document.querySelectorAll(".fa-eye").forEach(icone => {
    icone.addEventListener("click", (e) => {
        e.preventDefault(); // Evita o comportamento padrão do link

        // Sobe na estrutura até encontrar o .box
        let box = icone.closest(".box");
        let btn = box.querySelector(".btn-ver");

        // Usa os mesmos dados do botão .btn-ver
        let nome = btn.getAttribute("data-nome");
        let img = btn.getAttribute("data-img");
        let desc = btn.getAttribute("data-desc");
        let tecnicos = btn.getAttribute("data-tecnicos");

        modalNome.textContent = nome;
        modalImg.src = img;
        modalDesc.textContent = desc;

        let linkWhatsApp = `https://wa.me/5521996046875?text=Olá! Tenho interesse neste produto: ${encodeURIComponent(nome)}\n ${encodeURIComponent(desc)}`;
        btnWhatsapp.href = linkWhatsApp;

        tabela.innerHTML = "";

        if (tecnicos) {
            let dados = JSON.parse(tecnicos);
            for (let chave in dados) {
                let tr = document.createElement("tr");

                let td1 = document.createElement("td");
                td1.textContent = chave;

                let td2 = document.createElement("td");
                td2.textContent = dados[chave];

                tr.appendChild(td1);
                tr.appendChild(td2);
                tabela.appendChild(tr);
            }
        }

        modal.style.display = "block";
    });
});
// Sala

