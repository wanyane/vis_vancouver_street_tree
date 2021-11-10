
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
        color = "#ff9933"
    } else if (d['continent'] == "North America") {
        color = "#3366ff"
    } else if (d['continent'] == "Europe") {
        color = "#00cc66"
    }
    return color
}

function get_cy(d, i) {
    year = d["year"]
    cy = year_index_map[year]["dy"] * year_index_map[year]["cnt_y"]
    year_index_map[String(year)]["cnt_y"] += 1
    return y_offset - cy
}
function get_cx(d) {
    year = d["year"]
    cx = year_index_map[year]["offset_x"] + 
    year_index_map[year]["dx"] * year_index_map[year]["cnt_x"]
    year_index_map[String(year)]["cnt_x"] += 1
    
    return x_offset + cx
}


function render(svg, data, cls){
    // init year_index_map
    for (year in year_index_map) {
        year_index_map[year]["cnt_x"] = 0
        year_index_map[year]["cnt_y"] = 0
    }

    circles =  svg.selectAll("."+cls)
    circles.data(data)
          .enter().append("circle")
          .attr('class', cls)
          .attr('cx', get_cx)
          .attr('cy', get_cy)
          .attr('r', 6)
          .attr('fill', "white")
          .attr('opacity', (d) => d["opacity"])
        //   .attr('stroke', 'black')
}

function update(data, cls, duration, get_cx, get_cy, fill) {
    // init year_index_map
    for (year in year_index_map) {
        year_index_map[year]["cnt_x"] = 0
        year_index_map[year]["cnt_y"] = 0
    }
    circles =  svg.selectAll("."+cls)
    circles.data(data)
        .transition()
        .duration(duration)
        .attr('cx', get_cx)
        .attr('cy', get_cy)
        .attr('fill', fill)
        .attr('opacity', (d) => d["opacity"])
}

function grow_tree(data) {
    i = 0
    grow = setInterval(() => {
        data[i]["opacity"] = 1
        update(data, "normal_view", 300, get_cx, get_cy, "#00cc66")
        i++
        if (i == data.length) {
            clearInterval(grow)
        }
    }, 100);
}

function grow_percentage_tree(data) {
    for (i=0; i<data.length; i++) {
        data[i]["opacity"] = 1
    }
    update(data, "percentage_view", 1000, get_cx, get_cy, continent_to_color)
}

function switch_to_normal_view() {
    for (i=0; i<data_percentage_view.length; i++) {
        data_percentage_view[i]["opacity"] = 0
    }
    update(data_percentage_view, "percentage_view", 600, get_cx, ()=>400, continent_to_color)
    
    setTimeout(() => {
        // go back to original position
        update(data_percentage_view, "percentage_view", 10, get_cx, get_cy, continent_to_color)
        setTimeout(() => {
            grow_tree(data)    
        },100);
    },650);
}

function switch_to_percentage_view() {
    for (i=0; i<data.length; i++) {
        data[i]["opacity"] = 0
    }
    update(data, "normal_view", 600, get_cx, ()=>400, "#00cc66")
    
    setTimeout(() => {
        // go back to original position
        update(data, "normal_view", 10, get_cx, get_cy, "#00cc66")
        setTimeout(() => {
            grow_percentage_tree(data_percentage_view)
        },100);
    },650);
}

function switch_view_utility() {
    let static_value = 0
    function on_switch_view_clicked() {
        static_value += 1
        if (static_value % 2 == 0) { //switch to normal view
            switch_to_normal_view()

        } else { //switch to percentage view
            switch_to_percentage_view()
        }
        
    }
    return on_switch_view_clicked
}


function main() {
    continent_cnt = {}
    for (year in year_index_map) {
        if (continent_cnt[year] in continent_cnt == false) {
            continent_cnt[year] = {
                "Asia": 0,
                "Europe": 0,
                "North America": 0,
            }
        }
    }

    for (i=0; i<data.length; i++) {
        data[i]["opacity"] = 0
        // calculate continent_cnt
        continent_cnt[data[i]["year"]][data[i]["continent"]] += 1
    }

    data_percentage_view = []
    num_of_leaves_each_tree = 3
    for (year in year_index_map) {
        total = continent_cnt[year]["Asia"] + continent_cnt[year]["Europe"] + continent_cnt[year]["North America"]
        asia_norm =  Math.round(continent_cnt[year]["Asia"] / total * num_of_leaves_each_tree)
        europe_norm = Math.round(continent_cnt[year]["Europe"] / total * num_of_leaves_each_tree)
        na_norm = Math.round(continent_cnt[year]["North America"] / total * num_of_leaves_each_tree)

        for (i=0;i<asia_norm;i++) {
            data_percentage_view.push({
                "year": year,
                "continent": "Asia",
                "opacity": 0
            })
        }
        
        for (i;i<asia_norm + europe_norm;i++) {
            data_percentage_view.push({
                "year": year,
                "continent": "Europe",
                "opacity": 0
            })
        }
        
        for (i;i<num_of_leaves_each_tree;i++) {
            data_percentage_view.push({
                "year": year,
                "continent": "North America",
                "opacity": 0
            })
        }
    }


    const canva = d3.select('.canva')
    svg = canva.append('svg')
            .attr('width', 500)
            .attr('height', 500)

    render(svg, data, "normal_view")
    render(svg, data_percentage_view, "percentage_view")

    // grow_percentage_tree(data_percentage_view)
    // console.log(data)
    
    grow_tree(data)
    
    

}
on_switch_view_clicked = switch_view_utility()
main()
