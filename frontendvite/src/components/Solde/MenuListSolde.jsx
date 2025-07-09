import { Menu } from "antd";
import {
  HomeOutlined,
  FileAddOutlined,
  CodepenOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu; // ✅ Déstructuration de SubMenu

const MenuList = ({ darkTheme, setSelectedPage }) => {
  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: "Acceuil" },
    { key: "cas", icon: <FileAddOutlined />, label: "CA.S" },
    {
      key: "ccps", 
      icon: <FileAddOutlined />, 
      label: "CCP.S",
      children:[
        {key:"normal", label:"Normal"},
        {key:"rectificatif", label:"Rectificatif"},
      ]
    },
    {
      key: "code",
      label: "Référentiels",
      icon: <CodepenOutlined />,
      children: [
        { key: "corps", label: "Corps" },
        { key: "zone", label: "Zone" },
        { key: "rubrique", label: "Rubrique" },
        { key: "corps-grade-indice", label: "Corps-Grade-Indice" },
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
            {item.children.map((child) => (
              <Menu.Item key={child.key}>{child.label}</Menu.Item>
            ))}
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
