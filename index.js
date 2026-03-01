const randomLink = document.getElementById("random");

randomLink.addEventListener("click", (e)=>{
  e.preventDefault();

  const chars = getRandomArray(200, 0, Number(BASE_B)).map(a=>charI2B(BigInt(a)));
  const str = String.fromCodePoint(...chars);
  window.location = `view.html?c=${convertB2Coordinate(str)}`;
});

function getRandomArray(n, min, max) {
  const array = new Uint32Array(n); // 32비트 정수 사용 (더 정밀한 범위 분배 가능)
  window.crypto.getRandomValues(array);

  // 32비트 최대값(0xFFFFFFFF)으로 나누어 0~1 사이 값으로 변환 후 범위 적용
  return Array.from(array, (num) => {
    return Math.floor((num / 0xFFFFFFFF) * (max - min + 1)) + min;
  });
}
