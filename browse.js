const buildingInput = document.getElementById("building-input");

const roomSection = document.getElementById("room-section");
const roomSubInput1 = document.getElementById("room-sub-1-input");
const roomSubInput2 = document.getElementById("room-sub-2-input");
const roomSubInput3 = document.getElementById("room-sub-3-input");

const wallSection = document.getElementById("wall-section");
const wallInput = document.getElementById("wall-input");

const shelfSection = document.getElementById("shelf-section");
const shelfInput = document.getElementById("shelf-input");

const bookSection = document.getElementById("book-section");
const bookInput = document.getElementById("book-input");

const link = document.getElementById("link");

let step = 0;

roomSubInput1.value = "null";
roomSubInput2.value = "null";
roomSubInput3.value = "null";
wallInput.value = "null";
shelfInput.value = "null";
bookInput.value = "null";

buildingInput.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") {
    e.preventDefault();

    const match = buildingInput.value.match(/^[0-9A-Za-z가-힣]+$/g);

    if (match !== null && step === 0) { step++; syncStep(); }
  }
});

function handleRoomInput() {
  if (roomSubInput1.value === "null") return;
  if (roomSubInput2.value === "null") return;
  if (roomSubInput3.value === "null") return;
  
  if (step === 1) { step++; syncStep(); }
}

roomSubInput1.addEventListener("change", handleRoomInput);
roomSubInput2.addEventListener("change", handleRoomInput);
roomSubInput3.addEventListener("change", handleRoomInput);

wallInput.addEventListener("change", () => {
  if (wallInput.value === "null") return;

  if (step === 2) { step++; syncStep(); }
});

shelfInput.addEventListener("change", () => {
  if (shelfInput.value === "null") return;

  if (step === 3) { step++; syncStep(); }
});

bookInput.addEventListener("change", () => {
  if (roomSubInput1.value === "null") return;
  if (roomSubInput2.value === "null") return;
  if (roomSubInput3.value === "null") return;
  if (wallInput.value === "null") return;
  if (shelfInput.value === "null") return;
  if (bookInput.value === "null") return;

  const coordinate = `${buildingInput.value}:${roomSubInput1.value}${roomSubInput2.value}${roomSubInput3.value}:${wallInput.value}:${shelfInput.value}:${bookInput.value}:0`;

  link.innerText = `${buildingInput.value.slice(0, 20)}${buildingInput.value.length > 20 ? "..." : ""}:${roomSubInput1.value}${roomSubInput2.value}${roomSubInput3.value}:${wallInput.value}:${shelfInput.value}:${bookInput.value}:0`;
  link.href = `view.html?c=${coordinate}`
});

function syncStep() {
  if (step > 0) {
    roomSection.classList.remove("hidden");
  }
  if (step > 1) {
    wallSection.classList.remove("hidden");
  }
  if (step > 2) {
    shelfSection.classList.remove("hidden");
  }
  if (step > 3) {
    bookSection.classList.remove("hidden");
  }
}
