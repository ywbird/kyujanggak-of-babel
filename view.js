const textbox = document.getElementById("textbox");
const title = document.getElementById("title");
const pageInput = document.getElementById("page-input");
const prevPageLink = document.getElementById("prev-page");
const nextPageLink = document.getElementById("next-page");
const randomPageBtn = document.getElementById("random");
const coordinateEl = document.getElementById("coordinate");
const copyBtn = document.getElementById("copy");
const copyOpt = document.getElementById("copy-opt");

let init = true;

/*
- https://namu.wiki/w/바벨의 도서관
- https://youtu.be/FGhj3CGxl8I
*/

// "　"

document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.toString());
  const params = url.searchParams;
  const coordinate = params.get("c");

  title.innerText = convertCoordinate2Title(coordinate);

  navigate(coordinate);
});

randomPageBtn.addEventListener("click", ()=>{
  const url = new URL(window.location.toString());
  const params = url.searchParams;
  let [room, wall, shelf, book, page] = params.get("c").split("-");
  navigate(`${room}-${wall}-${shelf}-${book}-${Math.ceil(Math.random()*1000)}`);
});

pageInput.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") {
    const page = parseInt(pageInput.value);
    if (!(0 < page && page < 1000)) return;

    const url = new URL(window.location.toString());
    const params = url.searchParams;
    let [room, wall, shelf, book, _] = params.get("c").split("-");
    navigate(`${room}-${wall}-${shelf}-${book}-${pageInput.value}`);
  }
});

function fillText(coordinate) {
  const text = convertCoordinate2B(coordinate);
  textbox.innerHTML = ``;
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
}

function navigate(coordinate) {
  const url = new URL(window.location.toString());
  const params = url.searchParams;
  params.set("c", coordinate);
  if (!init) {
    window.history.pushState({}, "", url);
  }
  init = false;
  fillText(coordinate);

  let [room, wall, shelf, book, page] = coordinate.split("-");

  pageInput.value = page;

  if (parseInt(page) > 1) {
    prevPageLink.onclick = ()=>navigate(`${room}-${wall}-${shelf}-${book}-${parseInt(page)-1}`);
    prevPageLink.disabled = false;
  } else {
    prevPageLink.disabled = true;
  }
  if (parseInt(page) < 1000) {
    nextPageLink.onclick = ()=>navigate(`${room}-${wall}-${shelf}-${book}-${parseInt(page)+1}`);
    nextPageLink.disabled = false;
  } else {
    nextPageLink.disabled = true;
  }

  coordinateEl.innerText = `${room.length > 20 ? room.slice(0,20)+"..." : room}-${wall}-${shelf}-${book}-${page}`;
  coordinateEl.href = `view.html?c=${coordinate}`;

  copyBtn.onclick = 
    ()=>navigator.clipboard.writeText(
      copyOpt.value === "normal" ? coordinate :
      copyOpt.value === "url" ? `${window.location.origin}/view.html?c=${coordinate}` :
      copyOpt.value === "markdown" ? `[${convertCoordinate2Title(coordinate)}](${window.location.origin}/view.html?c=${coordinate})` :
      copyOpt.value === "html" ? `<a href="${window.location.origin}/view.html?c=${coordinate}">${convertCoordinate2Title(coordinate)}</a>` : coordinate
    );
}

