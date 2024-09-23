// elements needed (common)

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://tqnzaqtsbnsvjibsysvu.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)

const loginButton = document.getElementById("login-button");
const usernameInput = document.getElementById("username");
const promptInput = document.getElementById("prompt");


if (loginButton) {
  loginButton.addEventListener("click", () => {
    const username = usernameInput.value;
    const prompt = promptInput.value;
    if (username && prompt) {
      window.location.href = `paint.html?username=${encodeURIComponent(username)}&prompt=${encodeURIComponent(prompt)}`; 
      alert("Both username and prompt are required.");
    }
  });
}


if (window.location.pathname.endsWith("paint.html")) {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const prompt = params.get("prompt");
  if (!username || !prompt) {
    alert("Username and prompt are required to access the paint app.");
    window.location.href = "login.html"; 
  }


// stack overflow ^^ ^ ^ ^^ ^ 
  
  const usernameDisplay = document.getElementById("username-display");
  const promptDisplay = document.getElementById("prompt-display");
  usernameDisplay.textContent = `User: ${username}`;
  promptDisplay.textContent = `Prompt: ${prompt}`;

  const canvas = document.getElementById("paint-canvas");
  const ctx = canvas.getContext("2d");
  const colorPicker = document.getElementById("color-picker");
  const brushSizeInput = document.getElementById("brush-size");
  const tools = document.querySelector(".toolbar");
  const timerDisplay = document.getElementById("timer");

  let isDrawing = false;
  let lastX, lastY;
  let currentTool = "brush";
  let secondsRemaining = 60;  // AMOUTN OF TIMEREMRME


  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - tools.offsetHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); 



  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = getMousePos(e);
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.beginPath(); 
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const [mouseX, mouseY] = getMousePos(e);
    ctx.lineWidth = brushSizeInput.value;
    ctx.strokeStyle = colorPicker.value;
    ctx.lineCap = "round"; 

    canvas.addEventListener("contextmenu", ()=>{
      currentTool="eraser";
    })

    if (currentTool === "brush") {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
      [lastX, lastY] = [mouseX, mouseY];
    } else if (currentTool === "eraser") {
      ctx.clearRect(mouseX - brushSizeInput.value / 2, mouseY - brushSizeInput.value / 2, brushSizeInput.value, brushSizeInput.value);
    }
  });


  canvas.addEventListener("contextmenu", ()=>{
    currentTool="eraser";
  })

  const brushButton = document.getElementById("brush-button");
  const eraserButton = document.getElementById("eraser-button");

  brushButton.addEventListener("click", () => {
    currentTool = "brush";
  });

  eraserButton.addEventListener("click", () => {
    currentTool = "eraser";
  });

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
  }

  function startTimer() {
    if (secondsRemaining >= 0) {
      timerDisplay.textContent = formatTime(secondsRemaining);
      secondsRemaining--;
      setTimeout(startTimer, 1000); // recyrsiuve call
    } else {
      alert(`Time's up!`);
      window.location.href="endscreen.html"
      // option  reset timer and app state here
    }
  }

  startTimer();

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}
