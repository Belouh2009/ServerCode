import { Menu } from "antd";
import { UserAddOutlined, CodepenOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

const MenuList = ({ selectedPage, setSelectedPage }) => {
  // Ajout de selectedPage en prop
  const menuItems = [
    { key: "users", icon: <UserAddOutlined />, label: "Utilisateurs" },
    {
      key: "code",
      label: "Codes",
      icon: <CodepenOutlined />,
      children: [
        { key: "bareme", label: "Bareme" },
        { key: "corps", label: "Corps Grade Indice" },
        { key: "zone", label: "Zone" },
        {
          key: "rubrique",
          label: "Rubrique",
          children: [
            { key: "pension", label: "Pension" },
            { key: "solde", label: "Solde" },
          ],
        },
      ],
    },
  ];

  return (
    <Menu
      theme="light"
      mode="inline"
      className="menu-bar"
      selectedKeys={[selectedPage]} // Utilise selectedPage pour la sélection active
      onClick={(e) => setSelectedPage(e.key)}
    >
      {menuItems.map((item) =>
        item.children ? (
          <SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.children.map((child) =>
              child.children ? (
                <SubMenu key={child.key} title={child.label}>
                  {child.children.map((subChild) => (
                    <Menu.Item key={subChild.key}>{subChild.label}</Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={child.key}>{child.label}</Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

export default MenuList;
