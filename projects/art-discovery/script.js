function showSection(sectionId) {
    const sections = document.querySelectorAll('.category');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}
showSection('home');