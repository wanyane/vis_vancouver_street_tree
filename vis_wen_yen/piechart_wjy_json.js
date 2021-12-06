/**
 * Global Variables
 */
var glo_para=[];
/**
 * Load data from a CSV file as JSON objects
 * @param path the location of the CSV file to load
 */
// function loadData(path){
//     d3.json(path).then(function(data){
//         //do something with the data
//         // _data = data[5].TREE_ID;
//         var isTreeid=false;
//         drawPies(data,isTreeid);
//     });
//
// }
function loadData(){
    var isTreeid=false;
    drawPies(data,isTreeid);
}
function reloaddata(sent_data){
    console.log(sent_data);
    if (sent_data.length == 0){
      var rm_staff1=d3.select("#vis1").selectAll("g");
      var rm_staff2=d3.select("#vis2").selectAll("g");
      rm_staff1.remove();
      rm_staff2.remove();
      loadData();
      return;
    }
    var rm_staff1=d3.select("#vis1").selectAll("g");
    var rm_staff2=d3.select("#vis2").selectAll("g");
    rm_staff1.remove();
    rm_staff2.remove();
    drawPies(sent_data,true);
}



function check_add_r(rtempkey,rpiedict,tempkey){
    if(rpiedict.hasOwnProperty(tempkey)){
        if(rtempkey=="Y"){
            rpiedict[tempkey]+=1;
        }

    }
    else{
        if(rtempkey=="Y"){
            rpiedict[tempkey]=1;
        }
        else
            rpiedict[tempkey]=0;
    }
}
function check_add_g(gtempkey,gpiedict,tempkey){
    if(gpiedict.hasOwnProperty(tempkey)) {
        if (gpiedict[tempkey].hasOwnProperty(gtempkey)) {
            gpiedict[tempkey][gtempkey] += 1;
        }
        else {
            gpiedict[tempkey][gtempkey]=1;
        }
    }
    else {

        // var subarray=new Array(1);
        gpiedict[tempkey] = new Array(300);
        gpiedict[tempkey][gtempkey]=1;
        // print()
    }

}
function check_add_treeid(piedata_transfer,tree_id,tempkey,idx_treeid){
    if(piedata_transfer.hasOwnProperty(tempkey)) {
        piedata_transfer[tempkey].push(idx_treeid[tree_id]);
    }
    else {

        // var subarray=new Array(1);
        piedata_transfer[tempkey] = new Array(0);
        piedata_transfer[tempkey].push(idx_treeid[tree_id]);
        // print()
    }

}
function check_add_con(ctempkey,cpiedict){
    if(cpiedict.hasOwnProperty(ctempkey)) {
        cpiedict[ctempkey]+=1;
    }
    else {

        // var subarray=new Array(1);
        cpiedict[ctempkey]=1;
        // print()
    }

}
function last_check_show(data,length){
    var newdata=new Array(0);
    var line=Math.round(length*0.005);
    var keyarray=Object.keys(data);
    for( var i =0 ; i<length;i++){
        if(data[keyarray[i]]>line)
            newdata[keyarray[i]]=data[keyarray[i]];
    }
    return newdata;
}
function original_index(data){
    var tmp=new Array(0);
    for(var i=0;i<data.length;i++){
        tmp.push(i);
    }
    return tmp;
}
function check_index(data){
    let idx_check=new Array(0);
    for(var idx=0;idx<data.length;idx++){
        idx_check[data[idx]["tree_id"]]=idx;
    }
    return idx_check;
}
function drawPies(tdata,isTreeid){
    let svg = d3.select("#vis1");
    svg.attr("viewBox", `-200, -200, ${$("#vis1").width()}, ${$("#vis1").height()}`);
    var newdata=new Array(0);
    var width = 336;
    var height = 336;

    if(isTreeid){
        var piedata_len=tdata.length;
        for (var i =0;i<piedata_len;i++)
            newdata.push(data[tdata[i]]);
    }
    else {

        newdata = data;
        var piedata_len=newdata.length;
    }
    let idx_treeid= check_index(newdata);
    var piedata_transfer=new Array(0);
    var piedict=new Array(6);
    var rpiedict=new Array(6);
    var gpiedict=new Array(0);
    var cpiedict=new Array(0);
    var isClick=false;
    var isRing=false;
    for (var i = 0; i<piedata_len; i++){
        //left even & right odd
        var tree_id = newdata[i]["tree_id"];
        var tempkey=newdata[i]["plant_area"];
        var rtempkey=newdata[i]["root_barrier"];
        var gtempkey=newdata[i]["genus_name"];
        var ctempkey = newdata[i]["continent"];
        var isletter=/^[a-zA-Z]+$/.test(tempkey);
        if(isletter){
            tempkey=tempkey.toUpperCase();
            if(tempkey!=="C"&&tempkey!=="N"&&tempkey!=="B"&&tempkey!=="G")
                tempkey="O";}
        else if((Number(tempkey))||tempkey==='0')
            tempkey="W";
        else if(!tempkey)
            tempkey="O";
        check_add_treeid(piedata_transfer,tree_id,tempkey,idx_treeid);
        check_add_con(ctempkey,cpiedict);
        check_add_r(rtempkey,rpiedict,tempkey);
        check_add_g(gtempkey,gpiedict,tempkey);
        if(piedict.hasOwnProperty(tempkey)){
            piedict[tempkey]+=1;
        }
        else{
            piedict[tempkey]=1;
        }
    }

    var pie = d3.pie();
    var piedata= pie(Object.values(piedict));
    var cpie = d3.pie();
    var cpiedata= cpie(Object.values(cpiedict));
    var colorset=new Array(0);
    var colordict={"W":"#E4E1DE","C":"#B5ECE4","N":"#3059C4","B":"#B87A1B","G":"#FFFF00","O":"#FF9700"};
    for (var key in piedict){
        colorset.push(colordict[key]);
    }
// var colordict={"#7F9488", "#CDC7B4", "#BCCACA", "#BCA885", "#7E5350",
    var color = d3.scaleOrdinal(colorset);
    var gcolorset = ["#B9A4B0","#CBC2D3","#A6ACBC","#97B2B7","#BCCACA","#7F9488","#6F7766","#ACAD98","#CDC7B4","#E1C38B","#BCA885","#EDE4D9","#C28468","#D3C5C0","#BFA59E"];
    var ccolordict= {"North America":"#4FC3F7","South America":"#F06292","Africa":"#9575CD","Asia":"#FFEE58","Europe":"#0097A7"};
    var ccolorset=new Array(0);
    for (var key in cpiedict){
      ccolorset.push(ccolordict[key]);
    }
    var ccolor = d3.scaleOrdinal(ccolorset);
    // var color =d3.schemeCategory10;
    var outerRadius = 300;
    var innerRadius = 0;
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
    var arc1 = d3.arc()
        .innerRadius(0)
        .outerRadius(0)
    var listr=Object.keys(rpiedict);

    var arcs = svg.selectAll("g")

        .data(piedata)
        .enter()
        .append("g")

        .attr("transform","translate("+ (width/2) + ","+ (width/2) +")");
    arcs.append("path")
        .attr("class",function(d,i){
            return listr[i]+"2";
        })
        .attr("fill", function(d,i){
            return color(i);
        })
        .attr("d",function(d){
            return arc1(d);
        })
    // .attr("selector",function(d,i){
    //     console.log(listr[i]);
    //     return listr[i]+"2";
    // })
    arcs.append("path")
        .attr("class",function(d,i){
            return listr[i]+"1";
        })
        .attr("fill", function(d,i){
            return color(i);
        })
        .attr("d",function(d){
            return arc(d);
        })
        .attr("selector",function(d,i){
            return listr[i];
        })

        .on("click",function(d,i){
            if(!isRing){
                isClick=!isClick;
                isRing=!isRing;
            }

            let this_group = d3.select(this);
            var labelr=this_group.attr("selector");
            glo_para=piedata_transfer[labelr];
            render_view1(glo_para);
            draw_some(glo_para);
            var class1="."+labelr+"1";
            var class2="."+labelr+"2";
            let this_class1 = d3.selectAll(class1);
            let this_class2 = d3.select(class2);
            var pie2 = d3.pie();
            var gpielabel=gpiedict[labelr];
            gpielabel=last_check_show(gpielabel,glo_para.length);
            var tp=Object.keys(gpielabel)

            var gpiedata= pie2(Object.values(gpielabel));
            var gcolor = d3.scaleOrdinal(gcolorset);

            if(isClick){
                isClick=!isClick;
                var garcs = svg.selectAll("g").data(gpiedata);

                garcs.enter()
                    .append("g")
                    .attr("transform","translate("+ (width/2) + ","+ (width/2) +")");
                var arc4 = d3.arc()
                    .innerRadius(outerRadius)
                    .outerRadius(outerRadius + 50);
                garcs.append("path")
                    .attr("class","temp")
                    .attr("fill", function(d,i){
                        return gcolor(i);
                    })
                    .attr("d",function(d){
                        return arc4(d);
                    })
                    .on("click",function(){
                        isRing=!isRing;
                        let gar = d3.selectAll(".temp")
                            .transition()
                            .attr("d", function(d){
                                return arc3(d);
                            })
                            .text(function(d,i){
                                return "";
                            });
                    });
                garcs.append("text")
                    .attr("class","temp")
                    .attr("transform",function(d,i){
                        var x = arc.centroid(d)[0]*2.8;
                        var y = arc.centroid(d)[1]*2.8;
                        return "translate(" + x + ',' + y + ")"+"rotate("+(-90+(d.startAngle +(d.endAngle - d.startAngle)/2)*180 /Math.PI)+ ")";
                    })
                    .attr("text-anchor","middle")
                    .text(function(d,i){
                        return tp[i];
                    });

            }
            var scaler=rpiedict[labelr]/piedict[labelr]

            var arc2 = d3.arc()
                .innerRadius(outerRadius)
                .outerRadius(outerRadius + 50);
            //(outerRadius + 30)*scaler
            var arc3 = d3.arc()
                .innerRadius(0)
                .outerRadius(0);

            this_class1
                .transition()
                .style("opacity",0.3)
                .attr("d", function(d){
                    return arc2(d);
                })
                .text(function(d,i){
                    return "RB:"+(scaler*100).toFixed(2)+"%";
                });
            this_class2
                .transition()
                .style("opacity",1)
                .attr("d", function(d){
                    return arc3(d);
                });
            return labelr;
        })
        .on("mouseover", function(){
            if(!isClick){
                let this_group = d3.select(this);
                var labelr=this_group.attr("selector");
                var class1="."+labelr+"1";
                var class2="."+labelr+"2";
                let this_class1 = d3.selectAll(class1);
                let this_class2 = d3.select(class2);
                var scaler=rpiedict[labelr]/piedict[labelr];
                var arc2 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(outerRadius + 30);
                //(outerRadius + 30)*scaler
                var arc3 = d3.arc()
                    .innerRadius(0)
                    .outerRadius((outerRadius + 30)*scaler);

                this_class1
                    .transition()
                    .style("opacity",0.3)
                    .attr("d", function(d){
                        return arc2(d);
                    })
                    .text(function(d,i){
                        return "RB:"+(scaler*100).toFixed(2)+"%";
                    });
                this_class2
                    .transition()
                    .style("opacity",1)
                    .attr("d", function(d){
                        return arc3(d);
                    });
            }

        })
        .on("mouseout", function(){
            if(!isClick) {
                let this_group = d3.select(this);
                var labelr = this_group.attr("selector");
                var class1 = "." + labelr + "1";
                let this_class1 = d3.selectAll(class1);
                this_class1
                    .transition()
                    .attr("d", function (d) {
                        return arc(d)
                    })
                    .style("opacity", 1)
                    .text(function (d) {
                        return labelr;
                    });
            }
        });
    arcs.append("text")
        .attr("class",function(d,i){
            return listr[i]+"1";
        })
        .attr("transform",function(d,i){
            var x = arc.centroid(d)[0]*2.1;
            var y = arc.centroid(d)[1]*2.1;
            return "translate(" + x + ',' + y + ")";
        })
        .attr("text-anchor","middle")
        .text(function(d,i){
            return listr[i];
        });

    let csvg = d3.select("#vis2");
    csvg.attr("viewBox", `-200, -200, ${$("#vis2").width()}, ${$("#vis2").height()}`);
    var ctp=Object.keys(cpiedict);
    var arcs_con = csvg.selectAll("g")
        .data(cpiedata)
        .enter()
        .append("g")
        .attr("transform","translate("+ (width/2) + ","+ (width/2) +")");
    arcs_con.append("path")
        .attr("class","cont")
        .attr("fill", function(d,i){
            return ccolor(i);
        })
        .attr("d",function(d){
            return arc(d);
        })
        .on("click",function(d,i){
            var rm_staff1=d3.select("#vis1").selectAll("g");
            var rm_staff2=d3.select("#vis2").selectAll("g");
            rm_staff1.remove();
            rm_staff2.remove();
            loadData();
            render_view1(original_index([]));
            draw_some(original_index([]));
            })
    arcs_con.append("text")
        .attr("class","cont")
        .attr("transform",function(d,i){
            var x = arc.centroid(d)[0]*2.8;
            var y = arc.centroid(d)[1]*2.8;
            return "translate(" + x + ',' + y + ")"+"rotate("+(-90+(d.startAngle +(d.endAngle - d.startAngle)/2)*180 /Math.PI)+ ")";
        })
        .attr("text-anchor","middle")
        .text(function(d,i){
            return ctp[i];
        });
}
loadData();
