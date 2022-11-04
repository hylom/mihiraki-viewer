export function formatPageUrl(formatString, page) {
  const rex = /\%(\d*)d/;
  const m = rex.exec(formatString);
  if (!m) {
    return formatString;
  }
  let replace = page;
  if (m[1]) {
    if (m[1].startsWith('0')) {
      // zero padding mode
      const padLen = Number(m[1]);
      replace = pad(padLen, '0', page);
    }
  }
  return formatString.replace(rex, replace);
}

function pad(length, char, val) {
  const s = `${val}`;
  const rest = length - s.len;
  if (rest > 0) {
    return `${char.repeat(rest)}${s}`;
  }
  return s;
}
