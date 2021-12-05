const c_green = "#C5E1A5" 
const c_yellow = "#FFEE58" // Asia
const c_cyan = "#0097A7"   // Europe
const c_blue = "#4FC3F7"   // North America
const c_red = "#F06292"    // South America
const c_purple = "#9575CD" // Africa



function range(start, end) {
    return Array(end - start).fill().map((_, idx) => start + idx)
}


let tree_view_selected_data = new Set()
function add_to_tree_view_selected_data(data) {
    for (i=0;i<data.length; i++) {
        tree_view_selected_data.add(parseInt(data[i]))
    }
}

function delete_from_tree_view_selected_data(data) {
    for (i=0;i<data.length; i++) {
        tree_view_selected_data.delete(parseInt(data[i]))
    }
}

function data_preprocessing(display_data) {
    const trees_in_node = 200
    let previous_year = 1989
    let leaf_index = 0
    
    let as_cnt = 0
    let eu_cnt = 0
    let na_cnt = 0
    let sa_cnt = 0
    let af_cnt = 0
    
    let data_normal_view = []
    let prev_year_total = 0
    
    // for (i=0; i<data.length; i++) {
    for (i=0; i<display_data.length; i++) {
        year = display_data[i].year

        if ((i-prev_year_total) % trees_in_node == 0 || year != previous_year){
            if (year != previous_year) {
                leaf_index = 0
                previous_year += 1
                prev_year_total = i
            }
            data_normal_view.push({
                "year": year,
                "leaf_idx": leaf_index,
                "data": [],
                "continent_portion":{
                    "as": as_cnt,
                    "eu": eu_cnt,
                    "na": na_cnt,
                    "sa": sa_cnt,
                    "af": af_cnt,    
                },
            })
            leaf_index += 1
        }

        data_normal_view[data_normal_view.length-1]["data"].push(i)
        
        if (display_data[i].continent == "Asia"){
            data_normal_view[data_normal_view.length-1]["continent_portion"]["as"] += 1
        }
        if (display_data[i].continent == "Europe"){
            data_normal_view[data_normal_view.length-1]["continent_portion"]["eu"] += 1
        }
        if (display_data[i].continent == "North America"){
            data_normal_view[data_normal_view.length-1]["continent_portion"]["na"] += 1
        }
        if (display_data[i].continent == "South America"){
            data_normal_view[data_normal_view.length-1]["continent_portion"]["sa"] += 1
        }
        if (display_data[i].continent == "Africa"){
            data_normal_view[data_normal_view.length-1]["continent_portion"]["af"] += 1
        }
        
    }
    // cx, cy, r
    // data_normal_view = data_normal_view.slice(0,10)
    const x_offset = 350
    const y_offset = 400
    for (i=0;i<data_normal_view.length; i++) {
        year = data_normal_view[i].year
        leaf_idx = data_normal_view[i].leaf_idx
        radius = (30+(2019-year)*4)*Math.PI/180
        data_normal_view[i]["cx"] = x_offset+(150+leaf_idx*10)*Math.cos(radius)
        data_normal_view[i]["cy"] = y_offset - (100+leaf_idx*6)*Math.sin(radius)
        data_normal_view[i]["r"] = 3
        if (leaf_idx==0){
            data_normal_view[i]["pre_cx"] = x_offset+(120)*Math.cos(radius)
            data_normal_view[i]["pre_cy"] = 350
        } else {
            data_normal_view[i]["pre_cx"] = data_normal_view[i-1]["cx"]
            data_normal_view[i]["pre_cy"] = data_normal_view[i-1]["cy"]
        }
    }

    return data_normal_view

}

