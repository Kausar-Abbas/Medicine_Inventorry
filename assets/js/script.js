// Hamburger Menu and Sidebar Toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('sidebar-active');
  hamburger.classList.toggle('toggle');
  document.body.classList.toggle('no-scroll');
});




document.addEventListener('DOMContentLoaded', () => { 
  const form = document.getElementById('medicineForm');
  const newRecordBtn = document.getElementById('newRecordBtn');
  const medicineDropdown = document.getElementById('medicineDropdown');
  const medicineTableBody = document.querySelector('#medicineTable tbody');
  const downloadPDFButton = document.getElementById('downloadPDF');
  const loader = document.getElementById('loader');
  let currentFileName = '';

  const medicines = JSON.parse(localStorage.getItem('medicines')) || {};

  const renderMedicines = () => {
    medicineDropdown.innerHTML = '<option value="" disabled selected>Select a File</option>';
    for (const fileName in medicines) {
      const option = document.createElement('option');
      option.value = fileName;
      option.textContent = fileName;
      medicineDropdown.appendChild(option);
    }
    currentFileName = ''; // Reset current file name on page load
  };
  
  const renderTable = (fileName) => {
    const records = medicines[fileName] || [];
    medicineTableBody.innerHTML = '';
    records.forEach((medicine, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${medicine.name}</td>
        <td>${medicine.formula}</td>
        <td>${medicine.miligram}</td>
        <td>${medicine.quantity}</td>
        <td>${medicine.date}</td>
        <td><button onclick="editRecord('${fileName}', ${index})">Edit</button></td>
      `;
      medicineTableBody.appendChild(row);
    });
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  };

  newRecordBtn.addEventListener('click', () => {
    form.style.display = 'block';
    form.reset();
    document.getElementById('fileName').disabled = false;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileNameInput = document.getElementById('fileName').value;
    if (!fileNameInput) {
      showToast("Please enter a file name", "#2c2c2c", "error");
      return;
    }

    if (!currentFileName) {
      currentFileName = fileNameInput;
      document.getElementById('fileName').disabled = true;
    }

    const name = document.getElementById('name').value;
    const formula = document.getElementById('formula').value;
    const miligram = document.getElementById('miligram').value;
    const quantity = document.getElementById('quantity').value;
    const date = document.getElementById('date').value; // Date input

    if (!medicines[currentFileName]) {
      medicines[currentFileName] = [];
    }
    medicines[currentFileName].push({ name, formula, miligram, quantity, date });

    saveToLocalStorage();
    renderMedicines();
    renderTable(currentFileName);

    document.getElementById('name').value = '';
    document.getElementById('formula').value = '';
    document.getElementById('miligram').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('date').value = ''; // Reset date input
  });

  medicineDropdown.addEventListener('change', () => {
    currentFileName = medicineDropdown.value;
    renderTable(currentFileName);
    form.style.display = 'block';
    document.getElementById('fileName').value = currentFileName;
    document.getElementById('fileName').disabled = true;
  });

  downloadPDFButton.addEventListener('click', () => {
    const selectedFileName = medicineDropdown.value;
    if (!selectedFileName) {
      showToast("Please select a file first", "#2c2c2c", "error");
      return;
    }

    // Show the loader
    loader.style.display = 'flex';

    const records = medicines[selectedFileName] || [];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(16);
    doc.text('Al-Noor Medical Store', 105, 20, null, null, 'center');

    // Get the current date in "Month Day, Year" format
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Add the date to the PDF
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 105, 30, null, null, 'center');

    doc.text(`File name: ${selectedFileName}`, 105, 38, null, null, 'center');

    doc.line(20, 43, 190, 43);

    // Table Headers
    doc.setFontSize(10);
    doc.text('Sr#', 25, 50);
    doc.text('Name', 50, 50);
    doc.text('Formula', 90, 50);
    doc.text('Milligrams', 130, 50);
    doc.text('Quantity', 170, 50);
    doc.line(20, 55, 190, 55);

    let yPosition = 60;
    records.forEach((medicine, index) => {
      doc.text(String(index + 1), 25, yPosition);
      doc.text(medicine.name, 50, yPosition);
      doc.text(medicine.formula, 90, yPosition);
      doc.text(medicine.miligram, 130, yPosition);
      doc.text(medicine.quantity, 170, yPosition);
      yPosition += 10;

      doc.line(20, yPosition - 5, 190, yPosition - 5);
    });

    // Simulate download delay
    setTimeout(() => {
      // Save the PDF with the date prepended to the file name
      const formattedDateForFileName = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
      doc.save(`${formattedDateForFileName}_${selectedFileName}.pdf`);
      // Hide the loader after download
      showToast("Downloaded Duccessfully", "#2c2c2c", "success");
      loader.style.display = 'none';
    }, 2000); // Adjust delay time as needed
  });

  window.editRecord = (fileName, index) => {
    const medicine = medicines[fileName][index];
    document.getElementById('fileName').value = fileName;
    document.getElementById('name').value = medicine.name;
    document.getElementById('formula').value = medicine.formula;
    document.getElementById('miligram').value = medicine.miligram;
    document.getElementById('quantity').value = medicine.quantity;
    document.getElementById('date').value = medicine.date; // Set date value

    medicines[fileName].splice(index, 1);
    saveToLocalStorage();
    renderTable(fileName);
  };

  renderMedicines();
});

window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').style.display = 'none';
  }, 1000); 
});

// Toastify function with animated bottom line and custom positioning
function showToast(message, background, type) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "center",
    style: {
      background: background,
      top: "60%",
    },
    className: `toast-with-timer ${type}`,
    onClick: function () { }
  }).showToast();
}
