export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function transformKabupatenData(suaraData) {
    const counts = suaraData.reduce((acc, { kabupaten }) => {
        acc[kabupaten] = (acc[kabupaten] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        series: Object.values(counts),
        labels: Object.keys(counts),
        colors: Object.keys(counts).map(() => getRandomColor()),
    };

    return chartData;
}


// A function to process the data and count votes per area and date
export function processSuaraData(suaraData) {
    const counts = suaraData.reduce((acc, { kabupaten, kecamatan, kelurahan, CreatedAt }) => {
        const date = new Date(CreatedAt).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { kabupaten: {}, kecamatan: {}, kelurahan: {} };
        }
        acc[date].kabupaten[kabupaten] = (acc[date].kabupaten[kabupaten] || 0) + 1;
        acc[date].kecamatan[kecamatan] = (acc[date].kecamatan[kecamatan] || 0) + 1;
        acc[date].kelurahan[kelurahan] = (acc[date].kelurahan[kelurahan] || 0) + 1;
        return acc;
    }, {});

    return counts;
}

