import React, { useState } from 'react';
import { Button, Flex, Table, Card, Spin, Typography, theme } from 'antd';

const { Title } = Typography;

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];

const dataSource = Array.from({ length: 46 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const darkTheme = colorBgContainer === '#001529';

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = newSelectedRowKeys => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div
      style={{
        marginLeft: '10px',
        marginTop: '10px',
        padding: '24px',
        background: darkTheme ? '#001529' : '#fff',
        color: darkTheme ? '#ffffff' : '#000000',
        borderRadius: '10px 0 0 0',
        minHeight: '280px',
      }}
    >
      <Title level={2} style={{ color: darkTheme ? '#ffffff' : '#000000' }}>
        Teste Tableau Ant Design
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p>Chargement des données...</p>
        </div>
      ) : (
        <Card>
          <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
              <Button
                type="primary"
                onClick={start}
                disabled={!hasSelected}
                loading={loading}
              >
                Reload
              </Button>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
            </Flex>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
            />
          </Flex>
        </Card>
      )}
    </div>
  );
};

export default App;
