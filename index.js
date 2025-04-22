document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const tbody = document.querySelector("tbody");
    let confirmMessage="The student is already present. Do you want to update the details?";

    const themeToggleBtn = document.getElementById("themeToggle");

    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");

    // Persist theme in localStorage
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("preferredTheme", isDark ? "dark" : "light");
    });

    // On page load, apply saved theme
    const savedTheme = localStorage.getItem("preferredTheme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");

    }

// function that will fetch the all the data from the localstorage and will add the row to the  page  
    function loadRecords() {
      tbody.innerHTML = "";
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("student_")) {
          const student = JSON.parse(localStorage.getItem(key));
          addRow(student);
        }
      });
    }
    // This function will be triggerred for the validatingthe user inputs, alert whichever is failed
    function validateForm(student) {
      const nameRegex = /^[A-Za-z ]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const phoneRegex = /^[0-9]{10}$/;
  
      if (!student.name || !nameRegex.test(student.name)) {
        alert("Enter a valid name (letters only).");
        return false;
      }
      if (!student.id || isNaN(student.id)) {
        alert("Enter a valid student ID (numbers only).");
        return false;
      }
      if (!emailRegex.test(student.email)) {
        alert("Enter a valid email address.");
        return false;
      }
      if (!phoneRegex.test(student.contact)) {
        alert("Enter a valid 10-digit contact number.");
        return false;
      }
      return true;
    }

    // This will initiate the add the user to localstorage when user clicks button, added event trigger for the same
    form.addEventListener("submit", function (event) {
        event.preventDefault();
      
        const inputs = form.querySelectorAll("input");
        const student = {
          name: inputs[0].value.trim(),
          id: inputs[1].value.trim(),
          email: inputs[2].value.trim(),
          contact: inputs[3].value.trim(),
        };
      
        if (!validateForm(student)) return;
      
        const key = `student_${student.id}`;
        let saveConfirm=true;
        if(localStorage.getItem(key)){
            saveConfirm=confirm(confirmMessage)
            confirmMessage = "The student is already present. Do you want to update the details?";
        }
        if(saveConfirm){
            localStorage.setItem(key, JSON.stringify(student));
            loadRecords();
            form.reset();
        }
      });


    // This function will be triggerred by loadrecords to add the each row into the records  
    function addRow(student) {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.id}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </td>
      `;
  
      const editBtn = row.querySelector(".edit");
      const deleteBtn = row.querySelector(".delete");
        // This will add the event trigeer for the edit button for the edit purpose
      editBtn.addEventListener("click", () => {
        const inputs = form.querySelectorAll("input");
        inputs[0].value = student.name;
        inputs[1].value = student.id;
        inputs[2].value = student.email;
        inputs[3].value = student.contact;
        confirmMessage="Confirm you want to update the student details"
        // Just prefill the form and navigate to the form section
        form.scrollIntoView({ behavior: "smooth" });

      });
      // This will add the event listener for the delete button   
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this record?")) {
          localStorage.removeItem(`student_${student.id}`);
          loadRecords();
        }
      });
  
      tbody.appendChild(row);
    }
    loadRecords();
  });
  