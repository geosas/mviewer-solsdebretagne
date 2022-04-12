{
    mviewer.customLayers.idSol = {};
    
    var idSol  = mviewer.customLayers.idSol;
    
    idSol.legend = { items: [] };
    
    var style = [new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#1ab1a7'
        })
      })];
    
    
    
    idSol.legend.items.push({ styles: style, label: "", geometry: "Point" });
    
    mviewer.customLayers.idSol.layer = new ol.layer.Vector({
        source: new ol.source.Vector()    
    });
    
    mviewer.customLayers.idSol.handle = false;
    }
    