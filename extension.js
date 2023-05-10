const vscode = require('vscode');
const fetch = require('node-fetch');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.sendInputToApi', function () {
    const panel = vscode.window.createWebviewPanel(
      'sendInputToApi',
      'Send Input to API',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    // Set the HTML content of the panel
    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Send Input to API</title>
    </head>
    <body>
      <input type="text" id="input" placeholder="Enter message to send">
      <button id="send">Send</button>
      <div id="output"></div>
      <script>
        const button = document.getElementById('send');
        const input = document.getElementById('input');
        const output = document.getElementById('output');

        button.addEventListener('click', () => {
          const data = {
            text: input.value,
            key: '7271e3bd-ced0-4343-915f-ca1711ce4107',
            playerId: 'test',
            speak: true // DEFAULT FALSE | FOR VOICE OUTPUT
          };

          fetch('https://api.carterlabs.ai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then(response => response.json())
            .then(data => {
              output.innerHTML += \`
                <p>Input: \${data.input}</p>
                <p>Output Text: \${data.output.text}</p>
              \`;
              data.forced_behaviours.forEach(fb => {
                output.innerHTML += \`<p>Forced Behaviour: \${fb.name}</p>\`;
              });
            })
            .catch(error => {
              output.innerHTML += \`<p>Error: \${error.message}</p> <>\`;
            });
        });
      </script>
    </body>
    </html>
  `;


    // Add the panel to the subscriptions
    context.subscriptions.push(panel);
  });
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
