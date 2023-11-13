export class VirtualPiano {
  constructor(containerId, startOctave = 3, octaves = 2) {
    this.startOctave = startOctave;
    this.containerId = containerId;
    this.octaves = octaves;
    this.keys = [];
    this.createKeyboard();
    this.attachEventListeners();
  }

  createKeyboard() {
  const container = document.getElementById(this.containerId);
  container.innerHTML = ''; // Clear existing content
  container.classList.add('piano'); // Ensure the container has the flexbox class

  // Create a flex container for all octaves
  const allOctavesContainer = document.createElement('div');
  allOctavesContainer.classList.add('all-octaves');
  
  for (let o = 0; o < this.octaves; o++) {
    this.createOctave(allOctavesContainer, o);
  }

  container.appendChild(allOctavesContainer); // Add all octaves to the main container
}
  createOctave(container, octave) {
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
    const octaveElem = document.createElement('div');
    octaveElem.className = 'octave';

    whiteKeys.forEach((key, index) => {
      const whiteKeyElem = document.createElement('div');
      whiteKeyElem.className = 'key white';
      whiteKeyElem.dataset.note = `${key}/${this.startOctave + octave}`;
      octaveElem.appendChild(whiteKeyElem);

      if (index < whiteKeys.length - 1 && !['E', 'B'].includes(key)) {
        const blackKeyElem = document.createElement('div');
        blackKeyElem.className = 'key black';
        blackKeyElem.dataset.note = `${blackKeys[index]}/${this.startOctave + octave}`;
        blackKeyElem.style.left = `${(index + 1) * 40 - 10}px`; // Position black keys
        octaveElem.appendChild(blackKeyElem);
      }
    });

    container.appendChild(octaveElem);
  }

  attachEventListeners() {
    const container = document.getElementById(this.containerId);
    container.addEventListener('mousedown', (event) => {
      if (event.target.classList.contains('key')) {
        this.emitNoteEvent(event.target.dataset.note);
      }
    });

    // Map keyboard to piano keys
    const keyMap = {
      'KeyA': 'C', 'KeyW': 'C#', 'KeyS': 'D', 'KeyE': 'D#',
      'KeyD': 'E', 'KeyF': 'F', 'KeyT': 'F#', 'KeyG': 'G',
      'KeyY': 'G#', 'KeyH': 'A', 'KeyU': 'A#', 'KeyJ': 'B'
    };

    document.addEventListener('keydown', (event) => {
      if (keyMap[event.code]) {
        this.emitNoteEvent(keyMap[event.code]);
      }
    });
  }

  emitNoteEvent(note) {
    const event = new CustomEvent('notePlayed', { detail: { note } });
    document.dispatchEvent(event);
  }
}
