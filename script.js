let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];

// Öğretmen Girişi
function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const loginError = document.getElementById('loginError');

    const teacher = teachers.find(t => t.username === username && t.password === password);

    if (teacher) {
        loginError.textContent = '';
        localStorage.setItem('loggedInUser', username);
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('teacherPanel').style.display = 'block';
        document.getElementById('sidebar').style.display = 'block'; // Sidebar'ı göster
        updateClassSelect();
    } else {
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
}

// Sidebar'da seçilen bölüme git
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Sınıf ve öğrenci listeleme
function updateClassSelect() {
    const classSelect = document.getElementById('classSelect');
    const attendanceClassSelect = document.getElementById('attendanceClassSelect');
    classSelect.innerHTML = '<option value="">Sınıf Seçin</option>';
    attendanceClassSelect.innerHTML = '<option value="">Sınıf Seçin</option>';

    classes.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        classSelect.appendChild(option);

        const attendanceOption = document.createElement('option');
        attendanceOption.value = c.id;
        attendanceOption.textContent = c.name;
        attendanceClassSelect.appendChild(attendanceOption);
    });
    loadStudentsList();
}

// Öğrenci ekleme
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (studentName && classId) {
        const student = { name: studentName, id: Date.now(), classId };
        const selectedClass = classes.find(c => c.id == classId);
        selectedClass.students.push(student);
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('classes', JSON.stringify(classes));

        alert(`${studentName} sınıfına eklendi.`);
        document.getElementById('studentName').value = '';
        loadStudentsList();
    } else {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
    }
}

// Öğrencileri listeleme
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const listItem = document.createElement('li');
        const studentClass = classes.find(c => c.id == student.classId);
        listItem.textContent = `${student.name} (${studentClass.name})`;
        studentList.appendChild(listItem);
    });
}
