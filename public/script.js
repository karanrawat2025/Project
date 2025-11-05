document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        feedback: document.getElementById('feedback').value
    };

    const response = await fetch('/submit-feedback', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    const result = await response.json();

    // Show Thank You overlay
    const overlay = document.getElementById('thankYouOverlay');
    overlay.classList.add('show');

    // Hide overlay after 3 seconds
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 3000);

    // Reset the form
    document.getElementById('feedbackForm').reset();
});
