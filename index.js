// Initialize the page by saying that nothing has 
// been selected yet.
d3.select("#prof_a").text("No profile selected yet")

// This function operates when you change the text box
function handleChange(event){
  
  // Collect the string of text that was inputted.
  var text1 = d3.event.target.value;
  // initialize these lists, which we'll use and define
  // later
  wfr = [];
  bubble_ids = [];
  bubble_data = [];
  bubble_root = [];
  bubble_bact = [];
  chart_ids = [];
  chart_data = [];
  chart_bact = [];
  tester = [];

  // Use D3 to grab the json file 
  d3.json("navel_data.json").then((data) => {
    // We're setting "samples" and "meta" libraries
    // as variables.  We're also defining the list 
    // 'tester' in this anonymous function.
    var samples = data.samples;
    var meta = data.metadata;
    tester = [];

    // This test will appear if the function doesn't yield 
    // any data (i.e. if the text is invalid)
    d3.select("#prof_a").text("Please select a valid ID")
    d3.select("#prof_b").text(" ")
    d3.select("#prof_c").text(" ")
    d3.select("#prof_d").text(" ")
    d3.select("#prof_e").text(" ")
    d3.select("#prof_f").text(" ")
    d3.select("#prof_g").text(" ")

    // We're reading the 'samples' data
    samples.forEach(function(sample) {
    // Check if any Sample IDs match the text the user typed  
      if (sample.id == text1) {
      // If so, add the value to the list "tester"
        tester.push(sample.id)
        // run through all of the OTU IDs and push out the information
        // into the corresponding lists.
        for (var i = 0; i < sample.otu_ids.length; i++){
          if(sample.otu_ids[i]) {
            bubble_ids.push(sample.otu_ids[i])
            bubble_data.push(sample.sample_values[i])
            bubble_root.push(Math.sqrt(sample.sample_values[i])*5)
            bubble_bact.push(sample.otu_labels[i])
          }
        }
        // run through the top ten OTU IDs and push the information into
        // corresponding lists.  Stop if there are less than ten IDs.
        for (var i = 0; i < 10; i++){
          if(sample.otu_ids[i]) {
            chart_ids.push(String("OTU" + sample.otu_ids[i]))
            chart_data.push(sample.sample_values[i])
            chart_bact.push(sample.otu_labels[i])
          }
        }
      }
    })
    // Go through the meta data.  For each library in meta data,
    // search for the user's input
    meta.forEach(function(metus) {
      if (metus.id == text1) {
        // if you find the user's input, turn all the data in the
        // library into variables
        var sub_idn = metus.id;
        var sub_eth = metus.ethnicity;
        var sub_gen = metus.gender;
        var sub_age = metus.age;
        var sub_loc = metus.location;
        var sub_bbt = metus.bbtype;
        var sub_wfr = metus.wfreq;  
        // Push the weekly frequency of washes.  This will be used
        // for the gauge plot.
        wfr.push(sub_wfr);
        
        // Write the variables into the Patient Profile Box.
        // This replaces the initialized paragraphs at the top
        // of this js file.  Note that if text1 is not found,
        // the initialized paragraphs remain.
        d3.select("#prof_a").text("ID #: " + sub_idn)
        d3.select("#prof_b").text("Ethnicity: " + sub_eth)
        d3.select("#prof_c").text("Gender: " + sub_gen)
        d3.select("#prof_d").text("Age: " + sub_age)
        d3.select("#prof_e").text("Location: " + sub_loc)
        d3.select("#prof_f").text("BB Type: " + sub_bbt)
        d3.select("#prof_g").text("Washing Freq.: " + sub_wfr)
      }
    })


    // Develop the data for the the Horizontal chart
    var trace1 = {
      type: "bar",
      x: chart_data,
      y: chart_ids,
      text: chart_bact,
      orientation: 'h',
    };
    
    var data = [trace1];
    
    // Develop the layout for the horizontal chart
    var layout = {
      title: `Subject ${text1}'s Navel Bacteria Profile`
    };
    
    // Plot the chart if the "tester" list, previously defined 
    // as a null list, has an element.  "tester" can only have
    // an element if the user's text matches an ID (see line 46)
    if (tester[0]) {
    Plotly.newPlot("bar-plot", data, layout);
    }

    // This the data for the bubble chart
    var trace2 = {
      mode: 'markers',
      x: bubble_ids,
      y: bubble_data,
      marker: {
        size: bubble_root,
        color: "aquamarine",
        opacity: 0.5
      }
    };
    
    var data2 = [trace2];

        // Develop the layout for the bubble chart

    var layout2 = {
      title: `Subject ${text1}'s Navel Bacteria Profile, Bubble Form`
    };
    
    // Plot the Bubble chart iff the the user's text matches an ID
    // (See line 116)
    if (tester[0]) {
    Plotly.newPlot("bubble-plot", data2, layout2);
    }

    // This is for the Indicator
    var trace3 = 
      {
        domain: { x: [0, 10], y: [0, 10] },
        value: wfr[0],
        type: "indicator",
        mode: "gauge+number",
        width: 200,
        gauge: {
          axis: { range: [0,10]}
        }
      }
      ;
    
    var data3 = [trace3];
    
    var layout3 = {
      title: `Subject ${text1}'s Number of Weekly Washings`,
      width: 500, height: 300,
      margin: { t: 50, r: 35, l: 35, b: 15 }
        };
    
    // Plot the Gauge chart iff the the user's text matches an ID
    // (See line 116)        
    if (tester[0]) {
    Plotly.newPlot("gauge-plot", data3, layout3);
    }
    // if the user's text does NOT match an ID, it will clear any 
    // plots that might have been on the page previously.
    else {
      d3.select("#gauge-plot").html(null);
      d3.select("#bar-plot").html(null);
      d3.select("#bubble-plot").html(null);
    }
  });
}

// I defined the 'text1' variable here because it's right next to 
// the line where I execute the function.
var text1 = d3.select("#text");

// This is the line where I execute the function
text1.on("change", handleChange);



// Use D3 to select the table body
d3.json("navel_data.json").then((data) => {
  // Create a variable for the "samples" portion of the data
  var samples = data.samples;

  // These six 'for' loops create columns of the ID data
  for (var i = 0; i < 26; i++) {
    d3.select("#col1").append("p").text(samples[i].id)
  }

  for (var i = 26; i < 52; i++) {
    d3.select("#col2").append("p").text(samples[i].id)
  }

  for (var i = 52; i < 78; i++) {
    d3.select("#col3").append("p").text(samples[i].id)
  }

  for (var i = 78; i < 103; i++) {
    d3.select("#col4").append("p").text(samples[i].id)
  }

  for (var i = 103; i < 128; i++) {
    d3.select("#col5").append("p").text(samples[i].id)
  }

  for (var i = 128; i < 153; i++) {
    d3.select("#col6").append("p").text(samples[i].id)
  }                    
})  