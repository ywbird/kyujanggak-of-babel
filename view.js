const textbox = document.getElementById("textbox");
const title = document.getElementById("title");

/*
- https://namu.wiki/w/한국십진분류법
- https://namu.wiki/w/바벨의 도서관
- https://youtu.be/FGhj3CGxl8I
*/

// "　"

document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.toString());
  const params = url.searchParams;
  const text = convertCoordinate2B(params.get("c"));

  title.innerText = convertCoordinate2Title(params.get("c"));

  for (let row = 0; row < 10; row++) {
    const rowEl = document.createElement("div");
    rowEl.classList.add("line");
    for (let col = 0; col < 20; col++) {
      const charEl = document.createElement("span");
      charEl.classList.add("char");
      if (text.length > row*20 + col) {
        charEl.innerText = text[row*20+col];
      } else {
        charEl.innerText = " ";
      }
      rowEl.appendChild(charEl);
    }
    textbox.appendChild(rowEl);
  }

})
