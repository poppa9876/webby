document.addEventListener('DOMContentLoaded', function() {
    const rollNoSelect = document.getElementById('rollNo');
    for (let i = 1; i <= 60; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        rollNoSelect.appendChild(option);
    }
});

document.getElementById('projectForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const rollNo = document.getElementById('rollNo').value;
    const projectName = document.getElementById('projectName').value;

    const data = { name, rollNo, projectName };

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        if (data.success) {
            resultDiv.textContent = 'Data submitted successfully!';
        } else {
            resultDiv.textContent = 'Submission failed: ' + data.error;
        }
    })
    .catch(error => {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = 'An error occurred: ' + error.message;
    });
});
