import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/plots';

const DemoArea = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data,
    smooth : true,
    xField: 'Date',
    yField: 'scales',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  };

  return (
    <>
        <div>
            <h1 className='text-2xl'>Chart 1</h1>
            <Area {...config} />
        </div>
        <div>
            <h1 className='text-2xl'>Chart 2</h1>
            <Area {...config} />
        </div>
    </>
  );
};

export default DemoArea;