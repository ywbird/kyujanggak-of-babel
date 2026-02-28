const textarea = document.getElementById("textarea");
const searchBtn = document.getElementById("search");
const link = document.getElementById("link");

textarea.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", ()=>{
  const coordinate = convertB2Coordinate(textarea.value.padEnd(200, " "));
  let [building, room, wall, shelf, book, page] = coordinate.split(":");

  link.innerText = `${building.slice(0, 20)}...:${room}:${wall}:${shelf}:${book}:${page}`;
  link.href = `view.html?c=${coordinate}`
});
