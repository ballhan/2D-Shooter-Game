$(document).ready(function() {	
  documentEl = $(document);	
  documentEl.on('scroll', function() {	
    if (isScrolledIntoView('#landingText')) {	
        $(".navbar-right").find(".active").removeClass("active");	
        $('#navHome').parent().addClass("active");	
    };	
     if (isScrolledIntoView('#portfolioHighBound')) {	
        $(".navbar-right").find(".active").removeClass("active");	
        $('#navPortfolio').parent().addClass("active");	
    };	
    if (isScrolledIntoView('#portfolioLowBound')) {	
        $(".navbar-right").find(".active").removeClass("active");	
        $('#navPortfolio').parent().addClass("active");	
    };	
    if (isScrolledIntoView('#aboutHighBound')) {	
        $(".navbar-right").find(".active").removeClass("active");	
        $('#navAbout').parent().addClass("active");	
    };	
    if (isScrolledIntoView('#aboutLowBound')) {	
        $(".navbar-right").find(".active").removeClass("active");	
        $('#navAbout').parent().addClass("active");	
    };	
    if (isScrolledIntoView('#contactBound')) {	
        $(".navbar-right").find(".active").removeClass("active");	
        $('#navContact').parent().addClass("active");	
    };	
   });	
});