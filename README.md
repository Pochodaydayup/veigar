# Veigar

## 开发流程

1. git clone git@github.com:Pochodaydayup/veigar.git
2. yarn
3. yarn dev:mp
4. 用头条开发者工具打开 veigar/packages/veigar/examples/mp 即可调试

## TODO

- [ ] veigar-cli 的开发
  - [x] 接入 webpack webpack-chain
    - [x] build 命令的开发
  - [ ] 完成 veigar-loader
    - [x] compile .vue 文件
    - [ ] compile .tsx 文件
  - [ ] 完成 veigar-webpack-plugin 插件
    - [ ] typescript(tsx) 友好支持
    - [x] 将每个 page 分别打包，将每个 js 文件分别打包

- [ ] veigar 的开发
  - [ ] comment 的优化，目前是会创建一个空节点
  - [ ] patch props
  - [ ] setData queue

- [x] 开发流程的优化
