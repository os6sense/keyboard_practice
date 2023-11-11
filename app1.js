
let score = 0;
const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const octave = 4;
let currentNote = '';

// This function will update the score on the webpage
function updateScore(value) {
  score += value;
  document.getElementById('score').textContent = score;
}

// Set up VexFlow
const VF = Vex.Flow;
const div = document.getElementById("staff");
const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
renderer.resize(500, 170);
const context = renderer.getContext();
const stave = new VF.Stave(10, 40, 400);
stave.addClef("treble").addTimeSignature("4/4");
stave.setContext(context).draw();

// Function to draw a random note on the stave
function drawNote() {
  // Clear previous note
  context.clear();
  stave.setContext(context).draw();

  // Generate a random note
  const randomIndex = Math.floor(Math.random() * notes.length);
  currentNote = notes[randomIndex] + '/' + octave;

  // Create a stave note
  const staveNote = new VF.StaveNote({
    clef: "treble",
    keys: [currentNote],
    duration: "q"
  });

  // Create a voice in 4/4 and add the note
  const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables([staveNote]);

  // Format and draw the note
  new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);
}

// React to keyboard input
document.addEventListener('keydown', (event) => {
  const keyName = event.key.toUpperCase();
  if (notes.includes(keyName)) {
    const inputNote = keyName + '/' + octave;
    console.log(`Key pressed: ${inputNote}`);
    // Compare the pressed key to the displayed note
    if (inputNote === currentNote) {
      updateScore(1);
    } else {
      updateScore(-1);
    }
    drawNote(); // Draw a new note
  }
});

drawNote(); // Draw the initial note

