class DependentPrepositionGame {
    constructor(sentences) {
        this.originalSentences = sentences;
        this.sentences = this.shuffle([...sentences]);
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.timer = 60;
        this.interval = null;
        this.gameActive = false;
        this.reviewMode = false;
        this.initUI();
    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    initUI() {
        console.log("Game script is running!");

        document.body.innerHTML = `
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #2E3192, #1BFFFF);
                    color: white;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }
                #game-container {
                    background: rgba(0, 0, 0, 0.8);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                    text-align: center;
                }
                p {
                    font-size: 18px;
                }
                input {
                    padding: 10px;
                    font-size: 16px;
                    border-radius: 5px;
                    border: none;
                    outline: none;
                    text-align: center;
                }
                input.correct {
                    border: 2px solid #00FF00;
                    background-color: rgba(0, 255, 0, 0.2);
                }
                input.incorrect {
                    border: 2px solid #FF0000;
                    background-color: rgba(255, 0, 0, 0.2);
                }
                button {
                    padding: 10px 20px;
                    font-size: 18px;
                    margin-top: 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                button:hover {
                    opacity: 0.8;
                }
                #start {
                    background: #28a745;
                    color: white;
                }
                #restart {
                    background: #007bff;
                    color: white;
                    display: none;
                }
                #review {
                    background: #ffc107;
                    color: black;
                    display: none;
                }
                #timer-bar {
                    width: 100%;
                    height: 10px;
                    background: red;
                    transition: width 1s linear;
                }
            </style>
            <div id="game-container">
                <h1>Dependent Preposition Challenge</h1>
                <div id="timer-bar"></div>
                <p id="timer">Time left: 60s</p>
                <p id="sentence"></p>
                <input type="text" id="answer" autofocus>
                <p id="feedback"></p>
                <p>Score: <span id="score">0</span></p>
                <button id="start">Start Game</button>
                <button id="restart">Restart</button>
                <button id="review">Review Mistakes</button>
                <button id="downloadReport" style="display:none;">Download Report</button>  <!-- ✅ New button -->

            </div>
        `;

        document.getElementById("start").addEventListener("click", () => this.startGame());
        document.getElementById("restart").addEventListener("click", () => this.restartGame());
        document.getElementById("review").addEventListener("click", () => this.startReview());
        this.setupInputListener();
    }

    setupInputListener() {
        document.getElementById("answer").addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.checkAnswer();
            }
        });
    }

    startGame() {
        this.gameActive = true;
        this.reviewMode = false;
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.sentences = this.shuffle([...this.originalSentences]);
        this.timer = 60;
        clearInterval(this.interval);
        document.getElementById("start").style.display = "none";
        document.getElementById("restart").style.display = "block";
        document.getElementById("review").style.display = "none";
        document.getElementById("score").textContent = this.score;
        document.getElementById("feedback").textContent = "";
        document.getElementById("timer-bar").style.width = "100%";
        document.getElementById("answer").value = "";
        document.getElementById("answer").focus();
        this.updateSentence();
        this.startTimer();
    }

    updateSentence() {
        if (this.currentIndex < this.sentences.length) {
            document.getElementById("sentence").textContent = this.sentences[this.currentIndex].sentence;
            document.getElementById("answer").value = "";
        } else {
            this.endGame();
        }
    }

        checkAnswer() {
    if (!this.gameActive && !this.reviewMode) return;

    const input = document.getElementById("answer");
    const userInput = input.value.trim().toLowerCase();
    const currentSet = this.reviewMode ? this.wrongAnswers : this.sentences;
    const correctAnswer = currentSet[this.currentIndex].preposition;

    if (userInput === correctAnswer) {
    if (!this.reviewMode) {
        this.score += 5;  // ✅ Increase score for correct answer
        document.getElementById("score").textContent = this.score;  // ✅ Update score display
    }
    input.classList.add("correct");
    
} else {
    if (!this.reviewMode) {
        this.score -= 1;  // ✅ Deduct score for incorrect answer
        document.getElementById("score").textContent = this.score;  // ✅ Update score display
    }
    input.classList.add("incorrect");
    document.getElementById("feedback").textContent = `Incorrect: Correct answer is '${correctAnswer}'`;

    // Store incorrect answers for review mode
if (!this.reviewMode) {
    this.wrongAnswers.push({
        sentence: currentSet[this.currentIndex].sentence,
        preposition: currentSet[this.currentIndex].preposition,
        userAnswer: userInput || "(no answer)"  // ✅ Save what the user typed
    });
}

}



        if (this.reviewMode) {
        setTimeout(() => {
            input.classList.remove("correct", "incorrect");
            this.currentIndex++;  // ✅ Move to the next mistake in review mode
            this.showReviewSentence();
        }, 1000);
    } else {
        this.currentIndex++;  // ✅ Move to next sentence in normal game mode
        if (userInput !== correctAnswer) {  // ✅ Keep delay for incorrect answers
            setTimeout(() => {
                input.classList.remove("correct", "incorrect");
                this.updateSentence();
            }, 1000);
        } else {
            input.classList.remove("correct", "incorrect");
            this.updateSentence();  // ✅ No delay for correct answers
        }
    }


    } // ✅ **THIS BRACKET WAS MISSING**



    startTimer() {
        this.interval = setInterval(() => {
            if (this.timer > 0) {
                this.timer--;
                document.getElementById("timer").textContent = `Time left: ${this.timer}s`;
                document.getElementById("timer-bar").style.width = (this.timer / 60) * 100 + "%";
            } else {
                clearInterval(this.interval);
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
    this.gameActive = false;
    clearInterval(this.interval);
    console.log("✅ EndGame Triggered!");  // ✅ Debugging Log
    console.log("❗Wrong Answers Count:", this.wrongAnswers.length);  // ✅ Check stored mistakes

    document.getElementById("review").style.display = this.wrongAnswers.length > 0 ? "block" : "none";

    const reportButton = document.getElementById("downloadReport");
    if (!reportButton) {
        console.error("🚨 ERROR: Download Report button is missing!");
        return;
    }

    console.log("✅ Showing Report Button");
    reportButton.style.display = "block";

    // ✅ Ensure the event listener is only added once
    if (!reportButton.dataset.listenerAdded) {
        reportButton.addEventListener("click", () => this.generateReport());
        reportButton.dataset.listenerAdded = "true";  // Prevents duplicate listeners
        console.log("✅ Report Button Click Event Added!");
    }
}


    startReview() {
        if (this.wrongAnswers.length === 0) return;
        this.reviewMode = true;
        this.currentIndex = 0;
        this.showReviewSentence();
    }

    showReviewSentence() {
    if (this.currentIndex < this.wrongAnswers.length) {
        const currentMistake = this.wrongAnswers[this.currentIndex];
        document.getElementById("sentence").textContent = `${currentMistake.sentence.replace("__", "____")}`;
        document.getElementById("answer").value = "";
        document.getElementById("feedback").textContent = ""; // Clear feedback
    } else {
        document.getElementById("sentence").textContent = "Review complete!";
        document.getElementById("answer").style.display = "none";
        document.getElementById("feedback").textContent = "";
        this.reviewMode = false; // Reset review mode
        this.currentIndex = 0; // Reset index
    }
}
   restartGame() {
    this.gameActive = false;  // Stop any active game
    this.reviewMode = false;  // Reset review mode
    clearInterval(this.interval);  // Stop the timer

    // Reset key game variables
    this.currentIndex = 0;
    this.score = 0;
    this.timer = 60;
    this.wrongAnswers = [];
    this.sentences = this.shuffle([...this.originalSentences]);

    // Reset UI elements
    document.getElementById("score").textContent = this.score;
    document.getElementById("feedback").textContent = "";
    document.getElementById("sentence").textContent = "";
    document.getElementById("answer").value = "";
    const inputBox = document.getElementById("answer");
    inputBox.style.display = "block";
    inputBox.style.width = "80%";  // ✅ Ensures it stretches properly
    inputBox.style.margin = "10px auto";  // ✅ Centers it inside its container
    inputBox.style.textAlign = "center";  // ✅ Centers text inside the box
    inputBox.focus();
    document.getElementById("timer").textContent = "Time left: 60s";
    document.getElementById("timer-bar").style.width = "100%";

    // Hide review button & show start button
    document.getElementById("review").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById("start").style.display = "block";
}

    generateReport() {
    if (this.wrongAnswers.length === 0) {
        alert("No mistakes were made. Great job!");
        return;
    }

    let reportText = "Dependent Preposition Game - Mistakes Report\n\n";

    this.wrongAnswers.forEach(mistake => {
        reportText += `You wrote: "${mistake.sentence.replace("__", mistake.userAnswer.toUpperCase())}"\n`;
        reportText += `The correct answer is: "${mistake.sentence.replace("__", mistake.preposition.toUpperCase())}"\n\n`;
    });

    // Create a Blob and generate a download link
    const blob = new Blob([reportText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "game_report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


}

const sentences = [
    { sentence: "She's addicted __ coffee.", preposition: "to" },
    { sentence: "I'm afraid/frightened __ flying.", preposition: "of" },
    { sentence: "He's very angry with his son __ the party.", preposition: "with" },
    { sentence: "We're bored __ doing this.", preposition: "with" },
    { sentence: "I'm fed up __ you complaining all the time.", preposition: "with" },
    { sentence: "The square was full __ tourists.", preposition: "of" },
    { sentence: "We were fascinated __ the exhibition.", preposition: "by" },
    { sentence: "She's very fond __ her nephew.", preposition: "of" },
    { sentence: "He's good/bad __ languages.", preposition: "at" },
    { sentence: "I'm hooked __ that programme.", preposition: "on" },
    { sentence: "She's interested __ politics.", preposition: "in" },
    { sentence: "I'm not very keen __ fish. I prefer meat.", preposition: "on" },
    { sentence: "She's mad __ that new pop group.", preposition: "about" },
    { sentence: "He's married __ a Chinese woman.", preposition: "to" },
    { sentence: "They were very nice/kind __ us.", preposition: "to" },
    { sentence: "It's very nice/kind __ you to help us.", preposition: "of" },
    { sentence: "He's obsessed __ football.", preposition: "with" },
    { sentence: "I'm really pleased __ my new flat.", preposition: "with" },
    { sentence: "Your jacket is similar __ mine.", preposition: "to" },
    { sentence: "I'm sorry __ the weather, but it's not my fault!", preposition: "about" },
    { sentence: "I'm tired __ doing the washing up. It's your turn.", preposition: "of" },
    { sentence: "I'm worried __ my exam tomorrow.", preposition: "about" },
    { sentence: "I don't agree __ you.", preposition: "with" },
    { sentence: "She accused him __ lying.", preposition: "of" },
    { sentence: "I've applied __ a new job.", preposition: "for" },
    { sentence: "He apologized __ arriving late.", preposition: "for" },
    { sentence: "I asked __ a cup of coffee.", preposition: "for" },
    { sentence: "We arrived __ Paris at 4:00.", preposition: "in" },
    { sentence: "She arrived __ the airport.", preposition: "at" },
    { sentence: "Do you believe __ UFOs?", preposition: "in" },
    { sentence: "This house belongs __ my mother.", preposition: "to" },
    { sentence: "He borrowed some money __ his sister.", preposition: "from" },
    { sentence: "The course consists __ five days of practical classes.", preposition: "of" },
    { sentence: "The car crashed __ a tree.", preposition: "into" },
    { sentence: "Everything depends __ the weather.", preposition: "on" },
    { sentence: "We're going to divide the house __ two flats.", preposition: "into" },
    { sentence: "Could you explain that __ me again, please?", preposition: "to" },
    { sentence: "Have you heard __ a composer called Messiaen?", preposition: "of" },
    { sentence: "Have you heard __ your mother recently?", preposition: "from" },
    { sentence: "She fell __ love with an Italian boy.", preposition: "in" },
    { sentence: "I got __ London at 6:00.", preposition: "to" },
    { sentence: "What happened __ him in the end?", preposition: "to" },
    { sentence: "Don't laugh __ me! It's not funny.", preposition: "at" },
    { sentence: "Can you pay __ my coffee?", preposition: "for" },
    { sentence: "I prefer doing sport __ watching it.", preposition: "to" },
    { sentence: "The smell of candles reminds me __ Christmas.", preposition: "of" },
    { sentence: "Did you speak/talk to the boss __ your contract?", preposition: "about" },
    { sentence: "She's going to specialize __ paediatrics.", preposition: "in" },
    { sentence: "I hope you succeed __ finding a job.", preposition: "in" },
    { sentence: "He's suffering __ a broken heart.", preposition: "from" },
    { sentence: "I'm thinking __ going to Ireland this summer.", preposition: "of/about" },
    { sentence: "What do you think __ my new shoes?", preposition: "of" },
    { sentence: "What are you thinking __?", preposition: "about" },
    { sentence: "Her book has been translated __ 20 languages.", preposition: "into" },
    { sentence: "Don't worry __ anything.", preposition: "about" },
    { sentence: "My brother is afraid __ bats.", preposition: "of" },
    { sentence: "She's really angry __ her boyfriend about last night.", preposition: "with" },
    { sentence: "I'm very close __ my elder sister.", preposition: "to" },
    { sentence: "This exercise isn't very different __ the last one.", preposition: "from" },
    { sentence: "We're really excited __ going to Brazil.", preposition: "about" },
    { sentence: "Krakow is famous __ its main square.", preposition: "for" },
    { sentence: "I'm fed up __ sitting in this traffic jam.", preposition: "with" },
    { sentence: "I'm very fond __ my little nephew. He's adorable.", preposition: "of" },
    { sentence: "I've never been good __ sport.", preposition: "at" },
    { sentence: "Eat your vegetables. They're good __ you.", preposition: "for" },
    { sentence: "My sister is very interested __ astrology.", preposition: "in" },
    { sentence: "She's very keen __ cycling. She does about 50 km every weekend.", preposition: "on" },
    { sentence: "I don't like people who aren't kind __ animals.", preposition: "to" },
    { sentence: "She used to be married __ a pop star.", preposition: "to" },
    { sentence: "I'm really pleased __ my new scooter.", preposition: "with" },
    { sentence: "My dad was very proud __ learning to ski.", preposition: "of" },
    { sentence: "Why are you always rude __ waiters and shop assistants?", preposition: "to" },
    { sentence: "Rachel is worried __ losing her job.", preposition: "about" },
    { sentence: "I'm tired __ walking. Let's stop and have a rest.", preposition: "of" },
    { sentence: "He apologized __ the police officer for driving fast.", preposition: "to" },
    { sentence: "I never argue __ my husband about money.", preposition: "with" },
    { sentence: "We're arriving __ Milan on Sunday.", preposition: "in" },
    { sentence: "We're arriving __ Malpensa airport at 3.45.", preposition: "at" },
    { sentence: "Could you ask the waiter __ the bill?", preposition: "for" },
    { sentence: "Do you believe __ stereotypes?", preposition: "in" },
    { sentence: "Who does this book belong __?", preposition: "to" },
    { sentence: "I can't choose __ these two bags.", preposition: "between" },
    { sentence: "We might go out. It depends __ the weather.", preposition: "on" },
    { sentence: "I dreamt __ my childhood last night.", preposition: "about" },
    { sentence: "Don't laugh __ me! I'm doing my best!", preposition: "at" },
    { sentence: "I'm really looking forward __ the party.", preposition: "to" },
    { sentence: "If I pay __ the meal, can you get the drinks?", preposition: "for" },
    { sentence: "This music reminds me __ our honeymoon in Italy.", preposition: "of" },
    { sentence: "I don't spend a lot of money __ clothes.", preposition: "on" },
    { sentence: "We need to talk to Anita __ her school report.", preposition: "about" },
    { sentence: "I agree __ my boss about the problem.", preposition: "with" },
    { sentence: "He apologized __ being late.", preposition: "for" },
    { sentence: "She applied __ the job.", preposition: "for" },
    { sentence: "We always argue __ money.", preposition: "about" },
    { sentence: "I used to argue __ my sister a lot.", preposition: "with" },
    { sentence: "We arrived __ the airport at 6:00 a.m.", preposition: "at" },
    { sentence: "We arrived __ Paris in the evening.", preposition: "in" },
    { sentence: "I don't believe __ ghosts.", preposition: "in" },
    { sentence: "That bag belongs __ me.", preposition: "to" },
    { sentence: "I can't choose __ these two shirts.", preposition: "between" },
    { sentence: "Our weekend plans depend __ the weather.", preposition: "on" },
    { sentence: "I dreamt __ my grandfather last night.", preposition: "about" },
    { sentence: "They all laughed __ me when I fell over.", preposition: "at" },
    { sentence: "I'm looking forward __ my holiday.", preposition: "to" },
    { sentence: "I'll pay __ your coffee.", preposition: "for" },
    { sentence: "We all posed __ a photograph.", preposition: "for" },
    { sentence: "I prefer taking the train __ flying.", preposition: "to" },
    { sentence: "You can always rely __ your parents.", preposition: "on" },
    { sentence: "He reminds me __ an old school friend.", preposition: "of" },
    { sentence: "She shared her sweets __ my son.", preposition: "with" },
    { sentence: "They smiled __ me.", preposition: "at" },
    { sentence: "I love spending money __ clothes.", preposition: "on" },
    { sentence: "They succeeded __ climbing the mountain.", preposition: "in" },
    { sentence: "I talked __ the hotel manager about my room.", preposition: "to" },
    { sentence: "Are you waiting __ someone?", preposition: "for" },
    { sentence: "Don't worry __ it, it's not a problem.", preposition: "about" },
    { sentence: "She's angry __ her salary.", preposition: "about" },
    { sentence: "She's angry __ her boss.", preposition: "with" },
    { sentence: "He's very close __ his father.", preposition: "to" },
    { sentence: "The film is different __ the book.", preposition: "from" },
    { sentence: "I'm really disappointed __ these photos.", preposition: "with" },
    { sentence: "She's excited __ her new job.", preposition: "about" },
    { sentence: "Oxford is famous __ its university.", preposition: "for" },
    { sentence: "I'm fed up __ waiting. Let's go!", preposition: "with" },
    { sentence: "He's very fond __ his teacher.", preposition: "of" },
    { sentence: "I'm frightened __ snakes.", preposition: "of" },
    { sentence: "He's good __ remembering names.", preposition: "at" },
    { sentence: "Vegetables are good __ you.", preposition: "for" },
    { sentence: "She's interested __ French literature.", preposition: "in" },
    { sentence: "I'm not very keen __ fast food.", preposition: "on" },
    { sentence: "They were very kind __ me.", preposition: "to" },
    { sentence: "He's married __ my best friend.", preposition: "to" },
    { sentence: "I'm very pleased __ my progress.", preposition: "with" },
    { sentence: "I'm proud __ my children.", preposition: "of" },
    { sentence: "I'm ready __ a holiday.", preposition: "for" },
    { sentence: "He's responsible __ the sales team.", preposition: "for" },
    { sentence: "Don't be rude __ him.", preposition: "to" },
    { sentence: "We're sorry __ what happened.", preposition: "about" },
    { sentence: "They're tired __ working every day.", preposition: "of" },
    { sentence: "She's worried __ her car.", preposition: "about" }
];

const game = new DependentPrepositionGame(sentences);
