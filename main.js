import { GoogleGenerativeAI } from "@google/generative-ai";

const button = document.querySelector(".send");
const input = document.querySelector(".input");
const output = document.querySelector(".ai-message");
const message_area = document.querySelector(".message_area");
const loader = document.querySelector(".loading");

const genAi = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const formatText = (text) => {
  text = text.replace(/\*/g, "");
  let sentences = text.split(". ");
  sentences = sentences.filter((sentence) => sentence.trim() !== "");
  text = sentences.join(". ") + ".";
  text = text.replace(/\.\s/g, ".\u00A0");
  return text;
};

const getHistory = async () => {
  try {
    const response = await fetch('path/to/data.json');
    if (!response.ok) throw new Error('Network response was not ok.');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

button.addEventListener("click", async () => {
  if (!input.value) return alert("Please enter a prompt");
  const prompt = input.value;
  message_area.innerHTML += `<div class="message user-message">
    <div class="img"><img class="user" src="/my_face-removebg-preview.png" alt=""></div>
    <div class="text">${prompt}</div>
  </div>`;
  loader.style.visibility = "visible";
  message_area.scrollTop = message_area.scrollHeight;

  const history = await getHistory();
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 2048,
    },
  });

  try {
    const result = await chat.sendMessageStream(prompt);
    input.value = "";
    const response = await result.response;
    const text = await response.text();

    const formattedText = formatText(text);
    const formattedTextWithItalic = formattedText.replace(
      /\*(.*?)\*/g,
      "<i>$1</i>"
    );

    const formattedTextWithLinks = formattedTextWithItalic.replace(
      /(https?:\/\/[^\s]+)/g,
      (match) => {
        if (match === "https://www.monytccc.eu.org") {
          return '<a href="https://www.monytccc.eu.org" style="color: blue;" target="_blank">https://www.monytccc.eu.org</a>';
        } else {
          return '<a href="' + match + '" style="color: blue;" target="_blank">' + match + '</a>';
        }
      }
    );

    loader.style.visibility = "hidden";
    message_area.innerHTML += `<div class="message ai-message">
      <div class="img"><img src="logo.png" alt=""></div>
      <div class="text">${formattedTextWithLinks}</div>
    </div>`;
    message_area.scrollTop = message_area.scrollHeight;
  } catch (error) {
    loader.style.visibility = "hidden";
    input.value = "";
    message_area.scrollTop = message_area.scrollHeight - message_area.clientHeight;
    message_area.innerHTML += `<div class="message ai-message">
      <div class="img"><img src="logo.png" alt=""></div>
      <div class="text">Maaf Tidak Mengerti atau Coba yang lain</div>
    </div>`;
  }
});

input.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    button.click();
  }
});
