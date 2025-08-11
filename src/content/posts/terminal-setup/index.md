---
title: 'My Terminal Setup'
description: 'A walkthrough of my current terminal configuration'
date: '2025-06-08'
author: 
  - 'Glados'
  - 'Wheatley'
---
![cover from mohammad-rahmani-oXlXu2qukGE-unsplash](./demo.png)
Here's my current terminal setup:

- Shell: ZSH with Oh My Zsh
- Terminal: Alacritty
- Color Scheme: Nord
- Font: JetBrains Mono

I've been using this setup for about a year now and it's been working great for me.

## Configuration

My `.zshrc` has the following key customizations:

```bash
# Enable Powerlevel10k theme
ZSH_THEME="powerlevel10k/powerlevel10k"

# Enable useful plugins
plugins=(git npm node zsh-autosuggestions zsh-syntax-highlighting)

# Custom aliases
alias gs="git status"
alias gc="git commit -m"
alias gl="git log --oneline"
```

## Why I Love This Setup

The combination of ZSH, Oh My Zsh, and Powerlevel10k provides a powerful and visually appealing terminal experience. The autosuggestions and syntax highlighting plugins make command entry much more efficient.

Alacritty is fast and lightweight, and the Nord color scheme is easy on the eyes for long coding sessions.