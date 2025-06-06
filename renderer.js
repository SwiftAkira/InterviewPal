const audioSourceSelect = document.getElementById('audio-source');

async function getAudioSources() {
  console.log('Requesting audio sources...');
  const sources = await window.electronAPI.getAudioSources();
  console.log('Audio sources received:', sources);

  for (const source of sources) {
    const option = document.createElement('option');
    option.value = source.id;
    option.innerText = source.name;
    audioSourceSelect.appendChild(option);
  }
}

getAudioSources(); 