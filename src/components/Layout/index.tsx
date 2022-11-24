import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ProLayout, ProPageHeader } from '@ant-design/pro-components';
import type { ProSettings } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { globalAsideCollapsed } from '../../globalState';

import { routes } from './routes';

const settings: ProSettings = {
  layout: 'mix',
  siderMenuType: 'group',
};

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [asideCollapsed, setAsideCollapsed] = useRecoilState(globalAsideCollapsed);

  return (
    <ProLayout
      {...settings}
      route={routes}
      location={{
        pathname,
      }}
      // logo={false}
      // 折叠
      breakpoint={false}
      collapsed={asideCollapsed}
      onCollapse={setAsideCollapsed}
      collapsedButtonRender={false}
      // avatarProps={{
      //   src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      //   size: 'small',
      //   title: '七妮妮',
      // }}
      menuFooterRender={() => (
        <Button
          block
          onClick={() => {
            setAsideCollapsed((x) => !x);
          }}
        >
          {asideCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      )}
      headerTitleRender={asideCollapsed ? (logo) => <Link to="/">{logo}</Link> : undefined}
      headerContentRender={() => {
        return (
          <ProPageHeader
            prefixedClassName=""
            breadcrumbRender={false}
            header={{
              onBack() {
                navigate(-1);
              },
            }}
          />
        );
      }}
      menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
    >
      {children}
    </ProLayout>
  );
};

export default AppLayout;
