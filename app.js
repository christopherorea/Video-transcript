import { launch } from 'puppeteer';
import { writeFile } from "fs";


const url = process.argv[2];

(async () => {
  // Launch the browser and open a new blank page
  const browser = await launch({ 
    headless: true, 
    executablePath: 'C:/Users/c28_0/OneDrive/Documentos/Projects/KG-Neo4j/chrome/win64-118.0.5993.70/chrome-win64/chrome.exe' 
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  console.log('Opens youtube')
  await page.goto(url);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Opens button for options
  console.log('Opens options');
  const options = '#button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill';
  await page.waitForSelector(options, { timeout: 10000 });
  await page.click(options);

  // Opens transcript option
  //await page.screenshot({ path: 'check_for_transcript.png' })
  console.log('Opens transcript option');
  //await page.screenshot({ path: 'transcript_option.png' });
  const show = '#items > ytd-menu-service-item-renderer';
  await page.waitForSelector(show, { timeout: 10000 });
  await page.click(show);

  // Opens transcript text
  console.log('Activates transcript text');
  await page.evaluate(()=>{
    const loadTranscript = '#primary-button > ytd-button-renderer > yt-button-shape > button';
    document.querySelector(loadTranscript).click();
    window.scroll(0,0);
  });
  //await page.screenshot({ path: 'click.png' });

  // Reads transcription
  console.log('Reads transcript text');
  const transcriptDivs = 'ytd-transcript-segment-renderer';
  await page.waitForSelector(transcriptDivs, { timeout: 15000 });
  const content = await page.evaluate(() => {
    window.scroll(0,0);
    const transcript = document.querySelectorAll('ytd-transcript-segment-renderer');
    const content = Array.from(transcript).map(x => x.innerText);
    return content;
  });
  //await page.screenshot({ path: 'show_transcript.png' });

  // Create a file
  writeFile('output.txt', content.toString().replace(/,?[0-9]+:[0-9][0-9]/g, "").replace(/^\s*\n/gm, ""), (err) => {
    if (err) throw err;
  });

  await browser.close();
})();