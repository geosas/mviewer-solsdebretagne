(function() {
    // evenement
    mviewer.getMap().once('rendercomplete', function(e) {

        // qui va créer une tooltip sur un bouton avec id #reporting-btn
        $("#reporting-btn").tooltip({
            placement: 'left',
            trigger: 'hover',
            html: true,
            container: 'body',
            template: mviewer.templates.tooltip
        });

        // je recupère la config du plugin décrite dans le fichier config.json
        var config = mviewer.customComponents.apisol.config;
        var mviewerId = configuration.getConfiguration().application.id;
        var options = config.options;
        if (options.mviewers && options.mviewers[mviewerId]) {
            options = config.options.mviewers[mviewerId];
        }
        $('#reporting-btn').css('color', options.color)

        // FONCTIONNALITES PLUGIN 
        // ID de la popup
        const popupId = "popup";
        const popupContentId = "popup-content";
        const popupCloserId = "popup-closer";

        // Ajout des élements HTML la pop-up dans l'application - Au dessus de la carte, dans l'élement row sans ID
        $("#map").parent().append(`
            <div id="${popupId}" class="ol-popup">
                <a href="#" id="${popupCloserId}" class="ol-popup-closer"></a>
                <div id="${popupContentId}" height="350"></div>
            </div>`
        );

        // Suppression de la propriété CSS display pour la pop-up
        $(".ol-popup").css("display", "block");

        // Constantes qui ciblent les éléments HTML de la popup
        const container = document.getElementById(popupId);
        const content = document.getElementById(popupContentId);
        const closer = document.getElementById(popupCloserId);
        const iframe_base = "https://geosas.fr/apps/sdb/components/apisol-viewer/?";
        iframe = document.createElement("IFRAME");

        // Constante qui définit la map
        const map = mviewer.getMap();

        // Création d'une overlay pour anchrer la pop-up à la map
        const overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });

        closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        map.addOverlay(overlay);

        // Comportement au click sur la carte
        map.on('singleclick', function(evt) {
            if (!$('#reporting-btn').hasClass('active')) {
                return;
            }

            const coordinate = evt.coordinate;
            const hdms = ol.proj.toLonLat(coordinate);
            console.log(hdms);
            let lat = hdms[1];
            let lon = hdms[0];
            iframe_url = iframe_base+"lon="+lon+"&lat="+lat;
            console.log("iframe_url="+iframe_url);
            iframe.setAttribute("src", iframe_url);
	        iframe.style.border = "none";
            iframe.style.width = "700px";
            iframe.style.height = "520px";


            $(iframe).appendTo("#popup-content");

            overlay.setPosition(coordinate);
        });


        $('#reporting-btn').on('click', function(evt) {
            if ($('#reporting-btn').hasClass('active')) {
                $('#reporting-btn').removeClass("active");
                overlay.setPosition(undefined);
            } else {
                // Ajout de la class active au btn du plugin (= background grey)
                $('#reporting-btn').addClass("active");
            }
        });
    });
})();