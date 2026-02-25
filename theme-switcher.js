function changeTheme() {
    var select = document.getElementById('theme-select');
    var theme = select.value;
    var styleLink = document.getElementById('theme-style');
    styleLink.href = '/css/theme-' + theme + '.css';
    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', function() {
    var savedTheme = localStorage.getItem('theme') || 'osowoso';
    document.getElementById('theme-select').value = savedTheme;
    document.getElementById('theme-style').href = '/css/theme-' + savedTheme + '.css';
});
