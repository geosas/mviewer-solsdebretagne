export default function() {

  return `
    <div id="solaid-apisol-modal">
      <div class="solaid-apisol-title">Interface de sélection SolAid</div>
      <div class="solaid-apisol-close"></div>
      <div class="solaid-apisol-body">

        <div class="solaid-apisol-body-uts-precise">
          <div class="solaid-apisol-summary">
            <!--<span class="solaid-apisol-body-icon solaid-apisol-body-icon-locate-star"></span>-->
            <p>
              <i>&bull; Nous avons détecté que vous êtes sur le sol suivant: &bull;</i>
            </p>
            <div class="solaid-apisol-highlighted">
              &laquo;<strong class="solaid-apisol-uts-precise"><!-- Sol de fond de vallée hydromorphe... --></strong>&raquo;
              <span class="solaid-apisol-no-utx"><!-- UTX 001 --></span>
              <div class="solaid-apisol-links">
                <a href="#" class="solaid-apisol-link-info">Info. agronomiques</a>
                <a href="#" class="solaid-apisol-link-pdf" target="_blank">Fiche UTS</a>
              </div>
            </div>
          </div>
          <div class="solaid-apisol-buttons">
            <button type="button" class="solaid-apisol-btn-tree">Arbre décisionel</button>
            <button type="button" class="solaid-apisol-btn-success solaid-apisol-btn-confirm">Confirmer le type de sol</button>
          </div>
          <div class="solaid-apisol-buttons">
            <button type="button" class="solaid-apisol-btn-close">Fermer</button>
          </div>
        </div>

        <div class="solaid-apisol-body-ucs-choice">
          <div class="solaid-apisol-summary">
            <!--<span class="solaid-apisol-body-icon solaid-apisol-body-icon-locate"></span>-->
            <p>
              <i>&bull; Vous êtes dans une unité constituées de &bull;</i>
            </p>
            <div class="solaid-apisol-highlighted solaid-apisol-highlighted-ucs">
              &laquo;<strong class="solaid-apisol-ucs-name"><!-- Sols peu profonds et acides... --></strong>&raquo;
              <span class="solaid-apisol-no-utx"><!-- UTX 001 --></span>
             <div class="solaid-apisol-links">
              <a href="#" class="solaid-apisol-link-info">Carte des sols*</a>
              <a href="#" class="solaid-apisol-link-pdf" target="_blank">Fiche UCS</a>
            </div>
            </div>
          </div>
          <div class="solaid-apisol-buttons" style="margin-bottom:0;">
            <button type="button" class="solaid-apisol-btn solaid-apisol-btn-primary solaid-apisol-btn-menu">Identifiez le type de sol</button>
          </div>
          <div class="solaid-apisol-ucs-option solaid-apisol-other-ucs">
            <label><input type="checkbox" class="solaid-apisol-ucs-option-checkbox">Choisir manuellement une unité de sol différente</label>
            <div class="solaid-apisol-ucs-option-form">
              <select class="solaid-apisol-select-ucs">
                <!-- js -->
              </select>
            </div>
          </div>
          <div class="solaid-apisol-ucs-option solaid-apisol-c4c">
            <label><input type="checkbox" class="solaid-apisol-ucs-option-checkbox">Saisir directement un code 4 critères</label>
            <div class="solaid-apisol-ucs-option-form">
              <select class="solaid-apisol-c4c-select">
                <!-- js -->
              </select>
              <button type="submit" class="solaid-apisol-btn-primary solaid-apisol-c4c-submit">VALIDER</button>
              <a class="solaid-apisol-link-info" href="http://sols-de-bretagne.fr/donnees-et-outils/CARACTERISATION-DES-SOLS/METHODE-TARIERE-MASSIF-ARMORICAIN/ " target="_blank">En savoir plus</a>
            </div>
          </div>
          <div class="solaid-apisol-buttons">
            <button type="button" class="solaid-apisol-btn-close">Fermer</button>
          </div>
        </div>

        <div class="solaid-apisol-body-uts-found">
          <div class="solaid-apisol-summary">
            <!--<span class="solaid-apisol-body-icon solaid-apisol-body-icon-locate-valid"></span>-->
            <p>
              <i>&bull; D’après vos réponses, le type de sol est : &bull;</i>
            </p>
            <div class="solaid-apisol-highlighted">
              &laquo;<strong class="solaid-apisol-uts-found"><!-- Sol de fond de vallée hydromorphe... --></strong>&raquo;
              <span class="solaid-apisol-no-utx"><!-- UTX 001 --></span>
              <div class="solaid-apisol-links">
                <a href="#" class="solaid-apisol-link-info" target="_blank">Carte des sols</a>
                <a href="#" class="solaid-apisol-link-pdf" target="_blank">Fiche UTS</a>
              </div>
            </div>
          </div>
          <div class="solaid-apisol-buttons">
            <button type="button" class="solaid-apisol-btn-back">Retour</button>
            <button type="button" class="solaid-apisol-btn-success solaid-apisol-btn-confirm">Confirmer le type de sol</button>
          </div>
        </div>

        <div class="solaid-apisol-body-utt-found">
          <div class="solaid-apisol-summary">
            <!--<span class="solaid-apisol-body-icon solaid-apisol-body-icon-locate-valid"></span>-->
            <p>
              <i>&bull; D’après vos réponses, le type de sol estimé est : &bull;</i>
            </p>
            <div class="solaid-apisol-highlighted">
              &laquo;<strong class="solaid-apisol-utt-found"><!-- Sol de fond de vallée hydromorphe... --></strong>&raquo;
              <span class="solaid-apisol-no-utx"><!-- UTX 001 --></span>
              <div class="solaid-apisol-links">
                <a href="#" class="solaid-apisol-link-info" target="_blank">Carte des sols</a>
                <a href="#" class="solaid-apisol-link-pdf" target="_blank">Fiche UTS</a>
              </div>
            </div>
          </div>
          <div class="solaid-apisol-buttons">
            <button type="button" class="solaid-apisol-btn-back">Retour</button>
            <button type="button" class="solaid-apisol-btn-success solaid-apisol-btn-confirm">Confirmer le type de sol</button>
          </div>
        </div>

        <div class="solaid-apisol-body-uts-submitted">
          <div class="solaid-apisol-summary">
            <!--<span class="solaid-apisol-body-icon solaid-apisol-body-icon-locate-valid-green"></span>-->
            <p>
              <i>&bull; Merci d’avoir confirmé ce type de sol pour cette position &bull;</i>
            </p>
            <div class="solaid-apisol-highlighted">
              &laquo;<strong class="solaid-apisol-uts-confirmed"><!-- Sol de fond de vallée hydromorphe... --></strong>&raquo;
              <span class="solaid-apisol-no-utx"><!-- UTX 001 --></span>
              <div class="solaid-apisol-links">
                <a href="#" class="solaid-apisol-link-info" target="_blank">Carte des sols</a>
                <a href="#" class="solaid-apisol-link-pdf" target="_blank">Fiche UTS</a>
              </div>
            </div>
          </div>
          <div class="solaid-apisol-buttons">
            <button type="button" class="solaid-apisol-btn-primary solaid-apisol-btn-close">Fermer</button>
          </div>
        </div>


        <div class="solaid-apisol-body-questions">
          <div class="solaid-apisol-header">
            <div class="solaid-apisol-ucs">UCS 001</div>
            <div class="solaid-apisol-metadata">Coordonnées: <span class="solaid-apisol-data-lat"></span> - <span class="solaid-apisol-data-lon"></span> <br>Utilisateur: <span class="solaid-apisol-data-user"><span></div>
            <div class="solaid-apisol-notice">NOTICE</div>
          </div>
          <div class="solaid-apisol-arianne">
            <!-- -->
          </div>
          <div class="solaid-apisol-questions">
            <form action="">
              <h2 class="solaid-apisol-question"><strong>Q1</strong> <span>Quel est la question ?</span></h2>
              <div class="solaid-apisol-radios">
                <div class="solaid-apisol-radio">
                  <input type="radio" id="radio1" name="reponse" value="yes">
                  <label for="radio1">
                    Oui
                  </label>
                </div>
                <div class="solaid-apisol-radio">
                  <input type="radio" id="radio2" name="reponse" value="no">
                  <label for="radio2">
                    Non
                  </label>
                </div>
              </div>
            </form>
            <div class="solaid-apisol-buttons">
              <button class="solaid-apisol-back-ucs-choice solaid-apisol-btn-back">Retour</button>
              <button class="solaid-apisol-prev-question solaid-apisol-btn-back solaid-apisol-hide">Précédent</button>
              <div class="solaid-apisol-question-warning solaid-apisol-hide">Veuillez répondre à la question</div>
              <button class="solaid-apisol-next-question solaid-apisol-btn-info solaid-apisol-btn-next">Suivant</button>
              <a href="#" class="solaid-apisol-link-help" title="Aide à la décision">Aide</a>
            </div>
          </div>
          <div class="solaid-apisol-tree">
            <div class="solaid-apisol-tree-buttons">
              <button class="solaid-apisol-tree-print">Imprimer</button>
              <button class="solaid-apisol-tree-close">Fermer</button>
            </div>
            <canvas id="solaid-apisol-tree-canvas"></canvas>
            <a href="#" class="solaid-apisol-tree-fullscreen" title="Plein écran"></a>
          </div>
        </div>
        <div class="solaid-apisol-inner-modal">
          <div class="solaid-apisol-inner-modal-tree">
            <canvas id="solaid-apisol-inner-modal-tree-canvas"></canvas>
          </div>
          <div class="solaid-apisol-inner-modal-content">
          </div>
          <div class="solaid-apisol-inner-modal-footer"></div>
        </div>
        <div class="solaid-apisol-inner-loader">
          <div class="solaid-apisol-lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
        <div class="solaid-apisol-error"><div class="solaid-apisol-error-content"><strong>Arf, une erreur a eu lieu :</strong><p></p></div><button class="solaid-apisol-btn-back">Retour</button></div>
      </div>
    </div>
  `;
}