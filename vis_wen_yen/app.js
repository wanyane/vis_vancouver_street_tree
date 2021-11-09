
x_offset = 150
y_offset = 250

year_index_map = {
    "2011": {"cnt_x": 0, "cnt_y": 0, "dx": -8*2, "dy": 6*2,  "offset_x": 20,  "offset_y": 0},
    "2012": {"cnt_x": 0, "cnt_y": 0, "dx": -7*2, "dy": 7*2,  "offset_x": 36,  "offset_y": 0},
    "2013": {"cnt_x": 0, "cnt_y": 0, "dx": -6*2, "dy": 8*2,  "offset_x": 52,  "offset_y": 0},
    "2014": {"cnt_x": 0, "cnt_y": 0, "dx": -3*2, "dy": 9*2,  "offset_x": 68,  "offset_y": 0},
    "2015": {"cnt_x": 0, "cnt_y": 0, "dx": -0*2, "dy": 10*2, "offset_x": 84,  "offset_y": 0},

    "2016": {"cnt_x": 0, "cnt_y": 0, "dx": 3*2, "dy": 9*2,  "offset_x": 100,  "offset_y": 0},
    "2017": {"cnt_x": 0, "cnt_y": 0, "dx": 6*2, "dy": 8*2,  "offset_x": 116,  "offset_y": 0},
    "2018": {"cnt_x": 0, "cnt_y": 0, "dx": 7*2, "dy": 7*2,  "offset_x": 132,  "offset_y": 0},
    "2019": {"cnt_x": 0, "cnt_y": 0, "dx": 8*2, "dy": 6*2,  "offset_x": 148,  "offset_y": 0},
};

function continent_to_color(d) {
    if (d['continent'] == "Asia"){
        return "orange"
    } else if (d['continent'] == "North America") {
        return "blue"
    } else if (d['continent'] == "Europe") {
      return "green"
    }
}

function get_cy(d, i) {
    year = d["year"]
    // console.log(year)
    cy = year_index_map[year]["dy"] * year_index_map[year]["cnt_y"]
    year_index_map[String(year)]["cnt_y"] += 1
    return y_offset - cy

}
function get_cx(d) {
    year = d["year"]
    cx = year_index_map[year]["offset_x"] + 
    year_index_map[year]["dx"] * year_index_map[year]["cnt_x"]
    year_index_map[String(year)]["cnt_x"] += 1
    
    return x_offset+cx
}


function render(){
    const canva = d3.select('.canva')

    svg = canva.append('svg')
            .attr('width', 500)
            .attr('height', 500)

    circles =  svg.selectAll("circle")
    circles.data(data)
          .enter().append("circle")
          .attr('cx', get_cx)
          .attr('cy', get_cy)
          .attr('r', 6)
          .attr('fill', continent_to_color)
}

function update(data) {
    // init year_index_map
    for (year in year_index_map) {
        year_index_map[year]["cnt_x"] = 0
        year_index_map[year]["cnt_y"] = 0
    }
    circles =  svg.selectAll("circle")
    circles.data(data)
        .transition()
        .duration(800)
        .attr('fill', continent_to_color)
}
render()
// update(data)

i = 0
setInterval(() => {
    m = ["Asia", "Europe", "North America"]
    if (i%2 == 0){
        update(data_test)    
    } else {
        update(data)    
    }
    i += 1
}, 1000);

