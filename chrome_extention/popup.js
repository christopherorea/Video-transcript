document.getElementById('downloadBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: downloadTranscript
  });
});


async function downloadTranscript() {

  async function waitForSelector(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      let elapsed = 0;
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        } else if (elapsed >= timeout) {
          clearInterval(interval);
          reject(new Error(`Timeout waiting for selector: ${selector}`));
        }
        elapsed += 100; // Incrementa el tiempo transcurrido

      }, 100);
    });
  }

  try {
    // Abre el menú de opciones
    const optionsButton = await waitForSelector('#expand');  // Selector más robusto
    optionsButton.click();

    // Abre la opción de transcripción (si es necesario)
    const transcriptOption = await waitForSelector('#primary-button > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill'); // Selector más específico

    if (transcriptOption) {
      transcriptOption.click();
    }


    // Lee la transcripción
    const transcriptDivs = 'ytd-transcript-segment-renderer';
    await waitForSelector(transcriptDivs, 15000); // Aumenta el tiempo de espera si es necesario
    const content = Array.from(document.querySelectorAll(transcriptDivs)).map(x => x.innerText);

    const url = window.location.href;
    const filename = `${url.split('=')[1] || 'transcript'}.txt`; // Maneja casos donde no hay ID de video
    const text = url + "\n\n" + content.join('\n\n').replace(/,?[0-9]+:[0-9][0-9]/g, "").replace(/^\s*\n/gm, "");

    // Descarga el archivo
    const a = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();


  } catch (error) {
    console.error("Error al descargar la transcripción:", error);
    alert("Error al descargar la transcripción. Revisa la consola para más detalles.");
  }
}