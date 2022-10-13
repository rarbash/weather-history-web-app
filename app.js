var main = function () {
  var $xValues = [];
  var $yValues = [];
  var $barColors = [
    "#3fc1c0",
    "#20bac5",
    "#00b2ca",
    "#04a6c2",
    "#0899ba",
    "#0f80aa",
    "#16679a",
    "#1a5b92",
    "#1c558e",
  ];
  var $iconList = [];
  var barChart = null;
  var $infoData = {
    key: "GgdfI2QjBep(cSwZMkbi)ihppFMUEexGjzFvLTKI0pFXPV(3HI28Q(ItH3FndxV9V7ZNdyP8Kt7qW5mLB1yRvNW=====2",
    map: "StreetMap",
    w: 317,
    h: 317,
    level: 12,
    lat: 13.722944,
    lon: 100.530449,
    marker: "orange-1",
    frequency: "Daily",
  };
  var $city = "Bangkok";
  var $frequency = "Daily";
  // var $x = [];
  var $labelTopBar = [];
  var $index = 0;

  function CallAPI() {
    return $.ajax({
      url: "https://api.nostramap.com/Service/V2/GeoLocation/GetWeather",
      dataType: "jsonp",
      type: "GET",
      contentType: "application/json",
      data: $infoData,
      success: function (results) {
        console.log(results);
        results.results.weather.forEach(function (item) {
          if ($frequency === "Daily") {
            $xValues.push(String(item.timeStamp).slice(0, 10));
            $yValues.push(item.temperature.temp);
            $iconList.push(item.icon);
            var date = new Date(item.timeStamp);
            // console.log(date);
            $labelTopBar.push(String(date).slice(0, 4));
          } else if ($frequency === "3hours") {
            if ($index <= 8) {
              $xValues.push(String(item.timeStamp).slice(0, 10));
              $yValues.push(item.temperature.temp);
              $iconList.push(item.icon);
              // console.log($index)
            }
            $labelTopBar.push(String(item.timeStamp).slice(11, 16));
            $index++;
            // console.log(String(item.timeStamp).slice(0, 10));
          }
        });
        createChart();
      },
      error: function (response) {
        console.log(response);
      },
    });
  }

  createInite();

  async function createInite() {
    $infoData["lat"] = 13.722944;
    $infoData["lon"] = 100.530449;
    $infoData["frequency"] = $frequency;
    await CallAPI();
    addIcon();
  }

  var $dailyDiv = $("<div id='icon-daily-area'>");
  var $hourDiv = $("<div id='icon-hour-area'>");
  // var i = 0;

  function addIcon() {
    $dailyDiv.empty();
    $hourDiv.empty();
    // $dailyDiv.destroy();
    // $hourDiv.destroy();
    // console.log($iconList);
    $("div #add-icon-area").empty();
    if ($frequency === "Daily") {
      $dailyDiv.append($("<div>"));
      $iconList.forEach(function (icon) {
        var $imageIcon = $("<image id='icon'>");
        $imageIcon.attr("src", icon);
        $dailyDiv.append($imageIcon);
      });
      $("div #add-icon-area").append($dailyDiv);
    } else if ($frequency === "3hours") {
      $hourDiv.append($("<div>"));
      $iconList.forEach(function (icon) {
        var $imageIcon = $("<image id='icon'>");
        $imageIcon.attr("src", icon);
        $hourDiv.append($imageIcon);
      });
      $("div #add-icon-area").append($hourDiv);
    }
    $iconList = [];
  }

  function resetValue() {
    $xValues = [];
    $yValues = [];
    $labelTopBar = [];
    $index = 0;
  }

  function createh1() {
    $("#title").innerText = "";
    if ($frequency === "3hours") {
      $("#title").text($city + " Temperature every 3 hours in 24 hours");
    } else if ($frequency === "Daily") {
      $("#title").text($city + " Temperature in 7 days");
    }
  }

  function printLogic() {
    console.log($city);
    console.log($frequency);
    console.log($iconList);
  }

  function createChart() {
    if (barChart != null) {
      barChart.destroy();
    }
    barChart = new Chart("myChart", {
      type: "bar",
      data: {
        labels: $xValues,
        datasets: [
          {
            backgroundColor: $barColors,
            data: $yValues,
          },
        ],
      },
      options: myoption,
    });
  }

  var myoption = {
    title: {
      display: false,
      // text: "Temperature"
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: true,
    },
    hover: {
      animationDuration: 1,
    },
    animation: {
      duration: 1,
      onComplete: function () {
        var chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.textAlign = "center";
        // ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.textBaseline = "bottom";
        // Loop through each data in the datasets
        this.data.datasets.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          // var meta = day[i];
          meta.data.forEach(function (bar, index) {
            // var data = dataset.data[index];
            ctx.fillText($labelTopBar[index], bar._model.x, bar._model.y - 5);
          });
        });
      },
    },
  };

  $("#bkk").on("click", async function () {
    $city = "Bangkok";
    $infoData["lat"] = 13.722944;
    $infoData["lon"] = 100.530449;
    $infoData["frequency"] = $frequency;
    resetValue();
    await CallAPI();
    printLogic();
    createh1();
    addIcon();
  });

  $("#cnx").on("click", async function () {
    $city = "Chiang Mai";
    $infoData["lat"] = 18.7677;
    $infoData["lon"] = 98.964;
    $infoData["frequency"] = $frequency;
    resetValue();
    await CallAPI();
    printLogic();
    createh1();
    addIcon();
  });

  $("#daily").on("click", async function () {
    $frequency = "Daily";
    if ($city === "Chiang Mai") {
      $infoData["lat"] = 18.7677;
      $infoData["lon"] = 98.964;
    } else {
      $infoData["lat"] = 13.722944;
      $infoData["lon"] = 100.530449;
    }
    $infoData["frequency"] = "Daily";
    resetValue();
    await CallAPI();
    printLogic();
    createh1();
    addIcon();
  });

  $("#hour").on("click", async function () {
    // console.log($xValues);
    $frequency = "3hours";
    if ($city === "Chiang Mai") {
      $infoData["lat"] = 18.7677;
      $infoData["lon"] = 98.964;
    } else {
      $infoData["lat"] = 13.722944;
      $infoData["lon"] = 100.530449;
    }
    $infoData["frequency"] = "3hours";
    resetValue();
    await CallAPI();
    printLogic();
    createh1();
    addIcon();
  });
};
$(document).ready(main);
