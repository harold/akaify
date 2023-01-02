function processFile(f) {
  const reader = new FileReader()
  reader.addEventListener("load", () => {
    let wav = new wavefile.WaveFile()
    wav.fromDataURI(reader.result)
    let samples = wav.getSamples(false, Int16Array)
    if(samples instanceof Int16Array){
      // Mono
      alert("Mono not supported, yet!")
    } else {
      // Stereo
      out = []
      for(let i=0; i<samples.length; i++) {
        let n = samples[i].length
        let a = new Array(n*2)
        let cursor = 0
        let bufferLength = 1000
        while(cursor < n) {
          for(let j=0; j<bufferLength; j++) {
            if(cursor+j<n) {
              a[(2*cursor)+j] = samples[i][cursor+j]
              a[(2*cursor)+j+bufferLength] = samples[i][cursor+j]
            }
          }
          cursor = cursor + bufferLength
        }
        out.push(a)
      }
      outwav = new wavefile.WaveFile()
      outwav.fromScratch(samples.length, wav.fmt.sampleRate, wav.bitDepth, out)
      let blob = new Blob([outwav.toBuffer()], {type: "audio/x-wav"});
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "out.wav";
      link.click();
    }
  }, false)
  reader.readAsDataURL(f)
}

function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault()

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === 'file') {
        const file = item.getAsFile()
        processFile(file)
      }
    })
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      processFile(file)
    })
  }
}

function dragOverHandler(ev) {
  ev.preventDefault()
}
