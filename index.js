console.log("♟️ Shikamaru Bot está iniciando...");

const comandos = {
  menu: "¡Hola! Soy Shikamaru Bot. 🍃",
  ping: "¡Estoy activo! ♟️",
  botinfo: "Nombre: Shikamaru Bot\nVersión: 1.0.0",
  hug: "🤗 ¡Un abrazo para ti!",
  kiss: "😘 ¡Un besito!",
  pat: "🐱 *Acaricia suavemente*"
};

function ejecutarComando(texto) {
  if (!texto.startsWith("#")) {
    return null;
  }

  const nombre = texto.slice(1).trim().split(/\s+/)[0].toLowerCase();

  return comandos[nombre] || "No conozco ese comando. Escribe #menu";
}

console.log(ejecutarComando("#menu"));
console.log(ejecutarComando("#ping"));
