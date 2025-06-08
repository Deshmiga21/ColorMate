function generatePalette() {
  const baseColor = document.getElementById("base-color").value;
  const harmony = document.getElementById("harmony-select").value;
  const container = document.getElementById("palette-container");
  container.innerHTML = "";

  let colors;

  switch (harmony) {
    case "analogous":
      colors = chroma.scale([
        chroma(baseColor).set('hsl.h', '+30'),
        baseColor,
        chroma(baseColor).set('hsl.h', '-30')
      ]).colors(5);
      break;
    case "complement":
      colors = [baseColor, chroma(baseColor).set('hsl.h', '+180').hex()];
      break;
    case "triad":
      colors = chroma.scale([
        baseColor,
        chroma(baseColor).set('hsl.h', '+120'),
        chroma(baseColor).set('hsl.h', '+240')
      ]).colors(3);
      break;
    case "monochromatic":
      colors = chroma.scale([
        chroma(baseColor).brighten(2),
        baseColor,
        chroma(baseColor).darken(2)
      ]).colors(5);
      break;
    default:
      colors = [baseColor];
  }

  colors.forEach(hex => {
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.background = hex;
    box.textContent = hex;
    box.addEventListener("click", () => copyToClipboard(hex));
    container.appendChild(box);
  });

  updatePreview(colors[0]);
}

function updatePreview(color) {
  const btn = document.getElementById("preview-btn");
  const txt = document.getElementById("preview-text");
  btn.style.background = color;
  txt.style.color = color;
}

function copyToClipboard(hex) {
  navigator.clipboard.writeText(hex);
  alert(`Copied ${hex} to clipboard!`);
}

document.addEventListener("DOMContentLoaded", generatePalette);
function downloadAsImage() {
  html2canvas(document.getElementById("palette-container")).then(canvas => {
    const link = document.createElement("a");
    link.download = "color-palette.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function downloadAsJSON() {
  const boxes = document.querySelectorAll(".color-box");
  const colors = Array.from(boxes).map(box => box.textContent);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colors, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "color-palette.json");
  dlAnchor.click();
}
