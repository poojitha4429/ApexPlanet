const images = [
      "https://www.powertrafic.fr/wp-content/uploads/2023/04/image-ia-exemple.png",
      "https://i.etsystatic.com/41437928/r/il/33a3f1/4770000446/il_1588xN.4770000446_dyke.jpg",
      "https://static.displate.com/1200x857/displate/2024-02-17/5e2993dae1a543b89f9c8838fa7128b9_ad1f7c55d5ef0364e79093a37136eb42.jpg"
    ];

    let currentIndex = 0;

    function showImage(index) {
      document.getElementById("carouselImage").src = images[index];
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    }

     const quiz = [
      {
        question: "What does HTML stand for?",
        answers: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
        correct: 0
      },
      {
        question: "Which language is used for styling web pages?",
        answers: ["HTML", "JQuery", "CSS"],
        correct: 2
      },
      {
        question: "What is the correct syntax for a function in JavaScript?",
        answers: ["function = myFunc()", "function myFunc()", "myFunc(): function"],
        correct: 1
      }
    ];

    let currentQ = 0;

    function loadQuestion() {
      const q = quiz[currentQ];
      document.getElementById("question").innerText = q.question;
      const answersDiv = document.getElementById("answers");
      answersDiv.innerHTML = "";

      q.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.innerText = answer;
        btn.onclick = () => {
          if (index === q.correct) {
            btn.classList.add("correct");
          } else {
            btn.classList.add("wrong");
          }
          // Disable all buttons
          Array.from(answersDiv.children).forEach(b => b.disabled = true);
        };
        answersDiv.appendChild(btn);
      });
    }

    function nextQuestion() {
      currentQ = (currentQ + 1) % quiz.length;
      loadQuestion();
    }

    loadQuestion();

    // === Joke API Integration ===
    async function getJoke() {
      try {
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        const data = await response.json();
        document.getElementById("joke").innerText = ${data.setup} — ${data.punchline};
      } catch (error) {
        document.getElementById("joke").innerText = "Oops! Could not fetch a joke.";
      }
    }
