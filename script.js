document.addEventListener('DOMContentLoaded', () => {
    const h1Element = document.getElementById('dynamic-text');
    const container = document.querySelector('.container');
    const button = document.getElementById('change-bg-btn');
    const fileInput = document.getElementById('file-input');
    const colorPicker = document.getElementById('text-color-picker');
    const backgroundElement = container.querySelector('.background');

    // Function to get the computed background color
    function getBackgroundColor() {
        const computedStyle = window.getComputedStyle(backgroundElement);
        return computedStyle.backgroundColor;
    }

    // Function to determine if the color is dark
    function isColorDark(color) {
        const rgb = color.match(/\d+/g).map(Number);
        const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
        return brightness < 128;
    }

    // Function to generate a contrasting color
    function generateContrastingColor(color) {
        const rgb = color.match(/\d+/g).map(Number);
        const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
        return brightness < 128 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    }

    // Function to update the text shadow based on background color
    function updateTextShadow() {
        const bgColor = getBackgroundColor();
        const hintColor = generateContrastingColor(bgColor);
        const shadowColor = isColorDark(bgColor) ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        h1Element.style.color = hintColor; // Set the text color to contrast with the background
        h1Element.style.textShadow = `2px 2px 4px ${shadowColor}`; // Subtle shadow to enhance readability
    }

    // Function to change background image
    function changeBackground(imageUrl) {
        backgroundElement.style.backgroundImage = `url('${imageUrl}')`;
        localStorage.setItem('backgroundImage', imageUrl); // Save to local storage
        backgroundElement.onload = updateTextShadow; // Update text shadow when background image loads
        // Handle case when background image is cached
        if (backgroundElement.complete) {
            updateTextShadow();
        }
    }

    // Function to handle file input change
    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                changeBackground(e.target.result); // Use the uploaded image URL
            };
            reader.readAsDataURL(file);
        }
    }

    // Event listener for the button
    button.addEventListener('click', () => {
        fileInput.click(); // Trigger file input when button is clicked
    });

    // Event listener for file input change
    fileInput.addEventListener('change', handleFileInput);

    // Retrieve and apply the saved background image on page load
    const savedBackgroundImage = localStorage.getItem('backgroundImage');
    if (savedBackgroundImage) {
        changeBackground(savedBackgroundImage);
    } else {
        // Initial update if no saved background image
        updateTextShadow();
    }

    // Handle text color change
    colorPicker.addEventListener('input', (event) => {
        const color = event.target.value;
        document.documentElement.style.setProperty('--text-color', color);
        updateTextShadow();
    });

    // Event listener for the button to toggle color picker
    button.addEventListener('dblclick', () => {
        colorPicker.style.display = colorPicker.style.display === 'none' ? 'block' : 'none';
    });

    function updateTextShadow() {
        // Get all elements that you want to apply text shadow to
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td');

        // Iterate through each element and apply the text shadow
        elements.forEach(element => {
            const bgColor = getBackgroundColor(); // Get background color of the element (you may need to adjust this function based on your implementation)
            const hintColor = generateContrastingColor(bgColor); // Generate contrasting color for text

            // Determine shadow color based on background color
            const shadowColor = isColorDark(bgColor) ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

            // Apply styles to current element
            element.style.color = hintColor; // Set text color
            element.style.textShadow = `2px 2px 4px ${shadowColor}`; // Set text shadow
        });
    }
});
