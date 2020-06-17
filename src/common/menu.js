import { isUrl } from "../utils/utils";

const menuData = [
  // call-analytics
  {
    name: "通话分析",
    icon: "area-chart",
    path: "call-analytics",
    hideChildrenInMenu: true,
    children: [
      {
        path: "call-analytics/search"
      },
      {
        path: "call-analytics/qoe"
      },
      {
        path: "call-analytics/e2e"
      }
    ]
  }
];

function formatter(data, parentPath = "/", parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
