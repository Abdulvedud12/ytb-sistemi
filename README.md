# YTB Online Application System

A modern web application for the Presidency for Turks Abroad and Related Communities (YTB) that allows users to apply for various programs and scholarships.

## Features

- Modern and responsive design
- User-friendly application form
- Multi-language support (English/Turkish)
- Real-time form validation
- Smooth scrolling navigation
- Mobile-friendly interface
- Notification system for user feedback

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of HTML, CSS, and JavaScript
- Web server (local or hosted)

## Setup

1. Clone the repository or download the files:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd ytb-application-system
```

3. Set up a web server:
   - You can use any web server of your choice
   - For local development, you can use Python's built-in server:
     ```bash
     python -m http.server 8000
     ```
   - Or use Node.js's `http-server`:
     ```bash
     npx http-server
     ```

4. Open your browser and navigate to:
   - If using Python: `http://localhost:8000`
   - If using http-server: `http://localhost:8080`

## Project Structure

```
ytb-application-system/
├── index.html          # Main HTML file
├── style.css          # Styles and layout
├── script.js          # JavaScript functionality
├── README.md          # Project documentation
└── assets/           # Images and other assets
    └── ytb-logo.png  # YTB logo
```

## Customization

### Adding New Programs

To add new programs to the application form:

1. Open `index.html`
2. Locate the program selection dropdown
3. Add new options following the existing format:
```html
<option value="new-program">New Program Name</option>
```

### Modifying Styles

The application uses CSS variables for consistent theming. To modify the color scheme:

1. Open `style.css`
2. Locate the `:root` section
3. Modify the color variables as needed:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

## API Integration

The current version uses a simulated API call. To integrate with a real API:

1. Open `script.js`
2. Locate the `simulateApiCall` function
3. Replace it with your actual API endpoint:
```javascript
async function handleFormSubmit(event) {
    // ... existing code ...
    
    const response = await fetch('your-api-endpoint', {
        method: 'POST',
        body: formData
    });
    
    // Handle the response
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or concerns, please contact:
- Email: [contact@ytb.gov.tr](mailto:contact@ytb.gov.tr)
- Website: [https://www.ytb.gov.tr](https://www.ytb.gov.tr)

## Acknowledgments

- YTB (Presidency for Turks Abroad and Related Communities)
- Font Awesome for icons
- Google Fonts for the Roboto font family #   y t b - s i s t e m i  
 