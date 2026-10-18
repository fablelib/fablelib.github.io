import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

const vitepressOptions = {
  title: 'fable',
  description: '个人笔记',
  srcExclude: ['README.md', 'node_modules/**'],
  themeConfig: {
    nav: [{ text: '首页', link: '/' }],
    outline: [2, 3],
    lastUpdated: true
  }
}

const vitePressSidebarOptions = {
  documentRootPath: '/',
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  collapsed: false,
  excludeFiles: ['index.md'],
  excludeFolders: ['node_modules', '.github', '.vitepress']
}

export default defineConfig(
  withSidebar(vitepressOptions, vitePressSidebarOptions)
)