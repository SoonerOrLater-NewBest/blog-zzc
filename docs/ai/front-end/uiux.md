---
customLabelArray: [1]
---

# <Label :level='1'/> UI-UX-PRO-MAX

基于 **nextlevelbuilder/ui-ux-pro-max-skill** 开源项目，结合常用的工具：**OpenCode、VS Code、Cursor**。
的 **使用指南**

---

## 📘 项目简介

**UI UX Pro Max** 是一个开放的 AI 设计智能技能（AI Skill），核心是一个可搜索的 UI/UX 设计知识库，包含：

- 57 种 UI 风格
- 95 套专业配色方案
- 56 组字体搭配
- 24 种图表样式
- 多种技术栈最佳实践指南（如 React/Next.js/Vue/Svelte/SwiftUI 等）
- UX 原则、可访问性建议等内容([GitHub][1])

它设计来扩展 AI 编码助手的能力，让它不仅会写代码，还能在 **设计层面给出更专业的建议与输出**。([Echo Blog][2])

---

## ⚙️ 先决条件

在开始之前，请确保你的环境满足以下条件：

✅ 已安装 Node.js（支持 npm/yarn）
✅ 安装了 **Python 3.x**（用于内部 search 脚本）

```bash
# 检查是否安装 Python
python3 --version
```

（如未安装，在 macOS 可以使用 `brew install python3`；Ubuntu/Debian 使用 `sudo apt install python3`）([GitHub][1])

---

## 📥 安装技能（推荐：CLI 方式）

UI UX Pro Max 提供了一个命令行工具 `uipro-cli`，你可以用它在你的项目中初始化并集成这个设计技能：

```bash
# 全局安装 CLI
npm install -g uipro-cli

# 进入你的项目
cd /path/to/your/project

# 为不同的 AI 助手初始化
uipro init --ai cursor      # Cursor
uipro init --ai codex       # OpenCode / Codex
uipro init --ai copilot     # VS Code + Copilot
```

👆 你不需要为每个 AI 都初始化，但建议至少为 **cursor** 和 **codex** 做一次，这样在你用 Cursor + VS Code 打开发/设计界面时，这个技能才会自动触发。([GitHub][1])

---

## 🧰 在 VS Code + OpenCode 下的体验

### 🗂 1. 打开项目

在 VS Code 中打开你的项目（可以是任何前端项目，不论是标准 HTML/CSS/JS 还是 React/Next.js 等）。

---

### 💬 2. 使用 OpenCode 或 Copilot Chat

当你在 VS Code 中使用 OpenCode 或 GitHub Copilot 与模型交互时，只要提到 UI/UX 相关内容，这个技能就会自动被调用：

| 触发方式               | 示例                                              |
| ---------------------- | ------------------------------------------------- |
| OpenCode 聊天（Codex） | `Build a landing page for my SaaS product`        |
| Cursor Slash 命令      | `/ui-ux-pro-max Create a dashboard UI`            |
| Copilot Chat           | `/ui-ux-pro-max Design a homepage with dark mode` |

模型会：

1. 从设计数据库中查找相关的 UI 样式、配色与字体，
2. 输出遵循设计原则的代码与建议。([GitHub][1])

---

## 🏃 在 Cursor 中高效使用

### 🚀 启动 Cursor

当你在 VS Code 中启用 Cursor 时，在任意代码或聊天界面中键入：

```
/ui-ux-pro-max
```

后面跟你的指令，比如：

```
/ui-ux-pro-max Build a React landing page with SaaS vibes
```

Cursor 会读取技能文件，从 UI/UX 的知识库中提取设计策略并生成代码片段（布局 + 颜色 + 字体 + 交互建议）。([GitHub][1])

⚠️ 提示：**Slash 命令必须放在请求开头或开头第二项**，否则可能不会被识别。

---

## ✅ 示例工作流（结合 VS Code + Cursor + OpenCode）

下面是一个完整的实践流程：

1. **在 VS Code 打开项目根目录**

2. **启动 Cursor 或 OpenCode**

3. **输入 /ui-ux-pro-max + 指令**

   ```text
   /ui-ux-pro-max Design a responsive pricing page for my SaaS app
   ```

4. **AI 会返回设计建议 + 帮你生成基础代码结构**

   - 布局结构（Grid / Flex / Container）
   - 风格建议（Minimalist 或 Glassmorphism）
   - 配色和字体
   - 组件代码（按钮、表格、卡片、表单等）

5. **在 VS Code 中接受建议并开始本地开发**

---

## 💡 提示与优化建议

✅ **明确说明技术栈**
如果想让生成的代码是 React + Tailwind 或 Next.js，你可以在指令里明确写：

```
/ui-ux-pro-max Build a responsive landing page using React + Tailwind
```

这样生成的输出更贴合你的项目结构。([GitHub][1])

---

✅ **自定义资源库**
如果你自己已经有一套 UI 设计规范或配色体系，也可以将其扩展到这个技能功能里（具体做法参考项目 README 与 CSV 定制方式）。([博客园][3])

---

## 📌 常见问题

**Q：为什么 Cursor 没有响应设计技能？**

- 检查是否执行过 `uipro init --ai cursor`
- 检查 VS Code 根目录下是否存在 `.cursor/commands/ui-ux-pro-max.md`
- 检查 Python 是否可用（部分搜索功能依赖 Python）([GitHub][1])

**Q：为什么 Copilot Chat 没有识别 `/ui-ux-pro-max`？**

- 确保 GitHub Copilot 插件已启用
- 在 VS Code 中打开 Chat 窗口后重新输入命令

---

## 🏁 结语

这个项目的价值，在于它把一个“设计大脑”装进了你每天写代码的 AI 工具里，尤其是在 **VS Code + Cursor + OpenCode** 的组合下，可以即时获得 **设计体验与前端输出的一体化反馈**。([Echo Blog][2])

如果你想深入定制设计数据库、添加自己的配色体系或扩展新技术栈（比如 Tailwind + shadcn/ui），也可以参考 GitHub 的源码结构自行扩展。([GitHub][1])

---

如你需要，我还可以给出 **更详细的示例 prompt 范本**、**集成到特定技术栈（例：Next.js + Tailwind）** 的高级用法。要不要？

[1]: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill?utm_source=chatgpt.com 'GitHub - nextlevelbuilder/ui-ux-pro-max-skill: An AI SKILL that provide design intelligence for building professional UI/UX multiple platforms'
[2]: https://houbb.github.io/awesome-ai-coding/posts/agentskills/2026-01-05-ai-coding-skills-01-ui-ux-pro-max-skill.html?utm_source=chatgpt.com 'ui-ux-pro-max-skill.nextlevelbuilder 构建专业级跨平台 UI/UX 提供设计智能支持 | 老马啸西风'
[3]: https://www.cnblogs.com/xiaohuatongxueai/p/19458513?utm_source=chatgpt.com '前端天塌啦，后端程序员福利，这个开源UI/UX外挂，给 Cursor/Windsurf 加个 审美插件 - 小华同学ai - 博客园'
