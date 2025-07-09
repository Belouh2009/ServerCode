import { Menu } from "antd";
import {
  UserAddOutlined,
  CodepenOutlined
} from "@ant-design/icons";

const { SubMenu } = Menu;

const MenuList = ({ darkTheme, setSelectedPage }) => {
  const menuItems = [
    { key: "users", icon: <UserAddOutlined />, label: "Utilisateurs" },
    {
      key: "code",
      label: "Référentiels",
      icon: <CodepenOutlined />,
      children: [
        { key: "corps", label: "Corps" },
        { key: "zone", label: "Zone" },
        {
          key: "rubrique",
          label: "Rubrique",
          children: [
            { key: "pension", label: "Pension" },
            { key: "solde", label: "Solde" },
          ],
        },
        { key: "corpsGradeIndice", label: "Corps Grade Indice" },
      ],
    },
  ];

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu-bar"
      defaultSelectedKeys={["home"]}
      onClick={(e) => setSelectedPage(e.key)} // ✅ Sélectionner une page au clic
    >
      {menuItems.map((item) =>
        item.children ? ( // ✅ Vérifier si l'élément a des enfants (sous-menu)
          <SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.children.map((child) =>
              child.children ? ( // ✅ Vérifier si l'enfant a aussi des sous-menus (comme "Rubrique")
                <SubMenu key={child.key} icon={child.icon} title={child.label}>
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
