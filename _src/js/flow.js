var margin = { top: 20, right: 1, bottom: 6, left: 1 },
  width = 1140 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
  format = function (d) {
    return "$" + formatNumber(d);
  },
  color = d3.scale.category10();

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg
  .append("text")
  .text("Revenues")
  .attr("y", margin.top * 0.6)
  .attr("x", margin.left);

svg
  .append("text")
  .text("Expenses")
  .attr("y", margin.top * 0.6)
  .attr("x", margin.left + width)
  .attr("text-anchor", "end");

// define color scales
var fundColors = d3.scale
  .ordinal()
  .domain(["General Fund", "Non-discretionary funds"])
  .range(["#4285ff", "#8249b7"]); //2020 renovation
// .range(["#276419", "#4db029"]);
// .range(["#276419", "#b8e186"]);
var erColors = d3.scale
  .ordinal()
  .domain(["expense", "revenue"])
  .range(["#ff8129", "#7fc97f"]);
// .range(["#ffb36b", "#7fc97f"]);
// .range(["#ffd92f", "#ffd92f"])
// .range(["#c51b7d", "#8e0152"]);

// create color gradients for links
svg
  .append("linearGradient")
  .attr("id", "gradientRtoGF")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", "100%")
  .attr("y2", 0)
  .selectAll("stop")
  .data([
    { offset: "10%", color: erColors("revenue") },
    { offset: "90%", color: fundColors("General Funds") },
  ])
  .enter()
  .append("stop")
  .attr("offset", function (d) {
    return d.offset;
  })
  .attr("stop-color", function (d) {
    return d.color;
  });
svg
  .append("linearGradient")
  .attr("id", "gradientRtoNF")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", "100%")
  .attr("y2", 0)
  .selectAll("stop")
  .data([
    { offset: "10%", color: erColors("revenue") },
    { offset: "90%", color: fundColors("Non-discretionary funds") },
  ])
  .enter()
  .append("stop")
  .attr("offset", function (d) {
    return d.offset;
  })
  .attr("stop-color", function (d) {
    return d.color;
  });
svg
  .append("linearGradient")
  .attr("id", "gradientNFtoE")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", "100%")
  .attr("y2", 0)
  .selectAll("stop")
  .data([
    { offset: "10%", color: fundColors("Non-discretionary funds") },
    { offset: "90%", color: erColors("expense") },
  ])
  .enter()
  .append("stop")
  .attr("offset", function (d) {
    return d.offset;
  })
  .attr("stop-color", function (d) {
    return d.color;
  });
svg
  .append("linearGradient")
  .attr("id", "gradientGFtoE")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", "100%")
  .attr("y2", 0)
  .selectAll("stop")
  .data([
    { offset: "10%", color: fundColors("General Funds") },
    { offset: "90%", color: erColors("expense") },
  ])
  .enter()
  .append("stop")
  .attr("offset", function (d) {
    return d.offset;
  })
  .attr("stop-color", function (d) {
    return d.color;
  });

// wrangle the data
function data_wrangle(dataset, fy) {
  fy = fy.slice(0, 4);
  switch(fy) {
    case "FY15":
    case "FY16":
    case "FY17":
    case "FY18":
      return(data_wrangle_v1(dataset, "account_category", "department", "account_type", "Revenues", "Expenses", "fund_code", "General Funds", "amount"));
    case "FY13":
    case "FY14":
    case "FY19":
    case "FY20":
    case "FY21":
    case "FY22":
    case "FY23":
    case "FY24":
      return(data_wrangle_v1(dataset, "CATEGORY", "Department", "ExpenseRevenue", "R", "E", "Fund", "General Fund", "Amount"));
    case "FY25":
      return(data_wrangle_v1(dataset, "CATEGORY", "Department", "ExpenseRevenue", "Revenues", "Expenses", "Fund", "General Fund", "Amount"));
    default:
      return(data_wrangle_v1(dataset, "CATEGORY", "Department", "ExpenseRevenue", "Revenues", "Expenses", "Fund", "General Fund", "Amount"));
  } 
}

// NOTE list is specific to Sacramento Data
const rev_order = [
  "Taxes",
  "Charges, Fees, and Services",
  "Miscellaneous Revenue",
  "Intergovernmental",
  "Contributions from Other Funds",
  "Licenses and Permits",
  "Fines, Forfeitures, and  Penalties",
  "Interest, Rents, and Concessions",
];

// NOTE list is specific to Sacramento Data
const exp_order = [
  "Police",
  "Utilities",
  "Citywide and Community Support",
  "General Services",
  "Fire",
  "Debt Service",
  "Public Works",
  "Human Resources",
  "Parks and Recreation",
  "Community Development",
  "Convention and Cultural Services",
  "Finance",
  "Information Technology",
  "City Attorney",
  "Mayor/Council",
  "City Manager",
  "City Treasurer",
  "Economic Development",
  "City Clerk",
  "Non-Appropriated",
];

const sort_by = fields_arr => (a, b) => fields_arr.indexOf(a) - fields_arr.indexOf(b)
const fundKey = (fund_field, general_fund) => d => d[fund_field] == general_fund ? "General Fund" : "Non-discretionary funds"
const rollupFn = amount_field => v => ({...v, total: d3.sum(v, d => +d[amount_field])})
const generateNodesAndLinks = (data, type, offset) => ({
  nodes: data.map(kv => ({ name: kv.key, type })),
  links: data.map((kv, i) => 
    kv.values.map((kv2) => ({
      [type === 'revenue' ? 'source' : 'target']: i + offset,
      value: kv2.values.total,
      [type === 'revenue' ? 'target' : 'source']: kv2.key === "General Fund" ? 0 : 1
    }))
  ).flat()
})

