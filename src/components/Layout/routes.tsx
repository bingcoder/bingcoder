import { CrownFilled, SmileFilled } from '@ant-design/icons';

export const routes = {
  path: '/',
  children: [
    {
      path: '/',
      name: '欢迎',
      icon: <SmileFilled />,
    },
    {
      path: 'type-challenges',
      name: 'Type Challenge',
      icon: <CrownFilled />,
      children: [
        {
          path: 'easy',
          name: '简单',
          icon: <CrownFilled />,
        },
        {
          path: 'medium',
          name: '中等',
          icon: <CrownFilled />,
        },
        {
          path: 'hard',
          name: '困难',
          icon: <CrownFilled />,
        },
      ],
    },
    // {
    //   name: '列表页',
    //   icon: <TabletFilled />,
    //   path: '/list',
    //   children: [
    //     {
    //       path: '/list/sub-page',
    //       name: '列表页面',
    //       icon: <CrownFilled />,
    //       children: [
    //         {
    //           path: 'sub-sub-page1',
    //           name: '一一级列表页面',
    //           icon: <CrownFilled />,
    //         },
    //         {
    //           path: 'sub-sub-page2',
    //           name: '一二级列表页面',
    //           icon: <CrownFilled />,
    //         },
    //         {
    //           path: 'sub-sub-page3',
    //           name: '一三级列表页面',
    //           icon: <CrownFilled />,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/list/sub-page2',
    //       name: '二级列表页面',
    //       icon: <CrownFilled />,
    //     },
    //     {
    //       path: '/list/sub-page3',
    //       name: '三级列表页面',
    //       icon: <CrownFilled />,
    //     },
    //   ],
    // },
    // {
    //   path: 'https://ant.design',
    //   name: 'Ant Design 官网外链',
    //   icon: <ChromeFilled />,
    // },
  ],
};
