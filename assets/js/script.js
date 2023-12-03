let provinsi = {};
let villages = {};

async function loadAllMapData() {
    const urls = [
        // 'data/94/9471/94711.json',
        'data/94/9471/9471010/9471010.json',
        'data/94/9471/9471020/9471020.json',
        'data/94/9471/9471021/9471021.json',
        'data/94/9471/9471030/9471030.json',
        'data/94/9471/9471040/9471040.json',
    ];
    try {
        // Memuat data kota dari file GeoJSON
        const responses = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
        kota = responses[0];
        for (let i = 1; i < responses.length; i++) {
            kota.features = kota.features.concat(responses[i].features);
        }

        // Inisialisasi peta dengan data yang dimuat
        initializeChart();
    } catch (error) {
        console.error("Gagal memuat data map: ", error);
    }
}


function initializeChart() {
    Highcharts.mapChart('container', {
        // Pengaturan navigasi dan data peta
        title: {
            text: 'Peta Kota Jayapura'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        colorAxis: {
            min: 0
        },
        plotOptions: {
            map: {
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.Name}'
                }
            }
        },
        series: [{
            data: kota.features.map(feature => {
                const codeDistirct =  feature.properties.Code;
                return {
                    Code: codeDistirct,
                    code: feature.properties.Code,
                    name: feature.properties.Name,
                    value:  (feature.properties.Code * 2) % 100
                };

            }),
            mapData: kota,
            joinBy: 'Code',
            name: 'kota',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
        }],
    });
}

// Memulai proses memuat data
loadAllMapData();