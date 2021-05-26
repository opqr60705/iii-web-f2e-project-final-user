// 首頁開啟的ModalBox
getTheModal = () => {
    let description = document.querySelector("#myDescription");
    let span = document.getElementsByClassName("close")[0];
    //自動開啟
    window.onload = () => {
        description.style.display = "block";
    }
}

$("#switchbtn").toggle(
    () => { $(".search").css({ left: "0rem" }); },
    () => { $(".search").css($(window).width() < 2000 ? { left: "-15rem" } : { left: "-18rem" }); },
)

getTheModal();