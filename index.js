document.addEventListener('DOMContentLoaded', function() {
  initializeApp().then(() => {
    chrome.storage.local.get(['defaultGrade'], function(result) {
      if (result.defaultGrade) {        
        selectDefaultGrade(result.defaultGrade);
      }
    });
  });
  
  const defaultGradeSelect = document.getElementById('defaultGrade');
  
  const root = document.getElementById('root');
  let selectedGrade = '';

  function initializeApp() {
      return fetch('./data.json')
          .then(response => response.json())
          .then(loadedData => {
              const subjectSelectionDiv = document.createElement('div');
              subjectSelectionDiv.innerHTML = '<h3>教科選択</h3>';
              root.appendChild(subjectSelectionDiv);

              const subjectButtonsContainer = document.createElement('div');
              subjectButtonsContainer.style.display = 'grid';
              subjectButtonsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
              subjectButtonsContainer.style.gap = '10px';
              subjectSelectionDiv.appendChild(subjectButtonsContainer);

              const subjects = new Set();
              Object.values(loadedData).forEach(grades => {
                  Object.keys(grades).forEach(subject => {
                      subjects.add(subject);
                  });
              });

              subjects.forEach(subject => {
                  const button = document.createElement('button');
                  button.textContent = subject;
                  button.className = 'button subject-button';
                  button.onclick = () => handleSubjectSelect(subject, loadedData);
                  subjectButtonsContainer.appendChild(button);
              });
              return Promise.resolve();
          });
  }

  function handleSubjectSelect(subject, data) {
      document.querySelectorAll('.subject-button').forEach(btn => {
          btn.classList.remove('selected');
      });
      event.target.classList.add('selected');

      // Clear existing grade buttons if any
      let gradesDiv = document.getElementById('gradesDiv');
      if (!gradesDiv) {
          gradesDiv = document.createElement('div');
          gradesDiv.id = 'gradesDiv';
          root.appendChild(gradesDiv);
      } else {
          gradesDiv.innerHTML = ''; // Clear the div to display new buttons
      }

      const gradesHeader = document.createElement('h3');
      gradesHeader.textContent = '学年選択';
      gradesDiv.appendChild(gradesHeader);

      const gradesButtonsContainer = document.createElement('div');
      gradesButtonsContainer.style.display = 'grid';
      gradesButtonsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
      gradesButtonsContainer.style.gap = '10px';
      gradesDiv.appendChild(gradesButtonsContainer);

      // Find and display grades for the selected subject
      const grades = new Set();
      Object.entries(data).forEach(([grade, subjects]) => {
          if (subjects[subject]) {
              grades.add(grade);
          }
      });

      grades.forEach(grade => {
          const button = document.createElement('button');
          button.textContent = grade;
          button.className = 'button grade-button';
          button.setAttribute('data-grade', grade); // Useful for selecting default grade
          button.onclick = () => handleGradeSelect(grade, button, data);
          gradesButtonsContainer.appendChild(button);
      });
  }

  function selectDefaultGrade(savedGrade) {
    const gradeButton = document.querySelector(`.grade-button[data-grade="${savedGrade}"]`);
    if (gradeButton) {
      gradeButton.click();
    }
  }

  function handleGradeSelect(grade, button, data) {
      document.querySelectorAll('.grade-button').forEach(btn => {
          btn.classList.remove('selected');
      });
      button.classList.add('selected');

      selectedGrade = grade;
      updateSubjectUI(grade, data);
  }

  function updateSubjectUI(grade, data) {
      let subjectsDiv = document.querySelector('#subjectsDiv');
      if (!subjectsDiv) {
          subjectsDiv = document.createElement('div');
          subjectsDiv.id = 'subjectsDiv';
          root.appendChild(subjectsDiv);
      } else {
          subjectsDiv.innerHTML = '';
      }

      const subjectsHeader = document.createElement('h3');
      subjectsHeader.textContent = '教科';
      subjectsDiv.appendChild(subjectsHeader);

      const subjectsButtonsContainer = document.createElement('div');
      subjectsButtonsContainer.style.display = 'grid';
      subjectsButtonsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
      subjectsButtonsContainer.style.gap = '10px';
      subjectsDiv.appendChild(subjectsButtonsContainer);

      Object.entries(data[grade]).forEach(([subject, url]) => {
          const button = document.createElement('button');
          button.textContent = subject;
          button.className = 'button subject-button';
          button.onclick = () => window.open(url, '_blank');
          subjectsButtonsContainer.appendChild(button);
      });
  }
});
