const createElement = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn"> ${el}</span>`)
    return (htmlElements.join(" "));
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    fetch(url)
        .then((res) => res.json())
        .then((json) => displayLessons(json.data))

}
const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn")
    lessonBtns.forEach((btn) => btn.classList.remove("active"));

};

const loadWordLevel = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add("active");
            displayLevelWord(data.data);
        });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
}

const displayWordDetails = (word) => {
    console.log(word)
    const detailBox = document.getElementById("details-container");
    detailBox.innerHTML = ` <div class="">
                    <h2 class="text-2xl font-bold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
                </div>
                <div class="">
                    <h2 class="font-bold">Meaning</h2>
                    <p class="font-bangla">${word.meaning}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">Example</h2>
                    <p class="">${word.sentence}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">Synonym</h2>
                    <div class=""> ${createElement(word.synonyms)}</div>
                </div>`
    document.getElementById("word_modal").showModal();
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if (words.length == 0) {
        wordContainer.innerHTML = `
          <div class="text-center bg-white col-span-full rounded-xl py-10 space-y-6 font-bangla">
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-gray-500 text-xl font-medium">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class=" font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
          `;
    }
    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white text-center mx-10 py-10 mb-5 rounded-xl space-y-5">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "sobdo nai"}</h2>
            <p class="font-semibold">Meaning/Pronounciation</p>
            <div class="font-bangla font-bold">"${word.meaning ? word.meaning : "No Meaning"} / ${word.pronunciation ? word.pronunciation : "nai "}"</div>
            <div class="flex justify-between mx-10">
                <button onClick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.appendChild(card)


    });
    manageSpinner(false)
}

const displayLessons = (lessons) => {
    const containerBtn = document.getElementById("level-container");
    containerBtn.innerHTML = "";
    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
             <button id="lesson-btn-${lesson.level_no}" onclick="loadWordLevel(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"> <i class="fa-solid fa-book-open "></i>Lesson -${lesson.level_no}</button>
        `
        containerBtn.appendChild(btnDiv)
    }
}



loadLessons()

document.getElementById("btn-search").addEventListener('click', () => {
    removeActive();
    const input = document.getElementById("input-field");
    const searchValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then((data) => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            displayLevelWord(filterWords)
        });



});