function render_tree(g, data_normal_view, data_bar, leafs_lowest){
    circles =  g.selectAll()
    circles.data(data_normal_view)
          .enter().append("circle")
        //   .attr('class', cls)
          .attr('cx', (d)=>d.cx)
          .attr('cy', (d)=>d.cy)
          .attr('r', (d)=>d.r)
          .attr('fill', c_green)
          .attr("data", (d)=>d.data)
          .attr("continent_portion_as", (d)=>d.continent_portion["as"])
          .attr("continent_portion_eu", (d)=>d.continent_portion["eu"])
          .attr("continent_portion_na", (d)=>d.continent_portion["na"])
          .attr("continent_portion_sa", (d)=>d.continent_portion["sa"])
          .attr("continent_portion_af", (d)=>d.continent_portion["af"])
          .on('click', (e)=>{console.log(e.srcElement.attributes.data.value)})
          //Our new hover effects
        //   .attr('transform', 'translate(0, 0)')
          .on('mouseover', function (e) {
                as_cnt = e.srcElement.attributes.continent_portion_as.value
                eu_cnt = e.srcElement.attributes.continent_portion_eu.value
                na_cnt = e.srcElement.attributes.continent_portion_na.value
                sa_cnt = e.srcElement.attributes.continent_portion_sa.value
                af_cnt = e.srcElement.attributes.continent_portion_af.value

                d3.select(this).transition().duration('50').attr('opacity', '.85')
                txt.transition().duration(100)
                    .attr("opacity", 1)
                    .text("Asia: " + as_cnt + ", Europe: " + eu_cnt + ", North America: " + na_cnt + ", Sourth America: " + sa_cnt + ", Africa: " + af_cnt)
            }
          )
          .on('mouseout', function (d, i) {
                d3.select(this).transition().duration('50').attr('opacity', '1')
                txt.transition().duration('50').attr("opacity", 0)
            }
          )


    bar = g.selectAll()
    bar.data(data_bar)
        .enter().append('line')
        .style("stroke", (d)=>{return d.stroke})
        .style("stroke-width", 3)
        .attr("x1", (d)=>{return d.x1})
        .attr("y1", (d)=>{return d.y1})
        .attr("x2", (d)=>{return d.x2})
        .attr("y2", (d)=>{return d.y2})
        .attr("data", (d)=>{return d.data})
        .attr("continent", (d)=>{return d.continent})
        .attr("data_all", (d)=>{return d.data_all})
        .attr("select", false)
        .on('click', function(e) {
            // console.log(d3.select(this).attr("data"))
            if (e.srcElement.attributes.select.value == "false") {
                add_to_tree_view_selected_data(d3.select(this).attr("data").split(','))
                d3.select(this).attr("select", true)
                d3.select(this).transition().duration('10').attr('opacity', '.5')
            }
            else {
                delete_from_tree_view_selected_data(d3.select(this).attr("data").split(','))
                d3.select(this).attr("select", false)
                d3.select(this).transition().duration('10').attr('opacity', '1')
            }
            pass_data = Array.from(tree_view_selected_data).sort(function(a, b){return a - b})
            console.log(pass_data)
         }
        )
        .on('mouseover', function (e) {
            attrs = e.srcElement.attributes
            continent = attrs.continent.value
            data_len = attrs.data.value.split(",").length
            data_all_len = attrs.data_all.value.split(",").length
            d3.select(this).transition().duration('50').attr('opacity', '.5')
            txt.transition().duration(100)
                .attr("opacity", 1)
                .text(continent + ":" + data_len + "/" + data_all_len)
        }
        )
        .on('mouseout', function (d, i) {
            if (d3.select(this).attr("select") == "false") {
                d3.select(this).transition().duration('50').attr('opacity', '1')
            } else {
                d3.select(this).transition().duration('50').attr('opacity', '0.5')
            }
            txt.transition().duration('50').attr("opacity", 0)
        }
        )

    link = g.selectAll()
    link.data(leafs_lowest)
        .enter().append('line')
        .style("stroke", "#A1887F")
        .style("stroke-width", 1)
        .attr("x1", (d)=>{return d.pre_cx})
        .attr("y1", (d)=>{return d.pre_cy})
        .attr("x2", (d)=>{return d.cx})
        .attr("y2", (d)=>{return d.cy});

    txt = g.selectAll().data([123]).enter().append("text")
    txt.attr('x', 250)
        .attr('y', 500)
        .attr("dy", ".35em")
        .attr("fill", "#FFFFFF")
        .attr('opacity', 0)
        .text("Asia: " + 10 + "na: ")
}

