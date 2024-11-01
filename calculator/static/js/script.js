const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to the remaining screen space (after color palette)
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.color-palette').offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // Initial sizing

let painting = false;
let currentColor = 'black';
let generatedText = "";  // Variable to store the generated text

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(e.clientX, e.clientY - document.querySelector('.color-palette').offsetHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY - document.querySelector('.color-palette').offsetHeight);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

async function sendToBackend() {
    const canvas = document.getElementById('whiteboard');
    let imageData = canvas.toDataURL();
    imageData = imageData.replace(/^data:image\/(png|jpg);base64,/, '');

    const response = await fetch('/process-whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
    });

    const result = await response.json();

    // Store the result in the variable
    generatedText = result.message;
    
    // Show overlay if needed
    document.getElementById('response-overlay').style.display = 'block';
}

// Only bind `sendToBackend` to the send button
document.getElementById('send-btn').addEventListener('click', sendToBackend);

// Color selection and clear functionality
document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentColor = button.getAttribute('data-color');
    });
});

document.getElementById('clear-btn').addEventListener('click', () => {
    location.reload();
});

// Print result button logic (only draws on canvas when this button is clicked)
document.getElementById('print-result-btn').addEventListener('click', () => {
    // Draw the stored response message onto the canvas
    ctx.font = '20px Cambria Math';
    ctx.fillStyle = 'white';
    ctx.fillText(generatedText, 50, 50);  // Adjust position (x, y) as needed
});
