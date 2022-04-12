(function() {
    // evenement
    mviewer.getMap().once('rendercomplete', function(e) {
        // qui va créer une tooltip sur un bouton avec id #reporting-btn
        $("#reporting-btn").tooltip({
            placement: 'right',
            trigger: 'hover',
            html: true,
            container: 'body',
            template: mviewer.templates.tooltip
        });
        // je recupère la config du plugin décrite dans le fichier config.json
        var config = mviewer.customComponents.apisol.config;
        var mviewerId = configuration.getConfiguration().application.id;
        var options = config.options;
	var iframe ;
        if(options.mviewers && options.mviewers[mviewerId]) {
            options = config.options.mviewers[mviewerId];
        }
        $('#reporting-btn').css('color', options.color)

        // FONCTIONNALITES PLUGIN 
        // ID de la popup
        const popupId = "popup";
        const popupContentId = "popup-content";
        const popupCloserId = "popup-closer";

        // ID de la modal
        const modalId = "exampleModal";

        


        // Ajout des élements HTML la pop-up dans l'application - Au dessus de la carte, dans l'élement row sans ID
        $("#map").parent().append(`
            <div id="${popupId}" class="ol-popup">
                <a href="#" id="${popupCloserId}" class="ol-popup-closer"></a>
                <div id="${popupContentId}" height="350"></div>
            </div>`
        );

        // Suppression de la propriété CSS display pour la pop-up
        $(".ol-popup" ).css( "display", "block" );

        // Création d'une nouvelle modal
        $("#main").append(`
            <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                                <div class="titleModal${modalId}" id="modalNameContent"></div>
                                <div id="modalLinkContent"></div>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        );

        // Comportement checkbox
        $("#myCheck").click(function() {
            $("#clickedYes").toggle($(this).prop("myCheck"));
        });


//  $(document).ready(function() {
//    var newDiv, iframe;
//    newDiv = document.createElement("div");
//    iframe = document.createElement("IFRAME");
//    iframe.setAttribute("src", "https://en.wikipedia.org");;
//    $(iframe).appendTo($(newDiv));
//    $(newDiv).appendTo($('body'));
//  });
        // Constantes qui ciblent les éléments HTML de la popup
        const container = document.getElementById(popupId);
        const content = document.getElementById(popupContentId);
        const closer = document.getElementById(popupCloserId);
	const iframe_base = "https://geosas.fr/apps/sdb/components/apisol-viewer/?";
        iframe = document.createElement("IFRAME");

        const modalCoordContent = document.getElementById('modalCoord');

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

        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        map.addOverlay(overlay);    

        // Comportement au click sur la carte
        map.on('singleclick', function (evt) {
            const coordinate = evt.coordinate;
            const hdms = ol.proj.toLonLat(coordinate);
            console.log(hdms);
            let lat = hdms[1];
            let lon = hdms[0];
            iframe_url = iframe_base+"lon="+lon+"&lat="+lat;
            console.log("iframe_url="+iframe_url);
            iframe.setAttribute("src", iframe_url);
	    iframe.border = "0";
            iframe.style.width = "620px";
            iframe.style.height = "420px";

//		      popup = L.popup().setContent(hdms.toString()+" <br><button onclick='javascript:openPlugin();' class='map-button'>Afficher le plugin ici</button>")
//            modalNameContent.innerHTML = `Insérer l'API Solaid`;
//            modalLinkContent.innerHTML = `<p>Vous êtes ici</p><code>${iframe}</code>`;

            

		/*
        $(iframe).appendTo("#modalLinkContent");
            // Ajout du contenu de la pop (coordonnées et bouton)
            content.innerHTML = `
            <p>Vous êtes ici</p>
            <code>${hdms}</code>
            <button data-toggle="modal" data-target="#${modalId}" class='map-button'>Afficher le plugin ici</button>
            `;            
	    */
        $(iframe).appendTo("#popup-content");

            overlay.setPosition(coordinate);
        });
        
    });
})();

