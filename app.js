import './virtpiano/piano.css';
import { MidiStatusIndicator } from './midi.js';

import { VirtualPiano } from './virtpiano/keyboard';
import { Vex, Stave, StaveNote, Formatter } from "vexflow";

// Set up VexFlow for both treble and bass staves
const VF = Vex.Flow;

let score = 0;
let inputMode = 'midi'; // 'keyboard' or 'midi'

// Function to update the score
function updateScore(value) {
  score += value;
  document.getElementById('score').textContent = score;
}

// Represent which clefs we want displayed
class Mode {
  static TREBLE_CLEF_ONLY = 'treble_clef_only'
  static BASS_CLEF_ONLY = 'bass_clef_only'
  static BASS_AND_TREBLE_CLEF = 'bass_and_treble_clef'
};

// Represent which clefs we want displayed
class StaveTypes {
  static TREBLE_CLEF = 'treble'
  static BASS_CLEF = 'bass'
};

class Options {
  constructor(mode, octaves, darkMode ) {
    this.mode = mode || Mode.TREBLE_CLEF_ONLY
    this.octaves = octaves || 2
    this.enableDarkMode = darkMode || false
  }
}

class MyNote {
  constructor(type, octaves) {
    this.type = type;
    this.octaves = octaves;
    this.baseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  }

  getNote() {
    const min = this.type === "treble" ? 4 : 4 - this.octaves;
    const max = this.type === "treble" ? 3 + this.octaves : 3;

    let octave = Math.floor(Math.random() * (max - min + 1)) + min;

    const randomIndex = Math.floor(Math.random() * this.baseNotes.length);
    let currentNote = this.baseNotes[randomIndex];
    return `${currentNote}/${octave}`
  }
}

class MyStave {
  constructor(type) {
    this.type = type || "treble"
    this.div = document.getElementById(this.type + "-staff");
    this.renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG);
    this.renderer.resize(500, 190)
    this.context = this.renderer.getContext();
    this.stave = new VF.Stave(10, 40, 450).addClef(this.type).setContext(this.context).draw();
  }

  drawNote(options) {
    let myNote = new MyNote(this.type, options.octaves)

    this.context.clear();
    this.stave.setContext(this.context).draw();

    this.currentNote = myNote.getNote()

    // Display the note name
    document.getElementById(`${this.type}-note`).textContent = this.currentNote;

    // Create a stave note for the appropriate clef
    const staveNote = new VF.StaveNote({
      clef: this.type,
      keys: [this.currentNote],
      duration: "q"
    });

    // Create a voice in 4/4 and add the note
    const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables([staveNote]);

    // Format and draw the note
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(this.context, this.stave);
  }
}

const BassStave = new MyStave("bass")
const TrebleStave = new MyStave("treble")
const options = new Options(Mode.TREBLE_CLEF_ONLY, 1)

TrebleStave.drawNote(options)
BassStave.drawNote(options)

// MIDI Setup
//function setupMIDI() {
  //WebMidi.enable((err) => {
    //if (err) {
      //console.log("WebMidi could not be enabled.", err);
      //return;
    //}
    //console.log("WebMidi enabled!");

    //if (WebMidi.inputs.length > 0) {
      //const input = WebMidi.inputs[0];
      //input.addListener('noteon', "all", (e) => {
        //if (inputMode === 'midi') {
          //const midiNote = e.note.name + '/' + e.note.octave;
          //checkNoteInput(midiNote);
        //}
      //});
    //}
  //});
//}

// Check note input against the current note
function checkNoteInput(inputNote) {
  let octave = parseInt(inputNote[inputNote.length - 1])
  let stave = TrebleStave

  if (octave < 4) {
    stave = BassStave
  }

  let currentNote = stave.currentNote
  console.log(`Note input: ${inputNote}`);
  if (inputNote === currentNote) {
    updateScore(1);
  } else {
    updateScore(-1);
  }
  stave.drawNote(options); // Draw a new note
}

// Call this function to set up MIDI when you're ready to use MIDI input
//
const midiStatus = new MidiStatusIndicator('midi-status-container');
midiStatus.setupMIDI(checkNoteInput);
//setupMIDI();

// note we need an update method
let piano = new VirtualPiano('piano-container', 4, 1); 

// Listen for the custom 'notePlayed' event
document.addEventListener('notePlayed', (event) => {
  console.log('Note played:', event.detail.note);
  checkNoteInput(event.detail.note);
});

document.querySelectorAll('input[name="radio-option"]').forEach((radio) => {
  radio.addEventListener('change', onStaveOptionChange);
});

function onStaveOptionChange(event) {
  const value = event.target.value;
  switch (value) {
    case 'treble_clef_only':
      // Code to display only the treble clef
      document.getElementById('treble-staff').style.display = 'block';
      document.getElementById('bass-staff').style.display = 'none';
      document.getElementById('bass-note').style.display = 'none';
      document.getElementById('treble-note').style.display = 'block';
      piano.reset(4,1)
      break;
    case 'bass_clef_only':
      // Code to display only the bass clef
      document.getElementById('treble-staff').style.display = 'none';
      document.getElementById('treble-note').style.display = 'none';
      document.getElementById('bass-staff').style.display = 'block';
      document.getElementById('bass-note').style.display = 'block';
      piano.reset(3,1)
      break;
    case 'bass_and_treble_clef':
      // Code to display both the treble and bass clefs
      document.getElementById('treble-staff').style.display = 'block';
      document.getElementById('bass-staff').style.display = 'block';
      document.getElementById('treble-note').style.display = 'block';
      document.getElementById('bass-note').style.display = 'block';
      piano.reset(3,2)
      break;
  }
}
