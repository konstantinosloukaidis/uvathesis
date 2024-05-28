import React, { useState } from 'react';
import { Tabs, Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

function MetricsInformationCard() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [activeKey, setActiveKey] = useState('1');
    const navigate = useNavigate();

    const changeTab = (key) => {
      setActiveKey(key);
    };

    const dataSourceGM = [
        {
            key: '1',
            dimension: 'Volume',
            metric: "Number of datasets",
            description: 'The total number of datasets related to the data index. For example the number of datasets available for the Coverage index.',
            range: '0 - unbound'
        },
        {
            key: '2',
            dimension: 'Accessibility',
            metric: "Five Star Open Data",
            description: (
                <>
                    This metric rates a dataset in terms of accessibility using Tim Berners-Lee Five Star Open Data, which measures how accessible a dataset is. One star is attributed to data being available in any form, while five stars explains that the dataset connects other datasets within itself. For more information you can check the <a href='https://5stardata.info/en/' target="_blank" rel="noopener noreferrer"> website.</a>.
                </>
            ),
            range: '1 stars - 5 stars'        
        },
        {
            key: '3',
            dimension: 'Retrieval',
            metric: "Five Star Retrieval Difficulty",
            description: <Button onClick={() => navigate('/information/five-star-retrieval-difficulty')}>Five Star Retrieval Difficulty information page</Button>,
            range: '1 stars - 5 stars'        
        },
        {
            key: '4',
            dimension: 'Veracity',
            metric: "OGD or PSD",
            description: "This metric simply explains if the dataset is considered Open Government Data (OGD) or Private Sector Data (PSD).",
            range: '-'
        },
        {
            key: '5',
            dimension: 'Veracity',
            metric: "Source",
            description: "The source of the dataset. This contains the information about where was the dataset found, and not necessarily the original publisher. In case there is information about the origins of the creator of the dataset, for example the municipality, we try to include it.",
            range: '-'
        },
    ];

    const dataSourceOGDWMS = [
        {
            key: '1',
            dimension: 'Consistency',
            metric: "Layer Availability",
            description: 'OGD:WMS format uses requests to a server to acquire layer information and construct an image visualising the dataset information. Using this metric we check how many layers are available in the GetCapabilities request.',
            range: '0-100%'
        },
        {
            key: '2',
            dimension: 'Completeness',
            metric: "Map Layer Completeness",
            description: "Using the available layers, we construct the image using the GetMap request and ensure that it works without any errors. Also, we make sure that the image represents the information provided by the source, for example it successfully showcases a map of Amsterdam. This metric is purely calculated visually so it is not quantitative.",
            range: '-'
        },
        {
            key: '3',
            dimension: 'Currency',
            metric: "Metadata examination",
            description: "We check the given metadata from the GetCapabilities request and try to find out information about the currency of the dataset.",
            range: 'False = 0%, True=100%'
        },
        {
            key: '4',
            dimension: 'Chronological Order',
            metric: "Metadata examination",
            description: "We check the given metadata from the GetCapabilities request and try to find out information about the currency of the dataset.",
            range: `unbound - ${currentYear}`
        },
    ]

    const dataSourceAPI = [
        {
            key: '1',
            dimension: 'Completeness',
            metric: "Successful requests",
            description: 'We cannot measure exact completeness of data through API calls, we assume that every successful call (a 200 HTTP request) ensures completeness for the specified data, but we do not have information about how many different calls we can make, and therefore cannot measure a percentage.',
            range: '100%'
        },
        {
            key: '2',
            dimension: 'Consistency',
            metric: "Consistent requests",
            description: "We do not have information how many calls we can make, but we can ensure that for each call the returned data reflects the API description. For example if we use NS's API about pricing, we should retrieve values in float format. However, this depends on how clear the use of the API is from the vendor.",
            range: '0-100%'
        },
        {
            key: '3',
            dimension: 'Currency',
            metric: "API currency",
            description: "If the API is in use, then we assume it is currently updated and maintained. We cannot retrieve further information.",
            range: 'False = 0%, True=100%'
        },
        {
            key: '4',
            dimension: 'Chronological Order',
            metric: "API information",
            description: "Depends on the information given for the vendor. Usually it contains current and ongoing information.",
            range: `unbound - ${currentYear}`
        },
    ]

    const dataSourceCrawler = [
        {
            key: '1',
            dimension: 'Completeness',
            metric: "EXCEL/TSV/CSV Completeness",
            description: <Button onClick={() => changeTab('3')}>Check related tab</Button>,
            range: '-'
        },
       {
            key: '2',
            dimension: 'Consistency',
            metric: "EXCEL/TSV/CSV Consistency",
            description: <Button onClick={() => changeTab('3')}>Check related tab</Button>,
            range: '-'
        },
        {
            key: '3',
            dimension: 'Currency',
            metric: "EXCEL/TSV/CSV Curreny",
            description: <Button onClick={() => changeTab('3')}>Check related tab</Button>,
            range: '-'
        },
        {
            key: '4',
            dimension: 'Chronological Order',
            metric: "EXCEL/TSV/CSV Chronological order",
            description: <Button onClick={() => changeTab('3')}>Check related tab</Button>,
            range: `unbound - ${currentYear}`
        },
    ]

    const dataSourceEXCEL = [
        {
            key: '1',
            dimension: 'Consistency',
            metric: "Percentage of cells in a comprehensible and correct format",
            description: "We firstly understand what each column's or row's values should be, for example one dataset entails kilometre's coverage, therefore the values should be numeric. After that we try to find out how many cells contain proper numeric values and divide them by the total of cells in the period range. An empty cell is also considered not consistent with the database. This metric helps us find out how well written the dataset is, as well as how well the authors followed their own conformities.",
            range: '0-100%'
        },
        {
            key: '2',
            dimension: 'Completeness',
            metric: "Percentage of complete cells",
            description: "We find out how many cells are empty or not. For example, if a numeric cell has the number 0, this is considered complete, since someone added this value, even if it might be incorrect. Also, if the dataset has wrongly formatted cells, they are still complete. This way we can have an insight on how well and carefully maintained the dataset is.",
            range: '0-100%'
        },
        {
            key: '3',
            dimension: 'Completeness',
            metric: "Percentage of complete rows",
            description: "To acquire this metric, we check if for each year the dataset contains values for all of its metrics. For example in a dataset measuring kilometre coverage, it could contain information about electrified or non-electrified rails, therefore with this metric we can check if for the given period range, all periods are complete for both metrics.",
            range: '0-100%'
        },
        {
            key: '4',
            dimension: 'Currency',
            metric: "Percentage of current rows",
            description: "To calculate this metric we firstly find out the frequency of the sampling. Then we try to find the latest possible sampling period. For example if the frequnency is annual and we have 2024, then the latest possible period would be 2023, since 2024 is not yet complete. Then we check how many rows or columns (depending on the dataset's format) have values for the latest period. Lastly, we divide this number with the total number of rows or columns accordingly.",
            range: '0-100%'
        },
        {
            key: '5',
            dimension: 'Chronological Order',
            metric: "Chronological order of data",
            description: "This metric highlights the available years of the dataset. For a year to be considered available, the dataset should have at least one value. This metric showcases how many years of information are available in the dataset.",
            range: `unbound - ${currentYear}`
        },
    ]

    const dataSourceXMLRDF = [
        {
            key: '1',
            dimension: 'Consistency',
            metric: "Data Format Validation",
            description: 'XMLs (Extensible Markup Language) or XML/RDFs (Resource Description Framework) usually are accompanied with a XML Schema Definition. A consistency metric should describe if a given XML adheres to the rules specified by its XSD. This metric specifically returns the number of nodes that are formatted properly according to the XSD',
            range: '0-100%'
        },
        {
            key: '2',
            dimension: 'Completeness',
            metric: "Element & Attribute Check",
            description: "This metric specifies how many nodes are available, depending on the XSD of the XML. It does not specify if the nodes are correctly formatted but rather if they exist altogether.",
            range: '0-100%'
        },
        {
            key: '3',
            dimension: 'Currency',
            metric: "Metadata examination",
            description: "In order to evaluate the currency of an XML, an examination of its XSD or the XML itself, should give information about the chronological period it entails and thus how many of its data is current.",
            range: '-'
        },
        {
            key: '4',
            dimension: 'Chronological Order',
            metric: "Metadata examination",
            description: "Same as Currency",
            range: `unbound - ${currentYear}`
        },
    ]

    const columns = [
        {
            title: 'Dimension',
            dataIndex: 'dimension',
            key: 'dimension',
            width: 100
        },
        {
            title: 'Metric',
            dataIndex: 'metric',
            key: 'metric',
            width: 100
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200
        },
        {
            title: 'Range',
            dataIndex: 'range',
            key: 'range',
            width: 50
        },
    ];

    const items = [
        {
          key: '1',
          label: 'General Metrics',
          children: <Table dataSource={dataSourceGM} columns={columns} pagination={false} />
        },
        {
            key: '2',
            label: 'OGD:WMS',
            children: <Table dataSource={dataSourceOGDWMS} columns={columns} pagination={false} />
        },
        {
            key: '3',
            label: 'EXCEL/TSV/CSV',
            children: <Table dataSource={dataSourceEXCEL} columns={columns} pagination={false} />
        },
        {
            key: '4',
            label: 'API',
            children:
            <div style={{ height: "100%", overflow: "auto"}}>
                <div className="information-container">
                    Very few API dataset samples.
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginLeft: "5px"}}/>
                </div>
                <Table dataSource={dataSourceAPI} columns={columns} pagination={false} />
            </div>
        },
        {
            key: '5',
            label: 'Crawler/Scrapping',
            children: <Table dataSource={dataSourceCrawler} columns={columns} pagination={false} />,
        },
        {
            key: '6',
            label: 'XML/RDF',
            children:             
            <div style={{ height: "100%", overflow: "auto"}}>
                <div className="information-container">
                    No XML/RDF dataset samples.
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginLeft: "5px"}}/>
                </div>
                <Table dataSource={dataSourceXMLRDF} columns={columns} pagination={false} />
            </div>
        },
    ];

    return (
        <div style={{ height: '550px', width: '1100px', overflow: "auto" }}>
            <Tabs 
                defaultActiveKey={activeKey} 
                activeKey={activeKey} 
                items={items} 
                onChange={setActiveKey}
            />
        </div>
    );
}

export default MetricsInformationCard;