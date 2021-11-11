
x_offset = 150
y_offset = 350

year_index_map = {
    "2011": {"cnt_x": 0, "cnt_y": 0, "dx": -4*2, "dy": 6*2,  "offset_x": 20,  "offset_y": 0},
    "2012": {"cnt_x": 0, "cnt_y": 0, "dx": -3*2, "dy": 7*2,  "offset_x": 36,  "offset_y": 0},
    "2013": {"cnt_x": 0, "cnt_y": 0, "dx": -2*2, "dy": 8*2,  "offset_x": 52,  "offset_y": 0},
    "2014": {"cnt_x": 0, "cnt_y": 0, "dx": -1*2, "dy": 9*2,  "offset_x": 68,  "offset_y": 0},
    
    "2015": {"cnt_x": 0, "cnt_y": 0, "dx": -0*2, "dy": 10*2, "offset_x": 84,  "offset_y": 0},

    "2016": {"cnt_x": 0, "cnt_y": 0, "dx": 1*2, "dy": 9*2,  "offset_x": 100,  "offset_y": 0},
    "2017": {"cnt_x": 0, "cnt_y": 0, "dx": 2*2, "dy": 8*2,  "offset_x": 116,  "offset_y": 0},
    "2018": {"cnt_x": 0, "cnt_y": 0, "dx": 3*2, "dy": 7*2,  "offset_x": 132,  "offset_y": 0},
    "2019": {"cnt_x": 0, "cnt_y": 0, "dx": 4*2, "dy": 6*2,  "offset_x": 148,  "offset_y": 0},
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


function render(data, cls){
    // init year_index_map
    for (year in year_index_map) {
        year_index_map[year]["cnt_x"] = 0
        year_index_map[year]["cnt_y"] = 0
    }

    circles =  g.selectAll("."+cls)
    circles.data(data)
          .enter().append("circle")
          .attr('class', cls)
          .attr('cx', get_cx)
          .attr('cy', get_cy)
          .attr('r', 6)
          .attr('fill', "white")
          .attr('opacity', (d) => d["opacity"])
          .attr('visibility', "collapse")
          .attr('data_idx', (_, i) => i)
          .on('click', on_node_clicked)
        //   .attr('stroke', 'black')       
}

function create_pie_chart(cx, cy, data_idx) {
    // test pie
    let data = [
        {"continent": "Asia", "cnt": data_month_view[data_idx]["Asia"]},
        {"continent": "Europe", "cnt": data_month_view[data_idx]["Europe"]},
        {"continent": "North America", "cnt": data_month_view[data_idx]["North America"]}
    ]
    // var data = [{name: "Alex", share: 20.70}, 
    //             {name: "Shelly", share: 30.92},
    //             {name: "Clark", share: 15.42},
    //             {name: "Matt", share: 13.65},
    //             {name: "Jolene", share: 19.31}];

    var pie = d3.pie().value(function(d) { 
                return d.cnt; 
    })

    var color = d3.scaleOrdinal()
                  .domain(data)
                  .range(["orange", "green", "blue"])

    g.selectAll("piechart")
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class', 'piechart')
        .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(6)
             )
            
        .attr("stroke", "white")
        .attr('transform', 'translate(' + cx + ',' + cy + ')')
        .style("stroke-width", "0px")
        .attr('fill', function(d){ 
            console.log(d, d.data.continent)
            console.log(color)
            return(color(d.data.continent)) })
        .on('click', ()=>{
            g.selectAll(".piechart").remove()
        })
}

function zoom_in_click_utility(event) {
    let static_value = 0    
    function clicked(event) {
        // console.log(event, event.srcElement.attributes.data_idx.value)
        // remove previous piechart
        g.selectAll(".piechart").remove()

        event.stopPropagation();
        cx = event.path[0].cx.baseVal.value
        cy = event.path[0].cy.baseVal.value
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity.translate(250,250).scale(8).translate(-cx, -cy),
          d3.pointer(event)
        )
        // create pie chart
        
        data_idx = event.srcElement.attributes.data_idx.value
        create_pie_chart(cx, cy, data_idx)

        static_value += 1
      }
    return clicked
}



