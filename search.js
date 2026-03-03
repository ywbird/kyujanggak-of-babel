const searchInput = document.getElementById("textarea");
const searchBtn = document.getElementById("search");
const link = document.getElementById("link");
const resultList = document.getElementById("result-list");
const resultWrap = document.getElementById("result");
const moreResultBtn = document.getElementById("more-result");
const alert = document.getElementById("alert");

searchInput.addEventListener("keydown", (e)=>{
  searchInput.value = searchInput.value.replaceAll(/[^가-힣ㄱ-ㅎㅏ-ㅣ,\.!\? ]/g, "").slice(0, 200);

  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

let resultCoordList = [];

searchBtn.addEventListener("click", ()=>{
  searchInput.value = searchInput.value.replaceAll(/[^가-힣ㄱ-ㅎㅏ-ㅣ,\.!\? ]/g, "").slice(0, 200);
  
  const match = searchInput.value.match(/^[가-힣,\.!\? ]+$/g);

  if (match !== null) {
    const coordinate = exactMatch(searchInput.value);

    link.innerText = convertCoordinate2Title(coordinate);
    link.href = `view.html?c=${coordinate}`

    resultList.textContent = ``;
    resultCoordList = [];
    searchTen();
    resultWrap.classList.remove("hidden");
    alert.innerText = "";
  } else {
    alert.innerText = "올바르지 않은 내용입니다.";
  }
});

moreResultBtn.addEventListener("click", searchTen);

function searchTen() {
  for (let i = 0; i < 10; i++) {
    let searchTry = 20;
    let coordinate;
    do {
      coordinate = containingMatch(searchInput.value);
      searchTry--;
    } while (resultCoordList.includes(coordinate) && searchTry > 0);
    if (resultCoordList.includes(coordinate)) continue;
    resultCoordList.push(coordinate);

    const el = document.createElement("li");
    const a = document.createElement("a");
    a.innerText = convertCoordinate2Title(coordinate);
    a.href = `view.html?c=${coordinate}`;
    el.appendChild(a);
    resultList.appendChild(el);
    }
}

function exactMatch(input) {
  return convertB2Coordinate(input.padEnd(200, " "));
}

function containingMatch(input) {
  const len = input.length;

  const pos = getRandomArray(1, 0, 200-len)[0];
  const fill = String.fromCodePoint(...getRandomArray(200-len, 0, Number(BASE_B)).map(c=>charI2B(BigInt(c))));

  const left = fill.slice(0, pos);
  const right = fill.slice(pos, 200-len);

  const content = `${left}${input}${right}`;

  return convertB2Coordinate(content);
}

