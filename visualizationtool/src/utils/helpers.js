import { PERCENTAGE_METRICS } from "./constants";

export const fixHeatmapData = (originalData) => {

    let data = [];
    for (const pData of originalData) {
        let originalKey = pData.file
        for (const key in pData) {
            if (key === 'file') continue;

            const newDataPoint = {
                group: originalKey,
                variable: key,
                value: pData[key]
            };

            data.push(newDataPoint);
        }
    }

    return data;
}

export const bubblePlotTransform = (data, xAxisVariable, yAxisVariable, zAxisVariables) => {
    const transformedData = [];

    data.forEach(item => {
        const xValue = item[xAxisVariable];
        const yValue = item[yAxisVariable];

        Object.keys(item).forEach(key => {
            if (![xAxisVariable, yAxisVariable, 'file'].includes(key) && zAxisVariables.includes(key)) {
                const isPercentage = PERCENTAGE_METRICS.includes(key);
                transformedData.push({
                    file: item.file,
                    x: xValue,
                    y: yValue,
                    zValue: isPercentage ? item[key] * 5 : item[key],
                    zMetric: key
                });
            }
        });
    });

    return transformedData;
}

export const sortByVariable = (a, b, variable, sortDesc) => {
    if (a.variable === variable && b.variable !== variable) {
        return -1;
    } else if (a.variable !== variable && b.variable === variable) {
        return 1;
    } else {
        if (a.value > b.value) return sortDesc ? 1 : -1;
        if (a.value < b.value) return sortDesc ? -1 : 1;
        return 0;
    }
}

export const firstLetterUppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const strWithUnderscores = (str) => {
    return str.split(" ").join("_");
}

export const strWOUnderscores = (str) => {
    return str.split("_").join(" ");
}

const normalizeYear = (key) => {
    // Check for "MM/YYYY" format
    if (key.includes('/')) {
        return key.split('/')[1];
    }
    // Check for "YYYY-QX" format
    if (key.includes('-Q')) {
        return key.split('-')[0];
    }
    // Check for YYYY-MM
    if (key.includes('-')) {
        return key.split('-')[0];
    }
    // Default to the key itself if it doesn't match known patterns
    return key;
};

const calculateMetrics = (data, startYear, endYear) => {

    startYear = parseInt(startYear);
    endYear = parseInt(endYear);
    let diff = (endYear - startYear) * data.values_per_period + data.values_per_period;
    if (data.frequency === 'M') {
        diff = diff * 12
    } else if (data.frequency === 'Q') {
        diff = diff * 4
    }

    if (data.consistency && data.completeness) {
        if (data.non_uniform_cells) {
            let avg = data.values_per_period;
            let totalCompletenessCells = 0;
            let totalConsistencyCells = 0;
            let totalCells = 0;

            const yearlyCompleteness = {}
            const yearlyConsistency = {}
            const yearlyCells = {}

            // Normalize completeness data
            for (let key in data.completeness) {
                let year = normalizeYear(key);
                if (!yearlyCompleteness[year]) {
                    yearlyCompleteness[year] = 0;
                    yearlyCells[year] = 0;
                }
                yearlyCompleteness[year] += data.completeness[key].completeness_cells;
                yearlyCells[year] += data.completeness[key].cells;
            }

            // Normalize consistency data
            for (let key in data.consistency) {
                let year = normalizeYear(key);
                if (!yearlyConsistency[year]) {
                    yearlyConsistency[year] = 0;
                }
                yearlyConsistency[year] += data.consistency[key].consistency_cells;
            }

            for (let i = startYear; i <= endYear; i++) {
                totalCompletenessCells += yearlyCompleteness[i] ? yearlyCompleteness[i] : 0;
                totalConsistencyCells += yearlyConsistency[i] ? yearlyConsistency[i] : 0;
                totalCells += yearlyCells[i] ? yearlyCells[i] : avg;
            }

            return {
                completeness_percentage: totalCompletenessCells / totalCells,
                consistency_percentage: totalConsistencyCells / totalCells
            };

        } else {
            let totalCompletenessCells = 0;
            let totalConsistencyCells = 0;

            const yearlyCompleteness = {};
            const yearlyConsistency = {};

            // Normalize completeness data
            for (let key in data.completeness) {
                let year = normalizeYear(key);
                if (!yearlyCompleteness[year]) {
                    yearlyCompleteness[year] = 0;
                }
                yearlyCompleteness[year] += data.completeness[key].completeness_cells;
            }

            // Normalize consistency data
            for (let key in data.consistency) {
                let year = normalizeYear(key);
                if (!yearlyConsistency[year]) {
                    yearlyConsistency[year] = 0;
                }
                yearlyConsistency[year] += data.consistency[key].consistency_cells;
            }

            // Sum up the values for the specified range of years
            for (let i = startYear; i <= endYear; i++) {
                totalCompletenessCells += yearlyCompleteness[i] ? yearlyCompleteness[i] : 0;
                totalConsistencyCells += yearlyConsistency[i] ? yearlyConsistency[i] : 0;
            }

            return {
                completeness_percentage: totalCompletenessCells / diff,
                consistency_percentage: totalConsistencyCells / diff
            };
        }
    } else {
        let completeness = 0
        let consistency = 0
        for (let i = data.chronological_order_start; i <= data.chronological_order_end; i++) {
            completeness++
            consistency++
        }
        return {
            completeness_percentage: completeness / diff > 1 ? 1 : completeness / diff,
            consistency_percentage: consistency / diff > 1 ? 1 : consistency / diff
        }
    }

};

export const filterData = (data, sliderValue, dataGroups) => {
    let documents = [];
    data
        .filter((doc) => {
            return dataGroups.includes(doc.data_group)
        })
        .map((doc) => {
            const metrics = calculateMetrics(doc, sliderValue[0], sliderValue[1]);
            if (!metrics) return false
            documents.push({
                file: doc.filename,
                completeness: metrics.completeness_percentage,
                currency: doc.currency,
                consistency: metrics.consistency_percentage,
                retrieval: doc.retrieval,
                accessibility: doc.accessibility,
                chrono_start: doc.chronological_order_start,
                chrono_end: doc.chronological_order_end
            });
            return true;
        })
    return documents;
}

export const nullTranslator = (value) => {
    return value || 'No data'
}

export const countByDataGroup = (data, sliderValue) => {
    let startYear = sliderValue[0]
    let endYear = sliderValue[1]
    return data.reduce((acc, doc) => {
        const dataGroup = doc.data_group;

        if (Number(doc.chronological_order_start) >= startYear && Number(doc.chronological_order_end) <= endYear) {
            if (acc[dataGroup]) {
                acc[dataGroup]++;
            } else {
                acc[dataGroup] = 1;
            }
            acc.total++;
        }

        return acc;
    }, { total: 0 }); // Initialize total count to 0
};