function update(data, cls, duration, get_cx, get_cy, fill) {
    // init year_index_map
    for (year in year_index_map) {
        year_index_map[year]["cnt_x"] = 0
        year_index_map[year]["cnt_y"] = 0
    }
    circles =  g.selectAll("."+cls)
    circles.data(data)
        .transition()
        .duration(duration)
        .attr('cx', get_cx)
        .attr('cy', get_cy)
        .attr('fill', fill)
        .attr('opacity', (d) => d["opacity"])
        .attr('visibility', (d) => d["visibility"])
}

function grow_tree(data) {
    i = 0
    grow = setInterval(() => {
        // console.log()
        data[i]["opacity"] = 1
        data[i]["visibility"] = "visible"
        update(data, "normal_view", 300, get_cx, get_cy, "#00cc66")
        i++
        if (i == data.length) {
            clearInterval(grow)
        }
    }, 100);
}

function grow_month_tree(data) {
    i = 0
    grow = setInterval(() => {
        data[i]["opacity"] = 0.3+(data[i]["total"]/1000)
        data[i]["visibility"] = "visible"
        update(data, "month_view", 300, get_cx, get_cy, "#00cc66")
        i++
        if (i == data.length) {
            clearInterval(grow)
        }
    }, 100);
}

function grow_percentage_tree(data) {
    for (i=0; i<data.length; i++) {
        data[i]["opacity"] = 1
        data[i]["visibility"] = "visible"
    }
    update(data, "percentage_view", 1000, get_cx, get_cy, continent_to_color)
}

function switch_to_normal_view() {
    for (i=0; i<data_percentage_view.length; i++) {
        data_percentage_view[i]["opacity"] = 0
        data_percentage_view[i]["visibility"] = "collapse"
    }
    update(data_percentage_view, "percentage_view", 600, get_cx, ()=>400, continent_to_color)
    
    setTimeout(() => {
        // go back to original position
        update(data_percentage_view, "percentage_view", 10, get_cx, get_cy, continent_to_color)
        setTimeout(() => {
            grow_tree(data_normal_view)    
        },100);
    },650);
}

function switch_to_month_view() {
    for (i=0; i<data_normal_view.length; i++) {
        data_normal_view[i]["opacity"] = 0
        data_normal_view[i]["visibility"] = "collapse"
    }
    update(data_normal_view, "normal_view", 600, get_cx, ()=>400, "#00cc66")
    
    setTimeout(() => {
        // go back to original position
        update(data_normal_view, "normal_view", 10, get_cx, get_cy, "#00cc66")
        setTimeout(() => {
            grow_month_tree(data_month_view)    
        },100);
    },650);
}

function switch_to_percentage_view() {
    for (i=0; i<data_month_view.length; i++) {
        data_month_view[i]["opacity"] = 0
        data_month_view[i]["visibility"] = "collapse"
    }
    update(data_month_view, "month_view", 600, get_cx, ()=>400, "#00cc66")
    
    setTimeout(() => {
        // go back to original position
        update(data_month_view, "month_view", 10, get_cx, get_cy, "#00cc66")
        setTimeout(() => {
            grow_percentage_tree(data_percentage_view)
        },100);
    },650);
}

function switch_view_utility() {
    let static_value = 0
    function on_switch_view_clicked() {
        static_value += 1
        if (static_value % 3 == 0) { //switch to normal view
            switch_to_normal_view()

        } else if (static_value % 3 == 1) {
            switch_to_month_view()
        } else { //switch to percentage view
            switch_to_percentage_view()
        }
        
    }
    return on_switch_view_clicked
}

