const vscode = require('vscode');
const fetch = require('node-fetch');

const myExtension = {
  sendInputToApi: function() {
    // Prompt the user for input
    vscode.window.showInputBox({ prompt: 'Enter message to send' }).then(input => {
      if (!input) {
        // If no input is provided, do nothing
        return;
      }

      // Create the data object
      const data = {
        text: input,
        key: '7271e3bd-ced0-4343-915f-ca1711ce4107',
        playerId: 'test',
        speak: true // DEFAULT FALSE | FOR VOICE OUTPUT
      };

      // Send the data to the API endpoint
      fetch('https://api.carterlabs.ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          // Display the response in the console
          console.log('Input:', data.input);
          console.log('Output Text:', data.output.text);

          data.forced_behaviours.forEach(fb => {
            console.log('Forced Behaviour:', fb.name);
          });
        })
        .catch(error => {
          console.error(error);
        });
    });
  }
};

function activate(context) {
  // Register the command
  let disposable = vscode.commands.registerCommand('extension.sendInputToApi', function () {
    myExtension.sendInputToApi();
  });

  // Add the command to the subscriptions
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
