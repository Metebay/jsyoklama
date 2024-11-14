let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { username: "teacher1", password: "password1" },  // Örnek öğretmen
    { username: "teacher2", password: "password2" }
];

// Öğretmen giriş işlemi
function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const loginError = document.getElementById('loginError');

    // Öğretmenlerin bilgilerini kontrol et
    const teacher = teachers.find(t => t.username === username && t.password === password);

    if (teacher) {
        // Giriş başarılı
        loginError.textContent = '';
        localStorage.setItem('loggedInTeacher', username);
        document.getElementById('loginPage').style.display = 'none'; // Giriş sayfasını gizle
        document.getElementById('teacherPanel').style.display = 'block'; // Öğretmen panelini göster
        updateClassSelect();
        displayAttendanceRecords();
    } else {
        // Giriş başarısız
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
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

// Sınıf oluşturma
function createClass() {
    const className = document.getElementById('className').value;
    if (className) {
        const newClass = { name: className, id: Date.now(), students: [] };
        classes.push(newClass);
        localStorage.setItem('classes', JSON.stringify(classes));
        updateClassSelect();
        document.getElementById('className').value = '';
    } else {
        alert("Sınıf adı boş olamaz.");
    }
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

// Yoklama al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (classId) {
        const selectedClass = classes.find(c => c.id == classId);
        selectedClass.students.forEach(student => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" id="attendance-${student.id}" data-student-id="${student.id}">
                ${student.name}
            `;
            attendanceList.appendChild(listItem);
        });
    }
}

// Yoklama al
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const selectedClass = classes.find(c => c.id == classId);
    const attendanceResult = document.getElementById('attendanceResult');
    const checkedStudents = [];
    const date = new Date();
    const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    selectedClass.students.forEach(student => {
        const checkbox = document.getElementById(`attendance-${student.id}`);
        if (checkbox && checkbox.checked) {
            checkedStudents.push(student.name);
        }
    });

    if (checkedStudents.length > 0) {
        attendanceResult.textContent = `Yoklama alındı. Katılanlar: ${checkedStudents.join(', ')}`;

        // Kaydet: yoklama kaydını ekle
        const attendanceRecord = {
            classId,
            date: timestamp,
            studentsPresent: checkedStudents,
        };

        attendanceRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        displayAttendanceRecords();
    } else {
        attendanceResult.textContent = "Yoklama alınmadı. Katılan yok.";
    }
}

// Yoklama kayıtlarını göster
function displayAttendanceRecords() {
    const attendanceRecordsList = document.getElementById('attendanceRecords');
    attendanceRecordsList.innerHTML = '';

    attendanceRecords.forEach(record => {
        const listItem = document.createElement('li');
        const className = classes.find(c => c.id === record.classId).name;
        listItem.textContent = `${className} - ${record.date} | Katılanlar: ${record.studentsPresent.join(', ')}`;
        attendanceRecordsList.appendChild(listItem);
    });
}

// Sayfa yüklendiğinde öğretmen giriş panelini kontrol et
window.onload = function() {
    const loggedInTeacher = localStorage.getItem('loggedInTeacher');
    if (loggedInTeacher) {
        document.getElementById('loginPage').style.display = 'none'; // Giriş sayfasını gizle
        document.getElementById('teacherPanel').style.display = 'block'; // Öğretmen panelini göster
        updateClassSelect();
    }
}
