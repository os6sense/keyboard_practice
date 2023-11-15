//import { WebMidi } from 'webmidi';

export class MidiStatusIndicator {
  constructor(parentElementId) {
    this.parentElement = document.getElementById(parentElementId);
    this.statusLightElement = null;
    this.initialize();
  }

  initialize() {
    this.render();
  }

  render() {
    // Inject the HTML structure
    this.parentElement.innerHTML = `
      <div class="midi-status">midi status: <span id="midi-status-light"></span></div>
    `;

    // Apply the CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .midi-status {
        padding: 10px;
        margin: 10px 0;
        display: inline-block;
        background-color: #eee;
        border: 1px solid #ddd;
      }

      #midi-status-light {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
        background-color: red; /* Default to red */
      }

      .midi-connected #midi-status-light {
        background-color: green;
      }
    `;
    document.head.appendChild(style);

    // Cache the status light element for future updates
    this.statusLightElement = document.getElementById('midi-status-light');
  }

  setupMIDI(checkNoteInputCallback) {
    import('webmidi').then(({ WebMidi }) => {

      WebMidi.enable((err) => {
        if (err) {
          console.log("WebMidi could not be enabled.", err);
          this.updateStatus('RED');
          return;
        }
        console.log("WebMidi enabled!");
        this.updateStatus(WebMidi.inputs.length > 0 ? 'GREEN' : 'RED');

        if (WebMidi.inputs.length > 0) {
          const input = WebMidi.inputs[0];
          input.addListener('noteon', "all", (e) => {
            if (inputMode === 'midi') {
              const midiNote = e.note.name + '/' + e.note.octave;
                checkNoteInputCallback(midiNote);
            }
          });
        }
        // Handle MIDI inputs if available
        //WebMidi.inputs.forEach((input) => {
          //input.addListener('noteon', "all", (e) => {
            //const midiNote = e.note.name + '/' + e.note.octave;
            //checkNoteInputCallback(midiNote);
          //});
        //});

        // Update status on device connection and disconnection
        WebMidi.addListener('connected', (e) => {
          if (e.port.type === "input" || e.port.type === "output") {
            this.updateStatus('GREEN');
          }
        });

        WebMidi.addListener('disconnected', (e) => {
          if (WebMidi.inputs.length === 0 && WebMidi.outputs.length === 0) {
            this.updateStatus('RED');
          }
        });
      });
    });
  }

  updateStatus(color) {
    if (this.statusLightElement) {
      this.statusLightElement.style.backgroundColor = color.toLowerCase();
    }
  }
}
