const audioSourceSelect = document.getElementById('audio-source');
const startButton = document.getElementById('start-recording');
let mediaRecorder;
let recordedChunks = [];

async function getAudioSources() {
  try {
    // Request permission to access media devices. This is required to get device labels.
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.error('Error getting media stream:', err);
    alert('Could not get microphone permission. Please allow microphone access in your system settings.');
    return;
  }

  console.log('Requesting audio sources...');
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
  console.log('Audio input devices found:', audioInputDevices);

  audioSourceSelect.innerHTML = '<option value="">Select an audio source</option>';

  for (const source of audioInputDevices) {
    const option = document.createElement('option');
    option.value = source.deviceId;
    option.innerText = source.label || `Device ${audioSourceSelect.length}`;
    audioSourceSelect.appendChild(option);
  }
}

getAudioSources();

startButton.onclick = async () => {
  if (startButton.innerText === 'Start Recording') {
    const sourceId = audioSourceSelect.value;
    if (!sourceId) {
      alert('Please select an audio source.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: sourceId }
      },
      video: false
    });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, {
        type: 'audio/webm; codecs=opus'
      });
      const buffer = await blob.arrayBuffer();
      recordedChunks = [];
      window.electronAPI.saveAudio(Buffer.from(buffer));
    };

    mediaRecorder.start();
    startButton.innerText = 'Stop Recording';
  } else {
    mediaRecorder.stop();
    startButton.innerText = 'Start Recording';
  }
}; 