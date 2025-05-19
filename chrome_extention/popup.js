document.addEventListener('DOMContentLoaded', async () => {
    const summaryDiv = document.getElementById('summary');
    const urlDiv = document.getElementById('url');

    chrome.storage.sync.get(['summary', 'url']).then(result => {
        if (result.summary) {
            summaryDiv.textContent = result.summary;
            urlDiv.href = result.url;
            urlDiv.textContent = result.url;
        }
    });
});

document.getElementById('downloadBtn').addEventListener('click', async () => {

  const summaryDiv = document.getElementById('summary');
  const urlDiv = document.getElementById('url');

  summaryDiv.textContent = 'Cargando...'; // Mensaje de carga
  urlDiv.textContent = ''; // Limpiar la URL anterior
  const errorMessageDiv = document.getElementById('error-message');
  let apiKey = null;  // Inicializa la variable apiKey

  if (chrome.storage.sync.get(['apiKey'], (result) => {
    if (result.apiKey) {  // Si la clave API ya está almacenada, no hacemos nada
      apiKey = result.apiKey;
    } else {
      // Si no hay clave API almacenada, solicitamos al usuario que la ingrese
      apiKey = prompt("Por favor, ingresa tu clave API de Gemini:");  // Cambia el mensaje según sea necesario   
      if (apiKey) {
        chrome.storage.sync.set({ apiKey: apiKey }, () => {
          console.log("API key saved:", apiKey);
        });
      } else {
        alert("No se proporcionó ninguna clave API. La transcripción no se descargará.");
        return;
      }
    }
  }));

  // Función para mostrar mensajes de error
  function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    summaryDiv.textContent = ''; // Limpiar cualquier resumen anterior
  }

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: downloadTranscript,
    args: [apiKey]
  }, (injectionResults)=> {
    if (chrome.runtime.lastError) {
          displayError(`Error al inyectar script: ${chrome.runtime.lastError.message}`);
          return;
        }
      if (injectionResults && injectionResults[0] && injectionResults[0].result) {
        const { summary, url } = injectionResults[0].result;
        summaryDiv.textContent = summary;
        urlDiv.href = result.url;
        urlDiv.textContent = result.url;

        chrome.storage.sync.set({ summary: summary, url: url }, () => {
          console.log("Summary and URL saved:");
        });
      }
  });
});


async function downloadTranscript(apiKey) {

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
    const text = content.join('\n\n').replace(/,?[0-9]+:[0-9][0-9]/g, "").replace(/^\s*\n/gm, "");

    // Resume el texto usando la API de Gemini

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": [
          {
            "parts": [
              {
                "text": "Genera un resumen de la siguiente transcripción de YouTube:\n\n" + text,
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;

    //Descarga el archivo de texto
    const a = document.createElement('a');
    const file = new Blob([data.candidates[0].content.parts[0].text], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    return {summary: summary, url: url}; // Devuelve el resumen y la URL


  } catch (error) {
    console.error("Error al descargar la transcripción:", error);
    alert("Error al descargar la transcripción. Revisa la consola para más detalles.");
  }
}