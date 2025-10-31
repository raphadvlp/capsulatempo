      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
      import {
        getStorage,
        ref,
        listAll,
        getDownloadURL,
      } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

      // 🔥 Configuração Firebase
      const firebaseConfig = {
        apiKey: "AIzaSyCvBpaefejjMNPTN_A-yV5s6F0_okQFJZk",
        authDomain: "capsuladotempo-9d755.firebaseapp.com",
        projectId: "capsuladotempo-9d755",
        storageBucket: "capsuladotempo-9d755.appspot.com",
        messagingSenderId: "869092303974",
        appId: "1:869092303974:web:7d5b69c10147a178ddb9a7",
      };

      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      const videosRef = ref(storage, "videos/");

      const passwordScreen = document.getElementById("passwordScreen");
      const passwordInput = document.getElementById("passwordInput");
      const btnEntrar = document.getElementById("btnEntrar");
      const msgErro = document.getElementById("msgErro");
      const gallery = document.getElementById("gallery");
      const loading = document.getElementById("loading");

      // 🧩 Senha definida no código
      const SENHA_CORRETA = "gabriellaryssa2025"; // <--- altere aqui

      btnEntrar.addEventListener("click", () => {
        if (passwordInput.value === SENHA_CORRETA) {
          passwordScreen.style.display = "none";
          gallery.style.display = "grid";
          loading.style.display = "block";
          carregarVideos();
        } else {
          msgErro.style.display = "block";
          passwordInput.value = "";
        }
      });

      async function carregarVideos() {
        try {
          const result = await listAll(videosRef);
          loading.style.display = "none";

          if (result.items.length === 0) {
            gallery.innerHTML =
              "<p style='color:#ffb3c1;font-size:18px;'>Nenhum vídeo enviado ainda 💔</p>";
            return;
          }

          const items = result.items.reverse();
          for (const itemRef of items) {
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
          }
        } catch (error) {
          loading.textContent = "Erro ao carregar vídeos 😢";
          console.error(error);
        }
      }

        document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "index.html";
  });