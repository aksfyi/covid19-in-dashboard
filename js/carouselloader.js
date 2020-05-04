
$(document).ready(function(){
  M.AutoInit();
    $(".slider").slick({

// normal options...

infinite: false,

adaptiveHeight:true,

// the magic
responsive: [
{

breakpoint: 1920,
settings: {
  slidesToShow: 3,
  arrows:true,
  infinite: true

}

},
  
  {

    breakpoint: 1024,
    settings: {
      slidesToShow: 2,
      arrows:true,
     
    }

  }, {

    breakpoint: 600,
    settings: {
      slidesToShow: 1,
      arrows:true,
      infinite: true
      
    }

  }, {

    breakpoint: 300,
    settings: "unslick" // destroys slick

  }]
});
});