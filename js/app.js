function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
  setTimeout(() => {
    sidebar.style.transform = "translateX(0)";
  }, 10);
}

function closeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.transform = "translateX(100%)";
  setTimeout(() => {
    sidebar.style.display = "none";
  }, 300);
}

// Scroll to top
// const scroll_to_top = document.querySelector(".scroll_to_top");
// window.addEventListener("scroll", () => {
//   if (window.pageYOffset >= window.innerHeight / 2) {
//     scroll_to_top.classList.add("scroll_to_top_show");
//   } else {
//     scroll_to_top.classList.remove("scroll_to_top_show");
//   }
// });

// scroll_to_top.addEventListener("click", () => {
//   window.scrollTo(0, 0);
// });
