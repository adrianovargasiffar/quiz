// Este arquivo contém a lógica do jogo. Ele define funções para iniciar o jogo, carregar perguntas, verificar respostas, atualizar placares e gerenciar o temporizador. As variáveis de estado, como pontuação e turno da equipe, também são gerenciadas aqui.

const questions = [
    { question: "Qual elemento do Modelo ER representa uma entidade?", correct: "Retângulo", options: ["Elipse", "Losango", "Seta"] },
    { question: "O que é uma chave primária?", correct: "Identifica unicamente um registro", options: ["Permite valores duplicados", "Relaciona tabelas", "Serve para ordenação"] },
    { question: "Qual é o símbolo de um relacionamento em um diagrama ER?", correct: "Losango", options: ["Retângulo", "Elipse", "Chave"] },
    { question: "O que é cardinalidade em um modelo ER?", correct: "Número de ocorrências entre entidades", options: ["Tamanho do banco", "Tipo de dado", "Índice de tabela"] },
    { question: "O que é um SGBD?", correct: "Sistema Gerenciador de Banco de Dados", options: ["Sistema Gráfico de Bancos", "Servidor Global de Banco de Dados", "Software de Backup"] },
    { question: "Qual das opções é um exemplo de SGBD?", correct: "PostgreSQL", options: ["HTML", "Windows", "Python"] },
    { question: "O que é um atributo no Modelo ER?", correct: "Característica de uma entidade", options: ["Relação entre tabelas", "Índice de pesquisa", "Nome do banco de dados"] },
    { question: "Qual símbolo representa um atributo em um Diagrama ER?", correct: "Elipse", options: ["Retângulo", "Losango", "Seta"] },
    { question: "O que significa a 1ª Forma Normal (1FN)?", correct: "Eliminação de grupos repetitivos", options: ["Remover chaves primárias", "Relacionar todas as tabelas", "Criar índices"] },
    { question: "A 2ª Forma Normal (2FN) elimina que tipo de dependência?", correct: "Dependência Parcial", options: ["Dependência Transitiva", "Dependência Cíclica", "Chave Estrangeira"] },
    { question: "O que é um atributo composto?", correct: "Atributo formado por subcomponentes", options: ["Atributo com valor fixo", "Atributo de relacionamento", "Atributo exclusivo"] },
    { question: "No modelo relacional, o que é um domínio?", correct: "Conjunto de valores permitidos para um atributo", options: ["Nome da tabela", "Conjunto de registros", "Chave estrangeira"] },
    { question: "Qual tipo de relacionamento existe entre um professor e suas turmas?", correct: "1:N (Um para Muitos)", options: ["N:N (Muitos para Muitos)", "1:1 (Um para Um)", "Auto-relacionamento"] },
    { question: "Qual é a principal função de uma chave estrangeira?", correct: "Garantir integridade referencial", options: ["Ordenar registros", "Indexar tabelas", "Criar atributos compostos"] },
    { question: "O que é um relacionamento N:N?", correct: "Muitos para Muitos", options: ["Um para Um", "Um para Muitos", "Auto-relacionamento"] },
    { question: "Em qual situação uma tabela é dita estar na 3FN?", correct: "Quando não há dependências transitivas", options: ["Quando há chaves compostas", "Quando possui apenas uma chave primária", "Quando elimina auto-relacionamento"] },
    { question: "Qual conceito define um conjunto de dados inter-relacionados armazenados e organizados?", correct: "Banco de Dados", options: ["Sistema Operacional", "Modelo ER", "Tabelas Relacionais"] },
    { question: "O que é um índice em um banco de dados?", correct: "Estrutura que acelera buscas", options: ["Tabela auxiliar", "Chave alternativa", "Relacionamento forte"] },
    { question: "O que representa um relacionamento fraco em um Modelo ER?", correct: "Entidade que depende de outra", options: ["Entidade auto-relacionada", "Relacionamento N:N", "Chave composta"] },
    { question: "O que significa redundância de dados?", correct: "Repetição desnecessária de dados", options: ["Relacionamento N:N", "Chave duplicada", "Falta de índice"] }
];

let currentQuestion = 0;
let teamTurn = 'A';
let scoreA = 0;
let scoreB = 0;
let streakA = 0;
let streakB = 0;
let nameA = 'Time A';
let nameB = 'Time B';
let timerInterval;
let timeLeft = 10;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    nameA = document.getElementById("groupAName").value || 'Time A';
    nameB = document.getElementById("groupBName").value || 'Time B';

    document.getElementById("nameA").innerText = nameA;
    document.getElementById("nameB").innerText = nameB;
    document.getElementById("nameAProgress").innerText = nameA;
    document.getElementById("nameBProgress").innerText = nameB;

    document.getElementById("team-entry").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    loadQuestion();
}

function startTimer() {
    timeLeft = 60;
    document.getElementById("timer").innerText = `Tempo: ${timeLeft}`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Tempo: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            disableOptions();
            document.getElementById("nextBtn").classList.remove("hidden");
        }
    }, 1000);
}

function loadQuestion() {
    const q = questions[currentQuestion];
    const options = [...q.options, q.correct];
    shuffle(options);

    const currentTeamName = (teamTurn === 'A') ? nameA : nameB;
    document.getElementById("team-turn").innerText = `Vez do ${currentTeamName}`;
    document.getElementById("question").innerText = q.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(btn, opt === q.correct);
        optionsDiv.appendChild(btn);
    });

    startTimer();
}

function disableOptions() {
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => opt.onclick = null);
}

function updateProgressBars() {
    const totalPoints = scoreA + scoreB;
    const percentA = totalPoints === 0 ? 0 : (scoreA / totalPoints) * 100;
    const percentB = totalPoints === 0 ? 0 : (scoreB / totalPoints) * 100;
    document.getElementById("progressA").style.width = `${percentA}%`;
    document.getElementById("progressB").style.width = `${percentB}%`;
}

function checkAnswer(element, isCorrect) {
    clearInterval(timerInterval);
    disableOptions();

    if(isCorrect){
        element.classList.add("correct");
        if(teamTurn === 'A') {
            streakA++;
            scoreA += (streakA > 1) ? 2 : 1;
        } else {
            streakB++;
            scoreB += (streakB > 1) ? 2 : 1;
        }
    } else {
        element.classList.add("wrong");
        const correctOption = Array.from(document.querySelectorAll('.option')).find(opt => opt.innerText === questions[currentQuestion].correct);
        if(correctOption) correctOption.classList.add("correct");
        if(teamTurn === 'A') streakA = 0;
        else streakB = 0;
    }

    document.getElementById("scoreA").innerText = scoreA;
    document.getElementById("scoreB").innerText = scoreB;
    updateProgressBars();
    document.getElementById("nextBtn").classList.remove("hidden");
}

function launchConfetti() {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#bb0000', '#ffffff']
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#0000bb', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

document.getElementById("nextBtn").onclick = () => {
    currentQuestion++;
    teamTurn = (teamTurn === 'A') ? 'B' : 'A';
    if(currentQuestion < questions.length){
        loadQuestion();
        document.getElementById("nextBtn").classList.add("hidden");
    } else {
        let winner = "Empate!";
        if(scoreA > scoreB) winner = `${nameA} venceu!`;
        else if(scoreB > scoreA) winner = `${nameB} venceu!`;

        document.querySelector('.quiz-container').innerHTML = `<h2>Fim do jogo!</h2><p>Placar Final - ${nameA}: ${scoreA} | ${nameB}: ${scoreB}</p><h3>${winner}</h3>`;
        launchConfetti();
    }
};