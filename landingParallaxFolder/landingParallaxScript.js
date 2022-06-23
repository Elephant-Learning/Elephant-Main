// var timeout

//function showFeatures () {
  //clearTimeout(timeout)
  //document.getElementById('dropDownNavBarList').style.opacity = 1.0;
  //timeout = setTimeout(function(){document.getElementById('dropDownNavBarList').style.opacity = 0.0;}, 3000);
//}

//function hideFeatures () {
  //clearTimeout(timeout)
  //document.getElementById('dropDownNavBarList').style.opacity = 0.0;
//}

//function keepFeatures () {
  //clearTimeout(timeout)
//}

//var hover = document.getElementById('hover')
//hover.onmouseover = showFeatures

//var stuff = document.getElementById('dropDownNavBarList')
//dropDownNavBarList.onmouseover = keepFeatures
//dropDownNavBarList.onmouseout = hideFeatures

//$(document).ready(function() {
  //$("div.dropDownNavBarList").hover(function() {
    //document.getElementById('dropDownNavBarList').style.color = "black";
  //}, function() {
    //document.getElementById('dropDownNavBarList').style.color = "grey";
  //});
//}); 

$("a.button").hover(function() {
  $(this).siblings("h1").addClass("your_color_class");
}, function() {
  $(this).siblings("h1").removeClass("your_color_class");
});
