import jQuery from 'jquery';
import TreeVizu from 'treevizu';
import ModalTemplate from './template.js';

window.$ = window.jQuery = jQuery;

const APISol = (function($) {

  $.fn.APISol = function(options)
  {
    //parametres par defaults
    var defaults = {
      lat: null,
      lon: null,
      srid: 4326,
      profil: 0,
      level: 1,
      enableSetUTS: true,
      enableUCSChange: true,
      enableC4C: true,
      url: {
	      getucs: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=getucs&datainputs=__coords__&&rawdataoutput=getucs',
        gettree: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=gettree&datainputs=code_ucs=__id__;__coords__&rawdataoutput=tree',
        getquestion: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=getressourceinfo&datainputs=ressourcetype=rQ;no_ucs=__ucs__;no_question=__id__;__coords__&rawdataoutput=ressourcejson',
        getuts: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=getressourceinfo&datainputs=x=300000;y=6800000;srid=2154;ressourcetype=rUTS;no_ucsuts=__id__;debug=O;__coords__&rawdataoutput=ressourcejson',
        getutt: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=getutt&datainputs=id_ucs=__ucs__;id_node=__idquestion__&rawdataoutput=getutt',
        getc4c: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=getqcri&datainputs=qcri=__c4c__;id_ucs=__ucs__;dep=__dep__;__coords__&rawdataoutput=utslisteqcri',
        setuts: 'https://api.geosas.fr/sol?service=WPS&version=1.0.0&request=execute&identifier=setuts&datainputs=id_uts=__uts__;id_session=__session__;level=__level__;profil=__profil__;branche=__branche__;__coords__&rawdataoutput=setutsreponse',
      }
    };

    //surcharge des parametres par defaults
    var parameters = $.extend(defaults,options);

    // variable globals
    var _container = $(this);
        _container.html(ModalTemplate()); //add the HTML template
    var _modal = _container.find('div:first');
    var _pages = _modal.find('.solaid-apisol-body > div');
    var _ask = _modal.find('.solaid-apisol-questions h2');
    var _radios = _modal.find('.solaid-apisol-radios');
    var _debug = _modal.find('.solaid-apisol-debug');
    var _next = _modal.find('.solaid-apisol-next-question');
    var _prev = _modal.find('.solaid-apisol-prev-question');
    var _back = _modal.find('.solaid-apisol-back-ucs-choice');
    var _arianne = _modal.find('.solaid-apisol-arianne');
    var _submit = _modal.find('.solaid-apisol-submit-question');
    var _close = _modal.find('.solaid-apisol-close');
    var _warning = _modal.find('.solaid-apisol-question-warning');
    var _innerModal = _modal.find('.solaid-apisol-inner-modal');
    var _loader = _modal.find('.solaid-apisol-inner-loader');
    var _ahelp = _modal.find('a.solaid-apisol-link-help');
    var _atree = _modal.find('a.solaid-apisol-tree-fullscreen');
    var _treecont = _modal.find('.solaid-apisol-tree');
    var _root = null;
    var _current = null;
    var _previous = null;
    var _results = [];
    var _questions = [];
    var _ucsList = [];
    var _ucs = null;
    var _uts = null;
    var _utt = null;
    var _c4c = null;
    var _sessionid = Math.ceil(Math.random()*100000000);
    var that = this;

    //init TreeVizu
    var _canvas = _modal.find('#solaid-apisol-tree-canvas');
    var _tree = _canvas.TreeVizu({id: 'solaid-apisol-tree-canvas', 'viewY' : 10});

    this.load = function(lat, lon, srid = 4326) {
      //init coordinates
      this.setLatLon(lat, lon, srid);
      // display modal
      this.open();
      // begin loading
      this.showLoader();
      //send event
      this.trigger('apisol:open', [lat, lon, srid]);
      // load API data
      this.loadUCS()
          .then(function(json) {
              // display UTS if exist
              if(typeof(json.uts) !== 'undefined') {
                _uts = json.uts;
                _ucs = json.ucs[0];
                _ucsList = json.ucs;
                return that.showPageUtsPrecise();
              }
              // else display UCS choice
              else {
                _ucsList = json.ucs;
                _ucs = json.ucs[0];
                that.showPageUcsChoice();

              }
              that.hideLoader();
          });
    }

    this.reset = function() {
      _ucs = null;
      _uts = null;
      _current = null;
      _previous = null;
      _questions = null;
      _results = [];
      _tree.reset();
      _pages.hide();

      return this;
    }

    /*
    get coords url parameters
     */
     this.getCoordsParams = function() {
      return 'x='+parameters.lon+';y='+parameters.lat+';srid='+parameters.srid;
    }


    /*
    Does a ajax request to API getUcs url
     */
    this.loadUCS = function() {
      return new Promise(function(resolve, reject) {
        let url = parameters.url.getucs;
        url = url.replace('__coords__', that.getCoordsParams());
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(json) {
            resolve(json);
          },
          error: function(err) {
            that.openError("Une erreur a eu lieu lors de la requete getucs.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
            reject(err);
          }
          });
      });
    }

    /*
    Does a ajax request to API gettree url
     */
    this.loadQuestions = function() {
        return new Promise(function(resolve, reject) {
          let url = parameters.url.gettree;
          url = url.replace('__id__', _ucs.id);
          url = url.replace('__coords__', that.getCoordsParams());
          $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(json) {
              _ucs = $.extend({}, _ucs, json);
              resolve(json);
            },
            error: function(err) {
              that.openError("Une erreur a eu lieu lors de la requete gettree.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
              reject(err);
            }
          });
        })
    }

    /*
    Load a static version of tree data

    this.loadStaticQuestions = function() {

      //from api
      var json = `{"id":"22_1039","type":"ucs", "libelle":"Sols peu profonds et acides des landes de Locarn issus de granite","reponses":[{"id":"1200","type":"question","libelle":"Quelle est l???occupation du sol et sa position dans le versant???","reponses":[{"value":"Sommet, versant et plateau","id":"1302","type":"question","libelle":"L'apparition de la battance est-elle fr??quente, avec peu de cailloux et graviers en surface ?","reponses":[{"value":"Non","id":"1801","type":"question","libelle":"Des traces d'hydromorphie (taches rouilles/grises) sont-elles observ??es d??s la surface ?","reponses":[{"value":"Non","id":"1404","type":"question","libelle":"Le sol est-il peu profond (<40 cm), avec un horizon de surface particuli??rement fonc??, humif??re ?","reponses":[{"value":"Non","id":"2001","type":"question","libelle":"Quel est la profondeur d???apparition de la roche ?","reponses":[{"value":"Moyennement profond (de 40 ?? 80 cm)","id":"2101","type":"question","libelle":"Quel est l'intensit?? de l'alt??ration du mat??riau parental ?","reponses":[{"value":"Faible","id":"53","type":"uts","libelle":"Sol moyennement profond issu de granite ou gneiss peu alt??r??"},{"value":"Forte","id":"54","type":"uts","libelle":"Sol moyennement profond issu de granite ou gneiss ?? alt??rite sableuse ou sablo-limoneuse"}]},{"value":"Profond ?? tr??s profond (>80 cm)","id":"1900","type":"question","libelle":"Un ph??nom??ne de lessivage des argiles est-il observ?????","reponses":[{"value":"Non","id":"2101","type":"question","libelle":"Quel est l'intensit?? de l'alt??ration du mat??riau parental ?","reponses":[{"value":"Faible","id":"81","type":"uts","libelle":"Sol profond issu de granite ou gneiss non alt??r??"},{"value":"Forte","id":"82","type":"uts","libelle":"Sol profond issu de granite ou gneiss ?? alt??rite sableuse ou sablo-limoneuse"}]},{"value":"Oui","id":"243","type":"uts","libelle":"Sol peu lessiv?? profond issu de granite ou gneiss ?? alt??rite sableuse ou sablo-limoneuse"}]}]},{"value":"Oui","id":"14","type":"uts","libelle":"Sol peu ??pais ?? horizon de surface humif??re issu de granite ou gneiss peu alt??r??"}]},{"value":"Oui","id":"44","type":"uts","libelle":"Sol peu ??pais hydromorphe d??s la surface issu de granite ou gneiss ?? alt??rite limono-sablo-argileuse ou sablo-argileuse"}]},{"value":"Oui","id":"247","type":"uts","libelle":"Sol peu lessiv?? profond hydromorphe apr??s 50 cm issu de limon ??olien superpos?? ?? un autre mat??riau"}]},{"value":"Boisements sur les fortes pentes avant la zone alluviale","id":"392","type":"uts","libelle":"Sol d'apport colluvial limono-sablo-argileux"},{"value":"Bas de versant (prairies humides et friches, proche du cours d'eau)","id":"2001","type":"question","libelle":"Quel est la profondeur d???apparition de la roche ?","reponses":[{"value":"Peu profond (<40 cm)","id":"44","type":"uts","libelle":"Sol peu ??pais hydromorphe d??s la surface issu de granite ou gneiss ?? alt??rite limono-sablo-argileuse ou sablo-argileuse"},{"value":"Profond ?? tr??s profond (>80 cm)","id":"442","type":"uts","libelle":"Sol de fond de vall??e hydromorphe d??s la surface ?? horizons r??ductiques de profondeur d'apport colluvio-alluvial ou alluvial"}]}]}]}`;

      _ucs = JSON.parse(json);
      _questions = _ucs.reponses;
      return _questions
    }
    */





    this.initQuestions = function() {
      _questions = _ucs.reponses;
      _root = _questions[0];
      _current = _questions[0];
      _results = [];
      _results.push(_current);
      this.displayQuestion(_current);
      this.printMetaData();
    }


    this.next = function() {
      //check response
      var reponse = $('input[name=reponse]:checked').val();
      if(reponse === undefined) {
        _warning.removeClass('solaid-apisol-hide').empty().html("Veuillez choisir une r??ponse...");
        _next.addClass('solaid-apisol-hide');
        _radios.one('click', function() {
            _warning.addClass('solaid-apisol-hide');
            _next.removeClass('solaid-apisol-hide');
        })
        return;
      }

      //get corresponding question
      var question = _current.reponses.filter(res => res.value === reponse)[0];

      //if user cannot answer the question, return the UTT
      if(reponse == 'unknown') {
        _results.push(_current);
        setTimeout(function() { that.showPageUttFound(); }, 200);
        return;
      }

      //display UTS found
      if(question.type == 'uts') {
        _uts = question;
        _results.push(_uts);
        setTimeout(function() { that.showPageUtsFound(); }, 200);
        return;
      }

      //set current questions status
      _previous = _current;
      _current = question;
      _results.push(_current);

      //display question
      this.displayQuestion(_current);
      $('input[name=reponse]').prop("checked", false);
      this.moveTreeTo(_current);

      //display previous button
      this.displayQuestionButtons();

    }

    this.prev = function() {
      //save previous question
      _previous = _current;
      //hide submit button
      if(_previous.type === 'uts') {
        _next.removeClass('solaid-apisol-hide');
        _submit.addClass('solaid-apisol-hide');
      }

      //find new current question
      _current = _results[_results.length-2];
      if(_current === undefined) _current = _root;
      _results.pop();

      this.displayQuestion(_current);
      $('input[name=reponse]').prop("checked", false);

      //display next button
      this.displayQuestionButtons();

      //reset previous node style
      var node = _tree.findNodeById(_previous.id);
      _tree.styleNode(node, {'link': {'color': '#AAA'}});

      //move to node
      this.moveTreeTo(_current);
    }

    this.goToQuestion = function(id) {
      //save previous question
      _previous = _current;

      //find new current question
      _current = _results.find(r => r.id == id);
      if(_current === undefined) throw new Error('Question with id '+id+' does not exist');

      //update _results
      let update = [];
      for(let i=0, ln=_results.length; i<ln; i++) {
        update.push(_results[i]);
        if(_results[i].id == id) break;
      }
      _results = update;

      //display question
      this.displayQuestion(_current);

      //show buttons
      this.displayQuestionButtons();

      //reset previous node style
      var node = _tree.findNodeById(_previous.id);
      _tree.styleNode(node, {'link': {'color': '#AAA'}});

      //move to node
      this.moveTreeTo(_current);

    }

    this.displayQuestion = function(question) {
      //display question libelle
      _ask.find('span').empty().text(question.libelle);
      _ask.find('strong').empty().text('Q'+(_results.length));

      //if question has responses
      if(typeof question.reponses !== 'undefined' && question.reponses.length > 0) {
        //remove radio buttons
        _radios.empty();
        //construct new radio buttons
        let html = '';
        question.reponses.map(function(r) {
          html += '<div class="solaid-apisol-radio">';
          html += '<input type="radio" id="radio'+r.id+'" name="reponse" value="'+r.value+'">';
          html += '<label for="radio'+r.id+'"><strong></strong><span>'+r.value+'</span></label>';
          html += '</div>';
        });
        //add "i dont know button" when expertise is required
        if(question.expertise >= 2) {
          html += '<div class="solaid-apisol-radio">';
          html += '<input type="radio" id="radio0" name="reponse" value="unknown">';
          html += '<label for="radio0"><strong></strong><span>Je ne sais pas r??pondre</span></label>';
          html += '</div>';
        }

        _radios.html(html);
      }

      // display link
      this.displayLink(question);

      //send report to server
      this.sendUTSReport(1);

      //send event
      this.trigger('question:display', [question]);

    }

    this.displayLink = function(question) {
      //begin with UCS link
      let links = '<a href="#" class="solaid-apisol-ariane-ucs"><strong>UCS</strong><small>'+_ucs.libelle+'</small></a>';
      //create links to question
      _results.map(function(r, i) {
          if(i < _results.length - 1) {
              links += '<a href="#" class="solaid-apisol-ariane-q q'+(i+1)+'" data-question-id="'+r.id+'"><strong>'+'Q'+(i+1)+'</strong><small>'+r.libelle+'</small></a>';
          }
      });
      _arianne.html(links);
      //assign click events
      _arianne.find('a.solaid-apisol-ariane-q').one('click', this.arianne_clicked);
      _arianne.find('a.solaid-apisol-ariane-ucs').one('click', this.showPageUcsChoice);
      //stick scrollbar to bottom
      _arianne.scrollTop(1500);

    }

    this.displayQuestionButtons = function() {
      if(_results.length == 1) {
        _prev.addClass('solaid-apisol-hide');
        _back.removeClass('solaid-apisol-hide');
      }
      if(_results.length > 1) {
        _prev.removeClass('solaid-apisol-hide');
        _back.addClass('solaid-apisol-hide');
      }
    }

    this.showPageUttFound = function() {
      that.showLoader();
      that.loadUTTRessource(_current)
        .then(function(data) {
          _uts = $.extend({}, _uts, data);
          _uts.libelle = _uts.nom_utx; //dirty fix to homogenize format between UTS et UTSPrecise. (should better be done at the API level)
          _utt = _uts;

          console.log(_uts, data);

          //change display
          _pages.hide();
          let page = _pages.filter('.solaid-apisol-body-utt-found');
          page.show();
          //update html
          page.find('.solaid-apisol-utt-found').empty().html(_uts.nom_utx);
          page.find('.solaid-apisol-no-utx').empty().html('UTT ' +_uts.no_utx);
          page.find('.solaid-apisol-link-pdf').prop('href', _uts.ressourcelink);
          page.find('.solaid-apisol-link-info').prop('href', _uts.externallink);
          //add event
          page.find('.solaid-apisol-btn-back').one('click', that.returnFromPageUttFound);
          page.find('.solaid-apisol-btn-confirm').one('click', that.showPageConfirm);
          //hide loader
          that.hideLoader()
          //send report to server
          that.sendUTSReport(2)
          // send event
          that.trigger('uts:found', [_uts]);
        });
    }

    this.showPageUtsFound = function() {
      that.showLoader();
      that.loadUTSRessource(_uts)
        .then(function(data) {
          _uts = $.extend({}, _uts, data);
          console.log(_uts);
          //change screen
          _pages.hide();
          let page = _pages.filter('.solaid-apisol-body-uts-found');
          page.show();
          //update html
          page.find('.solaid-apisol-uts-found').empty().html(_uts.nom_utx);
          page.find('.solaid-apisol-no-utx').empty().html('UTS '+_uts.no_utx);
          page.find('.solaid-apisol-link-pdf').prop('href', _uts.ressourcelink);
          page.find('.solaid-apisol-link-info').prop('href', _uts.externallink);
          //add event
          page.find('.solaid-apisol-btn-back').one('click', that.returnFromPageUtsFound);
          page.find('.solaid-apisol-btn-confirm').one('click', that.showPageConfirm);
          //hide loader
          that.hideLoader();
          //send report to server
          that.sendUTSReport(2)
          // send event
          that.trigger('uts:found', [_uts]);
        });
    }

    this.returnFromPageUtsFound = function() {
      if(_questions == null) return that.returnPageUCSChoice();
      if(_c4c !== null) return that.returnPageUCSChoice();
      return that.returnPageQuestions();
    }

    this.returnFromPageUttFound = function() {
      if(_questions == null) return that.returnPageUCSChoice();
      return that.returnPageQuestions();
    }

    this.loadUTTRessource = function(question) {
      return new Promise(function(resolve, reject) {
        let url = parameters.url.getutt;
        url = url.replace('__ucs__', _ucs.id);
        url = url.replace('__idquestion__', question.id);
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(json) {
            resolve(json);
          },
          error: function(err) {
            that.openError("Une erreur a eu lieu lors de la requete getutt.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
            reject(err);
          }
        });
      });
    }

    this.loadUTSRessource = function(uts) {
      return new Promise(function(resolve, reject) {
        //call to getRessource API
        let id = (typeof uts.id == 'string')? uts.id.split('_')[0] : uts.id;
        let url = parameters.url.getuts;
          url = url.replace('__id__', id);
          that.loadRessourceInfo(url).then(json => resolve(json));
      });
    }

    this.loadRessourceInfo = function(url) {
      url = url.replace('__coords__', that.getCoordsParams());
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(json) {
            resolve(json);
          },
          error: function(err) {
            that.openError("Une erreur a eu lieu lors de la requete getressourceinfo.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
            reject(err);
          }
        });
      });
    }

    this.showPageUcsChoice = function() {
      _pages.hide();
      let page = _pages.filter('.solaid-apisol-body-ucs-choice');
      page.show();

      // print UCS data
      page.find('strong.solaid-apisol-ucs-name').empty().html(_ucs.name);
      page.find('span.solaid-apisol-no-utx').empty().html('UCS '+_ucs.id);
      page.find('.solaid-apisol-link-pdf').prop('href', _ucs.ressourcelink);
      let select = page.find('.solaid-apisol-select-ucs');

      // print UCS options
      if(parameters.enableUCSChange) {
        if(_ucsList.length > 1) {
          select.empty();
          select.append($('<option>', { value: '', text: "Choisissez dans la liste une unit?? correspondant mieux ?? votre situation :"}));
          $.each(_ucsList, function (i, item) {
              select.append($('<option>', {
                  value: item.id,
                  text : item.name
              }));
          });
          select.on('change', that.onChangeUcs);
          page.find('.solaid-apisol-other-ucs').show();
          _c4c = null;
        } else {
          page.find('.solaid-apisol-other-ucs').hide();
        }
      } else {
        page.find('.solaid-apisol-other-ucs').hide();
      }
      if(parameters.enableC4C) {
        let codes = _ucs.c4c;
        if(codes && codes.length !== 0) {
          that.updateCode4C(codes);
          page.find('.solaid-apisol-c4c').show();
          page.find('.solaid-apisol-c4c-submit').one('click', that.applyC4CCode);
        }
      } else {
        page.find('.solaid-apisol-c4c').hide();
      }

      //add events
      page.find('.solaid-apisol-btn-close').one('click', that.close);
      page.find('.solaid-apisol-btn-menu').one('click', that.showPageQuestions);
      page.find('.solaid-apisol-ucs-option-checkbox').on('click', function() {
        let bool = $(this).prop('checked');
        if(bool) $(this).parent('label').next('div').show();
        else $(this).parent('label').next('div').hide();
      });

      //trigger event
      that.trigger('ucs:choice', [_ucs]);

    }

    this.updateCode4C = function(codes) {
      if(codes.length>1) {
        let page = _pages.filter('.solaid-apisol-body-ucs-choice');
        let select = page.find('.solaid-apisol-c4c-select');
        select.empty();
        select.append($('<option>',{ value: "", text: "Code 4C..."}));
        codes.sort();
        $.each(codes, function(i, item) {
          select.append($('<option>', {
            value: item,
            text: item
          }));
        });
      }
    }

    this.onChangeUcs = function() {
      if($(this).val() == '') return;
      _ucs = _ucsList.find(u => u.id == $(this).val());
      // print name
      $('.solaid-apisol-body-ucs-choice .solaid-apisol-ucs-name').empty().html(_ucs.name);
      $('.solaid-apisol-body-ucs-choice .solaid-apisol-no-utx').empty().html(_ucs.id);
      $('.solaid-apisol-body-ucs-choice .solaid-apisol-link-info').prop('href','#');
      $('.solaid-apisol-body-ucs-choice .solaid-apisol-link-pdf').prop('href',_ucs.ressourcelink);
      //reset c4c
      _c4c = null;
      that.updateCode4C(_ucs.c4c);
    }

    this.applyC4CCode = function() {
      _c4c = _modal.find('.solaid-apisol-c4c-select').val();

      that.loadCode4C().then(function(filter) {

        //if c4c return only one UTS, go to UtsFound page
        if(filter.uts.length == 1) {
          _uts = {id: parseInt(filter.uts[0]) };
          console.log('c4c return one UTS : ', _uts);
          that.showPageUtsFound();
          return;
        }
        //if c4c return several UTS, filter questions
        if(filter.uts.length > 1) {
          console.log('c4c return many UTS :', filter.uts);
          that.filterUcsByUts(filter.uts);
          return that.showPageQuestions();
        }
      });
    }


    this.loadCode4C = function() {
      return new Promise(function(resolve, reject) {

        if(_c4c == null) resolve({uts:[]});

        let ucsid = _ucs.id.match(/\_[0-9]+$/g)[0].replace('_','');
        let ucsdep = _ucs.id.match(/^[0-9]+\_/g)[0].replace('_','');

        let url = parameters.url.getc4c;
        url = url.replace('__coords__', that.getCoordsParams());
        url = url.replace('__ucs__', ucsid);
        url = url.replace('__dep__', ucsdep);
        url = url.replace('__c4c__', _c4c);

        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(json) {
            resolve(json);
          },
          error: function(err) {
            that.openError("Une erreur a eu lieu lors de la requete getc4c.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
            reject(err);
          }
          });
      });
    }

    this.showPageUtsPrecise = function() {
      that.loadUTSRessource(_uts)
        .then(function(data) {
          _uts = $.extend({}, _uts, data);
          _uts.libelle = _uts.name; //dirty fix to homogenize format between UTS et UTSPrecise. (should better be done at the API level)

          _pages.hide();
          let page = _pages.filter('.solaid-apisol-body-uts-precise');
          page.show();

          //update html
          page.find('.solaid-apisol-uts-precise').html(_uts.name);
          page.find('.solaid-apisol-no-utx').empty().html('UTS '+_uts.id);
          page.find('.solaid-apisol-link-pdf').prop('href', _uts.ressourcelink);
          page.find('.solaid-apisol-link-info').prop('href', _uts.externallink);

          //add event
          page.find('.solaid-apisol-btn-tree').one('click', that.showPageUcsChoice);
          page.find('.solaid-apisol-btn-confirm').one('click', that.showPageConfirm);
          page.find('.solaid-apisol-btn-close').one('click', that.close);

          //trigger event
          that.trigger('utsprecise:detected', [_uts]);

          //hide loader
          that.hideLoader();
      });

    }

    this.showPageQuestions = function() {
      that.loadQuestions()
      .then(function(json) {

        that.trigger('questions:loaded', [json]);

        _pages.hide();
        let page = _pages.filter('.solaid-apisol-body-questions');
        page.show();

        that.initQuestions();

        page.find('.solaid-apisol-back-ucs-choice').one('click', that.showPageUcsChoice);

        let cont = _modal.find('.solaid-apisol-tree');
        let width = cont.width();
        let height = cont.height();
        _tree.reset();
        _tree.resize(width, height);
        that.buildTree();
        that.drawTree();
      });

    }

    this.returnPageQuestions = function() {
      _pages.hide();
      let page = _pages.filter('.solaid-apisol-body-questions');
      page.show();
    }

    this.returnPageUCSChoice = function() {
      _pages.hide();
      let page = _pages.filter('.solaid-apisol-body-ucs-choice');
      _c4c = null;
      page.show();
    }

    this.showPageConfirm = function() {
      that.showLoader();
      that.trigger('uts:confirm', [_uts]);
      that.sendUTSValidation()
        .then(function(json) {

          _pages.hide();
          let page = _pages.filter('.solaid-apisol-body-uts-submitted');
          page.show();

          page.find('.solaid-apisol-uts-confirmed').html(_uts.nom_utx);
          page.find('.solaid-apisol-no-utx').empty().html('UTS '+_uts.no_utx);
          page.find('.solaid-apisol-link-pdf').prop('href', _uts.ressourcelink);
          page.find('.solaid-apisol-link-info').prop('href', _uts.externallink);

          page.find('.solaid-apisol-btn-close').one('click', that.close);

          that.trigger('uts:confirmed', [_uts]);
          that.hideLoader();

        });
    }

    this.sendUTSReport = function(level) {
        if(false == parameters.enableSetUTS) return;

        let url = parameters.url.setuts;
        url = url.replace('__coords__', that.getCoordsParams());
        url = url.replace('__uts__', _uts? _uts.id : 0);
        url = url.replace('__session__', _sessionid);
        url = url.replace('__level__', level);
        url = url.replace('__profil__', parameters.profil);
        url = url.replace('__branche__', JSON.stringify(_results.map(res => parseInt(res.id))));

        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(json) {
            //console.log("Report successful");
          },
          error: function(err) {
            console.log("Une erreur a eu lieu lors de la requete setuts.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
          }
        });
    }

    this.sendUTSValidation = function() {
      return new Promise(function(resolve, reject) {

        let url = parameters.url.setuts;
        url = url.replace('__coords__', that.getCoordsParams());
        url = url.replace('__uts__', _uts? _uts.id : 0);
        url = url.replace('__session__', _sessionid);
        url = url.replace('__level__', 3);
        url = url.replace('__profil__', parameters.profil);
        url = url.replace('__branche__', JSON.stringify(_results.map(res => parseInt(res.id))));

        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(json) {
            resolve(json);
          },
          error: function(err) {
            that.openError("Une erreur a eu lieu lors de la requete setuts.<br> HTTP "+err.status+ "<br>Request: <p>"+url+"</p><br>Response: <p>"+err.responseText+"</p>");
            reject(err);
          }
          });
      });
    }

    this.arianne_clicked = function() {
      let id = $(this).attr('data-question-id');
      that.goToQuestion(id);
    }

    this.filterUcsByUts = function(ids) {
      if(typeof ids == 'undefined' || ids.length == 0)  return _ucs.reponses;
      let filtered = that.filterReponsesByUts(_ucs.reponses, ids);
      let sanitized = that.cutDeadBranch(filtered);
      _ucs.reponses = sanitized;
      return _ucs.reponses;
    }

    this.cutDeadBranch = function(reponses) {
      for(let i=0; i<reponses.length; i++) {
        let r = reponses[i];
        // find branch with one child
        if(r.reponses !== undefined && r.reponses.length == 1) {
          // replace branch info
          reponses[i].id = r.reponses[0].id;
          reponses[i].type = r.reponses[0].type;
          reponses[i].libelle = r.reponses[0].libelle;
          // suppress branch reponses
          reponses[i].reponses = undefined;
          continue;
        }
        // call recursively
        if(reponses[i].reponses !== undefined) reponses[i].reponses = that.cutDeadBranch(reponses[i].reponses);
      }
      return reponses;
    }

    this.filterReponsesByUts = function(reponses, ids) {
      for(let i=0; i<reponses.length; i++) {
        let r = reponses[i];
        // remove all uts that are not in the array
        if(r.type == 'uts' && ids.indexOf(r.id)==-1) reponses.splice(i,1);
        // call recursively
        if(r.reponses !== undefined) reponses[i].reponses = that.filterReponsesByUts(r.reponses, ids);
      }

      return reponses;
    }

    this.openHelp = function() {
      this.showLoader();
      this.getUrlHelpContent(_current)
        .then(url => this.loadHelpContent(url))
        .then(html => this.applyHelpContent(html))
        .then(this.openHelpPopup)
        .catch(err => console.log(err))
        ;
    }

    this.getUrlHelpContent = function(question) {
      return new Promise(function(resolve, reject) {
        //call to getRessource API
        let url = parameters.url.getquestion;
          url = url.replace('__ucs__', _ucs.id);
          url = url.replace('__id__', question.id);
          that.loadRessourceInfo(url).then(json => resolve(json));
      });
    }

    this.loadHelpContent = function(data) {
      return new Promise(function(resolve, reject) {
        if(data.imagelink.length == 0) {
          data.image = "<p> Pas d'image d'aide disponible...</p>";
          resolve(data);
        }
        else {
          let image = new Image()
          image.src = data.imagelink;
          data.image = image;
          image.onload = function() {
            resolve(data)
          }
          image.onerror = function() {
            reject(new Error("Could not load image at" + this.src))
          }
        }
      })
    }

    this.applyHelpContent = function(data) {
      return new Promise(function(resolve, reject) {
        let content = _innerModal.find('.solaid-apisol-inner-modal-content')
        content.html(data.image);
        let buttons = '';
        if(data.externallink.length > 0) buttons += '<a class="solaid-apisol-inner-modal-extra" href="'+data.externallink+'" target="_blank">Plus d\'information</a>';
        buttons += '<button type="button" class="solaid-apisol-inner-modal-close">Fermer</a>';
        let footer = _innerModal.find('.solaid-apisol-inner-modal-footer');
        footer.html(buttons);
        resolve();
      });
    }

    this.openHelpPopup = function() {
        _loader.hide();
        _innerModal.show();
        _innerModal.find('.solaid-apisol-inner-modal-close').one('click', that.closeHelpPopup);
        _innerModal.find('.solaid-apisol-inner-modal-extra').one('click', that.openExtra);
    }

    this.closeHelpPopup = function() {
        let content = _innerModal.find('.solaid-apisol-inner-modal-content')
        _innerModal.hide();
    }

    this.openError = function(msg) {
      let div = _modal.find('.solaid-apisol-error');
      div.show();
      div.find('button').one('click', this.closeError);
      div.find('p').empty().html(msg);
    }

    this.closeError = function() {
      _modal.find('.solaid-apisol-error').hide();
    }

    this.openExtra = function() {
      console.log('openExtra');
    }

    this.openTree = function() {
      _treecont.addClass('open');

      //resize canvas with modal div
      let width = _treecont.width();
      let height = _treecont.height();
      _tree.resize(width, height);

      // close button
      _treecont.find('.solaid-apisol-tree-close').one('click', that.closeTree);
      _treecont.find('.solaid-apisol-tree-print').on('click', that.printTree);

      // tree params
      _tree.centerTo(width/2, height/2);
      _tree.setControlsDisplay(true);
      _tree.setProgressive(false);

      // re-center on current question
      this.moveTreeTo(_current, 0);

      // dispatch event
      this.trigger('tree:open', [width, height]);

    }

    this.closeTree = function(e) {
      _treecont.removeClass('open');

      //resize canvas with modal div
      let width = _treecont.width();
      let height = _treecont.height();
      _tree.resize(width, height);

      _close.off('click', that.closeTree);
      _close.on('click', that.close);

      _tree.centerTo(width/2, 10);
      _tree.setControlsDisplay(false);
      _tree.setProgressive('first-children');
      _tree.setZoom(1);

      that.moveTreeTo(_current, 0);

      // dispatch event
      that.trigger('tree:close', [width, height]);

    }

    this.printTree = function(e) {
      let windowContent = '<!DOCTYPE html>';
      windowContent += '<html>';
      windowContent += '<head><title>Print canvas</title></head>';
      windowContent += '<body>';
      windowContent += '<img src="' + _canvas[0].toDataURL() + '">';
      windowContent += '</body>';
      windowContent += '</html>';

      const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
      printWin.document.open();
      printWin.document.write(windowContent);

      printWin.document.addEventListener('load', function() {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();
      }, true);
    }

    this.buildTree = function() {
        //add root UCS
        let style = {color: '#FFF', fontSize: '12px', 'lineWidth': 300, fontStyle: 'bold', padding:'12', backgroundColor: '#1E90FF', borderColor: '#4169E1', borderRadius: '2'};
        let name = 'UCS '+_ucs.libelle;
        let id = _ucs.id;
        let root = _tree.addRoot(name, {id: id}, style);

        // set tree questions
        let questions = _ucs.reponses;

        //add children questions
        this.addTreeNodes(questions, root);

    }

    this.drawTree = function() {
        _tree.draw();
        _tree.setProgressive('first-children');
        _tree.redraw();
        this.moveTreeTo(_current, 200);
    }

    this.addTreeNodes = function(questions, parent) {

      var objects = questions.map(r => ({name: r.libelle, meta: {id: r.id, type: r.type, label: r.value}}));
      objects.map(function(obj) {
        // change styling
        let style = {};
        // if node is an 'UTS'
        if(obj.meta.type == 'uts') {
          $.extend(true, style, {backgroundColor: '#dd4b39 ', color:'white', borderRadius: '5', borderColor:'white', borderWidth:2});
          //obj.meta.clickAction = function(n) { console.log('click on uts', n); };
          obj.name = '(UTS '+obj.meta.id+') '+obj.name;
        }

        // add node to tree
        let newNode = _tree.addChild(parent, obj, style);

        let question = questions.find(q => q.id == newNode.meta.id);
        if(question.reponses !== undefined && question.reponses.length > 0) {
          that.addTreeNodes(question.reponses, newNode);
        }
      })


    }

    this.moveTreeTo = function(question, time = 650) {
      let node = _tree.findNodeById(question.id);
      //set new style
      node = _tree.styleNode(node, {color: 'black', 'link': {'color': '#555', 'weight': 3}});
      // set parent style
      _tree.styleParents(node, {'color': 'grey', 'link': {'color': '#555', 'weight': 3}}, [_current.id]);
      //move to new node
      _tree.moveTo(node, time);
      //save previous question
      _previous = _current;

    }


    this.getUrlFicheUTS = function(uts) {
      return 'http://apisol.geosas.fr/public/Fiches_UTS/fiche.php?uts=14';
    }

    this.printMetaData = function() {
      $('.solaid-apisol-data-lat').empty().html(parameters.lat);
      $('.solaid-apisol-data-lon').empty().html(parameters.lon);
      $('.solaid-apisol-data-user').empty().html(parameters.user);
    }

    this.showLoader = function() {
      _loader.show();
    }

    this.hideLoader = function() {
      _loader.hide();
    }

    this.resize = function() {
      //re-center tree view
      if(_current !== null) {
        this.moveTreeTo(_current, 200);
      }
    }

    this.open = function() {
      _modal.show();
      this.resize();
      return this;
    }

    this.close = function() {
      _modal.hide();
      that.trigger('apisol:close', [_uts]);
      return this;
    }

    this.setX = function(x) {
      _modal.css({left: (x + _modal.width()/2)});
      return this;
    }

    this.setY = function(y) {
      _modal.css({top: y});
      return this;
    }

    this.setLatLon = function(lat, lon, srid = 2154) {
      parameters.lat = lat;
      parameters.lon = lon;
      parameters.srid = srid;
      return this;
    }

    this.setProfil = function(profil) {
      parameters.profil = profil;
      return this;
    }

    this.setLevel = function(level) {
      parameters.level = level;
      return this;
    }

    this.debug = function() {
      let txt = '';
      txt += _results.map(res => res.id + ':' +res.value);
    }

    //events
    _next.on('click',function(e) { e.preventDefault(); that.next(); that.debug(); });
    _prev.on('click',function(e) { e.preventDefault(); that.prev(); that.debug(); });
    _ahelp.on('click', function(e) { e.preventDefault(); that.openHelp(); })
    _atree.on('click', function(e) { e.preventDefault(); that.openTree(); })
    _close.on('click', that.close);
    $(window).on('resize', function(e) { that.resize(); });
    _modal.on('resize', function(e) { console.log('resize');})

    //initialise
    _modal.hide();

    //permet le chainage jquery
    return this;
  }
})(jQuery);
