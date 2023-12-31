export class VirtualPiano {
  constructor(containerId, startOctave = 4, octaves = 1) {
    this.containerId = containerId;
    this.startOctave = startOctave;
    this.octaves = octaves;
    this.mouseDownListener = (event) => this.onMouseDown(event);
    this.createKeyboard();
    this.attachEventListeners();
  }

  reset(startOctave = 2, octaves = 4) {
    this.startOctave = startOctave;
    this.octaves = octaves;
    this.removeEventListeners();
    this.createKeyboard();
    this.attachEventListeners();
  }

  createKeyboard() {
    const container = document.getElementById(this.containerId);
    container.innerHTML = ''; // Clear existing content

    // Create keys for the specified number of octaves
    for (let o = this.startOctave; o < this.startOctave + this.octaves; o++) {
      this.createOctave(container, o);
    }
  }

  createOctave(container, octave) {
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
    const octaveElem = document.createElement('div');
    octaveElem.className = 'octave';

    whiteKeys.forEach((key, index) => {
      const whiteKeyElem = document.createElement('div');
      whiteKeyElem.className = 'key white';
      whiteKeyElem.dataset.note = `${key}/${octave}`;
      whiteKeyElem.style.width = `26px`; 
      octaveElem.appendChild(whiteKeyElem);

      if (index < whiteKeys.length - 1 && !['E', 'B'].includes(key)) {
        const blackKeyElem = document.createElement('div');
        blackKeyElem.className = 'key black';
        blackKeyElem.dataset.note = `${blackKeys[index]}/${octave}`;
        blackKeyElem.style.left = `${(index + 1) * 26 - 6}px`; // Position black keys
        blackKeyElem.style.width = `14px`; 
        octaveElem.appendChild(blackKeyElem);
      }
    });

    container.appendChild(octaveElem);
  }

  attachEventListeners() {
    const container = document.getElementById(this.containerId);
    container.addEventListener('mousedown', this.mouseDownListener);
  }

  removeEventListeners() {
    const container = document.getElementById(this.containerId);
    container.removeEventListener('mousedown', this.mouseDownListener);
  }

  onMouseDown(event) {
    if (event.target.classList.contains('key')) {
      this.emitNoteEvent(event.target.dataset.note);
    }
  }

  emitNoteEvent(note) {
    const event = new CustomEvent('notePlayed', { detail: { note } });
    document.dispatchEvent(event);
  }
}
