(function($) {
    // USE STRICT
    "use strict";
    var navbars = ["header", "aside"];
    var hrefSelector =
        'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])';
    var linkElement = navbars
        .map((element) => element + " " + hrefSelector)
        .join(", ");
    $(".animsition").animsition({
        inClass: "fade-in",
        outClass: "fade-out",
        inDuration: 900,
        outDuration: 900,
        linkElement: linkElement,
        loading: true,
        loadingParentElement: "html",
        loadingClass: "page-loader",
        loadingInner: '<div class="page-loader__spin"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ["animation-duration", "-webkit-animation-duration"],
        overlay: false,
        overlayClass: "animsition-overlay-slide",
        overlayParentElement: "html",
        transition: function(url) {
            window.location.href = url;
        },
    });
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    // Scroll Bar
    try {
        var jscr1 = $(".js-scrollbar1");
        if (jscr1[0]) {
            const ps1 = new PerfectScrollbar(".js-scrollbar1");
        }

        var jscr2 = $(".js-scrollbar2");
        if (jscr2[0]) {
            const ps2 = new PerfectScrollbar(".js-scrollbar2");
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    // Select 2
    try {
        $(".js-select2").each(function() {
            $(this).select2({
                minimumResultsForSearch: 20,
                dropdownParent: $(this).next(".dropDownSelect2"),
            });
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    try {
        var showTablebutton = document.getElementsByClassName("showTable")[0];
        var showstatisticbutton = document.getElementsByClassName(
            "showstatistic"
        );
        var statistic = document.getElementById("statistics");
        var table = document.getElementById("table");

        showTablebutton.addEventListener("click", function() {
            statistic.style.display = "none";
            table.style.display = "block";
        });
        for (var i = 0; i < showstatisticbutton.length; i++) {
            showstatisticbutton[i].addEventListener("click", function(event) {
                statistic.style.display = "block";
                table.style.display = "none";
            });
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    // Load more
    try {
        var list_load = $(".js-list-load");
        if (list_load[0]) {
            list_load.each(function() {
                var that = $(this);
                that.find(".js-load-item").hide();
                var load_btn = that.find(".js-load-btn");
                load_btn.on("click", function(e) {
                    $(this)
                        .text("Loading...")
                        .delay(1500)
                        .queue(function(next) {
                            $(this).hide();
                            that.find(".js-load-item").fadeToggle(
                                "slow",
                                "swing"
                            );
                        });
                    e.preventDefault();
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    try {
        $('[data-toggle="tooltip"]').tooltip();
    } catch (error) {
        console.log(error);
    }

    // Chatbox
    try {
        var inbox_wrap = $(".js-inbox");
        var message = $(".au-message__item");
        message.each(function() {
            var that = $(this);

            that.on("click", function() {
                $(this)
                    .parent()
                    .parent()
                    .parent()
                    .toggleClass("show-chat-box");
            });
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
