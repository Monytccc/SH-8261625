// Script untuk mengurangi kemungkinan akses ke Developer Tools
document.onkeydown = function(e) {
    if(e.keyCode == 123) { // F12 key
        return false;
    }
    if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) {
        // Ctrl + Shift + I atau Ctrl + Shift + J
        return false;
    }
    if(e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0))) {
        // Ctrl + U
        return false;
    }
};

// Mendeteksi apakah Developer Tools terbuka
var devtools = /./;
devtools.toString = function() {
    this.opened = true; // DevTools terdeteksi terbuka
};

console.log('%c', devtools);
// Script untuk memblokir semua tombol keyboard di HTML
document.addEventListener('keydown', function(event) {
    event.preventDefault(); // Mencegah aksi default semua tombol keyboard
});
