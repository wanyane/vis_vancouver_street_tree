
    const map_width = 1280
    const map_height = 720
    const margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }

    const geo_hangzhou_url = 'vancouver.geojson';
    //const tree_hangzhou_url = 'street-trees.geojson'

    const box = d3.select('#chart');
    const svg_map = box.append('svg')
      .attr('width', map_width)
      .attr('height', map_height)
      .style('background-color', "#424242")
      .style('border-color', "#424242");

    const g = svg_map.append('g')
      .attr('transform', `translate(${margin.top}, ${margin.left})`);

    let topo_data;
    let geo_data;
    var projection;

    var drawn = false;

    function remove_some() {
      $('.new_psoints').remove();
      drawn = false;
    }

    let last_send = "";
    function sendID(title) {
      if (last_send == title) {
        render_view1([]);
        reloaddata([]);
        last_send = ""
        if (drawn){
          remove_some();
        }
        $('.layer--psoints').attr("visibility", "visiable");
        return;
      }
      last_send = title

      if (title == "Downtown Eastside"){
        title = "Strathcona";
      }
      //var result = tree_data.filter(function(e){return e.neighbourhood_name == title.toUpperCase()});
      var indexes = data.map(function(item, i){if(item.neighbourhood_name == title.toUpperCase()) return i;}).filter(function(item){ return item!=undefined; });
      var send_data = Array.from(indexes).sort(function(a, b){return a - b});
      if (drawn){
        remove_some();
      }
      draw_some(send_data);
      $('.layer--psoints').attr("visibility", "collapse");
      render_view1(send_data);
      reloaddata(send_data);
    }


    function draw_some(data_index) {
      if (drawn){
        remove_some();
      }
      if (data_index.length == 0){
        $('.layer--psoints').attr("visibility", "visiable");
        return;
      } else {
        $('.layer--psoints').attr("visibility", "collapse");
      }
      drawn = true;
      let draw_data = data_index.map(i => data[i])
      const new_centers_layer = g.append('g').attr('class', 'new_psoints')
      new_centers_layer
        .style('pointer-events', 'none')
        .selectAll('.center_group')
        .data(draw_data)
        .enter()
        .append('g')
        .attr('class', 'center_group')
        .each(function (d) {
          const el = d3.select(this);
          /*if (d != null){
            const [x,y] = projection(d.coordinate);
            el
              .append('circle')
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', 4)
              .attr('stroke', 'none')
              .attr('fill', 'red')
          }*/
          if (d != null){
            const [x,y] = projection(d.coordinate);
            var color = "#4FC3F7";
            if (d.continent == "North America"){
              color = "#4FC3F7";
            } else if (d.continent == "Asia"){
              color = "#FFEE58";
            } else if (d.continent == "Europe"){
              color = "#0097A7";
            } else if (d.continent == "South America"){
              color = "#F06292";
            } else if (d.continent == "Africa"){
              color = "#9575CD";
            }
            el
              .append('circle')
              .attr('id', d.tree_id)
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', 1.5)
              .attr('stroke', 'none')
              .attr('fill', color)
          }
        })
    }


    async function draw() {

      //////
      ///
      try {
        geo_data = await d3.json(geo_hangzhou_url)
        topo_data = topojson.topology({geo:geo_data}, 1e6)
      } catch (e) {
        console.error(e)
      }



      const geo_border = topojson.merge(topo_data, topo_data.objects.geo.geometries)

      const geo_interiors = topojson.mesh(topo_data, topo_data.objects.geo, (a, b) => a !== b)


      projection = d3.geoMercator()
        .fitSize([map_width, map_height], geo_data)

      const path = d3.geoPath()
        .projection(projection)


      const areas_layer = g.append('g').attr('class', 'layer--areas')
      const interiors_layer = g.append('g').attr('class', 'layer--interior')
      const outline_layer = g.append('g').attr('class', 'layer--outline')

      const area_overlays_layer = g.append('g').attr('class', 'layer--area_overlays')
      const centers_layer = g.append('g').attr('class', 'layer--psoints')

      areas_layer
        .selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('d', path)
        .attr('stroke', 'none')
        .attr('fill', 'gray')

      area_overlays_layer
        .selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('class', 'area_overlay')
        .attr('d', path)
        .attr('stroke', 'none')
        .attr('fill', 'skyblue')
        .attr('opacity', 0)
        .attr('opacity', 0)
        .attr('id', d => d.properties.name)
        .attr('onclick', 'sendID(this.id)')
        .append('title')
        .text(d => d.properties.name)

      interiors_layer
        .append('path')
        .datum(geo_interiors)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'white')

      outline_layer
        .append('path')
        .datum(geo_border)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'white')




      centers_layer
        .style('pointer-events', 'none')
        .selectAll('.center_group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'center_group')
        .attr('visibility', 'visiable')
        .each(function (d) {
          const el = d3.select(this);
          if (d != null){
            const [x,y] = projection(d.coordinate);                //coordinates x of each path

          //{"type": "Feature",
          //"geometry": {"type": "Point", "coordinates": [-123.165499, 49.266647]},
          //"properties": {"std_street": "W 6TH AV", "on_street": "W 6TH AV", "species_name": "PSEUDOPLATANUS", "diameter": 30.0, "root_barrier": "N", "street_side_name": "ODD", "genus_name": "ACER", "neighbourhood_name": "KITSILANO", "assigned": "N", "civic_number": "2655", "plant_area": "4", "curb": "Y", "tree_id": "5316", "common_name": "SYCAMORE MAPLE", "height_range_id": 6, "on_street_block": "2600"}
          //},
            var color = "#4FC3F7";
            if (d.continent == "North America"){
              color = "#4FC3F7";
            } else if (d.continent == "Asia"){
              color = "#FFEE58";
            } else if (d.continent == "Europe"){
              color = "#0097A7";
            } else if (d.continent == "South America"){
              color = "#F06292";
            } else if (d.continent == "Africa"){
              color = "#9575CD";
            }
            el
              .append('circle')
              .attr('id', d.tree_id)
              .attr('cx', x)
              .attr('cy', y)
              .attr('r', 1)
              .attr('stroke', 'none')
              .attr('fill', color)
          }
        })


    }

    draw()
