const hrs = document.getElementById("hrs")
const mins = document.getElementById("mins")
const sec = document.getElementById("sec")

const currenttime = new Date();
hrs.innerHTML = currenttime.getHours();
mins.innerHTML = currenttime.getMinutes()
sec.innerHTML = currenttime.getSeconds();