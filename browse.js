const roomInput = document.getElementById("room-input");

const infoSection = document.getElementById("info-section");

const wallSection = document.getElementById("wall-section");
const wallInput = document.getElementById("wall-input");

const shelfSection = document.getElementById("shelf-section");
const shelfInput = document.getElementById("shelf-input");

const bookSection = document.getElementById("book-section");
const bookInput = document.getElementById("book-input");

const link = document.getElementById("link");

let step = 0;

wallInput.value = "null";
shelfInput.value = "null";
bookInput.value = "null";

roomInput.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") {
    e.preventDefault();

    const match = roomInput.value.match(/^[0-9A-Za-z가-힣]+$/g);

    if (match !== null && step === 0) { step++; syncStep(); }
  }
  roomInput.value = roomInput.value.replaceAll(/[^0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]/g, "")

  syncCoordinate();
});

roomInput.addEventListener("paste", ()=>{
  console.log("paste");
  roomInput.value = roomInput.value.replaceAll(/[^0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]/g, "")

  syncCoordinate();
});

wallInput.addEventListener("change", () => {
  if (wallInput.value === "null") return;

  if (step === 1) { step++; syncStep(); }

  syncCoordinate();
});

shelfInput.addEventListener("change", () => {
  if (shelfInput.value === "null") return;

  if (step === 2) { step++; syncStep(); }

  syncCoordinate();
});

bookInput.addEventListener("change", () => {
  if (bookInput.value === "null") return;

  syncCoordinate();
});

function syncCoordinate() {
  if (wallInput.value === "null") return;
  if (shelfInput.value === "null") return;
  if (bookInput.value === "null") return;

  const match = roomInput.value.match(/^[0-9A-Za-z가-힣]+$/g);

  if (match === null) return;

  const coordinate = `${roomInput.value}-${wallInput.value}-${shelfInput.value}-${bookInput.value}-1`;

  // link.innerText = `${roomInput.value.slice(0, 20)}${roomInput.value.length > 20 ? "..." : ""}:${wallInput.value}:${shelfInput.value}:${bookInput.value}:0`;
  link.innerText = convertCoordinate2Title(coordinate);
  link.href = `view.html?c=${coordinate}`
}

function syncStep() {
  if (step > 0) {
    wallSection.classList.remove("hidden");
    infoSection.classList.add("hidden");
  }
  if (step > 1) {
    shelfSection.classList.remove("hidden");
  }
  if (step > 2) {
    bookSection.classList.remove("hidden");
  }
}
