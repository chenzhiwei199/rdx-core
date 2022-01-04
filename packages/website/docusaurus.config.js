const path = require('path');

module.exports = {
  title: 'Rdx',
  tagline: 'A state management library for React',
  url: 'https://chenzhiwei199.github.io',
  // https://github.com/chenzhiwei199/rdx-doc.git
  // https://github.com/czwcode/rdx.git
  baseUrl: '/rdx-doc/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'czwcode', // Usually your GitHub org/user name.
  projectName: 'rdx-doc', // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: 'a77e51116e47f5d2111555e347942ebe',
      indexName: 'rdx-doc',

      // Optional: see doc section bellow
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {},

      //... other Algolia params
    },
    navbar: {
      title: 'Rdx',
      logo: {
        alt: 'Rdx Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/introduce/coreConcepts',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        // { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'http://gitlab.alibaba-inc.com/wdk-frontend-release/rdx',
          label: 'Gitlab',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '核心概念',
              to: 'docs/introduce/coreConcepts',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/fusion.css'),
          ],
        },
      },
    ]
  ],
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [path.resolve(__dirname, 'tspaths-docusaurus-plugin.js')],
  scripts: [
    // 'https://gw.alipayobjects.com/os/lib/react-is/16.13.0/umd/react-is.development.js',
    // 'https://gw.alipayobjects.com/os/lib/react/16.12.0/umd/react.development.js',
    // 'https://gw.alipayobjects.com/os/lib/react-dom/16.12.0/umd/react-dom.development.js',
    // '//gw.alipayobjects.com/os/lib/styled-components/5.1.0/dist/styled-components.js',
    // '//gw.alipayobjects.com/os/lib/moment/2.24.0/moment.js',
    // '//gw.alipayobjects.com/os/lib/alife/hippo/2.13.11/dist/hippo.js'
  ],
};
