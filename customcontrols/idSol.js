mviewer.customControls.idSol = (function() {
    return {
        init: function() {
            $("#idSol_btn").on("click", function () {
                if ($(this).hasClass("btn-off") ){
                    $(this).removeClass("btn-off").addClass("btn-on");
                    $("#label_btnSol").removeClass("label-btn-off").addClass("label-btn-on");
                    $("#reporting-btn").addClass("active");
                } else {
                    $(this).removeClass("btn-on").addClass("btn-off");
                    $("#label_btnSol").removeClass("label-btn-on").addClass("label-btn-off");
                    $("#reporting-btn").removeClass("active");
                }        
            });

        },
        destroy: function() {}  
    };
  
  }());