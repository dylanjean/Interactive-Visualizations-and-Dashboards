d3.json("samples.json").then((data) =>{
    var sampleData = data.samples;
    var sampleId = sampleData.map(x => x.id);
    var otuId = sampleData.map(x => x.otu_ids);
    var otuLabels = sampleData.map(x => x.otu_labels);
    var sampleValues = sampleData.map(x => x.sample_values);
    var metadata = data.metadata;

    var formattedData = []
    
    sampleData.forEach( (x,y) => {
        id = sampleId[y]
        
        x.otu_labels.forEach((i, j) =>{
             
            formattedData.push({
                "ID":id,
                "otu_id":x.otu_ids[j],
                "otu_label":i,
                "sampleValues": x.sample_values[j]
                
            })
            
        })

    })

    var select = d3.select("select")
    sampleId.forEach( d =>{
        var opt = select.append("option");
        opt.property("value",d);
        opt.text(d);

    });
    sampleValues.forEach(value => {
        value.splice(10);
    });
    otuLabels.forEach(value => {
        value.splice(10);
    });
    otuId.forEach(value => {
        value.splice(10);
    });
    var dataObjs = [];
    var subjectIDs = [];

    sampleData.forEach( (x,y) => {
        id = sampleId[y]
        subjectIDs.push(id)
        x.otu_ids.forEach((i, j) =>{
             
            dataObjs.push({
                "ID":id,
                "otu_id":i,
                "otu_label":x.otu_labels[j],
                "sampleValues": x.sample_values[j]
                
            })
            
        })

    })
   



    function init(){
        var starterData = dataObjs.filter(function(obj) {
            return obj.ID === "940";
        });
       
        var labels = starterData.map(d =>d.otu_id)
        var lText = labels.map(d =>{
            return d.otu_id = `OTU  ${d.toString()}`; 
        });
        
        var trace1 = [{
            x: starterData.map(d =>d.sampleValues).reverse(),
            y: lText.reverse(),
            text: starterData.map(d =>d.otu_label).reverse(),
            orientation: "h",
            type: "bar"
          }];

          var layout = {
            height: 600,
            width: 800,
  
          };
        
          Plotly.newPlot("bar", trace1, layout );

          var fullFiltered = starterData.filter(function(obj) {
            return obj.ID === "940";
          });

          var trace2 = [{
            x: fullFiltered.map(d =>d.otu_id).reverse(),
            y: fullFiltered.map(d =>d.sampleValues).reverse(),
            text: fullFiltered.map(d =>d.otu_label).reverse(),
            mode: 'markers',
            marker: {
                color:fullFiltered.map(d =>d.otu_id).reverse(),
                size: fullFiltered.map(d =>d.sampleValues).reverse()
            }
        }];
        Plotly.newPlot("bubble", trace2, layout );

        var table = d3.select("#sample-metadata");
        var info = metadata.filter(d => d.id === 940);
        console.log(metadata)
        info.forEach( sample =>{
            
            
            Object.entries(sample).forEach(([key, value]) =>{
                table.append("ul")
                .append("li")
                .text(`${key}: ${value}`)
            });
        });
        
    };

    d3.selectAll("#selDataset").on("change", refreshTable);

    function refreshTable() {
        var dropdownMenu = d3.select("select");
        var idNo = dropdownMenu.property("value");
        var filtered = dataObjs.filter(function(x) {
            return x.ID === idNo;
        });
        var fullFiltered = formattedData.filter(function(x) {
            return x.ID === idNo;
        });

        refreshCharts(filtered, fullFiltered);

        d3.selectAll("ul").remove()
        d3.selectAll("li").remove()
        var info = metadata.filter(d => d.id === +option);
  
        info.forEach( sample =>{
            var ul = infoTable.append("ul")
            
            Object.entries(sample).forEach(([key, value]) =>{
                var li=ul.append("li")
                li.text(`${key}: ${value}`)
            });
        });

    };

    function refreshCharts(newdata, fullnewdata) {
        var labels = newdata.map(d =>d.otu_id)
        var lText = labels.map(d =>{
            return d = "OTU " + d.toString(); 
        });
        var updateBar = {
            x: [newdata.map(d =>d.sampleValues).reverse()],
            y: [lText.reverse()],
            text: [newdata.map(d =>d.otu_label).reverse()],
            orientation: "h",
            type: "bar"
        }
        Plotly.update("bar", updateBar);
        
        var updateBubble = {
            x: [fullnewdata.map(d =>d.otu_id).reverse()],
            y: [fullnewdata.map(d =>d.sampleValues).reverse()],
            text: [fullnewdata.map(d =>d.otu_label).reverse()],
            mode: 'markers',
            marker: {
                color:fullnewdata.map(d =>d.otu_id).reverse(),
                size: fullnewdata.map(d =>d.sampleValues).reverse()
            }
        }
        Plotly.update("bubble", updateBubble);

    };


    init()


});