function data_preprocessing() {
    statistics = {}
    for (y=2011; y<=2019; y++) {
        statistics[String(y)] = {}
        statistics[String(y)]["year_total"] = 0
        for (m=1; m<=12; m++) {
            statistics[String(y)][String(m)] = {
                "Asia": 0,
                "Europe": 0,
                "North America": 0,
                "total": 0,
            }
        }
    }
    
    for (i=0; i<data.length; i++) {
        year = data[i].year
        month = data[i].month
        continent = data[i].continent
        statistics[String(year)][String(month)][String(continent)] += 1
        statistics[String(year)][String(month)]["total"] += 1
        statistics[String(year)]["year_total"] += 1
    }
    console.log(statistics)

    // calculate data_normal_view
    data_normal_view = []
    for (y=2011; y<=2019; y++) {
        leaf_cnt = Math.ceil(statistics[String(y)]["year_total"] / 500)
        for (leaf=1; leaf<=leaf_cnt; leaf++) {
            data_normal_view.push({
                "year": y,
                "opacity": 0
            })
        }
    }
    // console.log(data_normal_view)

    // calculate data_normal_view
    data_month_view = []
    for (y=2011; y<=2019; y++) {
        for (m=1; m<=12; m++) {
            data_month_view.push({
                "year": y,
                "Asia": statistics[String(y)][String(m)]["Asia"],
                "Europe": statistics[String(y)][String(m)]["Europe"],
                "North America": statistics[String(y)][String(m)]["North America"],
                "total": statistics[String(y)][String(m)]["total"],
                "opacity": 0
            })
        }
    }

    console.log(data_month_view)

    // calculate data_percentage_view
    data_percentage_view = []
    num_of_leaves_each_tree = 10
    for (y=2011; y<=2019; y++) {
        total = 0
        asia = 0
        europe = 0
        na = 0
        for (m=1; m<=12; m++) {
            total += statistics[String(y)][String(m)]["total"]
            asia += statistics[String(y)][String(m)]["Asia"]
            europe += statistics[String(y)][String(m)]["Europe"]
            na += statistics[String(y)][String(m)]["North America"]
        }
        
        asia_norm =  Math.round(asia / total * num_of_leaves_each_tree)
        europe_norm = Math.round(europe / total * num_of_leaves_each_tree)
        na_norm = Math.round(na / total * num_of_leaves_each_tree)

        for (i=0;i<asia_norm;i++) {
            data_percentage_view.push({
                "year": y,
                "continent": "Asia",
                "opacity": 0
            })
        }
        
        for (i;i<asia_norm + europe_norm;i++) {
            data_percentage_view.push({
                "year": y,
                "continent": "Europe",
                "opacity": 0
            })
        }
        
        for (i;i<num_of_leaves_each_tree;i++) {
            data_percentage_view.push({
                "year": y,
                "continent": "North America",
                "opacity": 0
            })
        }
    }
    return {
        "data_normal_view": data_normal_view,
        "data_month_view": data_month_view,
        "data_percentage_view": data_percentage_view
    }

}

function main() {

    views = data_preprocessing()
    data_normal_view = views.data_normal_view
    data_month_view = views.data_month_view
    data_percentage_view = views.data_percentage_view
    


    render(data_normal_view, "normal_view")
    render(data_month_view, "month_view")
    render(data_percentage_view, "percentage_view")
    setTimeout(() => {
        grow_tree(data_normal_view)
    }, 1000);
    
    

}
on_switch_view_clicked = switch_view_utility()
on_node_clicked = zoom_in_click_utility()
const canva = d3.select('.canva')
const svg = canva.append('svg')
        .attr('viewBox', [0, 0, 500, 500])
const g = svg.append("g")


// zoom
const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .on("zoom", zoomed);

function zoomed({transform}) {
g.attr("transform", transform);
}

svg.call(d3.zoom()
      .extent([[300, 300], [400, 400]])
      .scaleExtent([1, 40])
      .on("zoom", zoomed));
// 

main()
// data_preprocessing()
