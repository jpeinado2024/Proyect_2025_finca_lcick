const API_KEY = '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';

const content = document.getElementById("content");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

let isAnwswerloading = false;
let answerSectionId = 0;

sendButton.addEventListener("click", handLeSendMessage);
chatInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        handLeSendMessage();
    }
}
);


function handLeSendMessage() {
    const question = chatInput.value.trim();

    if (question === "" || isAnwswerloading) return;

    sendButton.classList.add('send-button-nonactive');

    addQuestionSection(question);
    chatInput.value = ""; // Limpiar el campo de entrada después de enviar el mensaje
}


function getAnswer(question) {

    const fetchData =
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "qwen/qwen3-4b:free",
                "messages": [
                    {
                        "role": "user",
                        "content": question
                    },{
                        "role": "system",
                        "content": "actua como un asistente de chat que responde preguntas sobre el cafe. Proporciona respuestas concisas y claras, ten en cuenta nunca salirte del contexto del cafe, evitando tecnicismos innecesarios. Si no conoces la respuesta, di 'No lo sé'."
                    }
                ]
            })
        });

    fetchData.then(response => response.json())
        .then(data => {
            const resultData = data.choices[0].message.content;
            isAnwswerloading = false;
            addSnswerSection(resultData);
        }).finally(() => {
            scrollToBottom();
            sendButton.classList.remove('send-button-nonactive');
        })

}




function addQuestionSection(message) {
    isAnwswerloading = true;
    // crear una sección de pregunta vacía con una animación de carga
    const sectionElement = document.createElement("section");
    sectionElement.className = "question-section";
    sectionElement.textContent = message;

    content.appendChild(sectionElement);
    // añador un nuevo elemento de respuesta
    addSnswerSection(message);
    scrollToBottom();
}

function addSnswerSection(message) {
    if (isAnwswerloading) {
        answerSectionId++;
        // crear una sección de respuesta vacía con una animación de carga
        const sectionElement = document.createElement("section");
        sectionElement.className = "answer-section";
        sectionElement.innerHTML = getLoadingSvg();
        sectionElement.id = answerSectionId;

        content.appendChild(sectionElement);
        getAnswer(message)
    } else {
        const answerSectionElement = document.getElementById(answerSectionId);
        answerSectionElement.textContent = message;
    }



}

function getLoadingSvg() {
    return `<svg style="height: 25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#4986E2" stroke="#4986E2" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#4986E2" stroke="#4986E2" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#4986E2" stroke="#4986E2" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>`;
}

function scrollToBottom() {
    content.scrollTo({
         top: content.scrollHeight,
         behavior: 'smooth'
    });
}