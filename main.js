let binancePairs;
let interval = "12h";
let pair;

async function changePair() {
  pair = document.getElementById("currentPair").value;
  if(binancePairs === undefined){
    binancePairs = await getBinancePair();
  }
  if(binancePairs.includes(pair.toUpperCase())) {
    await createChart();
  }
}

async function changeInterval (id) {
    interval = id;
    await createChart();
}

async function getBinancePair() {
    try {
      const request = await fetch('https://api.binance.com/api/v1/exchangeInfo');
      const response = await request.json();
      const pairData = response.symbols.map(data => {
          return data.symbol;
      });
      return pairData;

    } catch (e) {
      console.log(e);
    }
}

async function createChart(){
  removeChart();

  const url = "https://api.binance.com/api/v3/klines?symbol=" + pair.toUpperCase() + "&interval=" + interval + "&limit=1000";
  const chart = LightweightCharts.createChart(document.getElementById("chart"), { width:1100, height:400 });
  const candles =  chart.addCandlestickSeries();

  try {
    const response = await fetch(url);
    const data = await response.json();
    const candlesData = data.map(d => {
      return {time:d[0]/1000, open:parseFloat(d[1]), high:parseFloat(d[2]), low:parseFloat(d[3]), close:parseFloat(d[4])};
    });
    candles.setData(candlesData);
    document.getElementById('interval').style.display = "block";
  } catch (Ex) {
    console.log(Ex);
  }
}

function removeChart() {
  document.getElementById('chart').remove();
  const chartContainer = document.getElementById('chartContainer');
  const chart = document.createElement('div');
  chart.id = "chart";
  chartContainer.prepend(chart);
}
