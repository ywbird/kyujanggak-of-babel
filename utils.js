const ROOM_BASE = 1000n;
const WALL_BASE = 8n;
const SHELF_BASE = 4n;
const BOOK_BASE = 32n;
const PAGE_BASE = 1000n;

const MAX_BIT_SIZE = 2690n;

const MAX_LIMIT = 11177n ** 200n;

const ENC_KEYS = [
  48193n, 17509n, 94421n, 21577n, 16649n, 17827n, 89659n, 93427n,
  20479n, 68071n, 72053n, 98129n, 37799n, 78593n, 13711n, 23039n,
  85793n, 72911n, 56807n, 16603n, 23831n, 69127n, 97861n, 63761n,
  59077n, 17627n, 34703n, 16607n, 85297n, 19507n, 56099n, 49451n,
];

function hash1(R, key) {
  let h = R ^ key;
  
  h ^= h >> 16n;
  h *= 0x85ebca6bn;
  h ^= h >> 13n;
  h *= 0xc2b2ae35n;
  h ^= h >> 16n;
  
  return h;
}

function convertB2Coordinate(input) {
  let num = feistelCipher(convertB2I(input.padStart(200, " ")), hash1, ENC_KEYS, MAX_BIT_SIZE);
 
  const page = num % PAGE_BASE;
  num /= PAGE_BASE;
  const book = num % BOOK_BASE;
  num /= BOOK_BASE;
  const shelf = num % SHELF_BASE;
  num /= SHELF_BASE;
  const wall = num % WALL_BASE;
  num /= WALL_BASE;
  const room = num % ROOM_BASE;
  num /= ROOM_BASE;

  return `${convertI2A(num)}:${room}:${wall}:${shelf}:${book}:${page}`;
}

function convertCoordinate2B(input) {
  let [building, room, wall, shelf, book, page] = input.split(":");

  let num = convertA2I(building);
  num *= ROOM_BASE;
  num += BigInt(room);
  num *= WALL_BASE;
  num += BigInt(wall);
  num *= SHELF_BASE;
  num += BigInt(shelf);
  num *= BOOK_BASE;
  num += BigInt(book);
  num *= PAGE_BASE;
  num += BigInt(page);

  while (num >= MAX_LIMIT) {
    num = feistelCipher(num, hash1, ENC_KEYS, MAX_BIT_SIZE);
  }

  return convertI2B(feistelCipher(num, hash1, ENC_KEYS.toReversed(), MAX_BIT_SIZE)).padStart(200, " ");
}

function convertCoordinate2Title(input) {
  let [building, room, wall, shelf, book, page] = input.split(":");

  let num = convertA2I(building);
  num *= ROOM_BASE;
  num += BigInt(room);
  num *= WALL_BASE;
  num += BigInt(wall);
  num *= SHELF_BASE;
  num += BigInt(shelf);
  num *= BOOK_BASE;
  num += BigInt(book);

  return convertI2B(feistelCipher(num, hash1, ENC_KEYS.toReversed(), MAX_BIT_SIZE) % (11177n**25n)).padStart(200, " ");
}

function feistelCipher(input, func, keys, bitSize =  64n) {
  const digit = bitSize % 2n === 0n ? bitSize : bitSize + 1n;

  let half = 1n << (digit/2n);
  let mask = half - 1n;

  let R = input % half;
  let L = input / half;

  for (let i = 0; i < keys.length; i++) {
    const res = func(R, keys[i]) & mask;
    const tmpL = R;
    R = L ^ res;
    L = tmpL;
  }

  return (R * half) + L;
}

/*

인코딩 문자
  - "0-9A-Za-z가-힣"

  유니코드

  0  : 48      ]
  9  : 57      ]=> 10
  A  : 65      ]
  Z  : 90      ]=> 26
  a  : 97      ]
  z  : 122     ]=> 26
  가 : 44032   ]
  힣 : 55203   ]=> 11171

  순번
  0-9   : 0-9
  A-z   : 10-61
  가-힣 : 62-11232
*/
function convertA2I(str) {
  const base = BigInt(11234);

  let x = BigInt(0);

  for (let i = 0; i < str.length; i++) {
    x *= base;
    x += charA2I(str.codePointAt(i));
  }

  return x;
}

function convertI2A(num) {
  const base = BigInt(11234);

  const digits = [];

  while (num) {
    digits.push(charI2A(num % base));
    num /= base;
  }

  return String.fromCodePoint(...(digits.toReversed()));
}

function charA2I(codePoint) {
  if (48 <= codePoint && codePoint <= 57) { // 0 - 9
    return BigInt(codePoint-48);
  } else if (65 <= codePoint && codePoint <= 90) { // A - Z
    return BigInt(codePoint-65 + 10);
  } else if (97 <= codePoint && codePoint <= 122) { // a - z
    return BigInt(codePoint-97 + 36);
  } else if (44032 <= codePoint && codePoint <= 55203) { // 가 - 힣
    return BigInt(codePoint-44032 + 62);
  } 
  return null
}

function charI2A(num) {
  if (0n <= num && num <= 9n) { // 0 - 9
    return Number(num + 48n);
  } else if (10n <= num && num <= 35n) { // A - Z
    return Number(num + 65n - 10n);
  } else if (36n <= num && num <= 61n) { // a - z
    return Number(num + 97n - 36n);
  } else if (62n <= num && num <= 11233n) { // 가 - 힣
    return Number(num + 44032n - 62n);
  } 
  return null
}

/*
사용 가능한 글자들

  - "가-힣,.!? "

  유니코드
  가-힣  : 44032-55203
  ,      : 44
  .      : 46
  !      : 33
  ?      : 63
  ` `    : 32

  순번
  가-힣 : 0 11170
  ,     : 11171
  .     : 11172
  !     : 11173
  ?     : 11174
  ` `   : 11175

*/
function convertB2I(str) {
  const base = BigInt(11177);

  let x = BigInt(0);

  for (let i = 0; i < str.length; i++) {
    x *= base;
    const val = charB2I(str.codePointAt(i));
    if (val !== null) {
      x += val;
    }
  }

  return x;
}

function convertI2B(num) {
  const base = BigInt(11177);

  const digits = [];

  while (num) {
    digits.push(charI2B(num % base));
    num /= base;
  }

  return String.fromCodePoint(...(digits.toReversed()));
}

function charB2I(codePoint) {
  if (codePoint === 32) { // 띄어쓰기 (공백)
    return BigInt(0);
  } else if (codePoint === 33) { // !
    return BigInt(1);
  } else if (codePoint === 44) { // ,
    return BigInt(2);
  } else if (codePoint === 46) { // .
    return BigInt(3);
  } else if (codePoint === 63) { // ?
    return BigInt(4);
  } else if (44032 <= codePoint && codePoint <= 55203) { // 가 - 힣
    return BigInt(codePoint - 44032 + 5);
  } 
  return null;
}

function charI2B(num) {
  if (num === 0n) { // 띄어쓰기 (공백)
    return 32;
  } else if (num === 1n) { // !
    return 33;
  } else if (num === 2n) { // ,
    return 44;
  } else if (num === 3n) { // .
    return 46;
  } else if (num === 4n) { // ?
    return 63;
  } else if (5n <= num && num <= 11176n) { // 가 - 힣
    return Number(num + 44032n - 5n);
  } 
  return null;
}
