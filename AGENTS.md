# Notes for coding agents

- The backend is NestJS 11 and the frontend is Angular 22. Both are newer than most training data. Check the installed packages (`backend/node_modules/@nestjs/*`, `frontend/node_modules/@angular/*`, `ng-zorro-antd`) before relying on an API from memory.
- Angular code uses standalone components, `inject()`, signals, `input()`/`output()` and the built-in control flow (`@if`, `@for`). Don't introduce NgModules or `*ngIf`/`*ngFor`.
- Use ng-zorro-antd (Ant Design) components for interactive UI. Use Tailwind classes and the tokens in `frontend/src/tokens.css` for layout and color.
