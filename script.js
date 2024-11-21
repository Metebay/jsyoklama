// Verilerin Yerel Depodan Yüklenmesi
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];

// Öğretmen Girişi
function teacherLogin() {
    const username = getInputValue('teacherUsername');
    const password = getInputValue('teacherPassword');
    const loginError = document.getElementById('loginError');

    const teacher = teachers.find(t => t.username === username && t.password === password);

    if (teacher) {
        handleLoginSuccess(username);
    } else {
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
}

// Giriş Başarılı Olduğunda
function handleLoginSuccess(username) {
    localStorage.setItem('loggedInUser', username);
    toggleVisibility('loginPage', false);
    toggleVisibility('teacherPanel', true);
    toggleVisibility('sidebar', true);
    updateClassSelect();
}

// Bölüm Görünürlüğünü Yönetme
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => toggleVisibility(section.id, false));
    toggleVisibility(sectionId, true);
}

// Sınıf ve Yoklama Seçeneklerini Güncelle
function updateClassSelect() {
    populateSelect('classSelect', classes);
    populateSelect('attendanceClassSelect', classes);
    loadStudentsList();
}

// Öğrenci Ekleme
function addStudent() {
    const studentName = getInputValue('studentName');
    const classId = getSelectValue('classSelect');

    if (validateStudentInput(studentName, classId)) {
        const newStudent = createStudent(studentName, classId);
        saveStudent(newStudent);
        alert(`${studentName} sınıfa eklendi.`);
        clearInput('studentName');
        loadStudentsList();
    } else {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
    }
}

// Öğrenci Listesini Yenileme
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentClass = classes.find(c => c.id == student.classId);
        addListItem(studentList, `${student.name} (${studentClass.name})`);
    });
}

// Yardımcı Fonksiyonlar
function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

function getSelectValue(id) {
    return document.getElementById(id).value;
}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.style.display = isVisible ? 'block' : 'none';
}

function clearInput(id) {
    document.getElementById(id).value = '';
}

function populateSelect(selectId, data) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">Sınıf Seçin</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

function addListItem(listElement, content) {
    const listItem = document.createElement('li');
    listItem.textContent = content;
    listElement.appendChild(listItem);
}

function validateStudentInput(name, classId) {
    return name && classId;
}

function createStudent(name, classId) {
    return { id: Date.now(), name, classId };
}

function saveStudent(student) {
    const classObj = classes.find(c => c.id == student.classId);
    classObj.students.push(student);
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));
}
