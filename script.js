const hrs = document.getElementById("hrs")
const mins = document.getElementById("mins")
const sec = document.getElementById("sec")
setInterval(()=>{
const currenttime = new Date();
hrs.innerHTML =(currenttime.getHours()< 10 ? "0" : "")+currenttime.getHours();
mins.innerHTML = (currenttime.getMinutes()< 10 ? "0" : "")+currenttime.getMinutes();
sec.innerHTML = (currenttime.getSeconds() < 10 ? "0" : "") + currenttime.getSeconds();
},1000)