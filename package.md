# dependences:
## @element-plus/icons-vue (^2.3.1)
这是一个为 Vue 3 提供 Element Plus 图标的包。它包含了 Element Plus UI 组件库的所有图标，专门为 Vue 3 设计，支持按需引入。

## @stomp/stompjs (^7.0.0)
STOMP（Simple Text Oriented Messaging Protocol）是一个用于消息传递的协议，特别适用于 WebSockets。@stomp/stompjs 是 STOMP 协议的 JavaScript 客户端库，常用于实现实时通讯（如聊天室、通知等功能）。

## @vueuse/core (^10.11.1)
VueUse 是一个为 Vue 提供实用功能的库，它包含大量的自定义组合函数（composables），可以帮助开发者在 Vue 3 中更高效地进行状态管理、事件处理、DOM 操作等

## @wangeditor/editor (^5.1.23)
这是 WangEditor 的核心编辑器库，WangEditor 是一个轻量级的富文本编辑器，提供了许多常用的功能，适用于 Web 开发中需要富文本编辑的场景。

## @wangeditor/editor-for-vue (5.1.10)
这是 WangEditor 编辑器的 Vue 3 版本封装，可以更方便地在 Vue 3 项目中使用 WangEditor，提供了 Vue 组件化的方式来集成富文本编辑器。

## codemirror (^5.65.18)
CodeMirror 是一个基于 JavaScript 的代码编辑器，它可以嵌入到 Web 应用中，支持多种编程语言的语法高亮、代码自动补全、代码折叠等功能，适用于构建在线代码编辑器或 IDE。

## codemirror-editor-vue3 (^2.8.0)
这是为 Vue 3 提供的 CodeMirror 组件封装，方便在 Vue 3 项目中集成 CodeMirror 编辑器。

## element-plus (^2.9.2)
Element Plus 是一款基于 Vue 3 的桌面端 UI 组件库，提供了一套高质量的组件和样式，可以快速构建现代化的 Web 应用界面，类似于 Vue 2 的 Element UI。

## exceljs (^4.4.0)
ExcelJS 是一个用于处理 Excel 文件的 JavaScript 库，支持读取、创建、修改 Excel 文件（.xlsx 格式），可以方便地在浏览器端或 Node.js 环境中处理 Excel 文件。

## lodash-es (^4.17.21)
Lodash 是一个实用的 JavaScript 库，提供了一系列常用的工具函数（如数组、对象、函数操作等）。lodash-es 是 Lodash 的 ES 模块版本，可以更好地与现代 JavaScript 打包工具（如 Webpack、Vite）兼容。

## nprogress (^0.2.0)
NProgress 是一个小巧的进度条库，通常用于在页面加载或执行长时间操作时显示进度条。它支持动态设置进度和定制样式。

## path-browserify (^1.0.1)
path-browserify 是 Node.js 中 path 模块的浏览器版本。它提供了路径处理的相关工具方法，适用于在浏览器端处理文件路径的场景。

## path-to-regexp (^6.3.0)
path-to-regexp 是一个将路径模板转换为正则表达式的库。它常用于处理 URL 路由匹配，尤其在 React Router、Vue Router 等前端路由库中得到广泛应用。

## qs (^6.13.1)
qs 是一个用于处理查询字符串的库，它可以将对象转换为 URL 编码的查询字符串，或者将查询字符串解析为对象。它通常与 HTTP 请求库（如 Axios）一起使用。

## sortablejs (^1.15.6)
Sortable.js 是一个用于实现拖拽排序功能的 JavaScript 库，可以轻松地将列表、网格等元素转化为可排序的组件，常用于实现动态拖拽功能。

## vue-i18n (9.9.1)
vue-i18n 是一个 Vue 的国际化插件，用于在 Vue 应用中处理多语言支持。它允许你根据用户的语言设置动态切换不同的语言环境。


# dev:
## @commitlint/cli (^19.6.1)
这是 Commitlint 的 CLI 工具，用于检查 Git 提交信息是否符合规范。它常与 Commitizen 等工具配合使用，确保团队的 Git 提交符合一致的格式，如 Angular 或 Conventional Commits 标准。

## @commitlint/config-conventional (^19.6.0)
这是 Commitlint 的配置包，提供了 Conventional Commits 标准的配置规则，确保 Git 提交消息的格式符合惯例，如 feat: add new feature 或 fix: fix bug 等。

## @eslint/js (^9.17.0)
@eslint/js 是 ESLint 的核心包，提供了 JavaScript 代码检查功能。它帮助开发者检测代码中的潜在错误、不一致性或不符合项目规范的地方。

## @types/codemirror (^5.60.15)
这是为 CodeMirror 编辑器提供的 TypeScript 类型定义包。CodeMirror 是一个流行的代码编辑器，支持语法高亮和代码自动完成等功能。

## @types/lodash (^4.17.14)
Lodash 是一个常用的 JavaScript 工具库，@types/lodash 提供了 Lodash 库的 TypeScript 类型定义，帮助开发者在使用 Lodash 时获得类型检查和自动补全支持。

## @types/node (^22.10.5)
这是 Node.js 的 TypeScript 类型定义包，提供 Node.js 内置模块（如 fs、http、path 等）的类型信息，以便 TypeScript 开发者能够进行类型检查。

## @types/nprogress (^0.2.3)
这是 nprogress 库的 TypeScript 类型定义包，nprogress 是一个用于显示加载进度条的库，通常在 Web 应用加载时使用。