function get_trunk_data(display_data, data_normal_view){
    let bar_data = []
    let statistic = {}
    let min_y = 3000
    let max_y = 0
    for (i=0; i<display_data.length; i++) {
        if (display_data[i].year <min_y) {
            min_y = display_data[i].year
        }
        if (display_data[i].year > max_y) {
            max_y = display_data[i].year
        }
    }
    for (y=min_y;y<=max_y;y++) {
        statistic[String(y)] = {
            "as": [],
            "eu": [],
            "na": [],
            "sa": [],
            "af": [],
            "all": []
        }
    }
    for (i=0;i<display_data.length;i++){
        let year = display_data[i].year
        let continent = display_data[i].continent
        
        statistic[String(year)]["all"].push(i)
        
        if (continent=="Asia") {
            statistic[String(year)]["as"].push(i)
        } else if (continent=="Europe") {
            statistic[String(year)]["eu"].push(i)
        } else if (continent=="North America") {
            statistic[String(year)]["na"].push(i)
        } else if (continent=="South America") {
            statistic[String(year)]["sa"].push(i)
        } else {
            statistic[String(year)]["af"].push(i)
        }
    }
    
    const bar_len = 120
    let leafs_lowest = data_normal_view.filter(function(d){ return d.leaf_idx === 0})
    for (const y in statistic) {
        let ratio = 0
        let all_len = statistic[String(y)]["all"].length
        let as_ratio = statistic[String(y)]["as"].length/all_len || 0
        let eu_ratio = statistic[String(y)]["eu"].length/all_len || 0
        let na_ratio = statistic[String(y)]["na"].length/all_len || 0
        let sa_ratio = statistic[String(y)]["sa"].length/all_len || 0
        let af_ratio = statistic[String(y)]["af"].length/all_len || 0
        
        // bar_data.push({
        //     "x1": leafs_lowest[y-1990].pre_cx,
        //     "y1": leafs_lowest[y-1990].pre_cy,
        //     "x2": leafs_lowest[y-1990].pre_cx,
        //     "y2": leafs_lowest[y-1990].pre_cy+bar_len, 
        //     "data": statistic[String(y)]["all"]
        // })
        // as
        ratio = 0
        next_ratio = as_ratio
        bar_data.push({
            "x1": leafs_lowest[y-1990].pre_cx,
            "y1": leafs_lowest[y-1990].pre_cy + ratio*bar_len,
            "x2": leafs_lowest[y-1990].pre_cx,
            "y2": leafs_lowest[y-1990].pre_cy + next_ratio*bar_len, 
            "data": statistic[String(y)]["as"],
            "continent": "Asia",
            "data_all": statistic[String(y)]["all"],
            "stroke": c_yellow
            
        })
        
        // eu
        ratio = next_ratio
        next_ratio += eu_ratio
        bar_data.push({
            "x1": leafs_lowest[y-1990].pre_cx,
            "y1": leafs_lowest[y-1990].pre_cy + ratio*bar_len,
            "x2": leafs_lowest[y-1990].pre_cx,
            "y2": leafs_lowest[y-1990].pre_cy + + next_ratio*bar_len, 
            "data": statistic[String(y)]["eu"],
            "continent": "Europe",
            "data_all": statistic[String(y)]["all"],
            "stroke": c_cyan
        })
        // na
        ratio = next_ratio
        next_ratio += na_ratio
        bar_data.push({
            "x1": leafs_lowest[y-1990].pre_cx,
            "y1": leafs_lowest[y-1990].pre_cy + ratio*bar_len,
            "x2": leafs_lowest[y-1990].pre_cx,
            "y2": leafs_lowest[y-1990].pre_cy+ next_ratio*bar_len, 
            "data": statistic[String(y)]["na"],
            "continent": "North America",
            "data_all": statistic[String(y)]["all"],
            "stroke": c_blue
        })
        // sa
        ratio = next_ratio
        next_ratio += sa_ratio
        bar_data.push({
            "x1": leafs_lowest[y-1990].pre_cx,
            "y1": leafs_lowest[y-1990].pre_cy + ratio*bar_len,
            "x2": leafs_lowest[y-1990].pre_cx,
            "y2": leafs_lowest[y-1990].pre_cy + next_ratio*bar_len, 
            "data": statistic[String(y)]["sa"],
            "continent": "South America",
            "data_all": statistic[String(y)]["all"],
            "stroke": c_red
        })
        // af
        ratio = next_ratio
        next_ratio += af_ratio
        bar_data.push({
            "x1": leafs_lowest[y-1990].pre_cx,
            "y1": leafs_lowest[y-1990].pre_cy + ratio*bar_len,
            "x2": leafs_lowest[y-1990].pre_cx,
            "y2": leafs_lowest[y-1990].pre_cy + next_ratio*bar_len, 
            "data": statistic[String(y)]["af"],
            "continent": "Africa",
            "data_all": statistic[String(y)]["all"],
            "stroke": c_purple
        })
    }
    return bar_data
    
    
}


const canva = d3.select('.canva')
const svg = canva.append('svg')
                 .attr('viewBox', [0, 0, 800, 800])
                 .style('background-color', "#424242")
                 
function render_view1(indexes){
    let display_data = indexes.map(i => data[i])
    let data_normal_view = data_preprocessing(display_data)
    let data_bar = get_trunk_data(display_data, data_normal_view)
    let leafs_lowest = data_normal_view.filter(function(d){ return d.leaf_idx === 0})
    
    // remove g
    svg.selectAll(".grp").remove()

    // create g
    const g = svg.append("g").attr("class", "grp")
    
    // render
    render_tree(g, data_normal_view, data_bar, leafs_lowest)
    
}

function test(n) {

    const nums = new Set();
    while(nums.size !== n) {
        nums.add(Math.floor(Math.random() * 40000) + 1);
    }
    
    nums_a = Array.from(nums).sort(function(a, b){return a - b})
    
    render_view1(nums_a)
}


render_view1(range(0, data.length))