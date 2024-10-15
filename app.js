let mediaRecorder;
let recordedBlobs = [];
let stream;
let countdown;
let timeLeft = 60;

const startButton = document.getElementById("startRecording");
const stopButton = document.getElementById("stopRecording");
const downloadButton = document.getElementById("downloadVideo");
const uploadButton = document.getElementById("uploadVideo");
const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const videoPreview = document.getElementById("videoPreview");

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCvBpaefejjMNPTN_A-yV5s6F0_okQFJZk",
  authDomain: "capsuladotempo-9d755.firebaseapp.com",
  projectId: "capsuladotempo-9d755",
  storageBucket: "capsuladotempo-9d755.appspot.com",
  messagingSenderId: "869092303974",
  appId: "1:869092303974:web:7d5b69c10147a178ddb9a7",
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

async function startRecording() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  videoPreview.srcObject = stream;

  recordedBlobs = [];
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  mediaRecorder.start();
  startButton.disabled = true;
  stopButton.disabled = false;
  countdown = setInterval(updateTimer, 1000);
}

function stopRecording() {
  mediaRecorder.stop();
  stream.getTracks().forEach((track) => track.stop());
  stopButton.disabled = true;
  downloadButton.disabled = false;
  uploadButton.disabled = false;
  clearInterval(countdown);
  resetTimer();
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Tempo restante: ${timeLeft}s`;

  if (timeLeft === 0) {
    stopRecording();
  }
}

function resetTimer() {
  timeLeft = 60;
  timerDisplay.textContent = `Tempo restante: 60s`;
}

function downloadVideo() {
  const blob = new Blob(recordedBlobs, { type: "video/mp4" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "video.mp4";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function uploadVideo() {
  const blob = new Blob(recordedBlobs, { type: "video/mp4" });
  const storageRef = storage.ref(`videos/${Date.now()}.mp4`);
  const uploadTask = storageRef.put(blob);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Pode exibir o progresso se necessário
    },
    (error) => {
      feedback.textContent = "Erro ao enviar o vídeo!";
      feedback.style.color = "red";
    },
    () => {
      feedback.textContent = "Vídeo enviado com sucesso!";
      feedback.style.color = "green";
    }
  );
}

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
downloadButton.addEventListener("click", downloadVideo);
uploadButton.addEventListener("click", uploadVideo);