## @types/path-browserify (^1.0.3)
这是 path-browserify 的 TypeScript 类型定义包，path-browserify 提供了 Node.js path 模块的浏览器版本，通常用于处理 URL 和路径。

## @types/qs (^6.9.17)
qs 是一个用于处理查询字符串的库，@types/qs 为其提供了 TypeScript 类型定义，确保你在使用 qs 时能获得类型检查。

## @types/sortablejs (^1.15.8)
这是 Sortable.js 的 TypeScript 类型定义包，Sortable.js 是一个用于实现拖拽排序的 JavaScript 库。

## @typescript-eslint/eslint-plugin (^8.19.0)
这是 ESLint 插件，用于在 TypeScript 项目中检查 TypeScript 特有的语法问题。它扩展了 ESLint 的规则集合，专门处理 TypeScript 的代码检查

## @typescript-eslint/parser (^8.19.0)
这是 ESLint 的解析器，用于解析 TypeScript 代码，使 ESLint 可以处理 TypeScript 文件（.ts 和 .tsx）。

## @vitejs/plugin-vue (^5.2.1)
这是 Vite 的官方插件，专为 Vue 3 项目设计。它提供了 Vue 文件的处理（如 .vue 文件的编译和热重载支持），与 Vite 集成，提供更快速的开发体验。

## autoprefixer (^10.4.20)
Autoprefixer 是一个 CSS 后处理工具，它会自动添加浏览器前缀，以确保 CSS 代码在各个浏览器中的兼容性。

## commitizen (^4.3.1)
Commitizen 是一个帮助生成符合规范的 Git 提交信息的工具。它通过交互式的命令行提示用户输入符合规则的提交信息，通常与 @commitlint 配合使用。

## cz-git (1.9.4)
cz-git 是一个 Commitizen 适配器，它提供了 Git 提交信息的规范化生成。通过 cz-git，你可以使用交互式命令行生成符合 Conventional Commits 标准的提交消息。

## eslint (^9.17.0)
ESLint 是一个广泛使用的 JavaScript 代码静态分析工具，用于检测和修复代码中的问题，以保持代码质量和一致性。

## eslint-config-prettier (^9.1.0)
这是一个 ESLint 配置包，用于关闭所有与 Prettier 格式化工具冲突的 ESLint 规则，以便在使用 Prettier 的同时，避免格式化规则的冲突。

## 19. eslint-plugin-prettier (^5.2.1)
这是一个 ESLint 插件，将 Prettier 集成到 ESLint 中。它允许 ESLint 自动检查代码格式化，并与 Prettier 配合使用。

## 20. eslint-plugin-vue (^9.32.0)
这是一个专为 Vue.js 项目设计的 ESLint 插件，提供 Vue 文件（.vue）的代码检查和语法规则。

## 21. globals (^15.14.0)
globals 提供了常见的 JavaScript 和 Web 环境中的全局变量的类型定义，用于在 ESLint 等工具中避免未声明的全局变量报错。

## 22. husky (^9.1.7)
Husky 是一个 Git 钩子工具，用于在 Git 操作（如 git commit）时执行自定义脚本。常用于集成代码检查、格式化等任务。

## 23. lint-staged (^15.3.0)
lint-staged 允许你在 Git 提交之前，只对被修改的文件运行代码检查工具，常与 Husky 一起使用，确保提交的代码符合规范。

## 24. postcss (^8.4.49)
PostCSS 是一个用于处理 CSS 的工具，可以执行 CSS 转换、优化、自动添加前缀等任务。它通过插件机制支持扩展。

## 25. postcss-html (^1.7.0)
这是一个 PostCSS 插件，允许 PostCSS 处理 HTML 文件中的 <style> 标签中的 CSS。

## 26. postcss-scss (^4.0.9)
这是一个 PostCSS 插件，允许 PostCSS 处理 SCSS（Sass）语法的文件。

## 27. prettier (^3.4.2)
Prettier 是一个代码格式化工具，自动将代码格式化为一致的样式，支持多种语言，包括 JavaScript、CSS、HTML、Markdown 等。

## 28. sass (^1.83.1)
Sass 是一种 CSS 预处理器，提供了更强大的功能，如变量、嵌套规则、混入（mixins）等。

## 29. stylelint (^16.12.0)
Stylelint 是一个 CSS 和 Sass 代码检查工具，用于检测和修复样式文件中的问题，帮助保持样式的一致性。

## 30. stylelint-config-html (^1.1.0)
这是 Stylelint 的配置包，适用于 HTML 文件中的样式检查。

## 31. stylelint-config-recess-order (^5.1.1)
这是 Stylelint 的配置包，遵循 Recess Order 规则，帮助确保 CSS 属性的顺序一致。

## 32. stylelint-config-recommended-scss (^14.1.0)
这是 Stylelint 的 SCSS 推荐配置，适用于 SCSS 文件的代码检查。

## 33. stylelint-config-recommended-vue (^1.5.0)
这是 Stylelint 的 Vue 推荐配置，适用于 .vue 文件中的样式检查。

## 34. stylelint-config-standard (^36.0.1)
这是 Stylelint 的标准配置，包含了常见的 CSS 样式规则检查。

## 35. terser (^5.37.0)
Terser 是一个 JavaScript 压缩工具，用于优化和压缩 JavaScript 代码，减少代码体积。
