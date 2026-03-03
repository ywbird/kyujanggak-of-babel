const randomLink = document.getElementById("random");

randomLink.addEventListener("click", (e)=>{
  e.preventDefault();

  const chars = getRandomArray(200, 0, Number(BASE_B)).map(a=>charI2B(BigInt(a)));
  const str = String.fromCodePoint(...chars);
  window.location = `view.html?c=${convertB2Coordinate(str)}`;
});

