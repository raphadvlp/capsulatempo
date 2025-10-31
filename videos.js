// -----------------------------------------------------
//  🔥 IMPORTS DO FIREBASE
// -----------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getStorage,
  ref,
  list,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// -----------------------------------------------------
//  ⚙️ CONFIGURAÇÃO DO FIREBASE
// -----------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCvBpaefejjMNPTN_A-yV5s6F0_okQFJZk",
  authDomain: "capsuladotempo-9d755.firebaseapp.com",
  projectId: "capsuladotempo-9d755",
  storageBucket: "capsuladotempo-9d755.appspot.com",
  messagingSenderId: "869092303974",
  appId: "1:869092303974:web:7d5b69c10147a178ddb9a7",
};

// -----------------------------------------------------
//  🚀 INICIALIZAÇÃO DO FIREBASE
// -----------------------------------------------------
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const videosRef = ref(storage, "videos");

console.log("Conectado ao bucket:", storage.app.options.storageBucket);

// -----------------------------------------------------
//  🔒 LÓGICA DA SENHA
// -----------------------------------------------------
const passwordScreen = document.getElementById("passwordScreen");
const passwordInput = document.getElementById("passwordInput");
const btnEntrar = document.getElementById("btnEntrar");
const msgErro = document.getElementById("msgErro");
const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");

// 🧩 Senha definida no código
const SENHA_CORRETA = "gabriellaryssa2025"; // altere aqui

btnEntrar.addEventListener("click", () => {
  if (passwordInput.value === SENHA_CORRETA) {
    msgErro.style.display = "none";
    passwordScreen.style.display = "none";
    gallery.style.display = "grid";
    loading.style.display = "block";
    carregarVideos();
  } else {
    msgErro.style.display = "block";
    passwordInput.value = "";
  }
});

// -----------------------------------------------------
//  🎬 FUNÇÃO PARA CARREGAR VÍDEOS
// -----------------------------------------------------
async function carregarVideos() {
  try {
    const result = await list(videosRef, { maxResults: 50 }); // até 50 vídeos
    loading.style.display = "none";

    if (!result.items.length) {
      gallery.innerHTML =
        "<p style='color:#ffb3c1;font-size:18px;'>Nenhum vídeo enviado ainda 💔</p>";
      return;
    }

    // Exibe vídeos mais recentes primeiro
    for (const itemRef of result.items.reverse()) {
      try {
        const url = await getDownloadURL(itemRef);
        const card = document.createElement("div");
        card.classList.add("card");

        const videoEl = document.createElement("video");
        videoEl.src = url;
        videoEl.controls = true;

        const info = document.createElement("div");
        info.classList.add("info");
        const fileName = document.createElement("p");
        fileName.textContent = itemRef.name.replace(".mp4", "");
        info.appendChild(fileName);

        card.appendChild(videoEl);
        card.appendChild(info);
        gallery.appendChild(card);
      } catch (e) {
        console.error("Erro ao carregar vídeo:", itemRef.name, e);
      }
    }
  } catch (error) {
    console.error("Erro ao carregar vídeos:", error);
    loading.textContent = "Erro ao carregar vídeos 😢";
  }
}

// -----------------------------------------------------
//  ⬅️ BOTÃO DE VOLTAR
// -----------------------------------------------------
document.getElementById("btnVoltar").addEventListener("click", () => {
  window.location.href = "index.html";
});
