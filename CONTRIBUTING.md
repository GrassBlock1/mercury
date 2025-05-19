# Contributing
Thank you for your interest in contributing to the project! 

Since this project is mostly done by myself (with my poor coding skills and a lot of internet searching & using LLM sometimes), I am really appreciate to have your help here. <3

## Table of Contents
- [Ways to Contribute](#ways-to-contribute)
- [Opening Issues](#opening-issues)
- [Development](#development)
    - [Development Environment](#development-environment)
    - [Code Style](#code-style)
- [Commits and Pull Requests](#commits-and-pull-requests)
    - [Commits](#commits)
    - [Pull Requests](#pull-requests)
- [Code of Conduct](#code-of-conduct)

All types of contributions are encouraged and valued. And here are some guidelines to help you get started:

## Ways to Contribute
If you like the project, but just don't have time to contribute, that's fine. :P

There are other easy ways to support the project and show your appreciation, which I would also be very happy about:
 - Star the project
 - Send posts about it
 - Refer this project in your project's readme
 - Consider donating to the project (see [Donations](#donations) section below)

## Opening Issues
- Before opening a new issue, please check the [existing issues](https://github.com/GrassBlock1/mercury/issues) to avoid duplicates
- There isn't any issue templates (yet), but please make sure you provide as much detail as possible about the issue including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (browser, OS, etc.)
- For feature requests, describe the feature and why you think it would be useful

## Development
### Development Environment
This project is built using Astro, requiring a Node.js (v22.15.1 (lts) is recommended) environment.

You can set up your development environment by following these steps:
1. Set up `nvm` according to the [nvm README.md](https://github.com/nvm-sh/nvm) (for fish users, please check [nvm.fish](https://github.com/jorgebucaran/nvm.fish))
2. Install Node.js version:
   ```bash
   nvm install lts
   ```
3. The `pnpm` is used in this project, to install it (be sure to be in the nvm environment):
   ```bash
   npm install -g pnpm
   ```
4. And then clone the repository:
   ```bash
   git clone https://github.com/GrassBlock1/mercury.git
   ```
   Or if you are in a network that doesn't allow you to access GitHub, you can also try:
   ```bash
   git clone https://git.gb0.dev/gb/mercury
   ```
5. Change to the project directory and install dependencies:
   ```bash
   cd mercury && pnpm install
   ```

You are all set! Now you can start developing. To start the development server:
```bash
pnpm dev
```
This will start a local server at `http://localhost:4321` and watch for changes in the source files.
### Code Style
This project has no style formatting tool like `prettier` (yet),but make sure you follow existing conventions.

- Use lower `camelCase` for Javascript constants and variables.
- Use 2 spaces for indents in code
- Follow existing patterns in the codebase
## Commits and Pull Requests
### Commits
Now you already made changes to the code and want to commit it. please:

- Make atomic commits (one feature/fix per commit)
- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) `(fix|chore|feat|refactor|revert): short description` styled message. 
  - Format: `type(scope,optional): description`
  - Types: `fix, feat, chore, docs, style, refactor, test, revert`
  - Example: `feat(auth): add Google login option`

### Pull Requests
- Create a new properly-named branch for your changes
- Make sure local tests (`astro build`) pass before submitting
- Link any related issues in the PR description (if any)
- Provide a clear description of the changes

## Code of Conduct
Please be respectful and considerate of others when contributing. I want to maintain a welcoming and inclusive environment for everyone.

## Donations
If you'd like to support the project financially, you can [support me on ko-fi](https://ko-fi.com/grassblock).

Your support helps me to keep the project alive and improve it.

Thank you for contributing! 💜