function data_wrangle_v1(dataset, category_field, department_field, expense_field, revenue_value, expense_value, fund_field, general_fund, amount_field) {
  const nodes = [
    { name: "General Funds", type: "fund", order: 0 },
    { name: "Non-discretionary funds", type: "fund", order: 1 },
  ];
  
  const rev = dataset.filter(v =>  v[expense_field] == revenue_value)
  revcats = d3
    .nest()
    .key(d => d[category_field])
    .sortKeys(sort_by(rev_order))
    .key(fundKey(fund_field, general_fund))
    .rollup(rollupFn(amount_field))
    .entries(rev);
  const rev_data = generateNodesAndLinks(revcats, "revenue", nodes.length)

  const exp = dataset.filter(v =>  v[expense_field] == expense_value)
  expdivs = d3
    .nest()
    .key(d => d[department_field])
    .sortKeys(sort_by(exp_order))
    .key(fundKey(fund_field, general_fund))
    .rollup(rollupFn(amount_field))
    .entries(exp);
  const exp_data = generateNodesAndLinks(expdivs, "expense", nodes.length + rev_data.nodes.length)

  return { nodes: [...nodes, ...rev_data.nodes, ...exp_data.nodes], links: [...rev_data.links, ...exp_data.links] };
}

// render the sankey
function do_with_budget(data) {
  svg.select("#chart").remove();

  var chart = svg
    .append("g")
    .attr("id", "chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey().nodeWidth(20).nodePadding(10).size([width, height]);

  var path = sankey.link();

  sankey.nodes(data.nodes).links(data.links).layout(0);

  var link = chart
    .append("g")
    .selectAll(".link")
    .data(data.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .style("stroke", function (d) {
      // NOTE(donny): if you are having problems getting the links to render, make
      // sure both of these cases are matching d.target.name at some point
      switch (d.target.name) {
        case "General Funds":
          return "url('#gradientRtoGF')";
        case "Non-discretionary funds":
          return "url('#gradientRtoNF')";
      }
      switch (d.source.name) {
        case "General Funds":
          return "url('#gradientGFtoE')";
        case "Non-discretionary funds":
          return "url('#gradientNFtoE')";
      }
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    })
    .on("mouseover", function (d) {
      let definition = "";
      const sourceWords = d.source.name.split(" ");

      // TODO(donny) - function is referencing results from an api which has not been set up for sacramento yet.
      //
      // if (
      //   sourceWords[sourceWords.length - 1] === "Funds" &&
      //   window.localStorage.getItem(d.target.name)
      // ) {
      //   definition = window.localStorage.getItem(d.target.name);
      // } else if (window.localStorage.getItem(d.source.name)) {
      //   definition = window.localStorage.getItem(d.source.name);
      // } else {
      //   definition = "definition unavailable";
      // }

      d3.select(this).classed("highlight", true);
      d3.select("#hover_description")
        .classed("show", true)
        .text(
          d.source.name + " → " + d.target.name + ": " + format(d.value)

          // see previos todo
          //
          // +
          //   ` (${definition})`
        );
    })
    .on("mousemove", function (d) {
      d3.select("#hover_description").style({
        top: d3.event.y - 10 + $(window).scrollTop() + "px",
        left: d3.event.x + 10 + "px",
      });
    })
    .on("mouseout", function () {
      d3.select(this).classed("highlight", function () {
        return d3.select(this).classed("click");
      });
      d3.select("#hover_description").classed("show", false);
    });

  var node = chart
    .append("g")
    .selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", function (d) {
      return "node " + d.type;
    })
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  node
    .append("rect")
    .attr("height", function (d) {
      return d.dy;
    })
    .attr("width", sankey.nodeWidth())
    .style("fill", function (d) {
      switch (d.type) {
        case "fund":
          d.color = fundColors(d.name);
          // d.color = "transparent";
          break;
        default:
          d.color = erColors(d.type);
          break;
      }
      return d.color;
    })
    .style("stroke", function (d) {
      if (d.type === "fund") {
        return d3.rgb(d.color);
      } else {
        return d3.rgb(d.color).darker(1);
      }
    })
    .on("mouseover", function (d) {
      var thisnode = d3.select(this.parentNode);

      //   highlight node only, not flows
      thisnode.classed("hover", true);

      //   append total amount to label
      thisnode
        .select("text")
        .transition()
        .text(function (d) {
          var text = d.name;
          text += ": " + format(d.value);
          return text;
        });
    })
    .on("mouseout", function (d) {
      var thisnode = d3.select(this.parentNode);
      //   remove node highlight
      thisnode.classed("hover", false);
      //   remove amount from label
      if (!thisnode.classed("highlight")) {
        thisnode
          .select("text")
          .transition()
          .text(function (d) {
            return d.name;
          });
      }
    })
    .on("click", function (d) {
      var thisnode = d3.select(this.parentNode);
      if (thisnode.classed("highlight")) {
        thisnode.classed("highlight", false);
        thisnode.classed("hover", false);
      } else {
        //   node.classed("highlight", false);
        thisnode.classed("highlight", true);
      }

      link.classed("highlight click", function (link_d) {
        if ([link_d.target.name, link_d.source.name].indexOf(d.name) >= 0) {
          return thisnode.classed("highlight");
        } else {
          return d3.select(this).classed("click");
        }
      });

      thisnode
        .select("text")
        .transition()
        .text(function (d) {
          var text = d.name;
          if (thisnode.classed("highlight")) {
            text += ": " + format(d.value);
          }
          return text;
        });
    });

  node
    .append("text")
    .attr("x", -6)
    .attr("y", function (d) {
      return d.dy / 2;
    })
    .attr("dy", ".35em")
    .attr("class", "main-text")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function (d) {
      return d.name;
    })
    .filter(function (d) {
      return d.x < width / 2;
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");
}
