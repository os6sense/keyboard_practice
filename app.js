let score = 0;
let inputMode = 'midi'; // 'keyboard' or 'midi'
const trebleNotes = ['C/4', 'D/4', 'E/4', 'F/4', 'G/4', 'A/4', 'B/4', 'C/5', 'D/5', 'E/5', 'F/5', 'G/5', 'A/5', 'B/5', 'C/6'];
const bassNotes = ['C/2', 'D/2', 'E/2', 'F/2', 'G/2', 'A/2', 'B/2', 'C/3', 'D/3', 'E/3', 'F/3', 'G/3', 'A/3', 'B/3', 'C/4'];
let currentNote, currentClef;

// Function to update the score
function updateScore(value) {
  score += value;
  document.getElementById('score').textContent = score;
}

// Set up VexFlow for both treble and bass staves
const VF = Vex.Flow;
const trebleDiv = document.getElementById("treble-staff");
const bassDiv = document.getElementById("bass-staff");
const trebleRenderer = new VF.Renderer(trebleDiv, VF.Renderer.Backends.SVG);
const bassRenderer = new VF.Renderer(bassDiv, VF.Renderer.Backends.SVG);
trebleRenderer.resize(500, 150);
bassRenderer.resize(500, 150);
const trebleContext = trebleRenderer.getContext();
const bassContext = bassRenderer.getContext();
const trebleStave = new VF.Stave(10, 40, 450).addClef("treble").setContext(trebleContext).draw();
const bassStave = new VF.Stave(10, 40, 450).addClef("bass").setContext(bassContext).draw();

// Draw a random note on the appropriate stave and display its name
function drawNote() {
  // Clear previous notes
  trebleContext.clear();
  bassContext.clear();
  trebleStave.setContext(trebleContext).draw();
  bassStave.setContext(bassContext).draw();

  // Determine clef and generate a random note
  currentClef = Math.random() < 0.5 ? "treble" : "bass";
  const noteArray = currentClef === "treble" ? trebleNotes : bassNotes;
  const randomIndex = Math.floor(Math.random() * noteArray.length);
  currentNote = noteArray[randomIndex];

  // Display the note name
  document.getElementById('noteName').textContent = currentNote;

  // Create a stave note for the appropriate clef
  const staveNote = new VF.StaveNote({
    clef: currentClef,
    keys: [currentNote],
    duration: "q"
  });

  // Create a voice in 4/4 and add the note
  const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables([staveNote]);

  // Format and draw the note
  const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(currentClef === "treble" ? trebleContext : bassContext, currentClef === "treble" ? trebleStave : bassStave);
}

// MIDI Setup
function setupMIDI() {
  WebMidi.enable((err) => {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
      return;
    }
    console.log("WebMidi enabled!");

    if (WebMidi.inputs.length > 0) {
      const input = WebMidi.inputs[0];
      input.addListener('noteon', "all", (e) => {
        if (inputMode === 'midi') {
          const midiNote = e.note.name + '/' + e.note.octave;
          checkNoteInput(midiNote);
        }
      });
    }
  });
}

// Check note input against the current note
function checkNoteInput(inputNote) {
  console.log(`Note input: ${inputNote}`);
  if (inputNote === currentNote) {
    updateScore(1);
  } else {
    updateScore(-1);
  }
  drawNote(); // Draw a new note
}



// React to keyboard input
document.addEventListener('keydown', (event) => {
  if (inputMode === 'keyboard') {
    const keyName = event.key.toUpperCase();
    // Map QWERTY keys to notes if needed
    const inputNote = mapKeyToNote(keyName); // Implement this function based on your key-to-note mapping
    if (inputNote) {
      checkNoteInput(inputNote);
    }
  }
});

// Function to switch between input modes
function switchInputMode(mode) {
  inputMode = mode; // 'keyboard' or 'midi'
  console.log(`Switched to ${mode} input mode.`);
}

// Call this function to set up MIDI when you're ready to use MIDI input
// setupMIDI();

// Initial note draw
drawNote();

// Utility function for mapping QWERTY keys to musical notes
function mapKeyToNote(key) {
  // This is a simple mapping, you may want to expand it based on your needs
  const keyToNoteMap = {
    'A': 'C/4', 'W': 'C#/4', 'S': 'D/4', // ... and so on for each key you want to map
  };
  return keyToNoteMap[key];
}






