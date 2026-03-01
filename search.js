const searchInput = document.getElementById("textarea");
const searchBtn = document.getElementById("search");
const link = document.getElementById("link");

searchInput.addEventListener("keydown", (e)=>{
  searchInput.value = searchInput.value.replaceAll(/[^가-힣ㄱ-ㅎㅏ-ㅣ,\.!\? ]/g, "");

  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", ()=>{
  searchInput.value = searchInput.value.replaceAll(/[^가-힣ㄱ-ㅎㅏ-ㅣ,\.!\? ]/g, "");
  
  const match = searchInput.value.match(/^[가-힣,\.!\? ]+$/g);

  if (match !== null) {
    const coordinate = convertB2Coordinate(searchInput.value.padEnd(200, " "));

    link.innerText = convertCoordinate2Title(coordinate);
    link.href = `view.html?c=${coordinate}`
  } else {
    link.innerText = "올바르지 않은 내용입니다.";
    link.href = ``
  }
});
