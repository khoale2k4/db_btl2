import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataFetcher = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data/vendor')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Attempting to fetch the data</h1>
            <div>
                {data.map((item) => (
                    <ul key={item.VendorID}>
                        <li>{item.VendorID}</li>
                        <li>{item.VendorName}</li>
                        <li>{item.VendorAddress}</li>
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default DataFetcher;